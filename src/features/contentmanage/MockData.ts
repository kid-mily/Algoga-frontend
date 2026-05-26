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