import {
  COMPANION_LABEL,
  COMPANION_OPTIONS,
  PREFERENCE_LABEL,
  PREFERENCE_OPTIONS,
  PURPOSE_LABEL,
  PURPOSE_OPTIONS,
  type Companion,
  type TravelPreference,
  type TravelPurpose,
} from "../types";

interface PreferenceFormProps {
  preferences: TravelPreference[];
  purpose: TravelPurpose | null;
  companion: Companion | null;
  budget: string;
  headcount: string;
  onTogglePreference: (preference: TravelPreference) => void;
  onPurposeChange: (purpose: TravelPurpose) => void;
  onCompanionChange: (companion: Companion) => void;
  onBudgetChange: (value: string) => void;
  onHeadcountChange: (value: string) => void;
}

// 여행 유형과 무관하게 항상 입력받는 공통 필드: 취향(다중)/목적/동행자/예산/인원수
export default function PreferenceForm({
  preferences,
  purpose,
  companion,
  budget,
  headcount,
  onTogglePreference,
  onPurposeChange,
  onCompanionChange,
  onBudgetChange,
  onHeadcountChange,
}: PreferenceFormProps) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-bold text-[#0A1628]">
          여행 취향 <span className="text-xs font-normal text-[#8A9BB0]">(1개 이상 선택)</span>
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PREFERENCE_OPTIONS.map((preference) => {
            const active = preferences.includes(preference);

            return (
              <button
                key={preference}
                type="button"
                onClick={() => onTogglePreference(preference)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "border-[#439A97] bg-[#EEF8F7] text-[#439A97]"
                    : "border-[#E1E8EF] text-[#718096] hover:bg-[#F3F8FC]"
                }`}
              >
                {PREFERENCE_LABEL[preference]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-[#0A1628]">여행 목적</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {PURPOSE_OPTIONS.map((option) => {
            const active = option === purpose;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onPurposeChange(option)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "border-[#439A97] bg-[#EEF8F7] text-[#439A97]"
                    : "border-[#E1E8EF] text-[#718096] hover:bg-[#F3F8FC]"
                }`}
              >
                {PURPOSE_LABEL[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-[#0A1628]">동행자</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMPANION_OPTIONS.map((option) => {
            const active = option === companion;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onCompanionChange(option)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "border-[#439A97] bg-[#EEF8F7] text-[#439A97]"
                    : "border-[#E1E8EF] text-[#718096] hover:bg-[#F3F8FC]"
                }`}
              >
                {COMPANION_LABEL[option]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold text-[#0A1628]">
            총예산(원)
          </label>
          <input
            type="number"
            min={1}
            value={budget}
            onChange={(event) => onBudgetChange(event.target.value)}
            placeholder="예: 1000000"
            className="mt-1.5 h-11 w-full rounded-xl border border-[#E1E8EF] px-3 text-sm outline-none focus:border-[#439A97]"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-[#0A1628]">인원수</label>
          <input
            type="number"
            min={1}
            value={headcount}
            onChange={(event) => onHeadcountChange(event.target.value)}
            placeholder="예: 2"
            className="mt-1.5 h-11 w-full rounded-xl border border-[#E1E8EF] px-3 text-sm outline-none focus:border-[#439A97]"
          />
        </div>
      </div>
    </div>
  );
}
