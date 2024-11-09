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