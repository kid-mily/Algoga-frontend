export const lectures = [
    {
      id: 1,
      thumbnail: "/images/thumb.png",
      country: "일본",
      title: "일본 여행 완벽 가이드",
      description: "일본 여행의 모든 것",
      price: "89,000원",
      mileage: "500",
      students: "1,234",
      chapters: 4,
      createdAt: "2024.04.15",
      isPublic: true,
    },
    {
      id: 2,
      thumbnail: "/images/thumb.png",
      country: "프랑스",
      title: "파리 완전 정복 2024",
      description: "파리의 모든 것을 담은 강의",
      price: "85,000원",
      mileage: "300",
      students: "934",
      chapters: 5,
      createdAt: "2024.04.10",
      isPublic: true,
    },
    {
      id: 3,
      thumbnail: "/images/thumb.png",
      country: "미국",
      title: "뉴욕 자유여행 가이드",
      description: "뉴욕 여행 준비하기",
      price: "89,000원",
      mileage: "00",
      students: "892",
      chapters: 3,
      createdAt: "2024.03.28",
      isPublic: false,
    },
  ];

  export const chapters = [
  {
    id: 1,
    lectureId: 1,
    duration: "15분",
    title: "여행 준비하기",
    description:
      "일본 여행을 위한 기본적인 준비 사항",
  },

  {
    id: 2,
    lectureId: 1,
    duration: "12분",
    title: "비자 및 입국 절차",
    description:
      "비자 신청과 입국 시 주의사항",
  },
];

export const quizzes = [
  {
    id: 1,
    lectureId: 1,
    lectureTitle:
      "일본 여행 완벽 가이드",
    question:
      "일본 여행 시 가장 중요한 준비물은?",
    options: [
      "여권",
      "신용카드",
      "현금",
      "모두 중요",
    ],
    answer: "모두 중요",
    explanation:
      "일본 여행 시에는 모든 준비물이 중요합니다.",
  },

  {
    id: 2,
    lectureId: 1,
    lectureTitle:
      "일본 여행 완벽 가이드",
    question:
      "일본의 수도는?",
    options: [
      "오사카",
      "도쿄",
      "교토",
      "후쿠오카",
    ],
    answer: "도쿄",
  },

  {
    id: 3,
    lectureId: 2,
    lectureTitle:
      "파리 완전 정복 2024",
    question:
      "에펠탑이 위치한 곳은?",
    options: [
      "센강 근처",
      "몽마르트르",
      "루브르",
      "베르사유",
    ],
    answer: "센강 근처",
    explanation:
      "에펠탑은 센강 근처에 위치해 있습니다.",
  },
];

export const coupons = [
  {
    id: 1,
    name: "일본 여행 완료 할인 쿠폰",
    discount: 20,
    startDate: "2024.04.15",
    endDate: "2024.12.31",
    lecture: "일본 여행 완벽 가이드",
    target: "패키지",
    categories: [
      "항공",
      "숙소",
    ],
    isActive: true,
    createdAt: "2024.04.15",
  },

  {
    id: 2,
    name: "파리 여행 수료 특별 할인",
    discount: 15,
    startDate: "2024.05.01",
    endDate: "2024.06.30",
    lecture: "파리 완전 정복 2024",
    target: "강의",
    categories: [
      "숙소",
      "액티비티",
    ],
    isActive: true,
    createdAt: "2024.04.20",
  },
  {
    id: 3,
    name: "뉴욕 여행 준비 쿠폰",
    discount: 10,
    startDate: "2024.03.01",
    endDate: "2024.04.30",
    lecture: "뉴욕 자유여행 가이드",
    target: "패키지",
    categories: [
      "숙소",
      "액티비티",
    ],
    isActive: false,
    createdAt: "2024.03.01",
  },
];

export const qnas = [
  {
    id: 1,
    lecture:"일본 여행 완벽 가이드",
    writer: "김여행",
    createdAt: "2024.04.28",
    question: "비자 발급은 어떻게 하나요?",
    isAnswered: true,
    answer:
      "일본은 90일 이내 무비자 입국이 가능합니다.",
    comments: [],
  },
  {
    id: 2,
    lecture:"파리 완전 정복 2024",
    writer: "박여행",
    createdAt: "2024.04.27",
    question:"뮤지엄 패스는 어디서 구매하나요?",
    isAnswered: false,
    answer: "",
    comments: [],
  },

  {
  id: 5,
  lecture:"도쿄 자유여행 마스터",
  question:"스이카 카드랑 파스모 카드 차이가 뭔가요?",
  writer: "한여행",
  createdAt: "2024.04.24",
  isAnswered: true,
  answer:"두 카드 모두 교통카드 기능은 동일하며 사용 가능한 지역도 거의 같습니다. 디자인과 발급처 정도만 다릅니다.",
  comments: [
    {
      id: 1,
      writer: "한여행",
      createdAt: "2024.04.24 14:20",
      content:"환불도 가능한가요?",
    },

    {
      id: 2,
      writer: "이관리자",
      createdAt:"2024.04.24 14:40",
      content:"네 가능합니다. 다만 수수료가 발생할 수 있습니다.",
      isInstructor: true,
    },
  ],
},

{
  id: 6,
  lecture:"런던 여행 필수 코스",
  question:"오이스터 카드는 어디서 구매하나요?",
  writer: "윤여행",
  createdAt: "2024.04.23",
  isAnswered: false,
  answer: "",
  comments: [],
},
];


export const students = [
  {
    id: 1,
    name: "김여행",
    email: "kim@algoga.kr",
    point: 15000,
    updatedAt: "2024.04.28",
  },

  {
    id: 2,
    name: "이수연",
    email: "lee@algoga.kr",
    point: 8500,
    updatedAt: "2024.04.27",
  },

  {
    id: 3,
    name: "박준혁",
    email: "park@algoga.kr",
    point: 22300,
    updatedAt: "2024.04.26",
  },
];

export const pointLogs = [
  {
    id: 1,
    name: "김여행",
    type: "적립",
    amount: 5000,
    reason: "강의 수료 보상",
    manager: "김관리자",
    createdAt: "2024.04.28",
  },

  {
    id: 2,
    name: "이수연",
    type: "사용",
    amount: 3000,
    reason: "강의 결제 사용",
    manager: "시스템",
    createdAt: "2024.04.27",
  },

  {
    id: 3,
    name: "김여행",
    type: "적립",
    amount: 2000,
    reason: "이벤트 참여 보상",
    manager: "박매니저",
    createdAt: "2024.04.26",
  },
];
