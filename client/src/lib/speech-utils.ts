export const processVoiceInput = (transcript: string, fieldType: string, language: 'english' | 'hindi'): string => {
  let processed = transcript.trim();

  // Handle different field types
  switch (fieldType) {
    case 'number':
    case 'tel':
      // Extract numbers from text
      processed = extractNumbers(processed, language);
      break;
    case 'email':
      // Clean up email format
      processed = processEmail(processed);
      break;
    case 'date':
      // Process date input
      processed = processDate(processed, language);
      break;
    default:
      // Clean up general text
      processed = cleanText(processed);
  }

  return processed;
};

const extractNumbers = (text: string, language: 'english' | 'hindi'): string => {
  // Convert spoken numbers to digits
  const numberWords = {
    english: {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
      'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
      'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
      'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
      'eighty': '80', 'ninety': '90', 'hundred': '00', 'thousand': '000',
      'lakh': '00000', 'crore': '0000000'
    },
    hindi: {
      'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4',
      'पांच': '5', 'छह': '6', 'सात': '7', 'आठ': '8', 'नौ': '9',
      'दस': '10', 'बीस': '20', 'तीस': '30', 'चालीस': '40', 'पचास': '50',
      'साठ': '60', 'सत्तर': '70', 'अस्सी': '80', 'नब्बे': '90',
      'सौ': '00', 'हजार': '000', 'लाख': '00000', 'करोड़': '0000000'
    }
  };

  let result = text.toLowerCase();
  const words = numberWords[language];

  // Replace number words with digits
  Object.entries(words).forEach(([word, digit]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, digit);
  });

  // Extract only digits
  const digits = result.match(/\d/g);
  return digits ? digits.join('') : text;
};

const processEmail = (text: string): string => {
  // Convert spoken email to proper format
  let email = text.toLowerCase()
    .replace(/\s+at\s+/g, '@')
    .replace(/\s+dot\s+/g, '.')
    .replace(/\s+/g, '');
  
  return email;
};

const processDate = (text: string, language: 'english' | 'hindi'): string => {
  // Convert spoken date to YYYY-MM-DD format
  // This is a simplified version - in production, you'd want more robust date parsing
  const datePattern = /(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})/;
  const match = text.match(datePattern);
  
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return text;
};

const cleanText = (text: string): string => {
  // Basic text cleaning
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
};

export const announceField = (fieldName: string, language: 'english' | 'hindi'): string => {
  const announcements = {
    english: {
      fullName: 'Please say your full name',
      fatherName: 'Please say your father\'s name',
      mobileNumber: 'Please say your mobile number',
      email: 'Please say your email address',
      dob: 'Please say your date of birth',
      annualIncome: 'Please say your annual income in rupees',
      address: 'Please say your complete address',
      state: 'Please say your state name',
      district: 'Please say your district name',
      pincode: 'Please say your PIN code'
    },
    hindi: {
      fullName: 'कृपया अपना पूरा नाम बताएं',
      fatherName: 'कृपया अपने पिता का नाम बताएं',
      mobileNumber: 'कृपया अपना मोबाइल नंबर बताएं',
      email: 'कृपया अपना ईमेल पता बताएं',
      dob: 'कृपया अपनी जन्म तिथि बताएं',
      annualIncome: 'कृपया अपनी वार्षिक आय रुपयों में बताएं',
      address: 'कृपया अपना पूरा पता बताएं',
      state: 'कृपया अपने राज्य का नाम बताएं',
      district: 'कृपया अपने जिले का नाम बताएं',
      pincode: 'कृपया अपना पिन कोड बताएं'
    }
  };

  return announcements[language][fieldName as keyof typeof announcements[typeof language]] || '';
};
