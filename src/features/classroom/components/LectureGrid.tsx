import LectureCard from "./LectureCard";
import { CourseItem } from "./types";


interface Props {
    lectures: CourseItem[];
    continentCode: string;
    countryId: string;
}

export default function LectureGrid({
    lectures,
    continentCode,
    countryId,
    }: Props) {

    return (
        <div className="grid grid-cols-3 gap-5">
        {lectures.map((lecture) => (
            <LectureCard
            key={lecture.courseId}
            lecture={lecture}
            continentCode={continentCode}
            countryId={countryId}
            />
        ))}
    </div>
    );
}