import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Upload, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SmartInsights = () => {
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioResponse, setAudioResponse] = useState('');
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const audioChunksRef = useRef([]);

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageResponse, setImageResponse] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
          };
          recorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setAudioBlob(blob);
            audioChunksRef.current = [];
            handleAudioUpload(blob); // Automatic upload when recording stops
          };
          recorder.start();
          setMediaRecorder(recorder);
        })
        .catch(error => console.error('Error accessing microphone:', error));
    } else if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }, [isRecording]);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
  };

  const handleAudioUpload = async (blob) => {
    setIsProcessingAudio(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);

      const response = await fetch('http://192.168.137.37:8000/api/transcribe/', {
        method: 'POST',
        body: formData,
      });
      console.log(response);
      const data = await response.json();
      setAudioResponse(data.text);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setAudioResponse('Error processing audio');
    }
    setIsProcessingAudio(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setIsProcessingImage(true);
    setImageResponse(''); // Clear previous response if any

    try {
      const formData = new FormData();
      formData.append('bill_file', file);
      formData.append('bill_type', "electricity");

      const response = await fetch('http://192.168.137.37:8000/api/carbon-footprintimage/', {
        method: 'POST',
        body: formData,
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        result += decoder.decode(value, { stream: true });
        setImageResponse(result); // Update the component's state to display the incremental response
      }

      // Parse the JSON response and remove unwanted fields
      const finalData = JSON.parse(result);
      console.log(finalData);

      const { message, bill_id, analysis } = finalData;

      const structuredData = {
        message: message,
        billId: bill_id,
        utilityType: analysis.bill_summary.utility_type,
        consumption: analysis.bill_summary.consumption,
        carbonEmissions: analysis.environmental_impact.carbon_emissions,
        carbonUnit: analysis.environmental_impact.unit,
        analysisContent: analysis.analysis,
      };

      setImageResponse(structuredData);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageResponse('Error processing image');
    }

    setIsProcessingImage(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Smart Insights</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Audio Section */}
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Audio Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <button
                    onClick={handleRecordClick}
                    className={`p-4 rounded-full transition-all transform hover:scale-105 ${isRecording
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                  >
                    {isRecording ? (
                      <MicOff className="h-8 w-8 text-white" />
                    ) : (
                      <Mic className="h-8 w-8 text-white" />
                    )}
                  </button>
                  {isRecording && (
                    <div className="absolute -top-1 -right-1 w-3 h-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                  )}
                </div>

                {audioBlob && (
                  <div className="w-full">
                    <audio controls src={URL.createObjectURL(audioBlob)} className="w-full mt-4" />
                  </div>
                )}

                {isProcessingAudio && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8">
                      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="text-blue-500 animate-pulse">Processing audio...</span>
                  </div>
                )}

                {audioResponse && (
                  <div className="w-full mt-4 p-4 bg-white shadow-lg rounded-lg border border-gray-100">
                    <h3 className="font-semibold mb-2 text-gray-700">Response:</h3>
                    <p className="text-gray-600">{audioResponse}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Section */}
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <label className="w-full">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all transform hover:scale-105 bg-gray-50 hover:bg-gray-100">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="w-full h-48 relative rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {isProcessingImage && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8">
                      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="text-blue-500 animate-pulse">Processing image...</span>
                  </div>
                )}

                {imageResponse && (
                  <div className="w-full mt-4 p-4 bg-white shadow-lg rounded-lg border border-gray-100">
                    {typeof imageResponse === 'string' ? (
                      <p className="text-gray-600">{imageResponse}</p> // Display incremental response
                    ) : (
                      // Render the structured final response
                      <>
                        <h3 className="font-semibold mb-2 text-gray-700">Bill Processing Results</h3>
                        <p><strong>Message:</strong> {imageResponse.message}</p>
                        <p><strong>Bill ID:</strong> {imageResponse.billId}</p>
                        <p><strong>Utility Type:</strong> {imageResponse.utilityType}</p>
                        <p><strong>Consumption:</strong> {imageResponse.consumption} kWh</p>
                        <p><strong>Carbon Emissions:</strong> {imageResponse.carbonEmissions} {imageResponse.carbonUnit}</p>
                        <h4 className="font-semibold mt-4 text-gray-700">Detailed Analysis</h4>
                        <div className="mt-2 whitespace-pre-line text-gray-600">
                          <ReactMarkdown>{imageResponse.analysisContent}</ReactMarkdown>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;