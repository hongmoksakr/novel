import React, { useState, useEffect } from 'react';
import { NovelSettings, Episode, CommenterPersona, EpisodeComment } from './types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_PERSONAS, 
  INITIAL_EPISODES 
} from './constants';
import { ChatPanel } from './components/ChatPanel';
import { Step1Settings } from './components/Step1Settings';
import { Step2Outline } from './components/Step2Outline';
import { Step3Writing } from './components/Step3Writing';
import { Step4Refine } from './components/Step4Refine';
import { Step5Comments } from './components/Step5Comments';
import { Step6Viewer } from './components/Step6Viewer';
import { 
  BookMarked, PenTool, GitBranch, FileEdit, 
  Sparkles, MessageSquare, MonitorPlay, Save, 
  CheckCircle, ChevronRight, Menu, X 
} from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('로컬 자동저장');

  // Load from localStorage or use defaults
  const [settings, setSettings] = useState<NovelSettings>(() => {
    const saved = localStorage.getItem('storyforge_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    const saved = localStorage.getItem('storyforge_episodes');
    return saved ? JSON.parse(saved) : INITIAL_EPISODES;
  });

  const [personas, setPersonas] = useState<CommenterPersona[]>(() => {
    const saved = localStorage.getItem('storyforge_personas');
    return saved ? JSON.parse(saved) : INITIAL_PERSONAS;
  });

  const [comments, setComments] = useState<EpisodeComment[]>(() => {
    const saved = localStorage.getItem('storyforge_comments');
    if (saved) return JSON.parse(saved);

    // Initial dummy continuous comments
    return [
      {
        id: 'c-1',
        episodeId: 'ep-1',
        personaId: 'p-1',
        personaName: '영지물처돌이',
        platform: '노벨피아',
        content: '캬 ㅋㅋㅋ 대마탑 수석이 번아웃 와서 똥땅으로 런친 설정 개맛도리네. 마석 펜 꺼내는 폼 보소',
        likes: 24,
        dislikes: 0,
        createdAt: '1시간 전',
        reactionTag: '사이다'
      },
      {
        id: 'c-2',
        episodeId: 'ep-1',
        personaId: 'p-3',
        personaName: '달리는치와와',
        platform: '더쿠',
        content: '아 미친 카이엔 하품하면서 삽 들고 따라오라는 거 댕치임 ㅠㅠㅠ 엘레나 눈 반짝이는 거 넘 귀여움',
        likes: 18,
        dislikes: 1,
        createdAt: '45분 전',
        reactionTag: '과몰입'
      },
      {
        id: 'c-3',
        episodeId: 'ep-2',
        personaId: 'p-1',
        personaName: '영지물처돌이',
        platform: '노벨피아',
        content: '1화에서 텃밭 가꾼다더니 스프링클러 만들다가 마왕 침상 봉인 뜯은 거 실화냐고 ㅋㅋㅋㅋ 스케일 폼 미쳤다',
        likes: 31,
        dislikes: 0,
        createdAt: '30분 전',
        reactionTag: '떡밥회수'
      },
      {
        id: 'c-4',
        episodeId: 'ep-2',
        personaId: 'p-2',
        personaName: '서사충망령',
        platform: '리디북스',
        content: '엘레나가 카이엔의 단순한 귀차니즘을 제국의 방패로 착각하는 감정선 빌드업이 아주 훌륭합니다. 별점 5개 누르고 갑니다.',
        likes: 15,
        dislikes: 0,
        createdAt: '15분 전',
        reactionTag: '분석'
      }
    ];
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('storyforge_settings', JSON.stringify(settings));
    localStorage.setItem('storyforge_episodes', JSON.stringify(episodes));
    localStorage.setItem('storyforge_personas', JSON.stringify(personas));
    localStorage.setItem('storyforge_comments', JSON.stringify(comments));
    setSaveStatus('저장됨');
    const timer = setTimeout(() => setSaveStatus('로컬 자동저장'), 1500);
    return () => clearTimeout(timer);
  }, [settings, episodes, personas, comments]);

  const stepsList = [
    { num: 1, label: '1단계: 설정 기획', icon: BookMarked },
    { num: 2, label: '2단계: 12단계 플롯', icon: GitBranch },
    { num: 3, label: '3단계: 본문 집필', icon: PenTool },
    { num: 4, label: '4단계: AI 부분 퇴고', icon: FileEdit },
    { num: 5, label: '5단계: 독자 댓글 생성', icon: MessageSquare },
    { num: 6, label: '6단계: 웹 뷰어 시연', icon: MonitorPlay },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* LEFT SIDE: AI Chat Assistant (Fixed 360px ~ 420px on desktop) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 md:w-96 lg:w-[390px] transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isMobileChatOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ChatPanel
          currentStep={currentStep}
          settings={settings}
          episodes={episodes}
          personas={personas}
          onNavigateStep={(step) => setCurrentStep(step)}
        />
      </div>

      {/* Mobile backdrop */}
      {isMobileChatOpen && (
        <div
          onClick={() => setIsMobileChatOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      {/* RIGHT SIDE: Main 6-Step Workflow Canvas */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500 animate-pulse" />
              <span className="font-extrabold text-sm tracking-tight text-white">StoryForge AI</span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">| 웹소설 창작 스튜디오</span>
            </div>
          </div>

          {/* Step Breadcrumbs Indicator */}
          <div className="hidden lg:flex items-center gap-1">
            {stepsList.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md'
                      : isPast
                      ? 'text-brand-400 hover:bg-slate-800'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              {saveStatus}
            </span>
          </div>
        </header>

        {/* Mobile Step Bar (if screen small) */}
        <div className="lg:hidden flex overflow-x-auto border-b border-slate-800 bg-slate-900 px-2 py-1.5 gap-1 scrollbar-none">
          {stepsList.map((step) => (
            <button
              key={step.num}
              onClick={() => setCurrentStep(step.num)}
              className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
                currentStep === step.num
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Dynamic Step View Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentStep === 1 && (
            <Step1Settings
              settings={settings}
              onChange={setSettings}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2Outline
              settings={settings}
              episodes={episodes}
              onChangeEpisodes={setEpisodes}
              onNext={() => setCurrentStep(3)}
              onPrev={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Writing
              settings={settings}
              episodes={episodes}
              onChangeEpisodes={setEpisodes}
              onNext={() => setCurrentStep(4)}
              onPrev={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Refine
              settings={settings}
              episodes={episodes}
              onChangeEpisodes={setEpisodes}
              onNext={() => setCurrentStep(5)}
              onPrev={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 && (
            <Step5Comments
              settings={settings}
              episodes={episodes}
              personas={personas}
              comments={comments}
              onChangePersonas={setPersonas}
              onChangeComments={setComments}
              onNext={() => setCurrentStep(6)}
              onPrev={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 6 && (
            <Step6Viewer
              settings={settings}
              episodes={episodes}
              comments={comments}
              onPrev={() => setCurrentStep(5)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
