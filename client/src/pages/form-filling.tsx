import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/components/ui/form";
import LanguageToggle from "@/components/language-toggle";
import VoiceAssistant from "@/components/voice-assistant";
import FormFieldWithVoice from "@/components/form-field-with-voice";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { getFormSchema } from "@/lib/form-schemas";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mic, Save, Send, ArrowLeft, MicOff } from "lucide-react";

export default function FormFilling() {
  const { schemeId } = useParams();
  const [language, setLanguage] = useState<'english' | 'hindi'>(() => {
    // Get language from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    return (langParam === 'hindi') ? 'hindi' : 'english';
  });
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formSubmissionId, setFormSubmissionId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { speak, isSpeaking } = useTextToSpeech(language);
  const { startListening, stopListening, isListening, transcript, resetTranscript } = useSpeechRecognition(language);

  const { data: scheme, isLoading: schemeLoading } = useQuery({
    queryKey: ['/api/schemes', schemeId],
  });

  const formSchema = getFormSchema(schemeId as string);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const createSubmissionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/form-submissions', {
        schemeId: schemeId as string,
        formData: JSON.stringify(data),
        language,
        status: 'draft'
      });
    },
    onSuccess: async (response) => {
      const submission = await response.json();
      setFormSubmissionId(submission.id);
      toast({
        title: language === 'english' ? "Form saved" : "फॉर्म सेव हुआ",
        description: language === 'english' ? "Your form has been saved as draft" : "आपका फॉर्म ड्राफ्ट के रूप में सेव हो गया है",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: language === 'english' ? "Error" : "त्रुटि",
        description: language === 'english' ? "Failed to save form" : "फॉर्म सेव नहीं हो सका",
      });
    }
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PATCH', `/api/form-submissions/${formSubmissionId}`, {
        formData: JSON.stringify(data),
        status: 'submitted'
      });
    },
    onSuccess: () => {
      toast({
        title: language === 'english' ? "Form submitted" : "फॉर्म जमा हुआ",
        description: language === 'english' ? "Your form has been submitted successfully" : "आपका फॉर्म सफलतापूर्वक जमा हो गया है",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/form-submissions'] });
    },
  });

  const formFields = [
    { name: 'fullName', type: 'text', required: true },
    { name: 'fatherName', type: 'text', required: true },
    { name: 'mobileNumber', type: 'tel', required: true },
    { name: 'email', type: 'email', required: false },
    { name: 'dob', type: 'date', required: true },
    { name: 'annualIncome', type: 'number', required: true },
    { name: 'address', type: 'textarea', required: true },
    { name: 'state', type: 'select', required: true },
    { name: 'district', type: 'text', required: true },
    { name: 'pincode', type: 'text', required: true },
  ];

  const fieldLabels = {
    english: {
      fullName: 'Full Name',
      fatherName: "Father's Name",
      mobileNumber: 'Mobile Number',
      email: 'Email Address',
      dob: 'Date of Birth',
      annualIncome: 'Annual Income',
      address: 'Complete Address',
      state: 'State',
      district: 'District',
      pincode: 'PIN Code'
    },
    hindi: {
      fullName: 'पूरा नाम',
      fatherName: 'पिता का नाम',
      mobileNumber: 'मोबाइल नंबर',
      email: 'ईमेल पता',
      dob: 'जन्म तिथि',
      annualIncome: 'वार्षिक आय',
      address: 'पूरा पता',
      state: 'राज्य',
      district: 'जिला',
      pincode: 'पिन कोड'
    }
  };

  const content = {
    english: {
      title: "AI Form Sahayak",
      subtitle: "Smart Government Form Assistant",
      voiceMode: "Voice Mode",
      voiceOff: "Voice Off",
      progress: "Progress",
      saveDraft: "Save Draft",
      submit: "Submit Form",
      backToSchemes: "Back to Schemes",
      voiceReady: "Voice Assistant Ready",
      listening: "Listening...",
    },
    hindi: {
      title: "एआई फॉर्म सहायक",
      subtitle: "स्मार्ट सरकारी फॉर्म असिस्टेंट",
      voiceMode: "आवाज मोड",
      voiceOff: "आवाज बंद",
      progress: "प्रगति",
      saveDraft: "ड्राफ्ट सेव करें",
      submit: "फॉर्म जमा करें",
      backToSchemes: "योजनाओं पर वापस",
      voiceReady: "आवाज असिस्टेंट तैयार",
      listening: "सुन रहा है...",
    }
  };

  const currentContent = content[language];
  const completedFields = formFields.filter(field => 
    form.watch(field.name as any) && String(form.watch(field.name as any)).trim() !== ''
  ).length;
  const progressPercentage = (completedFields / formFields.length) * 100;

  // Handle voice field filling
  const handleVoiceInput = async (fieldName: string) => {
    if (!isVoiceMode) return;

    const fieldLabel = fieldLabels[language][fieldName as keyof typeof fieldLabels[typeof language]];
    const field = formFields.find(f => f.name === fieldName);
    
    let prompt = '';
    if (language === 'english') {
      if (fieldName === 'annualIncome') {
        prompt = `Please say your ${fieldLabel.toLowerCase()} in rupees`;
      } else if (fieldName === 'mobileNumber') {
        prompt = `Please say your ${fieldLabel.toLowerCase()}, one digit at a time`;
      } else if (fieldName === 'pincode') {
        prompt = `Please say your ${fieldLabel.toLowerCase()}, digit by digit`;
      } else {
        prompt = `Please say your ${fieldLabel.toLowerCase()}`;
      }
    } else {
      if (fieldName === 'annualIncome') {
        prompt = `कृपया अपनी ${fieldLabel} रुपयों में बताएं`;
      } else if (fieldName === 'mobileNumber') {
        prompt = `कृपया अपना ${fieldLabel} एक-एक अंक करके बताएं`;
      } else if (fieldName === 'pincode') {
        prompt = `कृपया अपना ${fieldLabel} अंक-दर-अंक बताएं`;
      } else {
        prompt = `कृपया अपना ${fieldLabel} बताएं`;
      }
    }

    // Announce the field name first
    await speak(prompt);
    
    // Wait for speech to complete before starting listening
    setTimeout(() => {
      startListening((recognizedText: string) => {
        // Process and set the recognized text
        if (recognizedText.trim()) {
          let processedText = recognizedText.trim();
          
          // Process based on field type
          if (fieldName === 'annualIncome') {
            processedText = processIncomeText(recognizedText, language);
          } else if (fieldName === 'mobileNumber' || fieldName === 'pincode') {
            processedText = extractDigitsFromText(recognizedText, language);
          } else if (fieldName === 'fullName' || fieldName === 'fatherName') {
            processedText = capitalizeWords(recognizedText);
          }
          
          form.setValue(fieldName as any, processedText);
          resetTranscript();
          
          // Confirm what was heard
          const confirmation = language === 'english'
            ? `I heard: ${processedText}. Moving to next field.`
            : `मैंने सुना: ${processedText}। अगले फील्ड पर जा रहे हैं।`;
          speak(confirmation);
        }
      });
    }, 2000);
  };

  // Helper function to process income text
  const processIncomeText = (text: string, lang: 'english' | 'hindi'): string => {
    let processed = text.toLowerCase();
    
    if (lang === 'english') {
      // Convert words to numbers
      processed = processed
        .replace(/\bone\b/g, '1')
        .replace(/\btwo\b/g, '2')
        .replace(/\bthree\b/g, '3')
        .replace(/\bfour\b/g, '4')
        .replace(/\bfive\b/g, '5')
        .replace(/\bsix\b/g, '6')
        .replace(/\bseven\b/g, '7')
        .replace(/\beight\b/g, '8')
        .replace(/\bnine\b/g, '9')
        .replace(/\bten\b/g, '10')
        .replace(/\btwenty\b/g, '20')
        .replace(/\bthirty\b/g, '30')
        .replace(/\bforty\b/g, '40')
        .replace(/\bfifty\b/g, '50')
        .replace(/\bsixty\b/g, '60')
        .replace(/\bseventy\b/g, '70')
        .replace(/\beighty\b/g, '80')
        .replace(/\bninety\b/g, '90')
        .replace(/\bhundred\b/g, '00')
        .replace(/\bthousand\b/g, '000')
        .replace(/\blakh\b/g, '00000')
        .replace(/\bcrore\b/g, '0000000')
        .replace(/rupees?/g, '')
        .replace(/₹/g, '');
    } else {
      // Convert Hindi words to numbers
      processed = processed
        .replace(/\bएक\b/g, '1')
        .replace(/\bदो\b/g, '2')
        .replace(/\bतीन\b/g, '3')
        .replace(/\bचार\b/g, '4')
        .replace(/\bपांच\b/g, '5')
        .replace(/\bछह\b/g, '6')
        .replace(/\bसात\b/g, '7')
        .replace(/\bआठ\b/g, '8')
        .replace(/\bनौ\b/g, '9')
        .replace(/\bदस\b/g, '10')
        .replace(/\bबीस\b/g, '20')
        .replace(/\bतीस\b/g, '30')
        .replace(/\bचालीस\b/g, '40')
        .replace(/\bपचास\b/g, '50')
        .replace(/\bसाठ\b/g, '60')
        .replace(/\bसत्तर\b/g, '70')
        .replace(/\bअस्सी\b/g, '80')
        .replace(/\bनब्बे\b/g, '90')
        .replace(/\bसौ\b/g, '00')
        .replace(/\bहजार\b/g, '000')
        .replace(/\bलाख\b/g, '00000')
        .replace(/\bकरोड़\b/g, '0000000')
        .replace(/रुपये?/g, '')
        .replace(/₹/g, '');
    }
    
    // Extract only digits and clean up
    const digits = processed.match(/\d+/g);
    return digits ? digits.join('') : text;
  };

  // Helper function to extract digits
  const extractDigitsFromText = (text: string, lang: 'english' | 'hindi'): string => {
    let processed = text.toLowerCase();
    
    if (lang === 'english') {
      processed = processed
        .replace(/\bzero\b/g, '0')
        .replace(/\bone\b/g, '1')
        .replace(/\btwo\b/g, '2')
        .replace(/\bthree\b/g, '3')
        .replace(/\bfour\b/g, '4')
        .replace(/\bfive\b/g, '5')
        .replace(/\bsix\b/g, '6')
        .replace(/\bseven\b/g, '7')
        .replace(/\beight\b/g, '8')
        .replace(/\bnine\b/g, '9');
    } else {
      processed = processed
        .replace(/\bशून्य\b/g, '0')
        .replace(/\bएक\b/g, '1')
        .replace(/\bदो\b/g, '2')
        .replace(/\bतीन\b/g, '3')
        .replace(/\bचार\b/g, '4')
        .replace(/\bपांच\b/g, '5')
        .replace(/\bछह\b/g, '6')
        .replace(/\bसात\b/g, '7')
        .replace(/\bआठ\b/g, '8')
        .replace(/\bनौ\b/g, '9');
    }
    
    // Extract only digits
    const digits = processed.match(/\d/g);
    return digits ? digits.join('') : text;
  };

  // Helper function to capitalize words
  const capitalizeWords = (text: string): string => {
    return text.replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSaveDraft = () => {
    const formData = form.getValues();
    if (formSubmissionId) {
      updateSubmissionMutation.mutate({ ...formData, status: 'draft' });
    } else {
      createSubmissionMutation.mutate(formData);
    }
  };

  const onSubmit = (data: any) => {
    if (formSubmissionId) {
      updateSubmissionMutation.mutate({ ...data, status: 'submitted' });
    } else {
      createSubmissionMutation.mutate({ ...data, status: 'submitted' });
    }
  };

  useEffect(() => {
    if (isVoiceMode && transcript) {
      // Auto-fill current field if we have transcript
      const currentField = formFields[currentFieldIndex];
      if (currentField && transcript.trim()) {
        form.setValue(currentField.name as any, transcript.trim());
      }
    }
  }, [transcript, isVoiceMode, currentFieldIndex]);

  if (schemeLoading) {
    return (
      <div className="min-h-screen bg-gov-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gov-surface flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Scheme not found</p>
            <Link href="/schemes">
              <Button className="mt-4 w-full">Back to Schemes</Button>
            </Link>
          </CardContent>
        </Card>
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
          <Link href="/schemes">
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              {currentContent.backToSchemes}
            </Button>
          </Link>
        </div>

        {/* Form Container */}
        <Card>
          {/* Form Header */}
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {scheme.name[language]}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {scheme.description[language]}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Voice Toggle */}
                <Button
                  variant={isVoiceMode ? "destructive" : "default"}
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className="flex items-center space-x-2"
                >
                  {isVoiceMode ? <MicOff size={16} /> : <Mic size={16} />}
                  <span className="text-sm font-medium">
                    {isVoiceMode ? currentContent.voiceOff : currentContent.voiceMode}
                  </span>
                </Button>
                {/* Progress */}
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{currentContent.progress}</div>
                  <div className="text-sm text-gray-600">{completedFields} of {formFields.length} fields</div>
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-4">
              <Progress value={progressPercentage} className="w-full" />
            </div>
          </CardHeader>

          {/* Form Fields */}
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="border-l-4 border-gov-blue pl-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {language === 'english' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {formFields.slice(0, 6).map((field, index) => (
                    <FormFieldWithVoice
                      key={field.name}
                      field={field}
                      form={form}
                      language={language}
                      fieldLabels={fieldLabels}
                      onVoiceInput={() => handleVoiceInput(field.name)}
                      isVoiceMode={isVoiceMode}
                      isListening={isListening}
                    />
                  ))}
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {language === 'english' ? 'Address Information' : 'पता की जानकारी'}
                </h4>
                
                <div className="space-y-6">
                  {formFields.slice(6).map((field, index) => (
                    <FormFieldWithVoice
                      key={field.name}
                      field={field}
                      form={form}
                      language={language}
                      fieldLabels={fieldLabels}
                      onVoiceInput={() => handleVoiceInput(field.name)}
                      isVoiceMode={isVoiceMode}
                      isListening={isListening}
                    />
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleSaveDraft}
                  disabled={createSubmissionMutation.isPending}
                >
                  <Save className="mr-2" size={16} />
                  {currentContent.saveDraft}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gov-blue hover:bg-gov-blue-dark"
                  disabled={updateSubmissionMutation.isPending}
                >
                  <Send className="mr-2" size={16} />
                  {currentContent.submit}
                </Button>
              </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Voice Assistant Panel */}
        {isVoiceMode && (
          <VoiceAssistant
            language={language}
            isListening={isListening}
            isSpeaking={isSpeaking}
            onClose={() => setIsVoiceMode(false)}
          />
        )}
      </main>
    </div>
  );
}
