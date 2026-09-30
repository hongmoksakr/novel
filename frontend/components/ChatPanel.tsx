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
      content: `반갑습니다, 작가님. 당신의 전담 웹소설 디렉터 AI입니다. ✍️
현재 **${currentStep}단계**를 진행 중이십니다.

본 작품은 **사제지간, 연상연하, 개신교회 연애, 메조히스트 여성, 심리적 조교**라는 강렬한 배덕감과 밀도 높은 긴장감을 다룹니다.
교회라는 성역 속 둘만의 은밀한 규칙 설정, 종교적 죄책감과 쾌락의 대비, 숨 막히는 호흡의 대사 퇴고까지 무엇이든 명령하세요!`,
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

  // Step-specific contextual suggestion prompts focused on the genre
  const getQuickPrompts = () => {
    switch (currentStep) {
      case 1:
        return [
          '교회 성가대실에서 연하남이 연상 전도사에게 걸 첫 번째 복종 규칙 추천해줘',
          '모태신앙 여주인공의 종교적 죄책감과 메조히즘 심리 설정 디테일',
          '둘의 관계를 의심하는 청년부 회장 조연과의 갈등 구도 구상'
        ];
      case 2:
        return [
          '5단계(첫 관문 통과)에서 심야 본당 뒷편 체벌 사건 연출 아이디어',
          '8단계(절체절명 시련)에서 교회 익명 고발로 들킬 위기 플롯',
          '여름 수련회 기도원 고립 상황에서 영웅의 여정 12단계 배치 팁'
        ];
      case 3:
        return [
          '대예배 설교 도중 주고받는 비밀스러운 신호 본문 150% 분량 팁',
          '연하남의 차분한 존댓말 통제와 여주의 떨리는 호흡 티키타카',
          '1화 엔딩에서 다음 화를 누를 수밖에 없는 클리프행어 조언'
        ];
      case 4:
        return [
          '뺨을 맞거나 무릎 꿇는 순간의 감각과 심장 박동을 극대화해줘',
          '거룩한 찬송가 가사와 배덕한 육체적 복종을 교차시키는 문장 윤문',
          '여주의 수치심과 전율을 섬세하게 드러내는 묘사 수정'
        ];
      case 5:
        return [
          '리디북스/더쿠 독자들이 남주의 냉혹한 지배력에 열광하는 댓글 예시',
          '실제 개신교회 출신 독자들이 소름 돋아 할 현실 고증 반응',
          '1회부터 5회까지 점점 수위와 굴종이 깊어질 때의 정주행 반응'
        ];
      case 6:
        return [
          '독자가 단숨에 결제하게 만드는 웹 뷰어 첫 문장 임팩트 점검',
          '작품 소개글(어그로 카피라이팅) 3종 추천해줘'
        ];
      default:
        return ['배덕감 극대화 연출', '심리 조교 규칙 추천', '교회물 클리셰 비틀기'];
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
            <span>AI가 플롯과 심리 묘사를 분석하고 있습니다...</span>
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
