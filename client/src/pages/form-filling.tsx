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
import PhotoCapture from "@/components/photo-capture";
import SignaturePad from "@/components/signature-pad";
import DocumentScanner from "@/components/document-scanner";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { getFormSchema } from "@/lib/form-schemas";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { processVoiceInput } from "@/lib/speech-utils";
import { Mic, Save, Send, ArrowLeft, MicOff, Camera, Pen, Scan, X } from "lucide-react";

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
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState<string>('');
  
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
          
          // Process based on field type using improved speech utils
          processedText = processVoiceInput(recognizedText, field?.type || 'text', language, fieldName);
          
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

  // Photo capture handler
  const handlePhotoCapture = (imageData: string) => {
    form.setValue('applicantPhoto', imageData);
    setShowPhotoCapture(false);
    
    const confirmation = language === 'english' 
      ? 'Photo captured successfully!' 
      : 'फोटो सफलतापूर्वक कैप्चर हुई!';
    speak(confirmation);
  };

  // Signature capture handler
  const handleSignatureCapture = (signatureData: string) => {
    form.setValue('applicantSignature', signatureData);
    setShowSignaturePad(false);
    
    const confirmation = language === 'english' 
      ? 'Signature captured successfully!' 
      : 'हस्ताक्षर सफलतापूर्वक कैप्चर हुआ!';
    speak(confirmation);
  };

  // Document capture handler
  const handleDocumentCapture = (documentData: string, documentType: string) => {
    form.setValue(documentType as any, documentData);
    setShowDocumentScanner(false);
    setCurrentDocumentType('');
    
    const confirmation = language === 'english' 
      ? 'Document captured successfully!' 
      : 'दस्तावेज़ सफलतापूर्वक कैप्चर हुआ!';
    speak(confirmation);
  };

  // Open document scanner
  const openDocumentScanner = (documentType: string) => {
    setCurrentDocumentType(documentType);
    setShowDocumentScanner(true);
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

              {/* Photo and Signature Section */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {language === 'english' ? 'Photo & Signature' : 'फोटो और हस्ताक्षर'}
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Photo Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'english' ? 'Applicant Photo' : 'आवेदक की फोटो'}
                    </label>
                    {form.watch('applicantPhoto') ? (
                      <div className="relative">
                        <img 
                          src={form.watch('applicantPhoto')} 
                          alt="Applicant" 
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowPhotoCapture(true)}
                        >
                          {language === 'english' ? 'Change Photo' : 'फोटो बदलें'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2"
                        onClick={() => setShowPhotoCapture(true)}
                      >
                        <Camera size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {language === 'english' ? 'Take Photo' : 'फोटो लें'}
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Signature Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'english' ? 'Digital Signature' : 'डिजिटल हस्ताक्षर'}
                    </label>
                    {form.watch('applicantSignature') ? (
                      <div className="relative">
                        <img 
                          src={form.watch('applicantSignature')} 
                          alt="Signature" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 bg-white"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowSignaturePad(true)}
                        >
                          {language === 'english' ? 'Change Signature' : 'हस्ताक्षर बदलें'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2"
                        onClick={() => setShowSignaturePad(true)}
                      >
                        <Pen size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {language === 'english' ? 'Add Signature' : 'हस्ताक्षर जोड़ें'}
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {language === 'english' ? 'Required Documents' : 'आवश्यक दस्तावेज़'}
                </h4>
                
                <div className="space-y-4">
                  {/* Identity Document */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'english' ? 'Identity Document (Aadhar/Voter ID)' : 'पहचान दस्तावेज़ (आधार/वोटर आईडी)'}
                    </label>
                    {form.watch('identityDocument') ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <span className="text-sm text-green-700">
                          {language === 'english' ? 'Document uploaded' : 'दस्तावेज़ अपलोड हो गया'}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentScanner('identityDocument')}
                        >
                          {language === 'english' ? 'Replace' : 'बदलें'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2"
                        onClick={() => openDocumentScanner('identityDocument')}
                      >
                        <Scan size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {language === 'english' ? 'Scan Identity Document' : 'पहचान दस्तावेज़ स्कैन करें'}
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Address Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'english' ? 'Address Proof' : 'पता प्रमाण'}
                    </label>
                    {form.watch('addressProof') ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <span className="text-sm text-green-700">
                          {language === 'english' ? 'Document uploaded' : 'दस्तावेज़ अपलोड हो गया'}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentScanner('addressProof')}
                        >
                          {language === 'english' ? 'Replace' : 'बदलें'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2"
                        onClick={() => openDocumentScanner('addressProof')}
                      >
                        <Scan size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {language === 'english' ? 'Scan Address Proof' : 'पता प्रमाण स्कैन करें'}
                        </span>
                      </Button>
                    )}
                  </div>

                  {/* Income Document */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'english' ? 'Income Certificate' : 'आय प्रमाण पत्र'}
                    </label>
                    {form.watch('incomeDocument') ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <span className="text-sm text-green-700">
                          {language === 'english' ? 'Document uploaded' : 'दस्तावेज़ अपलोड हो गया'}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentScanner('incomeDocument')}
                        >
                          {language === 'english' ? 'Replace' : 'बदलें'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2"
                        onClick={() => openDocumentScanner('incomeDocument')}
                      >
                        <Scan size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {language === 'english' ? 'Scan Income Certificate' : 'आय प्रमाण पत्र स्कैन करें'}
                        </span>
                      </Button>
                    )}
                  </div>
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

        {/* Photo Capture Modal */}
        {showPhotoCapture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === 'english' ? 'Capture Photo' : 'फोटो कैप्चर करें'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPhotoCapture(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="p-4">
                <PhotoCapture
                  onPhotoCapture={handlePhotoCapture}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* Signature Pad Modal */}
        {showSignaturePad && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === 'english' ? 'Digital Signature' : 'डिजिटल हस्ताक्षर'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSignaturePad(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="p-4">
                <SignaturePad
                  onSignatureCapture={handleSignatureCapture}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* Document Scanner Modal */}
        {showDocumentScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === 'english' ? 'Scan Document' : 'दस्तावेज़ स्कैन करें'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDocumentScanner(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="p-4">
                <DocumentScanner
                  onDocumentCapture={handleDocumentCapture}
                  language={language}
                  documentType={currentDocumentType}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
