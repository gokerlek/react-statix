import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SaveStatix } from "../../components/SaveStatix";
import "@testing-library/jest-dom";

// Mock the useStatix hook
const mockSaveChanges = vi.fn();
const mockResetChanges = vi.fn();

vi.mock("../../hooks/useStatix", () => ({
    useStatix: () => ({
        saveChanges: mockSaveChanges,
        resetChanges: mockResetChanges,
    }),
}));

describe("SaveStatix", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render save and reset buttons", () => {
        render(<SaveStatix />);

        // Check for tooltip labels since actual text might be in tooltips
        const saveButton = screen.getByLabelText("Save changes");
        const resetButton = screen.getByLabelText("Reset changes");

        expect(saveButton).toBeInTheDocument();
        expect(resetButton).toBeInTheDocument();
    });

    it("should call saveChanges when save button is clicked", () => {
        render(<SaveStatix />);

        const saveButton = screen.getByLabelText("Save changes");
        fireEvent.click(saveButton);

        expect(mockSaveChanges).toHaveBeenCalledTimes(1);
    });

    it("should call resetChanges when reset button is clicked", () => {
        render(<SaveStatix />);

        const resetButton = screen.getByLabelText("Reset changes");
        fireEvent.click(resetButton);

        expect(mockResetChanges).toHaveBeenCalledTimes(1);
    });

    it("should have correct button structure", () => {
        render(<SaveStatix />);

        // Check that buttons are wrapped in a container div
        const container = screen.getByLabelText("Save changes").parentElement?.parentElement;
        expect(container).toHaveStyle({ display: 'flex' });
    });
});
