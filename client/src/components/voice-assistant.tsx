import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, X, HelpCircle } from "lucide-react";
import { useState } from "react";

interface VoiceAssistantProps {
  language: 'english' | 'hindi';
  isListening: boolean;
  isSpeaking: boolean;
  onClose: () => void;
}

export default function VoiceAssistant({ language, isListening, isSpeaking, onClose }: VoiceAssistantProps) {
  const [showHelp, setShowHelp] = useState(false);

  const content = {
    english: {
      title: "English Voice Assistant",
      ready: "English voice assistant is active. Click microphone icons to fill fields using voice. I understand English speech and numbers.",
      listening: "Listening for English input...",
      speaking: "Speaking in English...",
      helpTitle: "English Voice Commands Help",
      helpCommands: [
        "My name is John Doe",
        "Two lakh fifty thousand rupees",
        "My mobile number is nine eight seven six five four three two one zero",
        "I live in New Delhi",
        "PIN code is one one zero zero zero one"
      ],
      close: "Close",
      help: "Help",
      languageNote: "🇺🇸 Recognizes: English words, numbers, rupees"
    },
    hindi: {
      title: "हिंदी आवाज असिस्टेंट",
      ready: "हिंदी आवाज असिस्टेंट सक्रिय है। आवाज से फील्ड भरने के लिए माइक आइकन पर क्लिक करें। मैं हिंदी भाषा और संख्याएं समझता हूं।",
      listening: "हिंदी आवाज सुन रहा है...",
      speaking: "हिंदी में बोल रहा है...",
      helpTitle: "हिंदी आवाज कमांड सहायता",
      helpCommands: [
        "मेरा नाम राम कुमार है",
        "दो लाख पचास हजार रुपये",
        "मेरा मोबाइल नंबर नौ आठ सात छह पांच चार तीन दो एक शून्य है",
        "मैं नई दिल्ली में रहता हूं",
        "पिन कोड एक एक शून्य शून्य शून्य एक है"
      ],
      close: "बंद करें",
      help: "सहायता",
      languageNote: "🇮🇳 समझता है: हिंदी शब्द, संख्याएं, रुपये"
    }
  };

  const currentContent = content[language];

  const getStatusMessage = () => {
    if (isSpeaking) return currentContent.speaking;
    if (isListening) return currentContent.listening;
    return currentContent.ready;
  };

  const getStatusColor = () => {
    if (isSpeaking) return "text-blue-700 bg-blue-50";
    if (isListening) return "text-green-700 bg-green-50";
    return "text-gray-700 bg-gray-50";
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm z-40">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gov-blue rounded-full flex items-center justify-center">
            <Mic className="text-white" size={16} />
          </div>
          <div className="flex-1">
            <h5 className="font-medium text-gray-900">{currentContent.title}</h5>
            <p className="text-xs text-gray-600">
              {currentContent.languageNote}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-6 w-6"
          >
            <X size={14} />
          </Button>
        </div>
        
        <div className={`text-sm p-3 rounded-lg mb-3 ${getStatusColor()}`}>
          {getStatusMessage()}
          {isListening && (
            <div className="flex space-x-1 mt-2">
              <div className="w-1 h-4 bg-current rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-current rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-4 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHelp(true)}
          className="w-full text-xs"
        >
          <HelpCircle className="mr-1" size={12} />
          {currentContent.help}
        </Button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentContent.helpTitle}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(false)}
                  className="p-1 h-6 w-6"
                >
                  <X size={14} />
                </Button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    {language === 'english' ? 'Example Commands:' : 'उदाहरण कमांड:'}
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    {currentContent.helpCommands.map((command, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>"{command}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
