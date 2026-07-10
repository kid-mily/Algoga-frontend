"use client";

import { useCallback, useState } from "react";

export const useLoginRequiredModal = () => {
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);

  const openLoginRequiredModal = useCallback(() => {
    setIsLoginRequiredOpen(true);
  }, []);

  const closeLoginRequiredModal = useCallback(() => {
    setIsLoginRequiredOpen(false);
  }, []);

  return {
    isLoginRequiredOpen,
    openLoginRequiredModal,
    closeLoginRequiredModal,
  };
};
