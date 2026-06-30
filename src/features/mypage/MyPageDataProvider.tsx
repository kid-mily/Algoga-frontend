"use client";

import { createContext, useContext } from "react";
import { useMyPage } from "./hooks/userMyPage";

type MyPageDataContextValue = ReturnType<typeof useMyPage>;

const MyPageDataContext = createContext<MyPageDataContextValue | null>(null);

export function MyPageDataProvider({ children }: {
    children: React.ReactNode;
}) {
    const value = useMyPage();

    return (
        <MyPageDataContext.Provider value={value}>
            {children}
        </MyPageDataContext.Provider>
    );
}

export function useMyPageData() {
    const context = useContext(MyPageDataContext);

    if (!context) {
        throw new Error("useMyPageData는 MyPageDataProvider 안에서만 사용할 수 있습니다.");
    }

    return context;
}