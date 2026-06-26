import { CourseQuiz, CourseQuizAnswer } from "./types";

export const getQuizOptions = (quiz: CourseQuiz) => [
    quiz.option1,
    quiz.option2,
    quiz.option3,
    quiz.option4,
];

export const createQuizAnswers = (
    quizzes: CourseQuiz[],
    selections: Record<number, number>
    ): CourseQuizAnswer[] | null => {
    const answers = quizzes.map((quiz) => ({
        quizId: quiz.quizId,
        selectedOption: selections[quiz.quizId],
    }));

    const invalid = answers.some(
        ({ selectedOption }) =>
        selectedOption === undefined ||
        selectedOption < 1 ||
        selectedOption > 4
    );

    if (invalid) return null;

    return answers as CourseQuizAnswer[];
};