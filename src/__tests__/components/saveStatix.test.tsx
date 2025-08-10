import { describe, expect, it, vi, beforeEach } from "vitest";
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

    it("should render buttons with correct icons", () => {
        render(<SaveStatix />);

        // Check that both buttons render
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(2);

        // Check that both buttons have SVG icons
        buttons.forEach(button => {
            const svg = button.querySelector("svg");
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveAttribute("width", "16");
            expect(svg).toHaveAttribute("height", "16");
        });
    });

    it("should call correct functions when buttons are clicked", () => {
        render(<SaveStatix />);

        const [saveButton, resetButton] = screen.getAllByRole("button");
        
        // Test save button
        fireEvent.click(saveButton);
        expect(mockSaveChanges).toHaveBeenCalledTimes(1);
        expect(mockResetChanges).not.toHaveBeenCalled();
        
        // Test reset button
        fireEvent.click(resetButton);
        expect(mockResetChanges).toHaveBeenCalledTimes(1);
        expect(mockSaveChanges).toHaveBeenCalledTimes(1);
    });

    it("should display tooltips on hover", () => {
        render(<SaveStatix />);

        const [saveButton, resetButton] = screen.getAllByRole("button");

        // Initially no tooltips
        expect(screen.queryByText("Save changes")).not.toBeInTheDocument();
        expect(screen.queryByText("Reset changes")).not.toBeInTheDocument();

        // Test save button tooltip
        fireEvent.mouseEnter(saveButton);
        expect(screen.getByText("Save changes")).toBeInTheDocument();
        fireEvent.mouseLeave(saveButton);

        // Test reset button tooltip
        fireEvent.mouseEnter(resetButton);
        expect(screen.getByText("Reset changes")).toBeInTheDocument();
    });
});
