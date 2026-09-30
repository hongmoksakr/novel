import React, { useState } from 'react';
import { NovelSettings, Episode } from '../types';
import { 
  Sparkles, Wand2, ArrowRight, ArrowLeft, Check, 
  RotateCcw, SlidersHorizontal, Quote, ArrowDown 
} from 'lucide-react';
import { refineTextSelectionAI } from '../services/geminiService';

interface Step4RefineProps {
  settings: NovelSettings;
  episodes: Episode[];
  onChangeEpisodes: (episodes: Episode[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4Refine: React.FC<Step4RefineProps> = ({
  settings,
  episodes,
  onChangeEpisodes,
  onNext,
  onPrev,
}) => {
  const [selectedEpId, setSelectedEpId] = useState<string>(episodes[0]?.id || '');
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [customInstruction, setCustomInstruction] = useState<string>('더 긴장감 넘치고 생생한 감각 묘사로 수정해줘.');
  const [refinedResult, setRefinedResult] = useState<string>('');
  const [isRefining, setIsRefining] = useState(false);

  const activeEpisode = episodes.find(e => e.id === selectedEpId) || episodes[0];

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start !== end) {
      const text = target.value.substring(start, end);
      setSelectedText(text);
      setSelectionRange({ start, end });
    }
  };

  const handleRefine = async () => {
    if (!selectedText.trim()) {
      alert('본문에서 수정하고 싶은 문장이나 단락을 마우스로 드래그하여 선택해주세요.');
      return;
    }
    setIsRefining(true);
    try {
      const polished = await refineTextSelectionAI(
        selectedText,
        customInstruction,
        `문체: ${settings.writingStyle}, 시점: ${settings.storyPov}`
      );
      setRefinedResult(polished);
    } catch (err) {
      alert('AI 퇴고 중 오류가 발생했습니다.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleApplyPolishedText = () => {
    if (!activeEpisode || !selectionRange || !refinedResult) return;
    const original = activeEpisode.content;
    const newContent =
      original.substring(0, selectionRange.start) +
      refinedResult +
      original.substring(selectionRange.end);

    onChangeEpisodes(
      episodes.map(e => e.id === activeEpisode.id ? { ...e, content: newContent } : e)
    );
    setSelectedText('');
    setRefinedResult('');
    setSelectionRange(null);
  };

  const quickPresets = [
    '감각적이고 현장감 넘치는 묘사로 극대화',
    '호흡을 빠르게 끊고 사이다 같은 속도감 부여',
    '인물들의 대화에 위트와 츤데레 텐션 추가',
    '공포/위기 상황의 서늘한 서스펜스 강조'
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-6 rounded-2xl border border-purple-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                4단계
              </span>
              <h1 className="text-xl font-bold text-white">AI 부분 문장 퇴고 & 윤문</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              본문에서 아쉬운 문단이나 대사를 드래그하여 선택한 후, 작가의 의도에 맞게 AI로 부분 수정하고 즉시 교체하세요.
            </p>
          </div>

          <div className="flex gap-2">
            {episodes.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEpId(ep.id);
                  setSelectedText('');
                  setRefinedResult('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  activeEpisode?.id === ep.id
                    ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                제{idx + 1}화
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeEpisode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original Text with Drag Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{activeEpisode.title} 원문</span>
              <span className="text-purple-400 font-medium">💡 마우스로 원하는 부분을 드래그하세요</span>
            </div>

            <textarea
              rows={20}
              value={activeEpisode.content}
              onSelect={handleTextareaSelect}
              onChange={(e) => {
                const val = e.target.value;
                onChangeEpisodes(
                  episodes.map(ep => ep.id === activeEpisode.id ? { ...ep, content: val } : ep)
                );
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm leading-relaxed font-serif text-slate-200 focus:outline-none focus:border-purple-500 shadow-inner"
            />
          </div>

          {/* Right: AI Selection Refinement Workbench */}
          <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>선택 부분 AI 리라이팅 워크벤치</span>
            </h3>

            {/* Selected Text Preview */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Quote className="w-3 h-3 text-purple-400" />
                선택된 원문 구간
              </label>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 min-h-[70px] max-h-[120px] overflow-y-auto italic">
                {selectedText ? selectedText : '원문 텍스트에서 수정하고 싶은 구절을 드래그하여 선택하세요.'}
              </div>
            </div>

            {/* Instruction presets */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">빠른 요청 프리셋</label>
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomInstruction(preset)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instruction */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">상세 수정 요청 지시문</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  placeholder="예: 긴박감을 높여주고 짧은 문장 위주로 다듬어줘"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleRefine}
                  disabled={!selectedText.trim() || isRefining}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
                  <span>{isRefining ? '윤문 중...' : 'AI 퇴고'}</span>
                </button>
              </div>
            </div>

            {/* Refined Output Result */}
            {refinedResult && (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI 수정 제안안
                  </span>
                  <button
                    onClick={handleApplyPolishedText}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>본문에 즉시 반영하기</span>
                  </button>
                </div>
                <div className="bg-slate-950/90 p-3 rounded-lg border border-purple-500/20 text-xs text-slate-100 leading-relaxed font-serif whitespace-pre-wrap">
                  {refinedResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition"
        >
          이전: 3단계 본문 집필
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transition"
        >
          <span>5단계: 댓글러 페르소나 및 정주행 댓글 생성</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
