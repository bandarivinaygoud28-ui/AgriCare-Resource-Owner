import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { LanguageCode } from '../types';

interface VoiceButtonProps {
  onSpeechResult?: (transcript: string) => void;
  textToSpeak?: string;
  language: LanguageCode;
  mode?: 'listen' | 'speak';
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onSpeechResult,
  textToSpeak,
  language,
  mode = 'listen',
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getLangTag = (l: LanguageCode) => {
    switch (l) {
      case 'te': return 'te-IN';
      case 'hi': return 'hi-IN';
      default: return 'en-IN';
    }
  };

  const handleToggleListen = () => {
    // Check Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = getLangTag(language);
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onSpeechResult && transcript) {
          onSpeechResult(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleToggleSpeak = () => {
    if (!window.speechSynthesis || !textToSpeak) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getLangTag(language);
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (mode === 'speak') {
    return (
      <button
        type="button"
        onClick={handleToggleSpeak}
        className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
          isSpeaking
            ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
        } ${className}`}
        title="Listen to speech readout"
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span>{isSpeaking ? 'Stop Voice' : 'Voice Readout'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggleListen}
      className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
        isListening
          ? 'bg-red-500 text-white border-red-600 animate-bounce shadow-lg ring-4 ring-red-100'
          : 'bg-green-700 text-white hover:bg-green-800 border-green-800 shadow-sm'
      } ${className}`}
      title="Tap to speak"
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
    </button>
  );
};
