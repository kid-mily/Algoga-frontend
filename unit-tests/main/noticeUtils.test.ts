import { getMainNoticeViewModel } from "@/features/main/notice/utils/notice.utils";

describe("notice utils", () => {
    test("getMainNoticeViewModel은 공지 데이터를 메인 화면용 모델로 변환한다", () => {
        const result = getMainNoticeViewModel({
        noticeId: 1,
        tag: "NOTICE",
        title: "서비스 점검 안내",
        date: "2026-06-30",
        });

        expect(result).toMatchObject({
        noticeId: 1,
        title: "서비스 점검 안내",
        date: "2026-06-30",
        color: "gray",
        });
    });

    test("EVENT 태그는 blue 색상으로 변환된다", () => {
        const result = getMainNoticeViewModel({
        noticeId: 2,
        tag: "EVENT",
        title: "이벤트 안내",
        date: "2026-06-30",
        });

        expect(result.color).toBe("blue");
    });

    test("알 수 없는 태그는 태그 문자열을 category로 사용하고 gray 색상을 반환한다", () => {
        const result = getMainNoticeViewModel({
        noticeId: 3,
        tag: "CUSTOM",
        title: "커스텀 안내",
        date: "2026-06-30",

        });

        expect(result).toMatchObject({
        category: "CUSTOM",
        color: "gray",
        });
    });

    test("빈 태그는 fallback category를 사용한다", () => {
        const result = getMainNoticeViewModel({
        noticeId: 4,
        tag: "",
        title: "태그 없음",
        date: "2026-06-30",
        });

        expect(result.category).not.toBe("");
        expect(result.color).toBe("gray");
    });
});