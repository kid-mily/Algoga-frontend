import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import CountryProfitabilitySummaryCards from "@/features/statisticadmin/country-profitability-summary/components/CountryProfitabilitySummaryCards";
import CountryProfitabilityTable from "@/features/statisticadmin/country-profitability-summary/components/CountryProfitabilityTable";
import type { CountryProfitabilityItem } from "@/features/statisticadmin/country-profitability-summary/types";

const createCountry = (
  index: number
): CountryProfitabilityItem => ({
  countryName: `국가 ${index}`,
  bookingCount: index * 10,
  grossRevenue: index * 1_000_000,
  netRevenue: index * 800_000,
  refundRate: 4,
  balanceConversionRate: 75,
  cancelRate: 3,
  share: index,
});

const commonTableProps = {
  search: "",
  onSearchChange: jest.fn(),
  onDownloadCsv: jest.fn(),
};

describe("나라별 수익성 컴포넌트 테스트", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("요약 카드에 국가 수, 순매출, 환불율을 표시한다", ()=> {
        render(
            <CountryProfitabilitySummaryCards
                summary={{
                    countryCount: 5,
                    totalNetRevenue: 85_000_000,
                    averageRefundRate:4.5,
                }} 
            />
        );

        expect(
            screen.getByText("집계 국가 수")
        ).toBeVisible();
        expect(screen.getByText("5개국")).toBeVisible();

        expect(
            screen.getByText("총 순매출")
        ).toBeVisible();

        expect(
            screen.getByText("8,500만원")
        ).toBeVisible();

         expect(
            screen.getByText("평균 환불율")
        ).toBeVisible();
        expect(screen.getByText("4.5%")).toBeVisible();
    });
    test("나라별 수익성 데이터를 표시한다", () => {
    render(
      <CountryProfitabilityTable
        data={[
          {
            countryName: "일본",
            bookingCount: 50,
            grossRevenue: 50_000_000,
            netRevenue: 42_000_000,
            refundRate: 4,
            balanceConversionRate: 75,
            cancelRate: 3,
            share: 35,
          },
        ]}
        {...commonTableProps}
      />
    );

    expect(screen.getByText("일본")).toBeVisible();
    expect(screen.getByText("50")).toBeVisible();
    expect(
      screen.getByText("5,000만원")
    ).toBeVisible();
    expect(
      screen.getByText("4,200만원")
    ).toBeVisible();
    expect(screen.getByText("4%")).toBeVisible();
    expect(screen.getByText("75%")).toBeVisible();
    expect(screen.getByText("3%")).toBeVisible();
    expect(screen.getByText("35%")).toBeVisible();
  });

  test("검색어 변경을 부모 컴포넌트에 전달한다", () => {
    const onSearchChange = jest.fn();

    render(
        <CountryProfitabilityTable
            data={[]}
            search=""
            onSearchChange={onSearchChange}
            onDownloadCsv={jest.fn()}
        />
    );

    fireEvent.change(
        screen.getByPlaceholderText("국가 검색..."),
        {
            target: {
                value: "일본",
            },
        }
    );

    expect(onSearchChange).toHaveBeenCalledWith(
        "일본"
    );
});
 test("CSV 버튼 클릭을 부모 컴포넌트에 전달한다", () => {
    const onDownloadCsv = jest.fn();

    render(
      <CountryProfitabilityTable
        data={[]}
        search=""
        onSearchChange={jest.fn()}
        onDownloadCsv={onDownloadCsv}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CSV",
      })
    );

    expect(onDownloadCsv).toHaveBeenCalledTimes(1);
  });

  test("로딩 중에는 로딩 문구를 표시한다", () => {
    render(
      <CountryProfitabilityTable
        data={[]}
        {...commonTableProps}
        isLoading
      />
    );

    expect(
      screen.getByText(
        "나라별 수익성 목록을 불러오는 중입니다..."
      )
    ).toBeVisible();
  });

  test("데이터가 없으면 빈 상태를 표시한다", () => {
    render(
      <CountryProfitabilityTable
        data={[]}
        {...commonTableProps}
        isLoading={false}
      />
    );

    expect(
      screen.getByText(
        "조회된 나라별 수익성 데이터가 없습니다."
      )
    ).toBeVisible();
  });
  
  test("10개를 초과하면 다음 페이지로 이동할 수 있다.", ()=>{
    const countries = Array.from(
        {length: 11},
        (_, index) => createCountry(index+1)
    );

    render(
        <CountryProfitabilityTable
            data={countries}
            {...commonTableProps}
        />
    );

    expect(
        screen.getByText("국가 1")
    ).toBeVisible();
    expect(
        screen.queryByText("국가 11")
    ).not.toBeInTheDocument();

    expect(
        screen.getByText("총 11개 · 1/2 페이지")
    ).toBeVisible();

    fireEvent.click(
        screen.getByRole("button",{
            name: "다음 페이지",
        })
    );
    expect(
      screen.getByText("국가 11")
    ).toBeVisible();
    expect(
      screen.queryByText("국가 1")
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("총 11개 · 2/2 페이지")
    ).toBeVisible();
});

  test("첫 페이지에서는 이전 페이지 버튼이 비활성화된다", () => {
    render(
      <CountryProfitabilityTable
        data={[
          createCountry(1),
          createCountry(2),
        ]}
        {...commonTableProps}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "이전 페이지",
      })
    ).toBeDisabled();
  });

  test("마지막 페이지에서는 다음 페이지 버튼이 비활성화된다", () => {
    const countries = Array.from(
      { length: 11 },
      (_, index) => createCountry(index + 1)
    );

    render(
      <CountryProfitabilityTable
        data={countries}
        {...commonTableProps}
      />
    );

    const nextButton = screen.getByRole("button", {
      name: "다음 페이지",
    });

    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();
  });

  test("데이터가 변경되면 첫 페이지로 돌아간다", async () => {
    const countries = Array.from(
      { length: 11 },
      (_, index) => createCountry(index + 1)
    );

    const { rerender } = render(
      <CountryProfitabilityTable
        data={countries}
        {...commonTableProps}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "다음 페이지",
      })
    );

    expect(
      screen.getByText("총 11개 · 2/2 페이지")
    ).toBeVisible();

    rerender(
      <CountryProfitabilityTable
        data={[
          {
            ...createCountry(100),
            countryName: "새 검색 결과",
          },
        ]}
        search="새 검색"
        onSearchChange={jest.fn()}
        onDownloadCsv={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("총 1개 · 1/1 페이지")
      ).toBeVisible();
    });

    expect(
      screen.getByText("새 검색 결과")
    ).toBeVisible();
  });

  test("100%를 초과한 점유율 막대는 100%로 제한한다", () => {
    const { container } = render(
      <CountryProfitabilityTable
        data={[
          {
            ...createCountry(1),
            countryName: "이상 데이터",
            share: 120,
          },
        ]}
        {...commonTableProps}
      />
    );

    const cappedProgressBar =
      container.querySelector(
        'span[style="width: 100%;"]'
      );

    expect(cappedProgressBar).toBeInTheDocument();
    expect(screen.getByText("120%")).toBeVisible();
  });
});