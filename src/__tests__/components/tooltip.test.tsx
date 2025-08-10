import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "../../components/Tooltip";
import "@testing-library/jest-dom";

describe("Tooltip", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render children", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Test Button");
    });

    it("should not show tooltip initially", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();
    });

    it("should show tooltip on mouse enter", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        expect(screen.getByText("Test tooltip")).toBeInTheDocument();
    });

    it("should hide tooltip on mouse leave", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");

        // Show tooltip
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Test tooltip")).toBeInTheDocument();

        // Hide tooltip
        fireEvent.mouseLeave(button);
        expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();
    });

    it("should have correct container structure", () => {
        const { container } = render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const tooltipContainer = container.firstChild as HTMLElement;
        expect(tooltipContainer).toHaveStyle({
            position: 'relative',
            display: 'inline-block',
        });
    });

    it("should render tooltip with correct styles when visible", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText("Test tooltip");

        // Test key positioning and layout styles
        expect(tooltip).toHaveStyle({
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
        });

        // Test that tooltip is visible and has color
        expect(tooltip).toBeVisible();
        expect(tooltip).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    });

    it("should render tooltip arrow when visible", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText("Test tooltip");

        // The arrow is a child div of the tooltip
        const arrow = tooltip.querySelector('div');

        expect(arrow).toBeInTheDocument();
        expect(arrow).toHaveStyle({
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
        });
    });

    it("should handle multiple show/hide cycles", () => {
        render(
            <Tooltip label="Test tooltip">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");

        // First cycle
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Test tooltip")).toBeInTheDocument();

        fireEvent.mouseLeave(button);
        expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();

        // Second cycle
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Test tooltip")).toBeInTheDocument();

        fireEvent.mouseLeave(button);
        expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();

        // Third cycle
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Test tooltip")).toBeInTheDocument();
    });

    it("should work with different types of children", () => {
        const { rerender } = render(
            <Tooltip label="Button tooltip">
                <button>Button</button>
            </Tooltip>
        );

        expect(screen.getByRole("button")).toBeInTheDocument();

        rerender(
            <Tooltip label="Div tooltip">
                <div>Div content</div>
            </Tooltip>
        );

        expect(screen.getByText("Div content")).toBeInTheDocument();

        rerender(
            <Tooltip label="Span tooltip">
                <span>Span content</span>
            </Tooltip>
        );

        expect(screen.getByText("Span content")).toBeInTheDocument();
    });

    it("should handle empty label gracefully", () => {
        render(
            <Tooltip label="">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        // Find the tooltip container by looking for a div with tooltip styles
        const tooltipContainer = button.parentElement;
        const tooltipDiv = tooltipContainer?.querySelector('div[style*="position: absolute"]');

        expect(tooltipDiv).toBeInTheDocument();
        expect(tooltipDiv).toHaveTextContent("");
    });

    it("should handle special characters in label", () => {
        const specialLabel = "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";

        render(
            <Tooltip label={specialLabel}>
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });

    it("should handle long labels", () => {
        const longLabel = "This is a very long tooltip label that might wrap or cause layout issues";

        render(
            <Tooltip label={longLabel}>
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText(longLabel);
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveStyle({ whiteSpace: 'nowrap' });
    });

    it("should handle multiple children", () => {
        render(
            <Tooltip label="Multiple children tooltip">
                <button>Button 1</button>
                <button>Button 2</button>
            </Tooltip>
        );

        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent("Button 1");
        expect(buttons[1]).toHaveTextContent("Button 2");
    });

    it("should trigger tooltip on any child when multiple children exist", () => {
        render(
            <Tooltip label="Multiple children tooltip">
                <div>
                    <button>Button 1</button>
                    <span>Text content</span>
                </div>
            </Tooltip>
        );

        const container = screen.getByText("Button 1").parentElement;
        fireEvent.mouseEnter(container!);

        expect(screen.getByText("Multiple children tooltip")).toBeInTheDocument();
    });

    it("should maintain tooltip position relative to container", () => {
        render(
            <Tooltip label="Position test">
                <button style={{ width: '200px', height: '50px' }}>Large Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText("Position test");

        // Tooltip should be positioned above the button (bottom: 100%)
        // and centered horizontally (left: 50%, transform: translateX(-50%))
        expect(tooltip).toHaveStyle({
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
        });
    });

    it("should not interfere with child component functionality", () => {
        const handleClick = vi.fn();

        render(
            <Tooltip label="Click tooltip">
                <button onClick={handleClick}>Clickable Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");

        // Button should still be clickable
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);

        // Tooltip should work independently
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Click tooltip")).toBeInTheDocument();
    });

    it("should handle rapid mouse enter/leave events", () => {
        render(
            <Tooltip label="Rapid test">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");

        // Rapid mouse events
        for (let i = 0; i < 5; i++) {
            fireEvent.mouseEnter(button);
            fireEvent.mouseLeave(button);
        }

        // Final state should be hidden
        expect(screen.queryByText("Rapid test")).not.toBeInTheDocument();

        // Final show should work
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Rapid test")).toBeInTheDocument();
    });

    it("should render with correct z-index for layering", () => {
        render(
            <Tooltip label="Z-index test">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText("Z-index test");

        // Check that z-index is set (value might be string or number)
        const zIndex = getComputedStyle(tooltip).zIndex;
        expect(parseInt(zIndex)).toBeGreaterThan(999);
    });

    it("should handle disabled children appropriately", () => {
        render(
            <Tooltip label="Disabled tooltip">
                <button disabled>Disabled Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        expect(button).toBeDisabled();

        // Tooltip should still work on disabled elements
        fireEvent.mouseEnter(button);
        expect(screen.getByText("Disabled tooltip")).toBeInTheDocument();
    });

    it("should work with React fragments as children", () => {
        render(
            <Tooltip label="Fragment tooltip">
                <>
                    <span>Fragment child 1</span>
                    <span>Fragment child 2</span>
                </>
            </Tooltip>
        );

        expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
        expect(screen.getByText("Fragment child 2")).toBeInTheDocument();

        // Test tooltip functionality with fragments
        const container = screen.getByText("Fragment child 1").parentElement;
        fireEvent.mouseEnter(container!);
        expect(screen.getByText("Fragment tooltip")).toBeInTheDocument();
    });

    it("should handle focus events on focusable children", () => {
        render(
            <Tooltip label="Focus tooltip">
                <input type="text" placeholder="Test input" />
            </Tooltip>
        );

        const input = screen.getByPlaceholderText("Test input");

        // Focus should not show tooltip (only mouse events do)
        input.focus();
        expect(screen.queryByText("Focus tooltip")).not.toBeInTheDocument();

        // But mouse enter should still work
        fireEvent.mouseEnter(input);
        expect(screen.getByText("Focus tooltip")).toBeInTheDocument();
    });

    it("should have detailed style verification", () => {
        render(
            <Tooltip label="Style test">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText("Style test");

        // Test individual style properties that are most important
        expect(tooltip).toHaveStyle('position: absolute');
        expect(tooltip).toHaveStyle('bottom: 100%');
        expect(tooltip).toHaveStyle('left: 50%');
        expect(tooltip).toHaveStyle('transform: translateX(-50%)');

        // Test that background and text colors are applied
        const computedStyle = getComputedStyle(tooltip);
        expect(computedStyle.backgroundColor).toBeTruthy();
        expect(computedStyle.color).toBeTruthy();
        expect(computedStyle.padding).toBeTruthy();
        expect(computedStyle.borderRadius).toBeTruthy();
    });

    it("should properly handle tooltip arrow structure", () => {
        render(
            <Tooltip label="Arrow test">
                <button>Test Button</button>
            </Tooltip>
        );

        const button = screen.getByRole("button");
        fireEvent.mouseEnter(button);

        const tooltip = screen.getByText("Arrow test");

        // Check that the tooltip has the expected structure
        expect(tooltip).toBeInTheDocument();

        // The arrow should be a child element
        const children = tooltip.children;
        expect(children.length).toBe(1);

        const arrow = children[0] as HTMLElement;
        expect(arrow.tagName).toBe('DIV');
        expect(arrow).toHaveStyle('position: absolute');
        expect(arrow).toHaveStyle('top: 100%');
    });
});
