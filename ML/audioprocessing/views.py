import os
from datetime import datetime
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
from pydub import AudioSegment
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import spacy
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()
import google.generativeai as genai
# Configure Google Generative AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
class EnhancedAudioAnalysisSystem:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_trf')
        self.model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
        
        # Category-specific prompts
        self.category_prompts = {
            'transportation': """
                Analyze this transportation behavior and provide specific suggestions for reducing carbon footprint:
                - Current behavior: {transport_details}
                - Consider: public transit usage, vehicle efficiency, travel frequency
                - Provide 3 actionable recommendations with potential carbon impact
                Focus on our goal: Personal Carbon Footprint Tracker that enables users to monitor and reduce their carbon footprint.
            """,
            
            'diet': """
                Analyze this dietary pattern and suggest sustainable improvements:
                - Current diet: {diet_details}
                - Consider: plant-based options, food waste, local sourcing
                - Provide 3 specific recommendations with environmental impact estimates
                Focus on our goal: Personal Carbon Footprint Tracker that enables users to monitor and reduce their carbon footprint.
            """,
            
            'energy': """
                Review this energy usage pattern and provide efficiency recommendations:
                - Current usage: {energy_details}
                - Consider: heating/cooling, appliance usage, renewable options
                - Provide 3 concrete suggestions with potential energy savings
                Focus on our goal: Personal Carbon Footprint Tracker that enables users to monitor and reduce their carbon footprint.
            """,
            
            'waste': """
                Analyze waste management habits and suggest improvements:
                - Current behavior: {waste_details}
                - Consider: recycling practices, composting, reduction strategies
                - Provide 3 actionable recommendations with environmental impact
                Focus on our goal: Personal Carbon Footprint Tracker that enables users to monitor and reduce their carbon footprint.
            """,
            
            'shopping': """
                Review shopping patterns and suggest sustainable alternatives:
                - Current behavior: {shopping_details}
                - Consider: product lifecycle, packaging, sustainable brands
                - Provide 3 specific recommendations with environmental impact
                Focus on our goal: Personal Carbon Footprint Tracker that enables users to monitor and reduce their carbon footprint.
            """
        }

    def _extract_lifestyle_details(self, transcript):
        """Extract relevant lifestyle details from transcript"""
        details = {
            'transport_details': '',
            'diet_details': '',
            'energy_details': '',
            'waste_details': '',
            'shopping_details': ''
        }
        
        doc = self.nlp(transcript)
        
        for sent in doc.sents:
            sent_text = sent.text.lower()
            
            if any(word in sent_text for word in ['car', 'transit', 'travel', 'drive', 'air']):
                details['transport_details'] += sent.text + ' '
                
            if any(word in sent_text for word in ['diet', 'food', 'eat', 'meat', 'plant']):
                details['diet_details'] += sent.text + ' '
                
            if any(word in sent_text for word in ['energy', 'electricity', 'heating', 'power']):
                details['energy_details'] += sent.text + ' '
                
            if any(word in sent_text for word in ['waste', 'garbage', 'recycle', 'dispose']):
                details['waste_details'] += sent.text + ' '
                
            if any(word in sent_text for word in ['shopping', 'purchase', 'buy', 'grocery']):
                details['shopping_details'] += sent.text + ' '
        
        return details

    def get_gemini_suggestions(self, transcript):
        """Get personalized suggestions from Gemini for each category"""
        lifestyle_details = self._extract_lifestyle_details(transcript)
        suggestions = {}
        
        for category, prompt_template in self.category_prompts.items():
            details_key = f"{category}_details"
            details = lifestyle_details.get(details_key, '')
            
            if details:
                prompt = prompt_template.format(**{details_key: details})
                messages = [{"role": "user", "content": prompt}]
                response = self.model.invoke(messages)
                
                suggestions[category] = {
                    'current_behavior': details,
                    'recommendations': response.content,
                    'impact_category': self._calculate_impact_category(category, transcript)
                }
        
        return suggestions

    def _calculate_impact_category(self, category, transcript):
        """Calculate impact category based on user behavior"""
        doc = self.nlp(transcript)
        positive_indicators = ['efficient', 'reduce', 'conscious', 'sustainable']
        negative_indicators = ['high usage', 'frequent', 'excessive']
        
        positive_count = sum(1 for token in doc if token.text.lower() in positive_indicators)
        negative_count = sum(1 for token in doc if token.text.lower() in negative_indicators)
        
        if positive_count > negative_count:
            return 'LOW_IMPACT'
        elif positive_count < negative_count:
            return 'HIGH_IMPACT'
        else:
            return 'MEDIUM_IMPACT'
        
    def analyze_transcript(self, transcript):
        """Main analysis pipeline for processing transcripts"""
        suggestions = self.get_gemini_suggestions(transcript)
        
        # Extract topics using spaCy
        doc = self.nlp(transcript)
        topics = []
        seen = set()
        
        # Add noun chunks and named entities
        for chunk in doc.noun_chunks:
            if chunk.text.lower() not in seen:
                topics.append(chunk.text)
                seen.add(chunk.text.lower())
        
        for ent in doc.ents:
            if ent.text.lower() not in seen:
                topics.append(ent.text)
                seen.add(ent.text.lower())
        
        return {
            'topics': topics[:5],  # Top 5 topics
            'suggestions': suggestions
        }

class AudioTranscriptionView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.processor = WhisperProcessor.from_pretrained("openai/whisper-small")
        self.model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small")
        self.analyzer = EnhancedAudioAnalysisSystem()
        
        if torch.cuda.is_available():
            self.model = self.model.to("cuda")
        self.target_sr = 16000

    def _save_audio_file(self, audio_file):
        upload_dir = 'temp_uploads'
        os.makedirs(upload_dir, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"audio_{timestamp}.{audio_file.name.split('.')[-1]}"
        filepath = os.path.join(upload_dir, filename)
        
        content = audio_file.read()
        default_storage.save(filepath, ContentFile(content))
        return filepath

    def _convert_to_wav(self, audio_path):
        if not audio_path.endswith('.wav'):
            audio = AudioSegment.from_file(audio_path)
            wav_path = audio_path.rsplit('.', 1)[0] + '.wav'
            audio.export(wav_path, format='wav')
            os.remove(audio_path)
            return wav_path
        return audio_path

    def _transcribe_audio(self, audio_path):
        """Transcribe audio file using Whisper"""
        # Load and process audio
        audio, sr = librosa.load(audio_path, sr=self.target_sr)
        
        # Process with Whisper
        input_features = self.processor(
            audio, 
            sampling_rate=sr, 
            return_tensors="pt",
            language='en'
        ).input_features
        
        if torch.cuda.is_available():
            input_features = input_features.to("cuda")
        
        # Generate transcription
        predicted_ids = self.model.generate(
            input_features,
            language='en',
            task='transcribe'
        )
        
        # Decode the transcription
        transcription = self.processor.batch_decode(
            predicted_ids, 
            skip_special_tokens=True
        )[0]
        
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        # Analyze the transcription
        analysis_results = self.analyzer.analyze_transcript(transcription)
        
        return {
            'transcript': transcription,
            'analysis': analysis_results
        }

    def post(self, request, *args, **kwargs):
        if 'audio' not in request.FILES:
            return Response(
                {'error': 'No audio file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            audio_file = request.FILES['audio']
            if audio_file.size == 0:
                return Response(
                    {'error': 'Empty audio file provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Process the audio file
            audio_path = self._save_audio_file(audio_file)
            wav_path = self._convert_to_wav(audio_path)
            results = self._transcribe_audio(wav_path)
            
            # Cleanup
            os.remove(wav_path)
            
            return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Error processing audio file: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )