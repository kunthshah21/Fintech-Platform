import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestedQuestions, chatResponses } from '../../data/chatData';
import { useApp } from '../../context/AppContext';
import ChatChart from './ChatChart';

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

const GREETING_MSG = {
  id: 'greeting',
  role: 'bot',
  text: null,
  chart: null,
};

function matchQuestion(input) {
  const lower = input.toLowerCase().trim();
  const keywords = {
    portfolio: ['portfolio', 'performing', 'performance', 'how am i doing', 'my investments doing'],
    allocation: ['allocation', 'asset', 'diversif', 'spread', 'breakdown'],
    repayments: ['repayment', 'upcoming', 'due', 'schedule', 'payout'],
    returns: ['monthly return', 'return trend', 'returns over', 'earning'],
    marketplace: ['marketplace', 'opportunit', 'best deal', 'new deal', 'invest in', 'available'],
    risk: ['risk', 'exposure', 'safe', 'danger'],
    compare: ['compare', 'fd', 'fixed deposit', 'benchmark', 'vs'],
    transactions: ['transaction', 'summary', 'spent', 'inflow', 'outflow', 'money move'],
    'product-returns': ['best return', 'which invest', 'top perform', 'product return'],
    overview: ['overview', 'snapshot', 'quick look', 'summary of everything', 'financial overview'],
  };

  for (const [key, terms] of Object.entries(keywords)) {
    if (terms.some((t) => lower.includes(t))) return key;
  }
  return null;
}

export default function RoboChat() {
  const { user } = useApp();
  const [messages, setMessages] = useState([GREETING_MSG]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addBotResponse = useCallback((questionId) => {
    setIsTyping(true);
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      const response = chatResponses[questionId] || chatResponses.fallback;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'bot', text: response.text, chart: response.chart },
      ]);
      setIsTyping(false);
    }, delay);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }]);
    setInput('');

    const matched = matchQuestion(trimmed);
    addBotResponse(matched || 'fallback');
  }, [input, addBotResponse]);

  const handleSuggestion = useCallback((q) => {
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: q.label }]);
    addBotResponse(q.id);
  }, [addBotResponse]);

  const handleReset = useCallback(() => {
    setMessages([GREETING_MSG]);
    setInput('');
    setIsTyping(false);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.length <= 1 || messages[messages.length - 1]?.role === 'bot';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto px-1 pb-4 space-y-4 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {msg.id === 'greeting' ? (
                <GreetingMessage name={user.name} />
              ) : msg.role === 'user' ? (
                <UserBubble text={msg.text} />
              ) : (
                <BotBubble text={msg.text} chart={msg.chart} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-bg-alt border border-border px-4 py-3">
              <div className="flex gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {showSuggestions && !isTyping && (
        <div className="pb-3 pt-1">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions
              .filter((q) => !messages.some((m) => m.role === 'user' && m.text === q.label))
              .slice(0, 5)
              .map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSuggestion(q)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-text-secondary
                    hover:bg-accent hover:text-white hover:border-accent transition-all duration-150"
                >
                  {q.label}
                </button>
              ))}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20 transition-all">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your portfolio, returns, opportunities..."
              className="flex-1 text-sm text-text-primary placeholder:text-text-muted outline-none bg-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-white disabled:opacity-30 hover:bg-accent/90 transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleReset}
            title="Reset conversation"
            className="flex items-center justify-center h-10 w-10 rounded-xl border border-border text-text-muted hover:bg-bg-alt hover:text-text-secondary transition-colors shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function GreetingMessage({ name }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-bg-alt border border-border px-5 py-4 max-w-[85%]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-green" />
          <span className="text-sm font-semibold text-text-primary">YieldVest AI</span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Hi {name}! I'm your AI investment assistant. I can help you understand your portfolio,
          track returns, explore opportunities, and visualise your data with charts. What would you like to know?
        </p>
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="rounded-2xl rounded-tr-sm bg-accent text-white px-5 py-3 max-w-[80%]">
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft">
        <User className="h-4 w-4 text-accent" />
      </div>
    </div>
  );
}

function BotBubble({ text, chart }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-bg-alt border border-border px-5 py-4 max-w-[85%] min-w-[260px]">
        <p
          className="text-sm text-text-secondary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(text) }}
        />
        {chart && <ChatChart config={chart} />}
      </div>
    </div>
  );
}
