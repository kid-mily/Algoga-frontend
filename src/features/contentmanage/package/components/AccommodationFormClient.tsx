"use client";

import AdminErrorBanner from "@/features/common/components/AdminErrorBanner";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CompleteModal from "@/features/common/components/CompleteModal";
import {
  createAccommodation,
  getAccommodation,
  updateAccommodation,
} from "@/features/services/adminPackage.service";
import { getCourseCountries } from "@/features/services/adminCourse.service";
import { getErrorMessage } from "@/features/services/error.service";
import { CourseCountry } from "../types";

interface AccommodationFormClientProps {
  mode: "create" | "edit";
  accommodationId?: string;
}

export default function AccommodationFormClient({
  mode,
  accommodationId,
}: AccommodationFormClientProps) {
  const router = useRouter();
  const imageInputId = "accommodation-image-file";
  const [countries, setCountries] = useState<CourseCountry[]>([]);
  const [countryId, setCountryId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [nights, setNights] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [completeOpen, setCompleteOpen] = useState(false);
  const submitControllerRef = useRef<AbortController | null>(null);
  const imagePreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const countryData = await getCourseCountries(controller.signal);
        if (controller.signal.aborted) return;
        setCountries(countryData);
        setCountryId((prev) => prev || String(countryData[0]?.countryId || ""));

        if (mode === "edit" && accommodationId) {
          const accommodation = await getAccommodation(
            accommodationId,
            controller.signal
          );
          if (controller.signal.aborted) return;
          setCountryId(String(accommodation.countryId || countryData[0]?.countryId || ""));
          setName(accommodation.name);
          setAddress(accommodation.address);
          setDescription(accommodation.description);
          setPricePerNight(String(accommodation.pricePerNight || ""));
          setNights(String(accommodation.nights || ""));
          setCurrentImageUrl(accommodation.imageUrl || "");
        }
      } catch (fetchError: unknown) {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(fetchError, "숙소 정보를 불러오지 못했습니다."));
      } finally {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      }
    };

    void fetchInitialData();

    return () => {
      controller.abort();
    };
  }, [mode, accommodationId]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    return () => {
      submitControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);

    const numericPricePerNight = Number(pricePerNight);
    const numericNights = Number(nights);

    if (
      !countryId ||
      !name.trim() ||
      !address.trim() ||
      numericPricePerNight <= 0 ||
      numericNights <= 0 ||
      (mode === "create" && !imageFile)
    ) {
      return;
    }

    const payload = {
      countryId: Number(countryId),
      name: name.trim(),
      address: address.trim(),
      description: description.trim(),
      pricePerNight: numericPricePerNight,
      nights: numericNights,
      image: imageFile,
    };

    submitControllerRef.current?.abort();
    const submitController = new AbortController();
    submitControllerRef.current = submitController;

    try {
      setIsSubmitting(true);
      setError("");

      if (mode === "edit" && accommodationId) {
        await updateAccommodation(
          accommodationId,
          payload,
          submitController.signal
        );
      } else {
        await createAccommodation(payload, submitController.signal);
      }

      if (submitController.signal.aborted) return;
      setCompleteOpen(true);
    } catch (submitError: unknown) {
      if (submitController.signal.aborted) return;
      setError(getErrorMessage(submitError, "숙소 저장에 실패했습니다."));
    } finally {
      if (!submitController.signal.aborted) {
      setIsSubmitting(false);
      }
    }
  };

  const countryError = hasSubmitted && !countryId ? "국가를 선택해주세요." : "";
  const nameError = hasSubmitted && !name.trim() ? "숙소명을 입력해주세요." : "";
  const addressError =
    hasSubmitted && !address.trim() ? "주소를 입력해주세요." : "";
  const priceError =
    hasSubmitted && Number(pricePerNight) <= 0
      ? "1박 가격을 입력해주세요."
      : "";
  const nightsError =
    hasSubmitted && Number(nights) <= 0 ? "숙박일수를 입력해주세요." : "";
  const imageError =
    hasSubmitted && mode === "create" && !imageFile
      ? "숙소 이미지를 선택해주세요."
      : "";

  if (isLoading) {
    return (
      <section className="rounded-[20px] border border-[#E4E7EC] bg-white p-8 text-center text-[14px] text-[#667085]">
        숙소 정보를 불러오는 중입니다...
      </section>
    );
  }

  return (
    <>
      <AdminErrorBanner message={error} className="mb-4" />

      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border border-[#E4E7EC] bg-white"
      >
        <section className="grid grid-cols-2 gap-5 p-7">
          <label>
            <span className="text-[15px] font-semibold text-[#111827]">국가 *</span>
            <select
              value={countryId}
              onChange={(event) => setCountryId(event.target.value)}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            >
              {countries.map((country) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
            {countryError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {countryError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">숙소명 *</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="도쿄 신주쿠 그랜드 호텔"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {nameError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {nameError}
              </p>
            )}
          </label>

          <label className="col-span-2">
            <span className="text-[15px] font-semibold text-[#111827]">주소 *</span>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="숙소 주소를 입력하세요"
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {addressError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {addressError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">1박 가격 *</span>
            <input
              type="number"
              min={0}
              value={pricePerNight}
              onChange={(event) => setPricePerNight(event.target.value)}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {priceError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {priceError}
              </p>
            )}
          </label>

          <label>
            <span className="text-[15px] font-semibold text-[#111827]">숙박일수 *</span>
            <input
              type="number"
              min={1}
              value={nights}
              onChange={(event) => setNights(event.target.value)}
              className="mt-3 h-[52px] w-full rounded-[16px] border border-[#E4E7EC] px-4 text-[15px] outline-none"
            />
            {nightsError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {nightsError}
              </p>
            )}
          </label>

          <section className="col-span-2">
            <span
              id="accommodation-image-label"
              className="text-[15px] font-semibold text-[#111827]"
            >
              숙소 이미지 {mode === "create" ? "*" : ""}
            </span>
            <div className="mt-3 flex min-h-[52px] w-full flex-col items-center justify-center rounded-[16px] border border-[#E4E7EC] px-4 py-3">
              <input
                id={imageInputId}
                type="file"
                accept="image/*"
                aria-labelledby="accommodation-image-label"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] || null)
                }
                className="sr-only"
              />
              <label
                htmlFor={imageInputId}
                className="inline-flex h-[36px] cursor-pointer items-center justify-center rounded-[10px] bg-[#439A97] px-5 text-[14px] font-semibold text-white transition hover:opacity-90"
              >
                파일 선택
              </label>
              <p className="mt-2 max-w-full truncate text-center text-[13px] text-[#667085]">
                {imageFile?.name || "선택된 파일 없음"}
              </p>
            </div>
            {mode === "edit" && currentImageUrl && !imagePreviewUrl && (
              <p className="mt-2 text-[13px] text-[#667085]">
                새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
              </p>
            )}
            {imageError && (
              <p className="mt-2 text-[13px] font-medium text-[#DC2626]">
                {imageError}
              </p>
            )}
          </section>

          {(imagePreviewUrl || currentImageUrl) && (
            <figure className="col-span-2 rounded-[16px] border border-[#E4E7EC] bg-[#F9FAFB] p-4">
              <Image
                src={imagePreviewUrl || currentImageUrl}
                alt="숙소 이미지 미리보기"
                width={960}
                height={220}
                className="h-[220px] w-full rounded-[12px] object-cover"
                unoptimized
              />
              <figcaption className="mt-2 text-[13px] text-[#667085]">
                {imagePreviewUrl ? "새로 선택한 이미지" : "현재 등록된 이미지"}
              </figcaption>
            </figure>
          )}

          <label className="col-span-2">
            <span className="text-[15px] font-semibold text-[#111827]">설명</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="숙소 설명을 입력하세요"
              className="mt-3 h-[120px] w-full resize-none rounded-[16px] border border-[#E4E7EC] px-4 py-4 text-[15px] outline-none"
            />
          </label>
        </section>

        <footer className="flex items-center justify-end gap-3 border-t border-[#E4E7EC] px-7 py-5">
          <button
            type="button"
            onClick={() => router.push("/contentadmin/accommodations")}
            className="h-[48px] rounded-[14px] border border-[#E4E7EC] px-7 text-[15px] font-semibold text-[#344054]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[48px] rounded-[14px] bg-[#439A97] px-7 text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-[#D0D5DD]"
          >
            {isSubmitting ? "저장 중..." : mode === "create" ? "등록하기" : "수정하기"}
          </button>
        </footer>
      </form>

      <CompleteModal
        open={completeOpen}
        title={mode === "create" ? "등록 완료" : "수정 완료"}
        description={
          mode === "create"
            ? "숙소 등록이 완료되었습니다."
            : "숙소 수정이 완료되었습니다."
        }
        buttonText="확인"
        onConfirm={() => router.push("/contentadmin/accommodations")}
      />
    </>
  );
}
