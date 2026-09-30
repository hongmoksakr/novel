import React, { useState } from 'react';
import { NovelSettings, Episode } from '../types';
import { Sparkles, Wand2, Sliders, ArrowRight, ArrowLeft, Check, Copy, BookOpen } from 'lucide-react';
import { draftEpisodeContentAI } from '../services/geminiService';

interface Step3WritingProps {
  settings: NovelSettings;
  episodes: Episode[];
  onChangeEpisodes: (episodes: Episode[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Writing: React.FC<Step3WritingProps> = ({
  settings,
  episodes,
  onChangeEpisodes,
  onNext,
  onPrev,
}) => {
  const [selectedEpId, setSelectedEpId] = useState<string>(episodes[0]?.id || '');
  const [lengthMultiplier, setLengthMultiplier] = useState<1.0 | 1.25 | 1.5>(1.0);
  const [isDrafting, setIsDrafting] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeEpisode = episodes.find(e => e.id === selectedEpId) || episodes[0];

  const handleUpdateContent = (text: string) => {
    if (!activeEpisode) return;
    onChangeEpisodes(
      episodes.map(e => e.id === activeEpisode.id ? { ...e, content: text } : e)
    );
  };

  const handleDraftWithAi = async () => {
    if (!activeEpisode) return;
    setIsDrafting(true);

    // Find previous episode content snippet if any
    const activeIndex = episodes.findIndex(e => e.id === activeEpisode.id);
    const prevEpSnippet = activeIndex > 0 ? episodes[activeIndex - 1].content.slice(-400) : undefined;

    try {
      const generated = await draftEpisodeContentAI(
        activeEpisode,
        settings,
        lengthMultiplier,
        prevEpSnippet
      );
      handleUpdateContent(generated);
    } catch (err) {
      alert('소설 본문 집필 중 오류가 발생했습니다.');
    } finally {
      setIsDrafting(false);
    }
  };

  const handleCopy = () => {
    if (!activeEpisode?.content) return;
    navigator.clipboard.writeText(activeEpisode.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = activeEpisode?.content?.length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 p-6 rounded-2xl border border-brand-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                3단계
              </span>
              <h1 className="text-xl font-bold text-white">에피소드 본문 정밀 집필</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              2단계에서 구성된 얼개를 기반으로 실제 웹소설 본문을 완성합니다. 분량을 100%, 125%, 150%로 유연하게 조절하여 집필할 수 있습니다.
            </p>
          </div>

          {/* Volume Control Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] font-medium text-slate-400 pl-2 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-brand-400" />
              분량 조절:
            </span>
            <button
              onClick={() => setLengthMultiplier(1.0)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                lengthMultiplier === 1.0 ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              100% (기본)
            </button>
            <button
              onClick={() => setLengthMultiplier(1.25)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                lengthMultiplier === 1.25 ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              125% (풍성)
            </button>
            <button
              onClick={() => setLengthMultiplier(1.5)}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                lengthMultiplier === 1.5 ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              150% (대용량)
            </button>
          </div>
        </div>
      </div>

      {/* Episode Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {episodes.map((ep, idx) => (
          <button
            key={ep.id}
            onClick={() => setSelectedEpId(ep.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-2 border ${
              activeEpisode?.id === ep.id
                ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span className="max-w-[120px] truncate">{ep.title.replace(/^제\d+화\.\s*/, '')}</span>
            {ep.content ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="작성 완료" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-600" title="미작성" />
            )}
          </button>
        ))}
      </div>

      {/* Editor & Context Box */}
      {activeEpisode && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Context Info (1 col) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>플롯 얼개 요약</span>
              </h3>
              <div>
                <span className="text-[10px] text-brand-400 font-mono block">{activeEpisode.stageTitle}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{activeEpisode.title}</h4>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block mb-1">줄거리 요약:</span>
                {activeEpisode.summary}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-[10px] text-amber-400 block mb-1">핵심 갈등 & 복선:</span>
                {activeEpisode.conflict}
              </div>

              {/* AI Draft Button */}
              <button
                onClick={handleDraftWithAi}
                disabled={isDrafting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 text-xs transition"
              >
                <Wand2 className={`w-4 h-4 ${isDrafting ? 'animate-spin' : ''}`} />
                <span>{isDrafting ? 'AI 본문 집필 중...' : `AI로 ${lengthMultiplier * 100}% 분량 집필하기`}</span>
              </button>
            </div>
          </div>

          {/* Main Novel Manuscript Editor (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>원고 작성창 (마우스로 드래그하면 4단계에서 부분 수정 가능)</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-300">공백 포함: <strong className="text-brand-400">{wordCount.toLocaleString()}</strong>자</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사됨!' : '본문 복사'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={22}
              value={activeEpisode.content}
              onChange={(e) => handleUpdateContent(e.target.value)}
              placeholder="여기에 소설 본문을 직접 작성하거나, 좌측 [AI로 집필하기] 버튼을 눌러보세요..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm md:text-base leading-loose font-serif text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
        >
          이전: 2단계 플롯 수정
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
        >
          <span>4단계: AI 부분 문장 퇴고로 이동</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
