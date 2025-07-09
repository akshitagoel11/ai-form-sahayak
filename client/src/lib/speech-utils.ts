export const processVoiceInput = (transcript: string, fieldType: string, language: 'english' | 'hindi', fieldName?: string): string => {
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
      // Special handling for state field
      if (fieldName === 'state') {
        processed = processState(processed, language);
      } else {
        // Clean up general text
        processed = cleanText(processed);
      }
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
    .replace(/\s+/g, '')
    .replace(/[@]/g, '@')
    .replace(/[.]/g, '.');
  
  return email;
};

const processDate = (text: string, language: 'english' | 'hindi'): string => {
  // Convert spoken date to YYYY-MM-DD format
  let processedText = text.toLowerCase().trim();
  
  // Handle month names
  const monthNames = {
    english: {
      'january': '01', 'february': '02', 'march': '03', 'april': '04',
      'may': '05', 'june': '06', 'july': '07', 'august': '08',
      'september': '09', 'october': '10', 'november': '11', 'december': '12',
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
      'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09',
      'oct': '10', 'nov': '11', 'dec': '12'
    },
    hindi: {
      'जनवरी': '01', 'फरवरी': '02', 'मार्च': '03', 'अप्रैल': '04',
      'मई': '05', 'जून': '06', 'जुलाई': '07', 'अगस्त': '08',
      'सितंबर': '09', 'अक्टूबर': '10', 'नवंबर': '11', 'दिसंबर': '12'
    }
  };
  
  // Replace month names with numbers
  const months = monthNames[language];
  Object.entries(months).forEach(([month, number]) => {
    const regex = new RegExp(`\\b${month}\\b`, 'gi');
    processedText = processedText.replace(regex, number);
  });
  
  // Extract numbers from the processed text
  const numbers = processedText.match(/\d+/g);
  
  if (numbers && numbers.length >= 3) {
    // Assume format: day month year
    const [day, month, year] = numbers;
    if (year.length === 4) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  // Try standard date pattern
  const datePattern = /(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})/;
  const match = processedText.match(datePattern);
  
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return text;
};

const processState = (text: string, language: 'english' | 'hindi'): string => {
  // Common state mappings
  const stateMap = {
    english: {
      'up': 'Uttar Pradesh',
      'uttarpradesh': 'Uttar Pradesh',
      'uttar pradesh': 'Uttar Pradesh',
      'mp': 'Madhya Pradesh',
      'madhyapradesh': 'Madhya Pradesh',
      'madhya pradesh': 'Madhya Pradesh',
      'rajasthan': 'Rajasthan',
      'maharashtra': 'Maharashtra',
      'gujarat': 'Gujarat',
      'punjab': 'Punjab',
      'haryana': 'Haryana',
      'bihar': 'Bihar',
      'westbengal': 'West Bengal',
      'west bengal': 'West Bengal',
      'karnataka': 'Karnataka',
      'tamilnadu': 'Tamil Nadu',
      'tamil nadu': 'Tamil Nadu',
      'kerala': 'Kerala',
      'andhra pradesh': 'Andhra Pradesh',
      'telangana': 'Telangana',
      'odisha': 'Odisha',
      'jharkhand': 'Jharkhand',
      'chhattisgarh': 'Chhattisgarh',
      'assam': 'Assam',
      'himachal pradesh': 'Himachal Pradesh',
      'uttarakhand': 'Uttarakhand',
      'goa': 'Goa',
      'delhi': 'Delhi'
    },
    hindi: {
      'उत्तर प्रदेश': 'Uttar Pradesh',
      'मध्य प्रदेश': 'Madhya Pradesh',
      'राजस्थान': 'Rajasthan',
      'महाराष्ट्र': 'Maharashtra',
      'गुजरात': 'Gujarat',
      'पंजाब': 'Punjab',
      'हरियाणा': 'Haryana',
      'बिहार': 'Bihar',
      'पश्चिम बंगाल': 'West Bengal',
      'कर्नाटक': 'Karnataka',
      'तमिलनाडु': 'Tamil Nadu',
      'केरल': 'Kerala',
      'आंध्र प्रदेश': 'Andhra Pradesh',
      'तेलंगाना': 'Telangana',
      'ओडिशा': 'Odisha',
      'झारखंड': 'Jharkhand',
      'छत्तीसगढ़': 'Chhattisgarh',
      'असम': 'Assam',
      'हिमाचल प्रदेश': 'Himachal Pradesh',
      'उत्तराखंड': 'Uttarakhand',
      'गोवा': 'Goa',
      'दिल्ली': 'Delhi'
    }
  };

  const normalizedInput = text.toLowerCase().trim();
  const states = stateMap[language];
  
  // Check for exact match first
  for (const [key, value] of Object.entries(states)) {
    if (normalizedInput === key.toLowerCase()) {
      return value;
    }
  }
  
  // Check for partial match
  for (const [key, value] of Object.entries(states)) {
    if (normalizedInput.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedInput)) {
      return value;
    }
  }
  
  // Return cleaned text if no state match found
  return cleanText(text);
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
