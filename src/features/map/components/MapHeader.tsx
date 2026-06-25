import { CONTINENT_NAME_KO } from "../constants/mapConstants";

interface MapHeaderProps {
    selectedContinent: string;
    selectedCountry: string;
    onReset: () => void;
}

export default function MapHeader({
    selectedContinent,
    selectedCountry,
    onReset,
}: MapHeaderProps) {
    const title = !selectedContinent
        ? "대륙을 선택하세요"
        : selectedCountry
        ? selectedCountry
        : `${CONTINENT_NAME_KO[selectedContinent] ?? selectedContinent} 국가 선택`;

    return (
        <header className="z-[1000] border-b bg-white">
            <div className="flex items-center justify-between p-4">
                <p className="text-sm font-semibold text-gray-600">{title}</p>

                {selectedContinent ? (
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >
                        대륙 보기
                    </button>
                ) : null}
            </div>
        </header>
    );
}