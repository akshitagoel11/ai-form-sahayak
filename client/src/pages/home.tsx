import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/language-toggle";
import { Mic, FileText, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

  const content = {
    english: {
      title: "AI Form Sahayak",
      subtitle: "Smart Government Form Assistant",
      description: "Fill government forms easily with voice assistance in English or Hindi",
      voiceReady: "Voice Assistant Ready",
      features: {
        voice: "Voice Guided Forms",
        voiceDesc: "Step-by-step voice assistance",
        multilingual: "Bilingual Support",
        multilingualDesc: "Available in English & Hindi",
        smart: "Smart Recognition",
        smartDesc: "Automatic field detection"
      },
      startButton: "Start Form Filling",
      welcome: "Welcome to AI Form Sahayak"
    },
    hindi: {
      title: "एआई फॉर्म सहायक",
      subtitle: "स्मार्ट सरकारी फॉर्म असिस्टेंट",
      description: "अंग्रेजी या हिंदी में आवाज सहायता के साथ सरकारी फॉर्म आसानी से भरें",
      voiceReady: "आवाज असिस्टेंट तैयार",
      features: {
        voice: "आवाज गाइडेड फॉर्म",
        voiceDesc: "चरण-दर-चरण आवाज सहायता",
        multilingual: "द्विभाषी समर्थन",
        multilingualDesc: "अंग्रेजी और हिंदी में उपलब्ध",
        smart: "स्मार्ट पहचान",
        smartDesc: "स्वचालित फील्ड पहचान"
      },
      startButton: "फॉर्म भरना शुरू करें",
      welcome: "एआई फॉर्म सहायक में आपका स्वागत है"
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gov-surface">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gov-blue rounded-lg flex items-center justify-center">
                <Mic className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{currentContent.title}</h1>
                <p className="text-sm text-gray-600">{currentContent.subtitle}</p>
              </div>
            </div>
            
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gov-blue to-gov-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{currentContent.welcome}</h2>
              <p className="text-gray-600 mb-4">{currentContent.description}</p>
              
              {/* Voice Status Indicator */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">{currentContent.voiceReady}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gov-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mic className="text-gov-blue" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{currentContent.features.voice}</h3>
                <p className="text-sm text-gray-600">{currentContent.features.voiceDesc}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gov-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gov-blue" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{currentContent.features.multilingual}</h3>
                <p className="text-sm text-gray-600">{currentContent.features.multilingualDesc}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gov-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gov-blue" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{currentContent.features.smart}</h3>
                <p className="text-sm text-gray-600">{currentContent.features.smartDesc}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Choice Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'english' 
                  ? 'Choose Your Preferred Language for Form Filling' 
                  : 'फॉर्म भरने के लिए अपनी पसंदीदा भाषा चुनें'
                }
              </h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <Link href={`/schemes?lang=english`}>
                  <Card className={`border-2 cursor-pointer transition-all hover:border-gov-blue ${
                    language === 'english' ? 'border-gov-blue bg-gov-blue/5' : 'border-gray-200'
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🇺🇸</div>
                      <h4 className="font-semibold text-gray-900">English</h4>
                      <p className="text-sm text-gray-600 mt-1">Forms in English</p>
                      <p className="text-xs text-gov-blue mt-1">English Voice Assistant</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href={`/schemes?lang=hindi`}>
                  <Card className={`border-2 cursor-pointer transition-all hover:border-gov-blue ${
                    language === 'hindi' ? 'border-gov-blue bg-gov-blue/5' : 'border-gray-200'
                  }`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🇮🇳</div>
                      <h4 className="font-semibold text-gray-900">हिंदी</h4>
                      <p className="text-sm text-gray-600 mt-1">हिंदी में फॉर्म</p>
                      <p className="text-xs text-gov-blue mt-1">हिंदी आवाज असिस्टेंट</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            {language === 'english'
              ? 'Or continue with current language selection'
              : 'या वर्तमान भाषा चयन के साथ जारी रखें'
            }
          </p>
          <Link href="/schemes">
            <Button size="lg" className="bg-gov-blue hover:bg-gov-blue-dark text-white px-8 py-4 text-lg">
              {currentContent.startButton}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
