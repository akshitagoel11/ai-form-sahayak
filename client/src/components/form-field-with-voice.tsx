import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface FormFieldWithVoiceProps {
  field: {
    name: string;
    type: string;
    required: boolean;
  };
  form: any;
  language: 'english' | 'hindi';
  fieldLabels: any;
  onVoiceInput: () => void;
  isVoiceMode: boolean;
  isListening: boolean;
}

export default function FormFieldWithVoice({ 
  field, 
  form, 
  language, 
  fieldLabels, 
  onVoiceInput, 
  isVoiceMode,
  isListening 
}: FormFieldWithVoiceProps) {
  const label = fieldLabels[language][field.name as keyof typeof fieldLabels[typeof language]];
  const placeholders = {
    english: {
      fullName: "Enter your full name",
      fatherName: "Enter father's name",
      mobileNumber: "10-digit mobile number",
      email: "your@email.com",
      dob: "",
      annualIncome: "2,50,000",
      address: "House No., Street, Locality, City, State, PIN",
      state: "Select State",
      district: "Enter district",
      pincode: "6-digit PIN"
    },
    hindi: {
      fullName: "अपना पूरा नाम दर्ज करें",
      fatherName: "पिता का नाम दर्ज करें",
      mobileNumber: "10 अंकों का मोबाइल नंबर",
      email: "your@email.com",
      dob: "",
      annualIncome: "2,50,000",
      address: "घर नं., गली, मोहल्ला, शहर, राज्य, पिन",
      state: "राज्य चुनें",
      district: "जिला दर्ज करें",
      pincode: "6 अंकों का पिन"
    }
  };

  const stateOptions = [
    { value: "andhra-pradesh", label: { english: "Andhra Pradesh", hindi: "आंध्र प्रदेश" } },
    { value: "assam", label: { english: "Assam", hindi: "असम" } },
    { value: "bihar", label: { english: "Bihar", hindi: "बिहार" } },
    { value: "chhattisgarh", label: { english: "Chhattisgarh", hindi: "छत्तीसगढ़" } },
    { value: "delhi", label: { english: "Delhi", hindi: "दिल्ली" } },
    { value: "goa", label: { english: "Goa", hindi: "गोवा" } },
    { value: "gujarat", label: { english: "Gujarat", hindi: "गुजरात" } },
    { value: "haryana", label: { english: "Haryana", hindi: "हरियाणा" } },
    { value: "himachal-pradesh", label: { english: "Himachal Pradesh", hindi: "हिमाचल प्रदेश" } },
    { value: "jharkhand", label: { english: "Jharkhand", hindi: "झारखंड" } },
    { value: "karnataka", label: { english: "Karnataka", hindi: "कर्नाटक" } },
    { value: "kerala", label: { english: "Kerala", hindi: "केरल" } },
    { value: "madhya-pradesh", label: { english: "Madhya Pradesh", hindi: "मध्य प्रदेश" } },
    { value: "maharashtra", label: { english: "Maharashtra", hindi: "महाराष्ट्र" } },
    { value: "odisha", label: { english: "Odisha", hindi: "ओडिशा" } },
    { value: "punjab", label: { english: "Punjab", hindi: "पंजाब" } },
    { value: "rajasthan", label: { english: "Rajasthan", hindi: "राजस्थान" } },
    { value: "tamil-nadu", label: { english: "Tamil Nadu", hindi: "तमिलनाडु" } },
    { value: "telangana", label: { english: "Telangana", hindi: "तेलंगाना" } },
    { value: "uttar-pradesh", label: { english: "Uttar Pradesh", hindi: "उत्तर प्रदेश" } },
    { value: "uttarakhand", label: { english: "Uttarakhand", hindi: "उत्तराखंड" } },
    { value: "west-bengal", label: { english: "West Bengal", hindi: "पश्चिम बंगाल" } },
  ];

  const placeholder = placeholders[language][field.name as keyof typeof placeholders[typeof language]];

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <div className="relative">
            <Textarea
              placeholder={placeholder}
              className="pr-10 resize-none"
              rows={3}
              {...form.register(field.name)}
            />
            {isVoiceMode && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 p-1 h-8 w-8 text-gray-400 hover:text-gov-blue"
                onClick={onVoiceInput}
              >
                <Mic size={16} />
              </Button>
            )}
          </div>
        );

      case 'select':
        if (field.name === 'state') {
          return (
            <div className="relative">
              <Select onValueChange={(value) => form.setValue(field.name, value)}>
                <SelectTrigger className="pr-10">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isVoiceMode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-2 p-1 h-8 w-8 text-gray-400 hover:text-gov-blue"
                  onClick={onVoiceInput}
                >
                  <Mic size={16} />
                </Button>
              )}
            </div>
          );
        }
        break;

      case 'number':
        return (
          <div className="relative">
            {field.name === 'annualIncome' && (
              <div className="absolute left-3 top-3 text-gray-500">₹</div>
            )}
            <Input
              type="number"
              placeholder={placeholder}
              className={`${field.name === 'annualIncome' ? 'pl-8 pr-10' : 'pr-10'}`}
              {...form.register(field.name)}
            />
            {isVoiceMode && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 p-1 h-8 w-8 text-gray-400 hover:text-gov-blue"
                onClick={onVoiceInput}
              >
                <Mic size={16} />
              </Button>
            )}
          </div>
        );

      default:
        return (
          <div className="relative">
            <Input
              type={field.type}
              placeholder={placeholder}
              className="pr-10"
              maxLength={field.name === 'pincode' ? 6 : undefined}
              {...form.register(field.name)}
            />
            {isVoiceMode && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 p-1 h-8 w-8 text-gray-400 hover:text-gov-blue"
                onClick={onVoiceInput}
              >
                <Mic size={16} />
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="relative">
          <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
            {label} {field.required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            {renderField()}
          </FormControl>
          {isListening && (
            <div className="mt-2 text-sm text-gov-blue flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-gov-blue rounded-full animate-pulse"></div>
                <div className="w-1 h-4 bg-gov-blue rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-4 bg-gov-blue rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span>
                {language === 'english' ? `Listening for ${label.toLowerCase()}...` : `${label} के लिए सुन रहा है...`}
              </span>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
