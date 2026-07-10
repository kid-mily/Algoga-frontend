import type {
  CreateCommunityPostPayload,
  UpdateCommunityPostPayload,
} from "@/features/community/types";

export const createCommunityPostFormData = ({
  title,
  content,
  countryId,
  tagType,
  customTags = [],
  images = [],
}: CreateCommunityPostPayload) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);
  if (countryId) {
    formData.append("countryId", String(countryId));
  }
  formData.append("category", tagType);
  customTags.forEach((tag) => formData.append("customTags", tag));
  images.forEach((image) => formData.append("images", image));

  return formData;
};

export const createCommunityPostUpdateFormData = ({
  existingImageUrls = [],
  deletedImageUrls = [],
  ...payload
}: UpdateCommunityPostPayload) => {
  const formData = createCommunityPostFormData(payload);

  existingImageUrls.forEach((imageUrl) => formData.append("existingImageUrls", imageUrl));
  deletedImageUrls.forEach((imageUrl) => formData.append("deletedImageUrls", imageUrl));

  return formData;
};
