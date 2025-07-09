import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  language: 'english' | 'hindi';
  onLanguageChange: (language: 'english' | 'hindi') => void;
}

export default function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Language:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            language === 'english'
              ? 'text-white bg-gov-blue'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onLanguageChange('english')}
        >
          English
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            language === 'hindi'
              ? 'text-white bg-gov-blue'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onLanguageChange('hindi')}
        >
          हिंदी
        </Button>
      </div>
    </div>
  );
}
