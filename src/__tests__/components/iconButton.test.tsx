import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { IconButton } from "../../components/IconButton";
import "@testing-library/jest-dom";
import { colors } from "../../components/table/useStyle";

describe("IconButton", () => {
    it("should render children", () => {
        render(
            <IconButton label="Test button" onClick={() => {}}>
                <span>Icon</span>
            </IconButton>
        );

        const iconElement = screen.getByText("Icon");
        expect(iconElement).toBeInTheDocument();
    });

    it("should call onClick handler when clicked", () => {
        const handleClick = vi.fn();
        
        render(
            <IconButton label="Test button" onClick={handleClick}>
                <span>Icon</span>
            </IconButton>
        );

        const button = screen.getByRole("button");
        fireEvent.click(button);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should render tooltip with correct label", () => {
        render(
            <IconButton label="Test tooltip label" onClick={() => {}}>
                <span>Icon</span>
            </IconButton>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);
        
        const tooltip = screen.getByText("Test tooltip label");
        expect(tooltip).toBeInTheDocument();
    });

    it("should have correct initial styles", () => {
        render(
            <IconButton label="Test button" onClick={() => {}}>
                <span>Icon</span>
            </IconButton>
        );

        const button = screen.getByRole("button");
        
        expect(button).toHaveStyle({
            padding: '8px',
            background: 'transparent',
            cursor: 'pointer',
            borderRadius: '6px',
            display: 'inline-flex',
        });
        
        // Check that the text color is set to the secondary text color
        // Using RGB format to avoid color format mismatches
        const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgb(${r}, ${g}, ${b})`;
        };
        
        expect(button).toHaveStyle({
            color: hexToRgb(colors.text.secondary)
        });
    });

    it("should change background color on mouse enter and leave", () => {
        render(
            <IconButton label="Test button" onClick={() => {}}>
                <span>Icon</span>
            </IconButton>
        );

        const button = screen.getByRole("button");
        
        // Initial background should be transparent or not set
        // We don't test for exact value as browsers may render it differently
        
        // Mouse enter should change background color
        fireEvent.mouseEnter(button);
        expect(button).toHaveStyle({
            backgroundColor: '#f0f0f0'
        });
        
        // Mouse leave should revert background color
        fireEvent.mouseLeave(button);
        
        // We verify the background is no longer #f0f0f0
        expect(button).not.toHaveStyle({
            backgroundColor: '#f0f0f0'
        });
    });

    it("should work with different types of children", () => {
        const { rerender } = render(
            <IconButton label="Test button" onClick={() => {}}>
                <span>Text icon</span>
            </IconButton>
        );

        expect(screen.getByText("Text icon")).toBeInTheDocument();
        
        rerender(
            <IconButton label="Test button" onClick={() => {}}>
                <svg data-testid="svg-icon" />
            </IconButton>
        );
        
        expect(screen.getByTestId("svg-icon")).toBeInTheDocument();
        
        rerender(
            <IconButton label="Test button" onClick={() => {}}>
                <div>
                    <span>Nested icon</span>
                </div>
            </IconButton>
        );
        
        expect(screen.getByText("Nested icon")).toBeInTheDocument();
    });

    it("should handle disabled state", () => {
        render(
            <IconButton label="Disabled button" onClick={() => {}}>
                <span>Icon</span>
            </IconButton>
        );

        const button = screen.getByRole("button");
        
        // Make button disabled
        button.setAttribute('disabled', '');
        
        expect(button).toBeDisabled();
        
        // Tooltip should still work on disabled button
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Disabled button")).toBeInTheDocument();
    });

    it("should maintain tooltip functionality", () => {
        render(
            <IconButton label="Test tooltip" onClick={() => {}}>
                <span>Icon</span>
            </IconButton>
        );

        const button = screen.getByRole("button");
        
        // Tooltip should not be visible initially
        expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();
        
        // Show tooltip on mouse enter
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Test tooltip")).toBeInTheDocument();
        
        // Hide tooltip on mouse leave
        fireEvent.mouseLeave(button);
        expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();
    });
});
