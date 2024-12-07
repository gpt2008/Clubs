import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import App from "layout/MainLayout";

test("renders learn react link", () => {
	const { getByText } = render(<App />);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
