import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X, FileText, Scan } from "lucide-react";

interface DocumentScannerProps {
  onDocumentCapture: (documentData: string, documentType: string) => void;
  language: 'english' | 'hindi';
  documentType: string;
}

export default function DocumentScanner({ onDocumentCapture, language, documentType }: DocumentScannerProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedDocument, setCapturedDocument] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const content = {
    english: {
      title: `${documentType} Document`,
      description: "Scan document or upload from gallery",
      cameraButton: "Open Camera",
      uploadButton: "Upload Document",
      captureButton: "Capture Document",
      retakeButton: "Retake",
      useDocumentButton: "Use Document",
      cancelButton: "Cancel",
      tip: "Ensure document is clearly visible and well-lit"
    },
    hindi: {
      title: `${documentType} दस्तावेज़`,
      description: "दस्तावेज़ स्कैन करें या गैलरी से अपलोड करें",
      cameraButton: "कैमरा खोलें",
      uploadButton: "दस्तावेज़ अपलोड करें",
      captureButton: "दस्तावेज़ कैप्चर करें",
      retakeButton: "फिर से लें",
      useDocumentButton: "दस्तावेज़ उपयोग करें",
      cancelButton: "रद्द करें",
      tip: "सुनिश्चित करें कि दस्तावेज़ स्पष्ट रूप से दिखाई दे रहा है और अच्छी रोशनी में है"
    }
  };

  const currentContent = content[language];

  const startCamera = async () => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Try different camera configurations for document scanning
      let mediaStream;
      const cameraConfigs = [
        // Try back camera first (ideal for document scanning)
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Fallback to any camera with constraints
        { video: { width: { ideal: 1280 }, height: { ideal: 720 } } },
        // Basic video only
        { video: true }
      ];

      for (const config of cameraConfigs) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(config);
          console.log('Camera started with config:', config);
          break;
        } catch (configError) {
          console.log('Camera config failed:', config, configError);
        }
      }

      if (!mediaStream) {
        throw new Error('Unable to access camera with any configuration');
      }
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Set up video element properties first
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        // Handle video loading and playing
        const handleVideoReady = async () => {
          try {
            if (video && video.srcObject) {
              await video.play();
              console.log('Video is now playing');
              setIsVideoPlaying(true);
            }
          } catch (playError) {
            console.error('Error playing video:', playError);
            // Try to play again after a short delay
            setTimeout(async () => {
              try {
                if (video && video.srcObject) {
                  await video.play();
                  setIsVideoPlaying(true);
                }
              } catch (retryError) {
                console.error('Retry play failed:', retryError);
              }
            }, 100);
          }
        };

        // Add event listeners before setting srcObject
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
          handleVideoReady();
        };
        
        video.oncanplay = () => {
          console.log('Video can play');
          handleVideoReady();
        };
        
        // Reset video playing state
        setIsVideoPlaying(false);
        
        // Set the stream - this should trigger the events
        video.srcObject = mediaStream;
        
        // Force load if needed
        video.load();
        
        // Try to play immediately in case events don't fire
        setTimeout(() => {
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA
            handleVideoReady();
          }
        }, 100);
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      let errorMessage = '';
      if (language === 'english') {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Camera not supported in this browser.';
        } else {
          errorMessage = 'Error accessing camera. Please check your browser settings.';
        }
      } else {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'कैमरा अनुमति नहीं दी गई। कृपया कैमरा एक्सेस की अनुमति दें और फिर कोशिश करें।';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'इस डिवाइस पर कोई कैमरा नहीं मिला।';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'इस ब्राउज़र में कैमरा समर्थित नहीं है।';
        } else {
          errorMessage = 'कैमरा एक्सेस में त्रुटि। कृपया अपनी ब्राउज़र सेटिंग्स जांचें।';
        }
      }
      
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setIsVideoPlaying(false);
  };

  const captureDocument = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedDocument(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedDocument(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDocument = () => {
    if (capturedDocument) {
      onDocumentCapture(capturedDocument, documentType);
    }
  };

  const handleRetake = () => {
    setCapturedDocument(null);
    if (isCameraActive) {
      stopCamera();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <FileText size={20} />
          {currentContent.title}
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">{currentContent.description}</p>
        <p className="text-xs text-blue-600 text-center">{currentContent.tip}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCameraActive && !capturedDocument && (
          <div className="space-y-3">
            <Button
              onClick={startCamera}
              className="w-full flex items-center justify-center gap-2"
            >
              <Scan size={20} />
              {currentContent.cameraButton}
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload size={20} />
              {currentContent.uploadButton}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {isCameraActive && (
          <div className="space-y-3">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover bg-black"
                onLoadStart={() => console.log('Video load started')}
                onLoadedData={() => console.log('Video data loaded')}
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement;
                  console.log('Video metadata loaded, size:', video.videoWidth, 'x', video.videoHeight);
                }}
                onPlaying={() => {
                  console.log('Video is playing');
                  setIsVideoPlaying(true);
                }}
                onPause={() => console.log('Video paused')}
                onError={(e) => {
                  console.error('Video error:', e);
                  const video = e.target as HTMLVideoElement;
                  console.error('Video error details:', {
                    error: video.error,
                    networkState: video.networkState,
                    readyState: video.readyState,
                    srcObject: video.srcObject
                  });
                }}
                onCanPlay={() => console.log('Video can play')}
              />
              <div className="absolute inset-0 border-2 border-white border-dashed m-4 rounded-lg"></div>
              {/* Loading overlay - only show when video is not playing */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black bg-opacity-50">
                  <span className="bg-black bg-opacity-75 px-3 py-2 rounded">
                    {language === 'english' ? 'Loading camera...' : 'कैमरा लोड हो रहा है...'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={captureDocument}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                {currentContent.captureButton}
              </Button>
              <Button
                variant="outline"
                onClick={stopCamera}
                className="flex items-center justify-center gap-2"
              >
                <X size={20} />
                {currentContent.cancelButton}
              </Button>
            </div>
          </div>
        )}

        {capturedDocument && (
          <div className="space-y-3">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={capturedDocument}
                alt="Captured Document"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUseDocument}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {currentContent.useDocumentButton}
              </Button>
              <Button
                variant="outline"
                onClick={handleRetake}
                className="flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                {currentContent.retakeButton}
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}