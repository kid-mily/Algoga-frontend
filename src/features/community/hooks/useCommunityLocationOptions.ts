import { useEffect, useState } from "react";
import { getCommunityCountries } from "@/features/services/community.service";
import { getRequestErrorMessage } from "@/features/community/utils/communityErrors";
import type { CommunityContinent, CommunityCountry } from "@/features/community/types";

export const useCommunityLocationOptions = (
  isEditMode: boolean,
  onError: (message: string) => void
) => {
  const [continents, setContinents] = useState<CommunityContinent[]>([]);
  const [countries, setCountries] = useState<CommunityCountry[]>([]);
  const [continentCode, setContinentCode] = useState("");
  const [countryId, setCountryId] = useState("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadCountries = async () => {
      if (!continentCode) {
        setCountries([]);
        setCountryId("");
        return;
      }

      try {
        setIsLoadingCountries(true);
        if (!isEditMode) {
          setCountryId("");
        }
        const data = await getCommunityCountries(continentCode, controller.signal);
        setCountries(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          onError(getRequestErrorMessage(error, "국가 목록을 불러오지 못했습니다."));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCountries(false);
        }
      }
    };

    void loadCountries();

    return () => {
      controller.abort();
    };
  }, [continentCode, isEditMode, onError]);

  // 수정 모드 초기 로드 시, 게시글에 저장된 대륙/국가로 한 번에 복원
  const restoreSelection = (
    nextContinentCode: string,
    nextCountries: CommunityCountry[],
    nextCountryId: string
  ) => {
    setContinentCode(nextContinentCode);
    setCountries(nextCountries);
    setCountryId(nextCountryId);
  };

  return {
    continents,
    setContinents,
    countries,
    continentCode,
    countryId,
    isLoadingCountries,
    setContinentCode,
    setCountryId,
    restoreSelection,
  };
};
