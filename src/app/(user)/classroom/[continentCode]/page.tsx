// 나라 선택

import CountrySelectHeader from "@/features/classroom/components/CountrySelectHeader";
import CountrySelectForm from "@/features/classroom/components/CountrySelectSection";

export default function CountrySelectPage() {
    return (
        <div className="p-10 w-full min-h-screen bg-[#f5f6f8]">
            <div className="w-full max-w-4xl mx-auto pt-4 px-4">
                <CountrySelectHeader/>
                <div className="w-full mx-auto mt-10">
                    <CountrySelectForm/>
                </div>
            </div>
        </div>
    );
}