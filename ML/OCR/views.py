from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from paddleocr import PaddleOCR
from langchain_google_genai import ChatGoogleGenerativeAI
from pymongo import MongoClient
from bson import ObjectId
import os
import datetime
import json
import logging
import tempfile
from PIL import Image
import re
from pdf2image import convert_from_path
import magic  # for file type detection
import fitz  # PyMuPDF for text extraction from PDF

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class CarbonFootprintViews(APIView):
    def __init__(self):
        try:
            # MongoDB connection with error handling
            self.client = MongoClient('mongodb://localhost:27017/', 
                                    serverSelectionTimeoutMS=5000)
            # Test the connection
            self.client.server_info()
            self.db = self.client['Techonovate']
            self.bills_collection = self.db['carbon_footprint_bills']
            
            # Initialize PaddleOCR
            self.ocr = PaddleOCR(use_angle_cls=True, lang='en')
            logger.info("Successfully initialized CarbonFootprintViews")
        except Exception as e:
            logger.error(f"Initialization error: {str(e)}")
            raise

    def detect_file_type(self, file_path):
        import mimetypes
        try:
            # Ensure the mimetypes database is initialized
            mimetypes.init()
            
            # Get the mime type based on the file extension
            file_type, _ = mimetypes.guess_type(file_path)
            
            if file_type is None:
                # Fallback: basic check based on file extension
                extension = os.path.splitext(file_path)[1].lower()
                if extension == '.pdf':
                    file_type = 'application/pdf'
                elif extension in ['.jpg', '.jpeg']:
                    file_type = 'image/jpeg'
                elif extension == '.png':
                    file_type = 'image/png'
                elif extension == '.tiff':
                    file_type = 'image/tiff'
                else:
                    raise ValueError(f"Unsupported file extension: {extension}")
            
            logger.debug(f"Detected file type: {file_type}")
            return file_type
            
        except Exception as e:
            logger.error(f"Error detecting file type: {str(e)}")
            raise
    def extract_bill_info(self, text):
        """Extract relevant information from bill text"""
        try:
            # Initialize dictionary to store extracted information
            bill_info = {
                'amount': None,
                'date': None,
                'consumption': None,
                'utility_type': None
            }

            # Convert text to lowercase for easier matching
            text_lower = text.lower()

            # Extract amount (looking for currency patterns)
            amount_pattern = r'(?:rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)'
            amount_matches = re.findall(amount_pattern, text_lower)
            if amount_matches:
                # Remove commas and convert to float
                bill_info['amount'] = float(amount_matches[0].replace(',', ''))

            # Extract date
            date_patterns = [
                r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',  # DD/MM/YYYY or DD-MM-YYYY
                r'\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s?\d{2,4}'  # DD Mon YYYY
            ]
            for pattern in date_patterns:
                date_matches = re.findall(pattern, text_lower)
                if date_matches:
                    try:
                        # Convert the first found date to datetime object
                        bill_info['date'] = datetime.datetime.strptime(date_matches[0], '%d/%m/%Y')
                        break
                    except ValueError:
                        continue

            # Extract consumption (looking for kWh, units, etc.)
            consumption_patterns = {
                'electricity': r'(\d+(?:\.\d+)?)\s*(?:kwh|units)',
                'water': r'(\d+(?:\.\d+)?)\s*(?:kl|kilolitres|litres)',
                'gas': r'(\d+(?:\.\d+)?)\s*(?:mmbtu|cubic\s*meters|scm)'
            }

            for utility, pattern in consumption_patterns.items():
                consumption_matches = re.findall(pattern, text_lower)
                if consumption_matches:
                    bill_info['consumption'] = float(consumption_matches[0])
                    bill_info['utility_type'] = utility
                    break

            # Validate extracted information
            if not any(bill_info.values()):
                logger.warning("No information could be extracted from the bill")
                return None

            logger.info(f"Extracted bill information: {bill_info}")
            return bill_info

        except Exception as e:
            logger.error(f"Error extracting bill information: {str(e)}")
            return None

    def calculate_carbon_footprint(self, bill_info):
        """Calculate carbon footprint based on bill information"""
        try:
            if not bill_info or 'consumption' not in bill_info or 'utility_type' not in bill_info:
                return None

            # Carbon emission factors (kg CO2e per unit)
            emission_factors = {
                'electricity': 0.82,  # kg CO2e per kWh (India average)
                'water': 0.376,      # kg CO2e per kilolitre
                'gas': 2.02         # kg CO2e per cubic meter
            }

            utility_type = bill_info['utility_type']
            consumption = bill_info['consumption']

            if utility_type not in emission_factors:
                logger.error(f"Unknown utility type: {utility_type}")
                return None

            carbon_footprint = {
                'carbon_emissions': consumption * emission_factors[utility_type],
                'unit': 'kg CO2e',
                'utility_type': utility_type,
                'consumption': consumption,
                'emission_factor': emission_factors[utility_type]
            }

            logger.info(f"Calculated carbon footprint: {carbon_footprint}")
            return carbon_footprint

        except Exception as e:
            logger.error(f"Error calculating carbon footprint: {str(e)}")
            return None
    
    def extract_text_from_pdf(self, pdf_path):
        """Extract text from PDF using both PyMuPDF and OCR"""
        try:
            # First try direct text extraction
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text()
            
            # If substantial text was extracted, return it
            if len(text.strip()) > 100:
                logger.info("Successfully extracted text directly from PDF")
                return text
            
            # If little text was found, use OCR on converted images
            logger.info("PDF appears to be scanned, using OCR")
            images = convert_from_path(pdf_path)
            extracted_texts = []
            
            for i, image in enumerate(images):
                # Save each page temporarily
                temp_image_path = f"{pdf_path}_page_{i}.png"
                try:
                    image.save(temp_image_path)
                    # Process with OCR
                    page_text = self.process_image_ocr(temp_image_path)
                    extracted_texts.append(page_text)
                finally:
                    # Clean up temporary image
                    if os.path.exists(temp_image_path):
                        os.unlink(temp_image_path)
            
            return " ".join(extracted_texts)
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise
        finally:
            if 'doc' in locals():
                doc.close()
    def generate_analysis(self, bill_info, carbon_impact):
        """Generate comprehensive analysis of the bill and its environmental impact"""
        try:
            if not bill_info or not carbon_impact:
                return None

            # Initialize Google's GenerativeAI
            llm = ChatGoogleGenerativeAI(model="gemini-pro")
            
            # Prepare the prompt for analysis
            prompt = f"""
            Analyze this utility bill and its environmental impact:
            - Utility Type: {carbon_impact['utility_type']}
            - Consumption: {carbon_impact['consumption']} units
            - Carbon Emissions: {carbon_impact['carbon_emissions']:.2f} {carbon_impact['unit']}
            - Bill Amount: {'Rs. ' + str(bill_info['amount']) if bill_info.get('amount') else 'Not available'}
            - Bill Date: {bill_info['date'].strftime('%Y-%m-%d') if bill_info.get('date') else 'Not available'}

            Please provide:
            1. A summary of the consumption and its environmental impact
            2. Comparison with typical household consumption
            3. Practical suggestions for reducing consumption
            4. Potential cost and carbon savings from implementing suggestions
            """

            # Generate analysis using LLM
            response = llm.invoke(prompt)
            analysis = response.text if hasattr(response, 'text') else str(response)

            result = {
                'bill_summary': {
                    'utility_type': carbon_impact['utility_type'],
                    'consumption': carbon_impact['consumption'],
                    'amount': bill_info.get('amount'),
                    'date': bill_info.get('date')
                },
                'environmental_impact': {
                    'carbon_emissions': carbon_impact['carbon_emissions'],
                    'unit': carbon_impact['unit']
                },
                'analysis': analysis
            }

            logger.info("Analysis generated successfully")
            return result

        except Exception as e:
            logger.error(f"Error generating analysis: {str(e)}")
            return None
    def process_image_ocr(self, image_path):
        """Process image with PaddleOCR"""
        try:
            result = self.ocr.ocr(image_path)
            
            if not result or not result[0]:
                logger.warning("No text detected in image")
                return ""

            extracted_text = []
            for line in result:
                for word in line:
                    if isinstance(word, (list, tuple)) and len(word) > 1:
                        extracted_text.append(word[1][0])
            
            return " ".join(extracted_text)
            
        except Exception as e:
            logger.error(f"OCR processing error: {str(e)}")
            raise

    def save_uploaded_file(self, upload):
        """Safely save uploaded file to temp directory"""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(upload.name)[1]) as temp_file:
                for chunk in upload.chunks():
                    temp_file.write(chunk)
                return temp_file.name
        except Exception as e:
            logger.error(f"File save error: {str(e)}")
            raise

    def process_bill_file(self, file_path):
        """Process bill file (PDF or image) and extract text"""
        try:
            file_type = self.detect_file_type(file_path)
            
            if 'pdf' in file_type:
                return self.extract_text_from_pdf(file_path)
            elif 'image' in file_type:
                return self.process_image_ocr(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
                
        except Exception as e:
            logger.error(f"Error processing bill file: {str(e)}")
            raise

    def post(self, request):
        temp_file_path = None
        try:
            # Validate request
            bill_file = request.FILES.get('bill_file')  # Changed from bill_image
            bill_type = request.data.get('bill_type')
            
            if not all([bill_file, bill_type]):
                return Response({
                    "error": "Missing required fields",
                    "details": "Please provide both bill_file and bill_type"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file type
            allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
            if bill_file.content_type not in allowed_types:
                return Response({
                    "error": "Invalid file type",
                    "details": f"Supported types are: {', '.join(allowed_types)}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Save and process file
            temp_file_path = self.save_uploaded_file(bill_file)
            extracted_text = self.process_bill_file(temp_file_path)
            logger.info(f"Extracted text: {extracted_text}")
            
            # Extract bill information
            bill_info = self.extract_bill_info(extracted_text)
            if not bill_info:
                return Response({
                    "error": "Could not extract bill information",
                    "extracted_text": extracted_text
                }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            # Calculate carbon impact
            carbon_impact = self.calculate_carbon_footprint(bill_info)
            if not carbon_impact:
                return Response({
                    "error": "Could not calculate carbon impact",
                    "bill_info": bill_info
                }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            # Generate complete analysis
            analysis_result = self.generate_analysis(bill_info, carbon_impact)
            if not analysis_result:
                return Response({
                    "error": "Could not generate analysis",
                    "carbon_impact": carbon_impact
                }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            
            # Save to MongoDB
            bill_doc = {
                "bill_type": bill_type,
                "uploaded_at": datetime.datetime.utcnow(),
                "extracted_text": extracted_text,
                "analysis": analysis_result,
                "metadata": {
                    "file_name": bill_file.name,
                    "file_size": bill_file.size,
                    "content_type": bill_file.content_type
                }
            }
            
            inserted_bill = self.bills_collection.insert_one(bill_doc)
            
            return Response({
                "message": "Bill processed successfully",
                "bill_id": str(inserted_bill.inserted_id),
                "analysis": analysis_result
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Bill processing error: {str(e)}", exc_info=True)
            return Response({
                "error": str(e),
                "message": "Failed to process bill",
                "details": "Please check logs for more information"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        finally:
            # Clean up temporary file
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                except Exception as e:
                    logger.error(f"Failed to delete temporary file: {str(e)}")

    def get(self, request):
        try:
            bill_id = request.query_params.get('bill_id')
            
            if bill_id:
                try:
                    bill = self.bills_collection.find_one(
                        {"_id": ObjectId(bill_id)}
                    )
                    if not bill:
                        return Response({
                            "error": "Bill not found",
                            "bill_id": bill_id
                        }, status=status.HTTP_404_NOT_FOUND)
                    
                    bill['_id'] = str(bill['_id'])
                    return Response(bill, status=status.HTTP_200_OK)
                    
                except Exception as e:
                    logger.error(f"Error retrieving bill {bill_id}: {str(e)}")
                    raise
            
            # Get all bills with pagination
            page = int(request.query_params.get('page', 1))
            per_page = int(request.query_params.get('per_page', 10))
            
            total_bills = self.bills_collection.count_documents({})
            bills = list(self.bills_collection
                        .find({})
                        .skip((page - 1) * per_page)
                        .limit(per_page))
            
            for bill in bills:
                bill['_id'] = str(bill['_id'])
            
            return Response({
                "total_bills": total_bills,
                "page": page,
                "per_page": per_page,
                "total_pages": (total_bills + per_page - 1) // per_page,
                "bills": bills
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in GET request: {str(e)}", exc_info=True)
            return Response({
                "error": str(e),
                "message": "Failed to retrieve bills"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)