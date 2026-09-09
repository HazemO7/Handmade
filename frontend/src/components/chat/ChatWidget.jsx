import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMessageCircle, FiX, FiSend, FiTrash2, FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import { chatApi } from '../../services/api';

const QUICK_PROMPTS = [
  '👜 ما هي أحدث الشنط والأسعار؟',
  '✨ عايزة أطلب تصميم خاص',
  '🚚 ما هي مدة وتكلفة الشحن؟',
  '💎 خامات الخرز وطريقة العناية',
];

const INITIAL_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  content: 'أهلاً بكِ في **«حَبّة | HABA»** 🤍\nيسعدني جداً مساعدتكِ في اختيار قطعتكِ المصنوعة خرزة بخرزة، أو الإجابة عن الأسعار، الخامات، ومواعيد الشحن والتوصيل. كيف أساعدكِ اليوم؟',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const STORAGE_KEY = 'haba_chat_session_v1';

const ChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from sessionStorage if available
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback to initial
    }
    return [INITIAL_MESSAGE];
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Hide chat widget completely on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Save messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Unable to persist chat history:', e);
    }
  }, [messages]);

  // Scroll to bottom whenever messages change or loading state changes
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
      setTimeout(() => inputRef.current?.focus(), 200);
    }
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
      // Extract clean history for API context (last 6 exchanges)
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
        content: 'عذراً، حدث خطأ بسيط في الاتصال. يمكنكِ دائماً التواصل معنا مباشرة عبر واتساب وسنرد عليكِ فوراً!',
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

  const handleClearChat = () => {
    if (window.confirm('هل تودين بدء محادثة جديدة؟')) {
      setMessages([INITIAL_MESSAGE]);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  // Helper to render bold text and line breaks without external markdown libs
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Process **bold** text
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lineIdx}>
          {parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={partIdx} className="font-semibold text-[#292525]">
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
    <aside aria-label="مساعد حَبّة الذكي" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-body">
      {/* ── Teaser Floating Tooltip on First Load ── */}
      {showTeaser && !isOpen && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-16 right-0 mb-2 w-64 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E8C7B8] text-right text-xs transition-all duration-300 animate-bounce-subtle"
          style={{ direction: 'rtl' }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            className="absolute top-2 left-2 text-warm-400 hover:text-warm-700 p-0.5"
            aria-label="إغلاق التنبيه"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-start gap-2.5">
            <span className="text-lg flex-shrink-0">✨</span>
            <div>
              <p className="font-semibold text-[#542A3A] mb-0.5">مساعد حَبّة للتسوق</p>
              <p className="text-warm-600 leading-relaxed">
                محتاجة تسألي عن أسعار الشنط أو طلب تفصيل خاص؟ أنا هنا لمساعدتكِ!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="fixed inset-x-3 bottom-20 sm:inset-auto sm:absolute sm:bottom-16 sm:right-0 w-auto sm:w-[390px] h-[550px] max-h-[calc(100vh-100px)] flex flex-col bg-[#F7F1E8] rounded-2xl shadow-2xl border border-[#E8C7B8] overflow-hidden transition-all duration-300 animate-fadeIn"
          style={{ direction: 'rtl' }}
        >
          {/* Header */}
          <div
            className="px-4 py-3.5 flex items-center justify-between text-white flex-shrink-0 shadow-sm"
            style={{ backgroundColor: '#542A3A' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/favicon-32x32.png"
                  alt="HABA Logo"
                  className="w-9 h-9 rounded-full object-cover border border-[#C5A56A]/60 bg-[#F7F1E8] p-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#542A3A] rounded-full"></span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-semibold text-base text-[#F7F1E8] leading-tight">
                    مساعد حَبّة الذكي
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C5A56A]/25 text-[#E8C7B8] font-body tracking-wider">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-[#E8C7B8] flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  متصل الآن · الرد فوري
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-[#E8C7B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="بدء محادثة جديدة"
                aria-label="مسح المحادثة"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#E8C7B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="إغلاق الدردشة"
                aria-label="إغلاق"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-gradient-to-b from-[#F7F1E8] to-[#f4ebe0]">
            {/* Quick action chips (always accessible) */}
            <div className="space-y-1.5 pb-2">
              <p className="text-[11px] text-warm-500 font-medium">أسئلة شائعة يمكنكِ الضغط عليها:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="text-xs bg-white/90 hover:bg-[#542A3A] hover:text-white text-[#542A3A] px-2.5 py-1.5 rounded-full border border-[#E8C7B8] shadow-xs transition-all text-right font-body disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-right transition-all shadow-xs ${
                      isUser
                        ? 'bg-[#542A3A] text-[#F7F1E8] rounded-br-xs'
                        : 'bg-white text-[#292525] border border-[#E8C7B8] rounded-bl-xs'
                    }`}
                  >
                    <div className="text-[13.5px] whitespace-pre-wrap font-body">
                      {renderFormattedText(msg.content)}
                    </div>

                    {/* WhatsApp Action Button if custom order is discussed */}
                    {msg.whatsappUrl && (msg.isCustomOrder || msg.content.includes('واتساب')) && (
                      <div className="mt-3 pt-2.5 border-t border-warm-100">
                        <a
                          href={msg.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-2 px-3 rounded-lg text-white shadow-xs transition-colors"
                          style={{ backgroundColor: '#25D366' }}
                        >
                          <span>💬</span>
                          <span>محادثة واتساب للطلب الخاص</span>
                        </a>
                      </div>
                    )}

                    {/* Suggested Products Mini Cards */}
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-warm-100 space-y-2">
                        <p className="text-[11px] font-semibold text-[#542A3A]">القطع المقترحة لكِ:</p>
                        <div className="space-y-1.5">
                          {msg.suggestedProducts.map((p, pIdx) => (
                            <Link
                              key={pIdx}
                              to={`/product/${p.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2.5 p-2 bg-[#F7F1E8] hover:bg-[#ebdccf] rounded-xl border border-[#E8C7B8] transition-colors group"
                            >
                              {p.image ? (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-[#E8C7B8]"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-warm-200 flex items-center justify-center text-warm-500 flex-shrink-0">
                                  <FiShoppingBag className="w-5 h-5" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 text-right">
                                <p className="text-xs font-semibold text-[#292525] truncate group-hover:text-[#542A3A]">
                                  {p.name}
                                </p>
                                <p className="text-[11px] font-semibold text-[#C5A56A] mt-0.5">
                                  {p.price}
                                </p>
                              </div>
                              <span className="text-[10px] text-[#542A3A] font-medium underline flex-shrink-0">
                                عرض القطعة
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <span
                      className={`block text-[10px] mt-1.5 text-left ${
                        isUser ? 'text-[#E8C7B8]/70' : 'text-warm-400'
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
                <div className="bg-white border border-[#E8C7B8] px-3.5 py-2.5 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                  <span className="text-xs text-warm-500 font-body">حَبّة تكتب الآن</span>
                  <div className="flex gap-1 items-center px-1">
                    <span className="w-1.5 h-1.5 bg-[#542A3A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#542A3A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#542A3A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#E8C7B8] flex items-center gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتبي سؤالكِ هنا..."
              disabled={isLoading}
              maxLength={400}
              className="flex-1 bg-[#F7F1E8] text-[#292525] text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#E8C7B8] focus:outline-hidden focus:border-[#542A3A] transition-colors disabled:opacity-50 placeholder:text-warm-400 font-body text-right"
              style={{ fontSize: '14px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-xs active:scale-95"
              style={{ backgroundColor: '#542A3A' }}
              aria-label="إرسال"
            >
              <FiSend className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Floating Action Button (FAB) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-90"
        style={{ backgroundColor: '#542A3A', border: '2px solid #C5A56A' }}
        aria-label={isOpen ? 'إغلاق المساعد' : 'فتح المساعد الذكي'}
      >
        {isOpen ? (
          <FiX className="h-6 w-6 transition-transform group-hover:rotate-90" />
        ) : (
          <>
            <FiMessageCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
            {/* Unread indicator dot */}
            {hasUnread && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-[#542A3A] rounded-full animate-ping"></span>
            )}
            <span className="absolute top-1 right-1 w-3 h-3 bg-amber-400 border-2 border-[#542A3A] rounded-full"></span>
          </>
        )}
      </button>
    </aside>
  );
};

export default ChatWidget;
