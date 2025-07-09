import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pen, RotateCw, Check, X } from "lucide-react";

interface SignaturePadProps {
  onSignatureCapture: (signatureData: string) => void;
  language: 'english' | 'hindi';
}

export default function SignaturePad({ onSignatureCapture, language }: SignaturePadProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const content = {
    english: {
      title: "Digital Signature",
      description: "Sign in the box below",
      clearButton: "Clear",
      saveButton: "Save Signature",
      instruction: "Draw your signature here"
    },
    hindi: {
      title: "डिजिटल हस्ताक्षर",
      description: "नीचे बॉक्स में हस्ताक्षर करें",
      clearButton: "साफ़ करें",
      saveButton: "हस्ताक्षर सेव करें",
      instruction: "यहाँ अपना हस्ताक्षर बनाएं"
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let x, y;
        if ('touches' in e) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let x, y;
        if ('touches' in e) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      const signatureData = canvas.toDataURL('image/png');
      onSignatureCapture(signatureData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{currentContent.title}</CardTitle>
        <p className="text-sm text-gray-600 text-center">{currentContent.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair w-full bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-gray-400 text-sm flex items-center gap-2">
                <Pen size={16} />
                {currentContent.instruction}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearSignature}
            className="flex-1 flex items-center justify-center gap-2"
            disabled={!hasSignature}
          >
            <RotateCw size={16} />
            {currentContent.clearButton}
          </Button>
          <Button
            onClick={saveSignature}
            className="flex-1 flex items-center justify-center gap-2"
            disabled={!hasSignature}
          >
            <Check size={16} />
            {currentContent.saveButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}