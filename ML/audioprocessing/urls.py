# from django.urls import path
# # from .views import upload_pdfs, ask_question, chat
# from . import views
# # from  .views import chat

# urlpatterns = [
#     # path('chat/', chat, name='chat'),
#     # path('mask_psych/', views.mask_psych, name='mask_psych'),
#     # path('mask_mental/', views.mask_mental, name='mask_mental'),
#     # path('classify_psych/', views.classify_psych, name='classify_psych'),
#     # path('classify_mental/', views.classify_mental, name='classify_mental'),
#     # path('sentiment_analysis/', views.sentiment_analysis, name='sentiment_analysis'),
#     # path('llama_chat/', views.llama_chat, name='llama_chat'),
#     path('audioprocessing/', views.audioprocessing, name='audioprocessing'),
# ]


from django.urls import path
from .views import AudioTranscriptionView
from .views import chat

urlpatterns = [
    path('transcribe/', AudioTranscriptionView.as_view(), name='transcribe-audio'),
    path('chat/', chat, name='chat'),
]