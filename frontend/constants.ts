import { HeroStageTemplate, CommenterPersona, NovelSettings } from './types';

export const HERO_JOURNEY_STAGES: HeroStageTemplate[] = [
  {
    stageId: 1,
    name: '1. 일상 세계 (The Ordinary World)',
    englishName: 'The Ordinary World',
    description: '주인공의 일상, 결핍, 제한된 환경과 불만족을 보여주어 공감을 이끌어내는 단계.',
    defaultEpisodeHint: '평범하지만 억압받거나 결핍된 주인공의 삶과 배경 소개'
  },
  {
    stageId: 2,
    name: '2. 모험의 소명 (The Call to Adventure)',
    englishName: 'The Call to Adventure',
    description: '안정된 일상을 깨뜨리는 예기치 못한 사건, 메시지, 또는 도전의 발생.',
    defaultEpisodeHint: '시스템 알림창 발생, 황실 초대장, 또는 던전 브레이크 등 사건의 방아쇠'
  },
  {
    stageId: 3,
    name: '3. 소명의 거부 (Refusal of the Call)',
    englishName: 'Refusal of the Call',
    description: '주인공의 두려움, 현실적 불안, 이전 트라우마로 인한 주저와 망설임.',
    defaultEpisodeHint: '과거 실패의 기억이나 가족의 만류로 모험을 거부하려는 순간'
  },
  {
    stageId: 4,
    name: '4. 스승과의 만남 (Meeting with the Mentor)',
    englishName: 'Meeting with the Mentor',
    description: '지혜, 무기, 마법 아티팩트, 심리적 조언을 건네는 스승/조력자의 등장.',
    defaultEpisodeHint: '은퇴한 검성, 비밀스러운 AI 가이드, 혹은 고대 영혼과의 조우'
  },
  {
    stageId: 5,
    name: '5. 첫 관문 통과 (Crossing the First Threshold)',
    englishName: 'Crossing the First Threshold',
    description: '되돌아갈 수 없는 결단을 내리고 낯설고 위험한 특별한 세계로 첫 발을 내딛음.',
    defaultEpisodeHint: '고향 마을을 떠나 대도시로 가거나, 미지의 차원문으로 뛰어듦'
  },
  {
    stageId: 6,
    name: '6. 시험, 협력자, 적 (Tests, Allies, and Enemies)',
    englishName: 'Tests, Allies, and Enemies',
    description: '새로운 룰을 배우며 동료를 얻고 적의 위협을 마주하며 성장하는 연속 에피소드.',
    defaultEpisodeHint: '길드 입단 시험, 첫 파티 구성, 호적수 라이벌과의 신경전'
  },
  {
    stageId: 7,
    name: '7. 가장 깊은 동굴로의 접근 (Approach to the Inmost Cave)',
    englishName: 'Approach to the Inmost Cave',
    description: '최종 결전지나 심연의 위험 구역을 향한 준비와 고조되는 긴장감.',
    defaultEpisodeHint: '마왕성 잠입 전야의 캠프파이어, 비밀 작전 브리핑과 불안한 복선'
  },
  {
    stageId: 8,
    name: '8. 시련과 절체절명 (The Ordeal)',
    englishName: 'The Ordeal',
    description: '치명적인 위기, 상징적인 죽음과 절망 속에서 주인공이 바닥까지 떨어지는 순간.',
    defaultEpisodeHint: '치명상을 입거나 동료의 배신, 절체절명의 위기에서 각성하는 계기'
  },
  {
    stageId: 9,
    name: '9. 보상 (The Reward)',
    englishName: 'The Reward',
    description: '죽음의 고비를 넘기고 마침내 얻어낸 비기, 깨달음, 진실 혹은 승리.',
    defaultEpisodeHint: 'SS급 특성 획득, 고대 마도서 해독, 진정한 자신에 대한 신뢰 회복'
  },
  {
    stageId: 10,
    name: '10. 귀환의 길 (The Road Back)',
    englishName: 'The Road Back',
    description: '승리 후에도 잔존한 세력의 추격, 혹은 현실 세계로 돌아가기 위한 역경.',
    defaultEpisodeHint: '무너지는 던전 탈출전, 잔당들의 최후 발악과 동료들의 희생적 지원'
  },
  {
    stageId: 11,
    name: '11. 부활과 클라이맥스 (The Resurrection)',
    englishName: 'The Resurrection',
    description: '새롭게 거듭난 주인공의 최종 심판. 가장 높은 판돈이 걸린 최후의 승부.',
    defaultEpisodeHint: '완전히 새로워진 능력으로 흑막을 격파하고 세상의 법칙을 수호함'
  },
  {
    stageId: 12,
    name: '12. 영약/지혜를 품은 귀환 (Return with the Elixir)',
    englishName: 'Return with the Elixir',
    description: '모험의 결실로 세상을 구하거나, 변화된 새로운 삶의 터전을 정립하는 결말.',
    defaultEpisodeHint: '일상으로 돌아온 영웅의 평온, 그리고 새로운 지평을 암시하는 에필로그'
  }
];

export const INITIAL_SETTINGS: NovelSettings = {
  title: '천재 마도사의 영지 생존기',
  genre: '퓨전 판타지 / 영지물 / 상태창',
  tags: ['먼치킨', '영지발전', '착각계', '마탑출신', '사이다', '전략'],
  maleLead: '카이엔 로스차일드 (24세) - 대마탑 수석 출신이나 정치 싸움에 염증을 느끼고 변방 빈민 영지로 자진 유배 간 마도공학자. 무심한 척 챙겨주는 츤데레 뇌섹남.',
  femaleLead: '엘레나 폰 하이츠 (22세) - 몰락한 기사 가문의 장녀. 정의롭고 충직하나 카이엔의 속셈을 늘 거대한 대계(大計)로 착각하여 과도하게 충성함.',
  supportingChars: '오스칼(노련한 영지 총괄 집사, 현실주의자), 볼코프(야만족 출신이지만 도예를 좋아하는 보디가드), 비올라(마탑에서 카이엔을 쫓아온 천방지축 연금술사 후배)',
  writingStyle: '간결하고 스피디하며, 대화 중심의 생동감 넘치고 유머러스한 티키타카 문체. 감정 묘사는 절제하되 상황의 극적 연출에 힘을 실음.',
  storyPov: '주인공 1인칭 주인공 시점 (카이엔의 시선), 간혹 주변 인물의 착각을 조명하는 전지적 시점 교차',
  narrativeTense: '생동감 있는 현재형 위주의 혼용 과거형 서술 ("~한다", "~했다")',
  targetAudience: '20~30대 남녀 웹소설 독자, 빠른 사이다 전개와 영지 성장 카타르시스를 즐기는 층',
  synopsis: '대마탑을 뒤흔든 천재 마도공학자 카이엔. 번아웃이 와서 제국의 끝자락 똥땅 영지로 은퇴했더니, 그곳이 마계와 제국을 잇는 차원 요충지였다? 조용히 낮잠이나 자려던 은둔 마도사의 본의 아닌 대륙 평정기.'
};

export const INITIAL_PERSONAS: CommenterPersona[] = [
  {
    id: 'p-1',
    name: '영지물처돌이',
    platform: '노벨피아',
    age: '20대 중반',
    gender: '남성',
    personality: '설정 집착형, 밸런스와 마법 공학 원리에 열광함. 진도 빠르면 찬양함.',
    toneStyle: 'ㅋㅋ와 밈을 자주 쓰고 호쾌하며 피드백이 솔직함. "캬 이거지", "작가 폼 미쳤다"',
    favoriteGenre: '판타지 영지물, 헌터물',
    avatarColor: 'bg-emerald-500'
  },
  {
    id: 'p-2',
    name: '서사충망령',
    platform: '리디북스',
    age: '30대 초반',
    gender: '여성',
    personality: '남녀 주인공 사이의 텐션과 착각 감정선 분석가. 텍스트를 정독하며 복선 캐치.',
    toneStyle: '정갈하고 조용한 존댓말. "카이엔 엘레나 티키타카 진짜 미치겠네요...", 별점 분석',
    favoriteGenre: '로판, 하이판타지',
    avatarColor: 'bg-indigo-500'
  },
  {
    id: 'p-3',
    name: '달리는치와와',
    platform: '더쿠',
    age: '20대 후반',
    gender: '여성',
    personality: '과몰입 공감형. 억울한 일 생기면 대신 화내주고 귀여운 캐릭터에 환장함.',
    toneStyle: '독백형 커뮤체. "아 미친 카이엔 츤데레 댕맛도리ㅠㅠㅠ 영주님 저도 그 영지에 묻어주세요"',
    favoriteGenre: '퓨전 드라마, 착각계',
    avatarColor: 'bg-pink-500'
  },
  {
    id: 'p-4',
    name: '팩폭기관총',
    platform: '아카라이브',
    age: '20대 초반',
    gender: '남성',
    personality: '효율충, 답답한 고구마 극혐. 주인공이 사이다 날리면 통쾌해함.',
    toneStyle: '음슴체 및 커뮤 줄임말. "빌런 컷 개빠르네 ㅋㅋㅋ 5화 안에 영지 정리 안되면 하차각이었는데 살아남음"',
    favoriteGenre: '사이다 먼치킨',
    avatarColor: 'bg-amber-500'
  },
  {
    id: 'p-5',
    name: '심야독서가',
    platform: '조아라',
    age: '30대 중반',
    gender: '남성',
    personality: '구작부터 읽어온 정통파. 필력과 어휘 선택을 칭찬하는 든든한 국밥 독자.',
    toneStyle: '따뜻한 응원체. "작가님 건필하십시오. 주말 새벽에 시간 가는 줄 모르고 정주행 중입니다."',
    favoriteGenre: '정통 판타지, 마법물',
    avatarColor: 'bg-blue-600'
  }
];

export const INITIAL_EPISODES: Episode[] = [
  {
    id: 'ep-1',
    stageId: 1,
    stageTitle: '1. 일상 세계 (The Ordinary World)',
    epNumber: 1,
    title: '제1화. 은퇴 마도사, 최악의 영지를 받다',
    summary: '대마탑을 발칵 뒤집고 사표를 던진 카이엔이 쥐새끼도 굶어 죽는다는 불모지 "칼라드 영지"에 도착하는 도입부.',
    keyEvents: [
      '마탑 원로들의 만류를 뿌리치고 영지 증서를 받아 탈출함',
      '도착하자마자 낡아빠진 성문이 무너져내림',
      '폐허 속에서 흙먼지를 털며 등장하는 영지민들과의 조우'
    ],
    conflict: '조용히 낮잠이나 자려던 계획 vs 시작부터 빗발치는 영지민들의 밀린 임금 및 식량 청구',
    content: `제국 대마탑 120년 역사상 최연소 석좌마도사 카이엔 로스차일드.
그의 마지막 공식 선언은 황제와 대원로들을 경악시키기에 충분했다.

"사표 냅니다. 저 찾지 마세요. 텃밭 가꾸면서 낮잠이나 실컷 잘 겁니다."

그리하여 굴러떨어지듯 도착한 곳이 바로 제국 북동부 끝자락, 칼라드 영지였다.

쿠구구궁—!

마차에서 내리자마자 반겨준 것은 웅장한 환영식이 아니라, 200년 묵은 영주성의 외벽이 모래성처럼 주저앉는 굉음이었다.

"……어처구니가 없군."

카이엔은 미간을 짚었다. 
폐허 같은 성문 너머로 삐쩍 마른 기사 복장의 여자가 달려오고 있었다. 투구 밑으로 비죽 튀어나온 은빛 단발머리가 흙먼지에 뒤덮여 있었다.

"새로 부임하신 영주님이십니까?! 제 7대 기사단장, 엘레나 폰 하이츠입니다! 죄송합니다! 성벽 보수 예산이 3년 전부터 바닥나서……!"

엘레나는 숨을 헐떡이며 카이엔의 눈앞에 번쩍이는 서류 뭉치를 들이밀었다.

[밀린 영지민 급여 청구서 : 4,200 골드]
[마수 방벽 결계 충전 잔량 : 0.02%]

카이엔은 속으로 욕설을 삼켰다.
'분명 마탑 장로 영감탱이가 변방의 평온하고 공기 좋은 곳이라고 계약서에 적어놨는데……?'

"영주님! 이 위기를 어떻게 타개하시겠습니까! 혹시 대마탑의 비밀 비상자금이라도 가져오셨는지요?!"

초롱초롱하게 올려다보는 엘레나의 눈빛. 
카이엔은 하품을 쩍 하며 품에서 푸른빛 마석 펜을 꺼내 들었다.

"일단 시끄러우니까 조용히 하고. 삽 들고 따라와."

그의 은퇴 라이프에 거대한 먹구름이 끼어들기 시작한 순간이었다.`
  },
  {
    id: 'ep-2',
    stageId: 2,
    stageTitle: '2. 모험의 소명 (The Call to Adventure)',
    epNumber: 2,
    title: '제2화. 바닥에서 울리는 심연의 맥박',
    summary: '영지 지하수맥을 뚫으려 마법을 시전하던 중, 칼라드 영지 지하에 묻힌 고대 마왕의 관문이 반응하기 시작한다.',
    keyEvents: [
      '텃밭 스프링클러를 만들려다 고대 지하 결계를 건드림',
      '영지 전체가 붉은빛으로 공명하며 시스템 경고 발생',
      '엘레나가 카이엔의 "깊은 뜻"이라며 감격함'
    ],
    conflict: '단순 편의시설 확충 vs 뜻밖의 고대 유적 활성화',
    content: `낮잠은 글렀다. 
물이 나와야 차를 끓여 마시든 목욕을 하든 할 것 아닌가.

"영주님, 이 우물은 10년 전에 이미 말라붙었습니다. 물을 길어오려면 저쪽 늑대 계곡까지 왕복 반나절은 걸어야……."
"비켜 봐."

카이엔은 낡은 우물 테두리에 분필로 간이 삼각 마법진을 그렸다.
[수맥 감지 및 순간 열화 굴착식]

파지지직!
푸른 스파크가 튀며 땅바닥이 진동하기 시작했다. 
대마탑의 정밀 공학 공식이 적용된 마력은 암반층을 두부 자르듯 파고들었다.

콰아아앙!

시원한 지하수가 치솟는 대신, 땅속 수백 미터 아래에서 불길한 묵직한 울림이 터져 나왔다.

[경고 : 영지 중심부 \'아바돈의 심연 침상\' 결계가 자극되었습니다.]
[봉인 해제 잔여 기한 : 30일]

"……뭐?"
카이엔의 눈썹이 꿈틀했다.

옆에서 흙투성이가 된 채 구경하던 엘레나의 눈이 동그랗게 커졌다.
"설마…… 영주님께선 이미 영지 지하에 고대 마왕군의 잔재가 잠들어 있다는 걸 알고 계셨던 겁니까?! 그래서 일부러 자진해서 이 험지로 내려오신 거였군요!"

"아니, 난 그냥 물을 마시고 싶었을 뿐인데."
"겸손해하지 마십시오! 영지를 구하고 제국의 방패가 되시려는 그 숭고한 결의…… 이 엘레나, 목숨을 바쳐 따르겠습니다!"

카이엔은 멍하니 우물 바닥에서 피어오르는 보랏빛 연기를 바라보았다.
'장로 영감…… 당신 나한테 대체 무슨 폭탄을 넘긴 거야?'`
  }
];
