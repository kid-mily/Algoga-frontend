// 나라 선택

import CountrySelectHeader from "@/features/classroom/CountrySelectHeader";
import CountrySelectForm from "@/features/classroom/CountrySelectSection";

export default function CountrySelectPage() {
    return (
        <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
            <div className="w-full max-w-5xl mx-auto pt-32 pb-20 px-4">
                <CountrySelectHeader/>
                <div className="w-full mx-auto mt-10">
                    <CountrySelectForm/>
                </div>
            </div>
        </div>
    );
}