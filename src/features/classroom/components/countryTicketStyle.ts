export const continentTicketStyle = {
    ASIA: { accent: "bg-[#439A97]", soft: "bg-[#EEF8F7]", text: "text-[#357F7C]" },
    EUROPE: { accent: "bg-[#4F7FD9]", soft: "bg-[#F0F5FF]", text: "text-[#416AB8]" },
    NORTH_AMERICA: { accent: "bg-[#D6A640]", soft: "bg-[#FFF8E8]", text: "text-[#A87512]" },
    SOUTH_AMERICA: { accent: "bg-[#D96A5B]", soft: "bg-[#FFF1EF]", text: "text-[#BC4F43]" },
    AFRICA: { accent: "bg-[#C8843A]", soft: "bg-[#FFF4E8]", text: "text-[#A86425]" },
    OCEANIA: { accent: "bg-[#7C6FD6]", soft: "bg-[#F3F1FF]", text: "text-[#6558C8]" },
    ANTARCTICA: { accent: "bg-[#94A3B8]", soft: "bg-[#F1F5F9]", text: "text-[#64748B]" },
};

export const getCountryTicketStyle = (continentCode: string) =>
    continentTicketStyle[
        continentCode.toUpperCase() as keyof typeof continentTicketStyle
    ] ?? {
        accent: "bg-[#94A3B8]",
        soft: "bg-[#F8FAFC]",
        text: "text-[#64748B]",
    };