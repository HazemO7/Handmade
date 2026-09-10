import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiRotateCcw,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiExternalLink,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { chatApi } from '../../services/api';

const QUICK_PROMPTS = [
  { text: '👜 أحدث الشنط والأسعار', query: 'ما هي أحدث الشنط والأسعار المتوفرة؟' },
  { text: '✨ عايزة أطلب تفصيل خاص', query: 'عايزة أطلب تصميم وتفصيل شنطة خاصة' },
  { text: '🚚 مدة وتكلفة الشحن', query: 'ما هي مدة وتكلفة الشحن والتوصيل لمحافظتي؟' },
  { text: '💎 خامات الخرز والعناية به', query: 'ما هي خامات الخرز وكيف أعتني بالشنطة؟' },
];

const INITIAL_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  content: 'أهلاً بكِ في **«حَبّة | HABA»** 🤍\nيسعدني جداً مساعدتكِ في اختيار قطعتكِ المصنوعة خرزة بخرزة، أو الإجابة عن الأسعار، الخامات، ومواعيد الشحن والتوصيل. كيف أساعدكِ اليوم؟',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const STORAGE_KEY = 'haba_chat_session_v2';

const ChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from sessionStorage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [INITIAL_MESSAGE];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Hide chat completely in admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Save to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Unable to persist chat history:', e);
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Lock background body scroll on mobile when chat is open
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (isAdminRoute) {
    return null;
  }

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Filter clean history for context
      const historyContext = messages
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await chatApi.sendMessage({
        message: query,
        history: historyContext,
      });

      const replyData = res?.data || res;

      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyData?.reply || 'شكراً لتواصلكِ مع حَبّة! يسعدنا دائماً خدمتكِ.',
        suggestedProducts: replyData?.suggestedProducts || [],
        isCustomOrder: Boolean(replyData?.isCustomOrder),
        whatsappUrl: replyData?.whatsappUrl || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: 'عذراً، حدث خطأ بسيط في الاتصال. يمكنكِ دائماً التواصل معنا مباشرة عبر واتساب وسنرد عليكِ فوراً! 💖',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem(STORAGE_KEY);
    toast.success('تم بدء محادثة جديدة ✨', {
      icon: '🔄',
      style: {
        borderRadius: '12px',
        background: '#542A3A',
        color: '#F7F1E8',
        fontSize: '13px',
      },
    });
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // Helper to render bold text and line breaks smoothly
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-inherit">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* ── Soft Dimmed Backdrop Overlay (tap outside to close) ── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9990] transition-opacity duration-300 animate-fadeIn cursor-pointer"
          title="اضغطي هنا للإغلاق والرجوع للمتجر"
          aria-label="إغلاق المحادثة والرجوع للمتجر"
        />
      )}

      {/* ── Mobile Top Quick Dismiss Pill (above sheet) ── */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="sm:hidden fixed top-3 left-1/2 -translate-x-1/2 z-[9996] flex items-center gap-1.5 bg-[#542A3A] text-[#F7F1E8] px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xl border border-[#C5A56A]/60 active:scale-95 transition-all cursor-pointer"
          aria-label="إغلاق المحادثة والرجوع للمتجر"
        >
          <span>إغلاق المحادثة والرجوع للمتجر</span>
          <FiX className="w-4 h-4 text-[#C5A56A]" />
        </button>
      )}

      {/* ── Chat Window (Ultra Responsive for Mobile & Desktop) ── */}
      {isOpen && (
        <div
          className="fixed z-[9995] flex flex-col bg-[#F7F1E8] shadow-2xl overflow-hidden transition-all duration-300 font-body
            inset-x-2.5 bottom-2.5 top-12 rounded-3xl border border-[#E8C7B8]
            sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:h-[630px] sm:max-h-[85vh] sm:rounded-3xl animate-fadeIn"
          style={{ direction: 'rtl' }}
        >
          {/* ── Header ── */}
          <div
            className="px-3.5 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between text-white flex-shrink-0 shadow-md relative z-10"
            style={{
              background: 'linear-gradient(135deg, #542A3A 0%, #3e1b29 100%)',
              borderBottom: '1px solid rgba(197, 165, 106, 0.35)',
            }}
          >
            {/* Brand identity */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative flex-shrink-0">
                <img
                  src="/logo-mark.png"
                  alt="HABA"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#C5A56A] bg-[#F7F1E8] p-0.5 shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/favicon-32x32.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-[#542A3A] rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-[#F7F1E8] leading-tight">
                    مساعد حَبّة الذكي
                  </h3>
                  <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#C5A56A]/25 text-[#E8C7B8] font-body tracking-wider border border-[#C5A56A]/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-[#E8C7B8]/90 flex items-center gap-1 mt-0.5 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  متصل الآن · الرد فوري
                </p>
              </div>
            </div>

            {/* Header Actions: New Chat + PROMINENT CLOSE (X) BUTTON ON ALL DEVICES */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1 text-xs bg-white/15 hover:bg-white/25 active:scale-95 text-[#F7F1E8] px-2.5 sm:px-3 py-1.5 rounded-full border border-white/20 transition-all font-body shadow-xs"
                title="بدء محادثة جديدة"
              >
                <FiRotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs font-medium">محادثة جديدة</span>
              </button>

              {/* CLEAR (X) CLOSE BUTTON — Always visible & easy to tap */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#F7F1E8] hover:text-white bg-white/20 hover:bg-white/30 active:scale-90 rounded-full transition-all border border-white/30 shadow-xs cursor-pointer"
                title="إغلاق الدردشة والرجوع للمتجر"
                aria-label="إغلاق الدردشة"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── Messages Body ── */}
          <div
            className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 sm:space-y-4 text-sm bg-gradient-to-b from-[#F7F1E8] via-[#F4ECE3] to-[#efe3d5] overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Quick action chips bar */}
            <div className="space-y-1.5 pb-1">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[11.5px] text-warm-600 font-medium">
                  استفسارات سريعة بضغطة واحدة:
                </span>
                {messages.length > 2 && (
                  <button
                    onClick={handleNewChat}
                    className="text-[11px] text-[#542A3A] hover:underline font-semibold flex items-center gap-1"
                  >
                    <FiRotateCcw className="w-3 h-3" />
                    <span>محادثة جديدة</span>
                  </button>
                )}
              </div>
              {/* Sleek horizontal swipeable chips on mobile, flex-wrap on desktop */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5 sm:flex-wrap flex-nowrap">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.query)}
                    disabled={isLoading}
                    className="shrink-0 sm:shrink text-xs bg-white/95 hover:bg-[#542A3A] hover:text-white text-[#542A3A] px-3.5 py-1.5 rounded-full border border-[#E8C7B8] shadow-xs hover:shadow-sm transition-all duration-200 text-right font-body active:scale-95 disabled:opacity-50 whitespace-nowrap"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[85%] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 leading-relaxed text-right transition-all shadow-xs ${
                      isUser
                        ? 'bg-[#542A3A] text-[#F7F1E8] rounded-br-xs shadow-md'
                        : 'bg-white text-[#292525] border border-[#E8C7B8] rounded-bl-xs'
                    }`}
                  >
                    <div className="text-[13.5px] sm:text-[14px] whitespace-pre-wrap font-body leading-relaxed">
                      {renderFormattedText(msg.content)}
                    </div>

                    {/* WhatsApp Action Button if custom order is discussed */}
                    {msg.whatsappUrl && (msg.isCustomOrder || msg.content.includes('واتساب')) && (
                      <div className="mt-3 pt-3 border-t border-warm-100">
                        <a
                          href={msg.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full text-xs sm:text-sm font-semibold py-2.5 px-3.5 rounded-xl text-white shadow-md hover:brightness-105 active:scale-98 transition-all"
                          style={{
                            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                          }}
                        >
                          <span className="text-base">💬</span>
                          <span>محادثة واتساب للطلب الخاص المباشر</span>
                        </a>
                      </div>
                    )}

                    {/* Suggested Products Mini Cards */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-warm-100 space-y-2">
                        <p className="text-[11.5px] font-semibold text-[#542A3A] flex items-center gap-1.5">
                          <FiShoppingBag className="w-3.5 h-3.5 text-[#C5A56A]" />
                          <span>القطع المقترحة لكِ من المتجر:</span>
                        </p>
                        <div className="space-y-2">
                          {msg.suggestedProducts.map((p, pIdx) => (
                            <Link
                              key={pIdx}
                              to={`/product/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2.5 sm:gap-3 p-2 bg-[#F7F1E8] hover:bg-[#efe0d2] rounded-xl border border-[#E8C7B8] transition-all duration-200 group shadow-2xs hover:shadow-xs"
                            >
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-[#E8C7B8]"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-warm-200 flex items-center justify-center text-warm-500 flex-shrink-0">
                                  <FiShoppingBag className="w-5 h-5" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-xs sm:text-sm font-semibold text-[#292525] truncate group-hover:text-[#542A3A] transition-colors">
                                  {p.name}
                                </p>
                                <p className="text-[12px] font-bold text-[#C5A56A] mt-0.5">
                                  {p.price}
                                </p>
                              </div>
                              <span className="text-[11px] text-[#542A3A] font-semibold flex items-center gap-1 flex-shrink-0 bg-white/70 px-2 py-1 rounded-md border border-[#E8C7B8]">
                                <span>عرض</span>
                                <FiArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <span
                      className={`block text-[10px] mt-1.5 text-left ${
                        isUser ? 'text-[#E8C7B8]/75' : 'text-warm-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-right">
                <div className="bg-white border border-[#E8C7B8] px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-2">
                  <span className="text-xs text-warm-600 font-body">حَبّة تفكر الآن</span>
                  <div className="flex gap-1 items-center px-1">
                    <span
                      className="w-1.5 h-1.5 bg-[#542A3A] rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-[#542A3A] rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-[#542A3A] rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Cockpit ── */}
          <div
            className="p-3 sm:p-3.5 bg-white/95 backdrop-blur-md border-t border-[#E8C7B8] flex flex-col gap-1.5 flex-shrink-0 shadow-lg"
            style={{
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتبي سؤالكِ هنا (مثال: أحدث الشنط، التوصيل)..."
                disabled={isLoading}
                maxLength={400}
                className="flex-1 bg-[#F7F1E8] text-[#292525] text-base sm:text-sm px-4 py-2.5 sm:py-3 rounded-2xl border border-[#E8C7B8] focus:outline-hidden focus:border-[#542A3A] transition-all disabled:opacity-50 placeholder:text-warm-400 font-body text-right"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-md active:scale-95 hover:brightness-110"
                style={{ backgroundColor: '#542A3A', border: '1px solid #C5A56A' }}
                aria-label="إرسال"
              >
                <FiSend className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-warm-500 px-1 font-light">
              <span>«حَبّة ورا حَبّة، حكاية بتتعمل» 🤍</span>
              <button
                onClick={handleNewChat}
                className="text-[#542A3A] hover:underline flex items-center gap-1 font-medium"
              >
                <FiRotateCcw className="w-2.5 h-2.5" />
                <span>إعادة ضبط المحادثة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Floating Action Button (FAB) ── */}
      <aside
        aria-label="زر المساعد الذكي"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9980] font-body"
        style={{ direction: 'rtl' }}
      >
        {/* Teaser Floating Tooltip */}
        {showTeaser && !isOpen && (
          <div
            role="status"
            aria-live="polite"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer absolute bottom-16 right-0 mb-2 w-[calc(100vw-2.5rem)] max-w-xs sm:w-72 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-[#E8C7B8] text-right text-xs transition-all duration-300 hover:scale-[1.02] active:scale-95 animate-bounce-subtle"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="absolute top-2 left-2 text-warm-400 hover:text-warm-700 p-1 rounded-full hover:bg-warm-100 transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#542A3A] text-white flex items-center justify-center flex-shrink-0 shadow-sm border border-[#C5A56A]/50">
                <span className="text-base">✨</span>
              </div>
              <div className="flex-1 min-w-0 pr-0.5">
                <p className="font-heading font-semibold text-sm text-[#542A3A] mb-0.5">
                  مساعد حَبّة الذكي
                </p>
                <p className="text-warm-600 leading-relaxed text-[12px]">
                  محتاجة تسألي عن أسعار الشنط أو طلب تفصيل خاص؟ أنا هنا لمساعدتكِ!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* The Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 active:scale-90 ${
            isOpen ? 'hidden sm:flex' : 'flex'
          }`}
          style={{
            background: 'linear-gradient(135deg, #542A3A 0%, #3e1b29 100%)',
            border: '2px solid #C5A56A',
          }}
          aria-label={isOpen ? 'إغلاق المساعد' : 'فتح المساعد الذكي'}
        >
          {isOpen ? (
            <FiX className="h-6 w-6 sm:h-7 sm:w-7 transition-transform group-hover:rotate-90" />
          ) : (
            <>
              <FiMessageCircle className="h-7 w-7 sm:h-8 sm:w-8 transition-transform group-hover:scale-110" />
              {hasUnread && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-[#542A3A] rounded-full animate-ping"></span>
              )}
              <span className="absolute top-1 right-1 w-3 h-3 bg-amber-400 border-2 border-[#542A3A] rounded-full shadow-sm"></span>
            </>
          )}
        </button>
      </aside>
    </>
  );
};

export default ChatWidget;
