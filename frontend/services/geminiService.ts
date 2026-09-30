import { GoogleGenAI } from '@google/genai';
import { NovelSettings, Episode, CommenterPersona, EpisodeComment } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export async function askNovelAssistant(
  prompt: string,
  context: {
    currentStep: number;
    settings: NovelSettings;
    episodes: Episode[];
    personas: CommenterPersona[];
  }
): Promise<string> {
  const systemInstruction = `당신은 대한민국 최고의 웹소설 기획자이자 밀리언셀러 총괄 에디터 '스토리포지 AI'입니다.
작가가 구상 중인 웹소설을 돕기 위해 친절하고 전문적이며 재치 있게 답변하세요.
작가의 현재 작업 단계는 [${context.currentStep}단계]입니다.
- 1단계: 소설 기본 설정 (제목, 태그, 남여주인공, 조연, 문체, 시점, 독자층)
- 2단계: [영웅의 여정 12단계] 기반의 에피소드 얼개 구성
- 3단계: 본문 집필 (분량 조절 100%, 125%, 150%)
- 4단계: 문장/문단 부분 AI 퇴고 및 리라이팅
- 5단계: 플랫폼별(더쿠, 아카라이브, 노벨피아, 리디북스 등) 10인 페르소나 댓글러 생성 및 연속성 있는 정주행 댓글 작성
- 6단계: 웹 뷰어 시연

현재 소설 정보:
제목: ${context.settings.title}
장르/태그: ${context.settings.genre} / ${context.settings.tags.join(', ')}
주인공: 남주(${context.settings.maleLead}) / 여주(${context.settings.femaleLead})
문체: ${context.settings.writingStyle}

작가의 질문이나 요청에 대해 구체적인 아이디어, 대사 예시, 반전 플롯, 혹은 실행 가능한 추천을 한국어로 매끄럽고 센스 있게 제공하세요.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    return response.text || '죄송합니다. 영감을 정리하는 중 오류가 발생했습니다. 다시 질문해주세요.';
  } catch (error) {
    console.error('Gemini Assistant Error:', error);
    return 'AI 조력자와 연결하는 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  }
}

export async function generateNovelSettingsAI(themeHint: string): Promise<Partial<NovelSettings>> {
  const prompt = `주제/키워드: "${themeHint || '인기 웹소설 트렌드 반영'}"
위 주제를 바탕으로 웹소설 1단계 기획 설정을 생성해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "소설 제목 (매력적이고 웹소설 트렌드에 맞는 제목)",
  "genre": "세부 장르",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "maleLead": "남주인공 이름, 나이, 외모, 성격, 핵심 능력 및 결핍",
  "femaleLead": "여주인공 이름, 나이, 직책, 성격, 남주와의 케미 포인트",
  "supportingChars": "주요 조력자 및 라이벌 캐릭터 2-3명 설명",
  "writingStyle": "구체적인 문체 가이드 (예: 간결한 템포, 톡톡 튀는 대화, 감각적 묘사)",
  "storyPov": "시점 (예: 1인칭 주인공 시점 등)",
  "narrativeTense": "서술 시점 (현재형 혼용 과거형 등)",
  "targetAudience": "타깃 독자층 (연령, 선호 플랫폼, 기대 만족 요소)",
  "synopsis": "흡입력 있는 3~4줄 시놉시스"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.85,
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed;
  } catch (err) {
    console.error('generateNovelSettingsAI error:', err);
    throw err;
  }
}

export async function generateStageEpisodesAI(
  stageId: number,
  stageName: string,
  stageDesc: string,
  settings: NovelSettings,
  existingCount: number,
  generateCount: number = 2
): Promise<Array<{ title: string; summary: string; keyEvents: string[]; conflict: string }>> {
  const prompt = `소설 기본 설정:
- 제목: ${settings.title}
- 장르: ${settings.genre}
- 주인공: 남주(${settings.maleLead}) / 여주(${settings.femaleLead})
- 시놉시스: ${settings.synopsis}

[영웅의 여정 12단계 중 ${stageId}단계: ${stageName}]
단계 설명: ${stageDesc}

이 단계에 배치할 세부 에피소드를 ${generateCount}개 기획해주세요. (에피소드 번호는 기존에 ${existingCount}개가 이미 작성됨을 감안)
반드시 아래 JSON 배열 형식으로만 응답하세요:
[
  {
    "title": "제 N화. 에피소드 제목",
    "summary": "에피소드의 핵심 줄거리 2~3줄 요약",
    "keyEvents": ["핵심 사건 1", "핵심 사건 2", "핵심 사건 3"],
    "conflict": "이 에피소드의 주요 갈등 요소 및 긴장점"
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed;
  } catch (err) {
    console.error('generateStageEpisodesAI error:', err);
    throw err;
  }
}

export async function draftEpisodeContentAI(
  episode: Episode,
  settings: NovelSettings,
  lengthMultiplier: 1.0 | 1.25 | 1.5,
  prevEpisodeSnippet?: string
): Promise<string> {
  const targetWords = lengthMultiplier === 1.0 ? '공백 포함 약 1,800~2,200자 (기본 100%)' :
                      lengthMultiplier === 1.25 ? '공백 포함 약 2,500~2,800자 (풍성한 125%)' :
                      '공백 포함 약 3,200~3,800자 (압도적 분량 150%)';

  const prompt = `당신은 최정상급 인기 웹소설 작가입니다. 주어진 에피소드 기획을 바탕으로 실제 연재될 소설 원고를 집필하세요.

[작품 기본 정보]
- 제목: ${settings.title}
- 문체 스타일: ${settings.writingStyle}
- 시점: ${settings.storyPov}
- 시제: ${settings.narrativeTense}
- 남주인공: ${settings.maleLead}
- 여주인공: ${settings.femaleLead}
- 주요 조연: ${settings.supportingChars}

[집필 대상 에피소드]
- 에피소드: ${episode.title} (영웅의 여정: ${episode.stageTitle})
- 줄거리 요약: ${episode.summary}
- 핵심 사건: ${episode.keyEvents.join(' -> ')}
- 주요 갈등: ${episode.conflict}
${prevEpisodeSnippet ? `[직전 화의 마지막 전개 힌트]\n${prevEpisodeSnippet}` : ''}

[집필 조건 및 분량]
- 목표 분량: ${targetWords}
- 가독성이 높은 웹소설 특유의 줄바꿈과 생동감 넘치는 대화, 팽팽한 텐션을 살려주세요.
- 독자가 다음 화를 클릭하지 않고는 못 배기게 만드는 흥미진진한 클리프행어(엔딩 훅)를 포함하세요.
- 마크다운 설명이나 안내 문구 없이 오직 소설 본문 텍스트만 출력하세요.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    });

    return response.text.trim();
  } catch (err) {
    console.error('draftEpisodeContentAI error:', err);
    throw err;
  }
}

export async function refineTextSelectionAI(
  selectedText: string,
  instruction: string,
  styleContext: string
): Promise<string> {
  const prompt = `당신은 웹소설 전문 문장 윤문 및 퇴고 에디터입니다.
작가가 선택한 아래의 본문 텍스트를 작가의 요구사항에 맞춰 세련되고 몰입감 넘치게 수정/퇴고해주세요.

[작품 문체 가이드]
${styleContext}

[선택된 원문 텍스트]
"${selectedText}"

[작가의 수정 요청 사항]
${instruction}

수정된 텍스트만 깔끔하게 출력하세요. 부가 설명이나 인사말은 생략하세요.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.75,
      }
    });

    return response.text.trim();
  } catch (err) {
    console.error('refineTextSelectionAI error:', err);
    throw err;
  }
}

export async function generatePersonasAI(count: number = 5): Promise<CommenterPersona[]> {
  const prompt = `웹소설 독자 커뮤니티의 다양한 독자 페르소나를 ${count}명 생성해주세요.
플랫폼 스타일은 반드시 ['더쿠', '아카라이브', '노벨피아', '리디북스', '디시인사이드', '조아라'] 중에서 골고루 배정하세요.
각 플랫폼의 실제 유저 말투, 줄임말, 분위기를 실감 나게 반영해야 합니다.

반드시 아래 JSON 형식으로 응답하세요:
[
  {
    "id": "p-아이디",
    "name": "닉네임 (플랫폼 감성에 어울리는 닉네임)",
    "platform": "더쿠 | 아카라이브 | 노벨피아 | 리디북스 | 디시인사이드 | 조아라",
    "age": "20대 초반 등",
    "gender": "남성 | 여성",
    "personality": "성격 및 독서 성향",
    "toneStyle": "말투 특징 및 자주 쓰는 표현",
    "favoriteGenre": "선호 장르",
    "avatarColor": "bg-indigo-500 | bg-pink-500 | bg-emerald-500 | bg-amber-500 | bg-purple-500 | bg-blue-600"
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.85,
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed;
  } catch (err) {
    console.error('generatePersonasAI error:', err);
    throw err;
  }
}

export async function generateBingeCommentsAI(
  episodes: Episode[],
  personas: CommenterPersona[]
): Promise<EpisodeComment[]> {
  const episodeSummaries = episodes.map((ep, idx) => `[${idx + 1}회: ${ep.title}]\n줄거리: ${ep.summary}\n본문 요약: ${ep.content.slice(0, 300)}...`).join('\n\n');
  
  const personaList = personas.map((p) => `- ID: ${p.id} / 닉네임: ${p.name} / 플랫폼: ${p.platform} / 연령성별: ${p.age} ${p.gender} / 성향: ${p.personality} / 말투: ${p.toneStyle}`).join('\n');

  const prompt = `웹소설 연재작을 독자 페르소나들이 1회부터 정주행(연속 독서)하면서 남긴 실감 나는 댓글을 생성해주세요.

[에피소드 목록]
${episodeSummaries}

[참여 독자 페르소나 목록]
${personaList}

[핵심 조건]
1. 독자들은 1회부터 마지막 회차까지 순서대로 정주행하고 있으므로, 1회에서 남긴 반응이 다음 회차에서 기억되거나 이어지는 '연속성(서사적 누적)'이 드러나야 합니다.
   예: "1화에서 츤데레인 줄 알았더니 진짜 대형사고 치네 ㅋㅋㅋ", "지난화에 암시하던 우물 결계 터진 거 실화냐" 등.
2. 각 플랫폼(더쿠: 과몰입 앓는 커뮤체, 아카라이브: 음슴체와 실리주의, 노벨피아: 캬/콘 밈, 리디북스: 장문 문해력 분석)의 억양과 문화를 100% 반영하세요.
3. 각 회차당 독자별로 2~4개의 댓글을 골고루 분배하세요.

반드시 아래 JSON 형식으로 응답하세요:
[
  {
    "id": "c-고유번호",
    "episodeId": "에피소드 ID (예: ep-1)",
    "personaId": "작성한 페르소나 ID",
    "personaName": "페르소나 닉네임",
    "platform": "플랫폼 이름",
    "content": "댓글 본문 (플랫폼 특유의 톤앤매너 완벽 반영)",
    "likes": 12,
    "dislikes": 1,
    "createdAt": "10분 전 | 1시간 전 | 방금 전",
    "reactionTag": "주접 | 분석 | 사이다 | 과몰입 | 떡밥회수"
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9,
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed;
  } catch (err) {
    console.error('generateBingeCommentsAI error:', err);
    throw err;
  }
}
