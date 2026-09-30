export interface NovelSettings {
  title: string;
  tags: string[];
  genre: string;
  maleLead: string;
  femaleLead: string;
  supportingChars: string;
  writingStyle: string; // 문체
  storyPov: string; // 사건 시점
  narrativeTense: string; // 작성 시점
  targetAudience: string; // 타깃 독자층
  synopsis: string;
}

export interface Episode {
  id: string;
  stageId: number; // 1 ~ 12 (영웅의 여정)
  stageTitle: string;
  epNumber: number;
  title: string;
  summary: string;
  keyEvents: string[];
  conflict: string;
  content: string; // 집필된 원문 (Step 3)
}

export interface HeroStageTemplate {
  stageId: number;
  name: string;
  englishName: string;
  description: string;
  defaultEpisodeHint: string;
}

export type PlatformStyle = '더쿠' | '아카라이브' | '노벨피아' | '리디북스' | '디시인사이드' | '조아라';

export interface CommenterPersona {
  id: string;
  name: string;
  platform: PlatformStyle;
  age: string;
  gender: string;
  personality: string;
  toneStyle: string;
  favoriteGenre: string;
  avatarColor: string;
}

export interface EpisodeComment {
  id: string;
  episodeId: string;
  personaId: string;
  personaName: string;
  platform: PlatformStyle;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  reactionTag?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionProposal?: {
    type: 'apply_settings' | 'apply_outline' | 'apply_episode_content' | 'apply_personas';
    payload: any;
    label: string;
  };
}

export interface ProjectFullData {
  version: string;
  exportedAt: string;
  settings: NovelSettings;
  episodes: Episode[];
  personas: CommenterPersona[];
  comments: EpisodeComment[];
}
