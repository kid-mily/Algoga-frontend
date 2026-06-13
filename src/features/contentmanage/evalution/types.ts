export type EvalutionLevel = "초급" | "중급" | "고급";

export type EvalutionQuestion = {
  id: number;
  level: EvalutionLevel;
  country: string;
  title: string;
  options: string[];
  answerIndex: number;
};

export type EvalutionQuestionFormData = {
  level: EvalutionLevel;
  country: string;
  title: string;
  options: string[];
  answerIndex: number;
};

export const evalutionLevels: EvalutionLevel[] = ["초급", "중급", "고급"];

export const evalutionCountries = [
  "남아프리카공화국",
  "콩고민주공화국",
  "이집트",
  "대한민국",
  "남극",
  "캐나다",
  "프랑스",
  "일본",
];

export const defaultEvalutionQuestions: EvalutionQuestion[] = [
  {
    id: 1,
    level: "초급",
    country: "대한민국",
    title: "다음 중 여행 전 필수적으로 확인해야 할 사항이 아닌 것은?",
    options: ["여권 유효기간", "비자 필요 여부", "현지 날씨", "좋아하는 색상"],
    answerIndex: 3,
  },
  {
    id: 2,
    level: "초급",
    country: "캐나다",
    title: '항공권 예약 시 "편도"의 뜻은?',
    options: ["왕복 항공권", "한 방향 항공권", "무료 항공권", "환승 항공권"],
    answerIndex: 1,
  },
  {
    id: 3,
    level: "중급",
    country: "일본",
    title: "일본 입국 시 관세 신고가 필요한 경우는?",
    options: ["신고 대상 물품 소지", "기내용 가방 소지", "여권 소지", "호텔 예약"],
    answerIndex: 0,
  },
  {
    id: 4,
    level: "중급",
    country: "프랑스",
    title: '프랑스 레스토랑에서 "서비스 요금(Service Compris)"이 포함된 경우 추가 팁은?',
    options: ["필수로 20%", "상황에 따라 선택", "반드시 카드 결제", "금지"],
    answerIndex: 1,
  },
  {
    id: 5,
    level: "고급",
    country: "이집트",
    title: "항공사 얼라이언스(Alliance) 마일리지 공유 시 파트너사 탑승 마일리지가 적립될 때 적용되는 기준은?",
    options: ["항공권 예약 등급", "여행 국가", "수하물 개수", "기내식 종류"],
    answerIndex: 0,
  },
];
