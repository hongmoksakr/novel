import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, RefreshCw, Compass, Lightbulb, 
  Wand2, ArrowRight, MessageSquareText, FileText 
} from 'lucide-react';
import { NovelSettings, Episode, CommenterPersona, ChatMessage } from '../types';
import { askNovelAssistant } from '../services/geminiService';

interface ChatPanelProps {
  currentStep: number;
  settings: NovelSettings;
  episodes: Episode[];
  personas: CommenterPersona[];
  onApplySettings?: (newSettings: Partial<NovelSettings>) => void;
  onNavigateStep: (step: number) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  currentStep,
  settings,
  episodes,
  personas,
  onNavigateStep,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `안녕하세요 작가님! 당신의 전담 웹소설 디렉터 AI입니다. ✍️
현재 **${currentStep}단계**를 진행 중이시네요.

아이디어가 막히거나, 캐릭터의 매력적인 티키타카 대사, 영웅의 여정 플롯 반전, 분량 확장 기법, 혹은 플랫폼 독자 반응까지 무엇이든 물어보세요!`,
      timestamp: '방금 전'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const reply = await askNovelAssistant(textToSend, {
        currentStep,
        settings,
        episodes,
        personas
      });

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step-specific contextual suggestion prompts
  const getQuickPrompts = () => {
    switch (currentStep) {
      case 1:
        return [
          '남주와 여주의 짜릿한 첫만남 설정 추천해줘',
          '요즘 2030 독자들이 열광하는 사이다 문체 팁은?',
          '반전 매력을 가진 조연 캐릭터 3명만 구상해줘'
        ];
      case 2:
        return [
          '5단계(첫 관문 통과)에서 긴장감을 극대화할 에피소드 아이디어 줘',
          '8단계(절체절명의 시련)에서 독자들 가슴 찢어질 위기 사건은?',
          '영웅의 여정 12단계를 매끄럽게 잇는 떡밥 복선 조언'
        ];
      case 3:
        return [
          '1화 엔딩의 클리프행어(다음화 유도) 연출 피드백 줘',
          '분량을 150%로 늘릴 때 지루하지 않게 심리 묘사 채우는 법',
          '대화의 텐션을 2배로 올려줄 티키타카 대사 수정안'
        ];
      case 4:
        return [
          '선택한 문장을 긴장감 넘치고 호흡이 빠른 문장으로 고쳐줘',
          '로맨스/착각계 텐션을 뿜어내는 문장 윤문 팁',
          '인물의 시각적/공감각적 묘사를 극대화하는 수식어 추천'
        ];
      case 5:
        return [
          '노벨피아 독자들의 전형적인 밈과 열광하는 포인트는?',
          '더쿠/리디북스 유저들이 주인공 관계성에 치이는 주접 댓글 예시',
          '1화부터 5화까지 정주행 독자들의 과몰입 포인트 정리'
        ];
      case 6:
        return [
          '웹소설 뷰어에서 1화 이탈율을 줄이는 초반 3초 법칙은?',
          '작품 소개글(어그로 카피라이팅) 문구 5개 추천해줘'
        ];
      default:
        return ['스토리 반전 아이디어', '인기 웹소설 클리셰 비틀기', '다음 화 소재 추천'];
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border-r border-slate-800 text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm tracking-wide text-white">스토리 디렉터 AI</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                실시간 연동
              </span>
            </div>
            <p className="text-xs text-slate-400">현재 <span className="text-brand-400 font-medium">{currentStep}단계</span> 기획을 실시간 지원 중</p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([
              {
                id: `reset-${Date.now()}`,
                role: 'assistant',
                content: `대화가 새로 정리되었습니다. 현재 **${currentStep}단계**에 맞추어 창작에 필요한 질문을 던져주세요! 💡`,
                timestamp: '방금 전'
              }
            ]);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="대화 내역 초기화"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm ml-4'
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div
                className={`text-[10px] mt-1.5 flex justify-end ${
                  msg.role === 'user' ? 'text-brand-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-brand-700 flex items-center justify-center shrink-0 mt-0.5 text-white">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-brand-400 p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI가 웹소설 기획 및 플롯을 분석하고 있습니다...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>현재 단계 추천 질문:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {getQuickPrompts().map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700/70 transition flex items-center gap-1"
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="아이디어 요청, 플롯 수정, 대사 추천을 명령하세요..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-3.5 pr-11 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1.5 p-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
