// 강의

"use client";

import { useRouter } from "next/navigation";
import { CourseItem, LEVEL_COLORS } from "./types";

interface Props {
    lecture: CourseItem;
    continentCode: string;
    countryId: string;
}

export default function LectureCard({lecture, continentCode, countryId}: Props) {
    const router = useRouter();

    const levelText = lecture.levelName || lecture.level;
    const levelClass = LEVEL_COLORS[levelText] || "bg-gray-500";
    
    const handleCardClick = () => {
        router.push(`/classroom/${continentCode}/${countryId}/lecture/${lecture.courseId}`);
    };

    return (
        <div
        onClick={handleCardClick}
        className="bg-white rounded-3xl overflow-hidden border cursor-pointer hover:shadow-md transition-shadow"
        >
            <img
                src={lecture.thumbnailUrl}
                alt={lecture.title}
                className="w-full h-30 object-cover"
            />
            <div className="p-5">
                <span
                    className={`text-white text-xs px-2 py-1 rounded ${levelClass}`}
                >
                    {levelText}
                </span>
                <h3 className="mt-3 font-bold">{lecture.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{lecture.description}</p>
                <p className="mt-4 font-bold text-[#439A97]">
                    {lecture.price.toLocaleString()}원
                </p>
            </div>
        </div>
    );
}