import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LanguageToggle from "@/components/language-toggle";
import { Mic, ArrowLeft, ArrowRight } from "lucide-react";

export default function SchemeSelection() {
  const [language, setLanguage] = useState<'english' | 'hindi'>(() => {
    // Get language from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    return (langParam === 'hindi') ? 'hindi' : 'english';
  });

  const { data: schemes, isLoading } = useQuery({
    queryKey: ['/api/schemes'],
  });

  const content = {
    english: {
      title: "AI Form Sahayak",
      subtitle: "Smart Government Form Assistant",
      selectScheme: "Select Government Scheme Form",
      backHome: "Back to Home"
    },
    hindi: {
      title: "एआई फॉर्म सहायक",
      subtitle: "स्मार्ट सरकारी फॉर्म असिस्टेंट",
      selectScheme: "सरकारी योजना फॉर्म चुनें",
      backHome: "होम पर वापस"
    }
  };

  const currentContent = content[language];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gov-surface">
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2" size={16} />
              {currentContent.backHome}
            </Button>
          </Link>
        </div>

        {/* Scheme Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {currentContent.selectScheme}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {schemes?.map((scheme: any) => (
                <Link key={scheme.id} href={`/form/${scheme.id}?lang=${language}`}>
                  <Card className="border border-gray-200 hover:border-gov-blue cursor-pointer transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gov-blue/10 rounded-lg flex items-center justify-center">
                          <i className={`${scheme.icon} text-gov-blue text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {scheme.name[language]}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {scheme.description[language]}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-gov-blue text-sm">
                              <span>
                                {language === 'english' ? 'Fill in English' : 'हिंदी में भरें'}
                              </span>
                              <ArrowRight className="ml-1" size={14} />
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {language === 'english' ? '🇺🇸 EN Voice' : '🇮🇳 HI Voice'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
