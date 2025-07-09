import { useState, useCallback, useEffect } from 'react';

export function useTextToSpeech(language: 'english' | 'hindi') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language and voice
      const lang = language === 'english' ? 'en-IN' : 'hi-IN';
      utterance.lang = lang;
      
      // Try to find a voice that matches the language
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language === 'english' ? 'en' : 'hi')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesis.speak(utterance);
    });
  }, [language, voices]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: 'speechSynthesis' in window
  };
}
