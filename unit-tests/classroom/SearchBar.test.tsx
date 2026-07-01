import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/features/classroom/components/SearchBar";

describe("SearchBar", () => {
    test("입력값이 바뀌면 onChange가 호출된다", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();
        const onSearch = jest.fn();

        render(<SearchBar value="" onChange={onChange} onSearch={onSearch} />);

        await user.type(screen.getByRole("textbox"), "일본");

        expect(onChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenLastCalledWith("본");
    });

    test("검색 버튼을 클릭하면 onSearch가 호출된다", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();
        const onSearch = jest.fn();

        render(<SearchBar value="일본" onChange={onChange} onSearch={onSearch} />);

        await user.click(screen.getByRole("button"));

        expect(onSearch).toHaveBeenCalledTimes(1);
    });

    test("Enter 키를 누르면 onSearch가 호출된다", async () => {
        const user = userEvent.setup();
        const onChange = jest.fn();
        const onSearch = jest.fn();

        render(<SearchBar value="일본" onChange={onChange} onSearch={onSearch} />);

        await user.type(screen.getByRole("textbox"), "{Enter}");

        expect(onSearch).toHaveBeenCalledTimes(1);
    });
});