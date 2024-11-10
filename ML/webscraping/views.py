from django.http import JsonResponse
from bs4 import BeautifulSoup
import requests
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import logging

logger = logging.getLogger(__name__)

def get_amazon_products(search_query, num_products=20):
    """
    Scrape Amazon products based on search query with improved parsing and debugging
    """
    # Headers to better mimic a real browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    }
    
    # Format the Amazon search URL
    base_url = f'https://www.amazon.com/s?k={search_query.replace(" ", "+")}'
    logger.info(f"Searching Amazon with URL: {base_url}")
    
    try:
        response = requests.get(base_url, headers=headers, timeout=10)
        logger.info(f"Response status code: {response.status_code}")
        
        if response.status_code != 200:
            logger.error(f"Failed to get response from Amazon. Status code: {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Debug: Save HTML to file for inspection
        with open('amazon_response.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
            
        products = []
        
        # Try multiple possible selectors for product containers
        product_divs = soup.select('div[data-component-type="s-search-result"]')
        if not product_divs:
            product_divs = soup.select('.s-result-item')
        
        logger.info(f"Found {len(product_divs)} product divs")
        
        for div in product_divs[:num_products]:
            try:
                # Multiple possible selectors for each field
                title = (
                    div.select_one('.a-text-normal')
                    or div.select_one('h2')
                    or div.select_one('.a-link-normal')
                )
                
                price = (
                    div.select_one('.a-price .a-offscreen')
                    or div.select_one('.a-price')
                    or div.select_one('.a-price-whole')
                )
                
                rating = (
                    div.select_one('.a-icon-alt')
                    or div.select_one('.a-star-rating')
                )
                
                image = (
                    div.select_one('img.s-image')
                    or div.select_one('.s-image')
                )
                
                # Get ASIN (Amazon product ID)
                asin = div.get('data-asin')
                
                # Extract product URL
                product_link = div.select_one('a.a-link-normal')
                product_url = f"https://www.amazon.com{product_link['href']}" if product_link and 'href' in product_link.attrs else None
                
                if title:  # Only add product if at least title is found
                    product = {
                        'title': title.text.strip() if title else 'N/A',
                        'price': price.text.strip() if price else 'N/A',
                        'rating': rating.text.strip() if rating else 'N/A',
                        'image_url': image['src'] if image and 'src' in image.attrs else 'N/A',
                        'asin': asin if asin else 'N/A',
                        'product_url': product_url if product_url else 'N/A'
                    }
                    logger.info(f"Successfully parsed product: {product['title'][:30]}...")
                    products.append(product)
            except Exception as e:
                logger.error(f"Error parsing product: {str(e)}")
                continue
                
        return products
    except Exception as e:
        logger.error(f"Error in get_amazon_products: {str(e)}")
        return []

@csrf_exempt
@require_http_methods(["GET"])
def get_top_products(request):
    """
    API endpoint to get top Amazon products
    """
    try:
        # Get search query from URL parameters
        search_query = request.GET.get('query', 'laptop')
        logger.info(f"Received request for query: {search_query}")
        
        # Get products
        products = get_amazon_products(search_query)
        
        # Log the result
        logger.info(f"Found {len(products)} products")
        
        response_data = {
            'status': 'success',
            'query': search_query,
            'count': len(products),
            'products': products
        }
        
        return JsonResponse(response_data)
    except Exception as e:
        logger.error(f"Error in get_top_products view: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'query': search_query
        }, status=500)
    


@csrf_exempt
@require_http_methods(["GET"])
def get_first_product(request):
    """
    API endpoint to get the first Amazon product for the given search query
    """
    try:
        # Get search query from URL parameters
        search_query = request.GET.get('query', 'laptop')
        logger.info(f"Received request for query (first product): {search_query}")
        
        # Get products
        products = get_amazon_products(search_query)
        
        if not products:
            return JsonResponse({
                'status': 'success',
                'query': search_query,
                'message': 'No products found',
                'product': None
            })

        # Return only the first product
        first_product = products[0]
        
        logger.info(f"Returning first product: {first_product['title'][:30]}...")
        
        response_data = {
            'status': 'success',
            'query': search_query,
            'product': first_product
        }
        
        return JsonResponse(response_data)
    except Exception as e:
        logger.error(f"Error in get_first_product view: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': str(e),
            'query': search_query
        }, status=500)


from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS, Pinecone, Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from sklearn.metrics.pairwise import cosine_similarity
import pinecone
import numpy as np
from typing import List, Dict
import spacy
from sentence_transformers import SentenceTransformer

class GreenProductSearchEngine:
    """
    Advanced semantic search engine for identifying and ranking eco-friendly products
    using multiple embedding models and re-ranking strategies.
    """
    
    # Comprehensive dictionary of eco-friendly keywords and their weights
    GREEN_KEYWORDS = {
        'sustainability': 1.0,
        'eco-friendly': 1.0,
        'renewable': 0.9,
        'biodegradable': 0.9,
        'recyclable': 0.8,
        'organic': 0.8,
        'energy-efficient': 0.8,
        'solar-powered': 0.7,
        'compostable': 0.7,
        'zero-waste': 0.7,
        'natural': 0.6,
        'recycled': 0.6,
        'sustainable': 0.6,
        'green': 0.5,
        'eco': 0.5,
        'environmentally-friendly': 0.5,
        # Energy efficiency specific terms
        'energy-star': 0.9,
        'low-power': 0.8,
        'power-saving': 0.8,
        'efficient': 0.7,
        'low-consumption': 0.7,
        'battery-efficient': 0.7
    }
    
    # Material sustainability scoring
    MATERIAL_SCORES = {
        'bamboo': 0.9,
        'recycled plastic': 0.8,
        'recycled aluminum': 0.8,
        'post-consumer': 0.7,
        'reclaimed': 0.7,
        'biodegradable materials': 0.9,
        'renewable materials': 0.8
    }
    
    # Product certification weights
    CERTIFICATION_WEIGHTS = {
        'Energy Star': 0.9,
        'EPEAT': 0.8,
        'USDA Organic': 0.7,
        'Fair Trade': 0.6,
        'FSC': 0.6,
        'Green Seal': 0.5,
        'RoHS': 0.7,
        'TCO Certified': 0.8
    }

    def __init__(self, openai_api_key: str):
        """Initialize search engine with necessary APIs and models."""
        self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
        self.openai_embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        self.nlp = spacy.load("en_core_web_lg")
        
        # Initialize FAISS for vector storage
        self.faiss_index = FAISS.from_texts(
            ["placeholder"], embedding=self.openai_embeddings
        )
        
        # Initialize LLM for context compression
        self.llm = OpenAI(temperature=0)
        self.compressor = LLMChainExtractor.from_llm(self.llm)
        
    def calculate_green_score(self, product: Dict) -> float:
        """
        Calculate a comprehensive green score for a product based on multiple factors.
        """
        # Combine title and description for analysis
        text = f"{product['title']} {product.get('description', '')}"
        doc = self.nlp(text.lower())
        score = 0.0
        matches = []
        
        # Keyword matching with context
        for keyword, weight in self.GREEN_KEYWORDS.items():
            if keyword in doc.text:
                score += weight
                matches.append(f"Keyword: {keyword}")
                
        # Certification matching
        for cert, weight in self.CERTIFICATION_WEIGHTS.items():
            if cert.lower() in doc.text:
                score += weight * 1.5  # Extra weight for certifications
                matches.append(f"Certification: {cert}")
                
        # Material sustainability scoring
        for material, weight in self.MATERIAL_SCORES.items():
            if material in doc.text:
                score += weight
                matches.append(f"Sustainable Material: {material}")
        
        # Advanced NLP analysis
        entities = [ent.text.lower() for ent in doc.ents]
        green_entities = [
            ent for ent in entities 
            if any(keyword in ent for keyword in self.GREEN_KEYWORDS)
        ]
        score += len(green_entities) * 0.3
        
        # Check for specific energy efficiency terms in technical specs
        tech_terms = ['watt', 'voltage', 'energy', 'power', 'consumption']
        tech_score = sum(term in doc.text for term in tech_terms) * 0.2
        score += tech_score
        
        # Price-efficiency ratio consideration
        try:
            price = float(product.get('price', '0').replace('$', '').replace(',', ''))
            if price > 0:
                efficiency_ratio = score / price
                score += efficiency_ratio * 0.1
        except:
            pass
        
        # Normalize final score
        normalized_score = min(score / 10, 1.0)
        
        return {
            'score': normalized_score,
            'matches': matches,
            'raw_score': score
        }

    def semantic_search(self, products: List[Dict], query: str, top_k: int = 10) -> List[Dict]:
        """
        Perform semantic search using multiple embedding models and re-ranking.
        """
        # Generate query embeddings
        query_embedding_st = self.sentence_transformer.encode(query)
        query_embedding_openai = self.openai_embeddings.embed_query(query)
        
        results = []
        for product in products:
            # Generate product embeddings
            product_text = f"{product['title']} {product.get('description', '')}"
            embedding_st = self.sentence_transformer.encode(product_text)
            embedding_openai = self.openai_embeddings.embed_documents([product_text])[0]
            
            # Calculate green scores
            green_metrics = self.calculate_green_score(product)
            
            # Calculate similarities
            st_similarity = cosine_similarity([query_embedding_st], [embedding_st])[0][0]
            openai_similarity = cosine_similarity([query_embedding_openai], [embedding_openai])[0][0]
            
            # Combined scoring with weights
            combined_score = (
                0.3 * st_similarity +  # Sentence transformer similarity
                0.3 * openai_similarity +  # OpenAI embedding similarity
                0.4 * green_metrics['score']  # Green score
            )
            
            results.append({
                'product': product,
                'score': combined_score,
                'green_metrics': green_metrics,
                'similarity_scores': {
                    'sentence_transformer': float(st_similarity),
                    'openai': float(openai_similarity)
                }
            })
        
        # Sort by combined score
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return results[:top_k]

    def get_green_product_recommendations(self, search_query: str, amazon_products: List[Dict]) -> List[Dict]:
        """
        Main method to get eco-friendly product recommendations.
        """
        try:
            # Store products in FAISS for vector similarity
            product_texts = [
                f"{p['title']} {p.get('description', '')}" 
                for p in amazon_products
            ]
            self.faiss_index.add_texts(product_texts)
            
            # Perform semantic search
            results = self.semantic_search(amazon_products, search_query)
            
            # Format results for response
            formatted_results = []
            for result in results:
                product_data = result['product']
                product_data.update({
                    'green_score': result['green_metrics']['score'],
                    'sustainability_matches': result['green_metrics']['matches'],
                    'search_relevance': {
                        'combined_score': result['score'],
                        'similarity_scores': result['similarity_scores']
                    }
                })
                formatted_results.append(product_data)
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error in get_green_product_recommendations: {str(e)}")
            return []