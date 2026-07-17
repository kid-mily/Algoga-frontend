// 패키지 라운지 화면들을 오갈 때 courseId/continentCode 같은 선택 정보를
// 쿼리 파라미터로 계속 이어주기 위한 헬퍼 (값이 없으면 그 파라미터는 생략한다)
export function buildQueryString(
  params: Record<string, string | number | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
