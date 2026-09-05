import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import {
  Sparkles,
  Mic,
  Square,
  Send,
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  ExternalLink,
  Bot,
  MessageSquareText,
  ChevronDown,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedData?: any[];
  source?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
];

const QUICK_PROMPTS = [
  {
    label: 'नागौर मंडी में मूंग का भाव',
    query: 'आज नागौर मंडी में मूंग का भाव क्या है?',
    icon: '🌾',
  },
  {
    label: 'सरसों व गेहूं का MSP भाव',
    query: 'गेहूं और सरसों का सरकारी MSP भाव क्या है?',
    icon: '🌱',
  },
  {
    label: 'मंडी में स्लॉट कैसे बुक करें?',
    query: 'किसानसेतु पर मंडी का स्लॉट कैसे बुक करें?',
    icon: '📅',
  },
  {
    label: 'बारिश व मौसम यार्ड अलर्ट',
    query: 'आज मंडी में बारिश का अलर्ट है क्या?',
    icon: '🌧️',
  },
  {
    label: 'सीकर में बाजरा भाव',
    query: 'सीकर मंडी में आज बाजरा का क्या भाव है?',
    icon: '🌾',
  },
  {
    label: 'सोनीपत में गेहूं भाव',
    query: 'सोनीपत अनाज मंडी में गेहूं का भाव क्या चल रहा है?',
    icon: '🌾',
  },
];

export const SahayakAssistantWidget: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? '🌾 **नमस्ते! मैं आपका किसान सहायक AI हूँ।**\n\nआप मुझसे देश की किसी भी मंडी में **आज के ताज़ा भाव, सरकारी MSP, मौसम अलर्ट या स्लॉट बुकिंग** के बारे में बोलकर या लिखकर पूछ सकते हैं।'
          : '🌾 **Hello! I am your Kisan Sahayak AI.**\n\nAsk me about **today live mandi rates, official Central MSP, weather alerts, or slot booking** by speaking or typing!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Central e-NAM / Agmarknet Gateway',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Sync language with global context
  useEffect(() => {
    if (language === 'hi') {
      setSelectedLang(SUPPORTED_LANGUAGES[0]);
    } else {
      setSelectedLang(SUPPORTED_LANGUAGES[1]);
    }
  }, [language]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang.code;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          handleSendQuery(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLang]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = selectedLang.code;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Failed to start recognition:', err);
      }
    } else {
      alert(
        language === 'hi'
          ? 'आपके ब्राउज़र में वॉइस स्पीच रिकग्निशन समर्थित नहीं है। कृपया लिखकर प्रश्न पूछें।'
          : 'Voice speech recognition is not supported in this browser. Please type your query.'
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text to Speech Read-Aloud
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanContent = text.replace(/[*#•_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanContent);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : query).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await api.askSahayakAi(q, selectedLang.code.startsWith('hi') ? 'hi' : 'en');
      if (res && res.success && res.answer) {
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: res.answer,
          timestamp: res.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relatedData: res.relatedData,
          source: res.source,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'hi'
            ? 'क्षमा करें, सर्वर से संपर्क करने में समस्या हुई। कृपया पुनः प्रयास करें।'
            : 'Sorry, could not connect to server. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group">
          {hasNewBadge && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold border border-emerald-500/40 shadow-xl backdrop-blur-md animate-bounce">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'hi' ? 'आज का मंडी भाव पूछें' : 'Ask Today Mandi Prices'}</span>
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasNewBadge(false);
            }}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-emerald-300/40"
            aria-label="Open Sahayak AI Assistant"
          >
            <div className="absolute inset-0 rounded-3xl bg-emerald-400 opacity-20 animate-ping pointer-events-none" />
            <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-slate-950 items-center justify-center">
                AI
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950/80 border-b border-slate-800 flex items-center justify-between gap-3 text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">
                    {language === 'hi' ? 'किसान सहायक AI' : 'Kisan Sahayak AI'}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live e-NAM
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'hi' ? 'सरकारी MSP व मंडी भाव सलाहकार' : 'Govt MSP & Market Advisor'}</span>
                </span>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1"
                >
                  <span>{selectedLang.native}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-32 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden z-20 py-1 text-xs">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 ${
                          selectedLang.code === lang.code
                            ? 'text-emerald-400 font-bold bg-slate-800/50'
                            : 'text-slate-300'
                        }`}
                      >
                        <span>{lang.native}</span>
                        {selectedLang.code === lang.code && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (speakingMessageId) window.speechSynthesis.cancel();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
                {messages.map((msg) => {
                  const isAssistant = msg.sender === 'assistant';
                  const isSpeaking = speakingMessageId === msg.id;
                  const isCopied = copiedMessageId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col space-y-1.5 ${
                        isAssistant ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-md ${
                          isAssistant
                            ? 'bg-slate-900 border border-slate-800 text-slate-200'
                            : 'bg-emerald-600 text-white font-medium ml-auto'
                        }`}
                      >
                        <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                        {/* If assistant attached related mandi rates */}
                        {msg.relatedData && Array.isArray(msg.relatedData) && msg.relatedData.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                              Live Rates Available:
                            </span>
                            <div className="grid grid-cols-1 gap-1.5">
                              {msg.relatedData.slice(0, 3).map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-[11px]"
                                >
                                  <div>
                                    <span className="font-bold text-white">
                                      {item.hindiName || item.crop}
                                    </span>
                                    <span className="text-slate-400 block text-[10px]">
                                      ₹{item.modalPrice || item.modal} / Qtl
                                    </span>
                                  </div>
                                  <Link
                                    to={`/farmer/book-slot?crop=${encodeURIComponent(item.commodity || item.crop)}`}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                                  >
                                    Book Slot
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Meta & Action bar */}
                      <div className="flex items-center gap-2 px-1 text-[10px] text-slate-500">
                        <span>{msg.timestamp}</span>
                        {isAssistant && msg.source && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-500 font-medium">{msg.source}</span>
                          </>
                        )}
                        {isAssistant && (
                          <div className="flex items-center gap-1.5 ml-1">
                            <button
                              onClick={() => copyToClipboard(msg.text, msg.id)}
                              className="hover:text-slate-300 p-0.5"
                              title="Copy Answer"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => speakText(msg.text, msg.id)}
                              className={`p-0.5 hover:text-white ${isSpeaking ? 'text-amber-400 animate-pulse' : ''}`}
                              title={isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
                            >
                              {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 max-w-[80%] text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>{language === 'hi' ? 'मंडी डेटा विश्लेषित किया जा रहा है...' : 'Analyzing live mandi feed...'}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="p-2 border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar flex items-center gap-1.5 flex-shrink-0 text-xs">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(prompt.query)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap text-[11px] font-medium flex items-center gap-1 transition-all shadow-xs"
                  >
                    <span>{prompt.icon}</span>
                    <span>{prompt.label}</span>
                  </button>
                ))}
              </div>

              {/* Voice Interaction & Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2 flex-shrink-0">
                {isListening && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 animate-pulse">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>{selectedLang.native} में सुन रहे हैं... कृपया बोलें</span>
                    </span>
                    <button
                      onClick={stopListening}
                      className="px-2 py-0.5 bg-red-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      रोकें (Stop)
                    </button>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuery();
                  }}
                  className="relative flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`p-2.5 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white'
                    }`}
                    title={isListening ? 'Stop Mic' : 'Speak in ' + selectedLang.native}
                  >
                    {isListening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      isListening
                        ? `${selectedLang.native} में सुन रहे हैं...`
                        : language === 'hi'
                        ? 'मंडी भाव या प्रश्न पूछें...'
                        : 'Ask mandi price or question...'
                    }
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
                  />

                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading}
                    className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>e-NAM व Agmarknet प्रमाणित</span>
                  </span>
                  <a
                    href="https://agmarknet.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-emerald-400 underline inline-flex items-center gap-0.5"
                  >
                    <span>agmarknet.gov.in</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
