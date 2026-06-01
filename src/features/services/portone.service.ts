declare global {
    interface Window {
        PortOne?: {
        requestPayment: (payload: Record<string, any>) => Promise<any>;
        };
    }
}

const PORTONE_SCRIPT_ID = "portone-browser-sdk";
const PORTONE_SCRIPT_SRC = "https://cdn.portone.io/v2/browser-sdk.js";

export const loadPortOne = async () => {
    if (typeof window === "undefined") {
        throw new Error("브라우저에서만 결제를 진행할 수 있습니다.");
    }

    if (window.PortOne) return window.PortOne;

    await new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById(PORTONE_SCRIPT_ID);
        if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("PortOne SDK 로드에 실패했습니다.")), { once: true });
        return;
    }

    const script = document.createElement("script");
    script.id = PORTONE_SCRIPT_ID;
    script.src = PORTONE_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("PortOne SDK 로드에 실패했습니다."));
    document.body.appendChild(script);
    });

    if (!window.PortOne) {
        throw new Error("PortOne SDK를 찾을 수 없습니다.");
    }

    return window.PortOne;
    };

    export const requestTossPayment = async ({
    orderName,
    totalAmount,
    customerName,
    }: {
    orderName: string;
    totalAmount: number;
    customerName?: string;
    }) => {
    const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
    const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

    if (!storeId || !channelKey) {
        throw new Error("NEXT_PUBLIC_PORTONE_STORE_ID와 NEXT_PUBLIC_PORTONE_CHANNEL_KEY를 설정해주세요.");
    }

    const PortOne = await loadPortOne();
    const paymentId = `lecture-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const result = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
        easyPay: {
        easyPayProvider: "TOSSPAY",
        },
        customer: {
        fullName: customerName || "Algoga User",
        },
    });

    if (result?.code) {
        throw new Error(result.message || "결제가 취소되었거나 실패했습니다.");
    }

    return result?.paymentId || paymentId;
};
