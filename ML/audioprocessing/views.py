
# import os
# from datetime import datetime
# import torch
# from transformers import WhisperProcessor, WhisperForConditionalGeneration
# from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
# import librosa
# import numpy as np
# import soundfile as sf
# from pydub import AudioSegment
# import gc
# import google.generativeai as genai
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.schema import AIMessage
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from dotenv import load_dotenv
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# load_dotenv()

# # Configure the Gemini model
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# class AudioTranscriptionView(APIView):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.processor = WhisperProcessor.from_pretrained("openai/whisper-large-v2")
#         self.model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-large-v2")
#         if torch.cuda.is_available():
#             self.model = self.model.to("cuda")
#         self.target_sr = 16000
#         self.segment_duration = 30
#         self.genai_model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)

#     def _save_audio_file(self, audio_file):
#         upload_dir = 'temp_uploads'
#         os.makedirs(upload_dir, exist_ok=True)
#         timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
#         filename = f"audio_{timestamp}.{audio_file.name.split('.')[-1]}"
#         filepath = os.path.join(upload_dir, filename)
#         with open(filepath, 'wb+') as destination:
#             for chunk in audio_file.chunks():
#                 destination.write(chunk)
#         return filepath

#     def _convert_to_wav(self, audio_path):
#         """Convert audio file to WAV format if necessary"""
#         if not audio_path.endswith('.wav'):
#             audio = AudioSegment.from_file(audio_path)
#             wav_path = audio_path.rsplit('.', 1)[0] + '.wav'
#             audio.export(wav_path, format='wav')
#             os.remove(audio_path)  # Clean up original file
#             return wav_path
#         return audio_path

#     def _load_audio(self, audio_path):
#         """Load WAV audio file with librosa"""
#         audio, sr = librosa.load(audio_path, sr=self.target_sr)
#         return audio, sr

#     def _transcribe_audio(self, audio_path):
#         """Transcribe audio file using Whisper and translate transcript to English"""
#         audio, sr = self._load_audio(audio_path)
#         input_features = self.processor(audio, sampling_rate=sr, return_tensors="pt").input_features
#         if torch.cuda.is_available():
#             input_features = input_features.to("cuda")
#         predicted_ids = self.model.generate(input_features)
#         transcript = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

#         # Translate to English using Gemini
#         translation_prompt = f"Translate the following transcript to English: '{transcript}'"
#         translation_response = self.genai_model.invoke([{"role": "user", "content": translation_prompt}])
        
#         # Extract the text from the response
#         translated_transcript = translation_response[0].content if isinstance(translation_response, list) else translation_response.content

#         return translated_transcript

#     def _analyze_transcript(self, transcript):
#         print("Transcript:",transcript)
#         """Perform NLP analysis using pre-trained models and generate insights"""
#         # Load pre-trained models for vari  ous analyses
#         sentiment_analyzer = pipeline("sentiment-analysis")
#         zero_shot_classifier = pipeline("zero-shot-classification")
#         summarizer = pipeline("summarization")
#         emotion_detector = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

#         # Analyze transcript
#         sentiment = sentiment_analyzer(transcript)
#         classification = zero_shot_classifier(transcript, candidate_labels=["environmental impact", "personal habits", "carbon footprint", "lifestyle"])
#         summary = summarizer(transcript, max_new_tokens=100, min_length=25, do_sample=False)
#         emotions = emotion_detector(transcript)

#         # Prepare analysis output




#         analysis_output = {
#             "sentiment": sentiment,
#             "classification": classification,
#             "summary": summary[0]['summary_text'],
#             "emotions": emotions,
#         }

#         # Generate insights using Gemini with full context of the analyses
#         gemini_prompt = (
#             f"""This is the structure of our website:'Body Type': Body type.
# 'Sex': Gender. 
# ' Diet': Diet.
# 'How Often Shower': Frequency of showering
# 'Heating Energy Source': Residential heating energy
# 'Transport': Transportation preference.
# 'Vehicle Type': Vehicle fuel type.
# 'Social Activity': Frequency of participating in social activities.
# 'Monthly Grocery Bill': Monthly amount spent on groceries, in dollars.
# 'Frequency of Traveling by Air': Frequency of using aircraft in the last month.
# 'Vehicle Monthly Distance Km': The kilometers traveled by vehicle in the last month.
# 'Waste Bag Size': Size of the garbage bag
# 'Waste Bag Weekly Count': The amount of garbage thrown away in the last week.
# 'How Long TV PC Daily Hour': Daily time spent in front of TV or PC.
# 'How Many New Clothes Monthly': Number of clothes purchased monthly.
# 'How Long Internet Daily Hour': Time spent on the Internet daily.
# 'Energy efficiency': Whether or not you care about purchasing energy efficient devices.
# 'Recycling': The wastes it recycles.
# 'Cooking_With': Devices used in cooking
# 'CarbonEmission': Dependent variable, total carbon emissions.this is the transcript of the users audio which he is giving on the site instead of manually typing:{transcript}.
# .This is the analysis based on certain ml models:{analysis_output}.We need to generate suggestions recommendations key points.Remember to stick of the context of our problem statement.Give the best recommendations as our ps involved carbon footprint reduction.It is for a hackathon of Rotaract club"""
#         )
#         messages = [{"role": "user", "content": gemini_prompt}]
#         gemini_response = self.genai_model.invoke(messages)
#         print(gemini_response)
#         if isinstance(gemini_response, list):
#             insights_text = gemini_response[0].content  # Extracts the content of the first response if it's a list
#         else:
#             insights_text = gemini_response.content


#         # Final response to include translation, analysis, and Gemini's output
#         {
#     "translated_transcript":transcript,
#     "analysis": {
#         "Sentiment Analysis": {
#             "Sentiment": analysis_output["sentiment"][0]["label"],
#             "Score": analysis_output["sentiment"][0]["score"]
#         },
#         "Topic Classification": {
#             "Topics": [
#                 {
#                     "Label": label,
#                     "Score": score
#                 }
#                 for label, score in zip(
#                     analysis_output["classification"]["labels"],
#                     analysis_output["classification"]["scores"]
#                 )
#             ]
#         },
#         "Summary": analysis_output["summary"],
#         "Emotions": [
#             {
#                 "Emotion": emotion["label"],
#                 "Score": emotion["score"]
#             }
#             for emotion in analysis_output["emotions"][0]
#         ]
#     },
#     "insights":  insights_text
# }


#     def post(self, request):
#         """Handle transcription and analysis request"""
#         if 'audio' not in request.FILES:
#             return Response({'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

#         audio_file = request.FILES['audio']
#         if audio_file.size == 0:
#             return Response({'error': 'Empty audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             audio_path = self._save_audio_file(audio_file)
#             print(audio_path)
#             translated_transcript = self._transcribe_audio(audio_path)
#             print("Translation is",translated_transcript)
#             print("\n")
#             analysis_and_insights = self._analyze_transcript(translated_transcript)
#             print("Insights is:",analysis_and_insights)
#             # Clean up temporary file
#             os.remove(audio_path)

#             return Response(analysis_and_insights, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import os
from datetime import datetime
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import librosa
from pydub import AudioSegment
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AudioTranscriptionView(APIView):
    def _init_(self, *args, **kwargs):
        super()._init_(*args, **kwargs)
        self.processor = WhisperProcessor.from_pretrained("openai/whisper-large-v2")
        self.model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-large-v2")
        if torch.cuda.is_available():
            self.model = self.model.to("cuda")
        self.target_sr = 16000
        # Increase chunk size for longer audio
        self.chunk_length_s = 30  # Process 30 seconds at a time

    def _save_audio_file(self, audio_file):
        upload_dir = 'temp_uploads'
        os.makedirs(upload_dir, exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"audio_{timestamp}.{audio_file.name.split('.')[-1]}"
        filepath = os.path.join(upload_dir, filename)
        with open(filepath, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)
        return filepath

    def _convert_to_wav(self, audio_path):
        """Convert audio file to WAV format if necessary"""
        if not audio_path.endswith('.wav'):
            audio = AudioSegment.from_file(audio_path)
            wav_path = audio_path.rsplit('.', 1)[0] + '.wav'
            audio.export(wav_path, format='wav')
            os.remove(audio_path)  # Clean up original file
            return wav_path
        return audio_path

    def _load_audio(self, audio_path):
        """Load WAV audio file with librosa"""
        audio, sr = librosa.load(audio_path, sr=self.target_sr)
        return audio, sr

    def _transcribe_audio(self, audio_path):
        """Transcribe audio file using Whisper with support for longer audio"""
        audio, sr = self._load_audio(audio_path)
        
        # Calculate number of samples per chunk
        chunk_length_samples = int(self.chunk_length_s * sr)
        
        # Initialize empty transcript
        full_transcript = []
        
        # Process audio in chunks
        for i in range(0, len(audio), chunk_length_samples):
            # Get chunk of audio
            chunk = audio[i:i + chunk_length_samples]
            
            # Process chunk
            input_features = self.processor(
                chunk, 
                sampling_rate=sr, 
                return_tensors="pt"
            ).input_features
            
            if torch.cuda.is_available():
                input_features = input_features.to("cuda")
            
            # Generate transcription with increased max length
            predicted_ids = self.model.generate(
                input_features,
                max_length=448,  # Increased from default
                min_length=1,
                no_repeat_ngram_size=3,
                num_beams=5
            )
            
            # Decode chunk
            chunk_transcript = self.processor.batch_decode(
                predicted_ids, 
                skip_special_tokens=True
            )[0]
            
            # Add to full transcript
            full_transcript.append(chunk_transcript.strip())
            
            # Clear CUDA cache if using GPU
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        
        # Join all chunks with proper spacing
        return " ".join(full_transcript)

    def post(self, request):
        """Handle transcription request"""
        if 'audio' not in request.FILES:
            return Response({'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

        audio_file = request.FILES['audio']
        if audio_file.size == 0:
            return Response({'error': 'Empty audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save and process the audio file
            audio_path = self._save_audio_file(audio_file)
            wav_path = self._convert_to_wav(audio_path)
            
            # Get the transcript
            transcript = self._transcribe_audio(wav_path)
            
            # Clean up temporary files
            os.remove(wav_path)
            
            return Response({'transcript': transcript}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
