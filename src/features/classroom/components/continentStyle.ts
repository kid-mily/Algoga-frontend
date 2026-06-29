export const continentStyle = {
    ASIA: {
        label: "Asia",
        code: "AS",
        accent: "bg-[#439A97]",
        soft: "bg-[#EEF8F7] text-[#357F7C]",
        description: "다양한 문화와 전통이 공존하는 대륙이에요.",
    },
    EUROPE: {
        label: "Europe",
        code: "EU",
        accent: "bg-[#4F7FD9]",
        soft: "bg-[#F0F5FF] text-[#416AB8]",
        description: "역사적인 도시와 예술이 살아있는 대륙이에요.",
    },
    NORTH_AMERICA: {
        label: "North America",
        code: "NA",
        accent: "bg-[#D6A640]",
        soft: "bg-[#FFF8E8] text-[#A87512]",
        description: "넓은 자연과 현대적인 도시가 어우러진 대륙이에요.",
    },
    SOUTH_AMERICA: {
        label: "South America",
        code: "SA",
        accent: "bg-[#D96A5B]",
        soft: "bg-[#FFF1EF] text-[#BC4F43]",
        description: "열정적인 문화와 풍부한 자연을 가진 대륙이에요.",
    },
    AFRICA: {
        label: "Africa",
        code: "AF",
        accent: "bg-[#C8843A]",
        soft: "bg-[#FFF4E8] text-[#A86425]",
        description: "광활한 대지와 독특한 생태계가 펼쳐진 대륙이에요.",
    },
    OCEANIA: {
        label: "Oceania",
        code: "OC",
        accent: "bg-[#7C6FD6]",
        soft: "bg-[#F3F1FF] text-[#6558C8]",
        description: "섬과 바다, 여유로운 자연이 매력적인 대륙이에요.",
    },
    ANTARCTICA: {
        label: "Antarctica",
        code: "AN",
        accent: "bg-[#94A3B8]",
        soft: "bg-[#F1F5F9] text-[#64748B]",
        description: "얼음과 극지 환경으로 이루어진 특별한 대륙이에요.",
    },
};

export const getContinentStyle = (continentCode: string) =>
    continentStyle[continentCode.toUpperCase() as keyof typeof continentStyle] ?? {
        label: continentCode,
        code: continentCode.slice(0, 2).toUpperCase(),
        accent: "bg-[#94A3B8]",
        soft: "bg-[#F8FAFC] text-[#64748B]",
        description: "여행에 필요한 강의를 확인해 보세요.",
    };