import CharCounter from "@/features/common/components/CharCounter";
import { LectureQuizDraftErrors } from "../types";

const QUIZ_QUESTION_MAX_LENGTH = 500;
const QUIZ_OPTION_MAX_LENGTH = 200;
const QUIZ_EXPLANATION_MAX_LENGTH = 1000;

const labels = ["A", "B", "C", "D"];

type QuizDraftItemProps = {
  index: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  errors?: LectureQuizDraftErrors;
  onQuestionChange: (value: string) => void;
  onOptionChange: (optionIndex: number, value: string) => void;
  onCorrectOptionChange: (optionNumber: number) => void;
  onExplanationChange: (value: string) => void;
  onRemove?: () => void;
};

export default function QuizDraftItem({
  index,
  question,
  options,
  correctOption,
  explanation,
  errors,
  onQuestionChange,
  onOptionChange,
  onCorrectOptionChange,
  onExplanationChange,
  onRemove,
}: QuizDraftItemProps) {
  return (
    <article className="rounded-[16px] border border-[#E4E7EC] p-5">
      <header className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#111827]">퀴즈 {index + 1}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[13px] font-semibold text-[#98A2B3] hover:text-[#DC2626]"
          >
            삭제
          </button>
        )}
      </header>

      <div className="mt-4">
        <label
          htmlFor={`lecture-quiz-question-${index}`}
          className="text-[14px] font-semibold text-[#111827]"
        >
          문제 *
        </label>
        <textarea
          id={`lecture-quiz-question-${index}`}
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="퀴즈 문제를 입력하세요"
          maxLength={QUIZ_QUESTION_MAX_LENGTH}
          aria-invalid={Boolean(errors?.question)}
          className={`mt-3 h-[100px] w-full resize-none rounded-[14px] border p-4 text-[14px] outline-none transition-colors ${
            errors?.question
              ? "border-[#DC2626] bg-[#FEF2F2]"
              : "border-[#E4E7EC] focus:border-[#439A97]"
          }`}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors?.question ? (
            <p className="text-[13px] font-medium text-[#DC2626]">{errors.question}</p>
          ) : (
            <span />
          )}
          <CharCounter length={question.length} maxLength={QUIZ_QUESTION_MAX_LENGTH} />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-[14px] font-semibold text-[#111827]">객관식 보기 *</legend>
        <div className="mt-3 space-y-3">
          {options.map((option, optionIndex) => {
            const optionNumber = optionIndex + 1;
            const isSelected = correctOption === optionNumber;
            const optionError = errors?.options?.[optionIndex];

            return (
              <div key={labels[optionIndex]} className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onCorrectOptionChange(optionNumber)}
                  aria-label={`${optionNumber}번 보기를 정답으로 선택`}
                  aria-pressed={isSelected}
                  className={`mt-[3px] flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                    isSelected ? "bg-[#439A97] text-white" : "bg-[#F2F4F7] text-[#667085]"
                  }`}
                >
                  {labels[optionIndex]}
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(event) => onOptionChange(optionIndex, event.target.value)}
                    placeholder={`${optionNumber}번 보기`}
                    maxLength={QUIZ_OPTION_MAX_LENGTH}
                    aria-invalid={Boolean(optionError)}
                    className={`h-[44px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition-colors ${
                      optionError
                        ? "border-[#DC2626] bg-[#FEF2F2]"
                        : "border-[#E4E7EC] focus:border-[#439A97]"
                    }`}
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {optionError ? (
                      <p className="text-[12px] font-medium text-[#DC2626]">{optionError}</p>
                    ) : (
                      <span />
                    )}
                    <CharCounter length={option.length} maxLength={QUIZ_OPTION_MAX_LENGTH} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {errors?.correctOption && (
          <p className="mt-2 text-[13px] font-medium text-[#DC2626]">{errors.correctOption}</p>
        )}
      </fieldset>

      <div className="mt-4">
        <label
          htmlFor={`lecture-quiz-explanation-${index}`}
          className="text-[14px] font-semibold text-[#111827]"
        >
          해설
        </label>
        <textarea
          id={`lecture-quiz-explanation-${index}`}
          value={explanation}
          onChange={(event) => onExplanationChange(event.target.value)}
          placeholder="정답 힌트나 해설을 입력하세요"
          maxLength={QUIZ_EXPLANATION_MAX_LENGTH}
          className="mt-3 h-[90px] w-full resize-none rounded-[14px] border border-[#E4E7EC] p-4 text-[14px] outline-none focus:border-[#439A97]"
        />
        <div className="mt-1 flex justify-end">
          <CharCounter length={explanation.length} maxLength={QUIZ_EXPLANATION_MAX_LENGTH} />
        </div>
      </div>
    </article>
  );
}
