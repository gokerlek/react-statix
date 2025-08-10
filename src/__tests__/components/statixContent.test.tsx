import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatixContent } from "../../components/StatixContent";
import "@testing-library/jest-dom";
import { colors } from "../../components/table/useStyle";

describe("StatixContent", () => {
    it("should render children when provided", () => {
        render(
            <StatixContent isOpen={true}>
                <div data-testid="test-child">Test Content</div>
            </StatixContent>
        );

        const childElement = screen.getByTestId("test-child");
        expect(childElement).toBeInTheDocument();
        expect(childElement).toHaveTextContent("Test Content");
    });

    it("should render without children", () => {
        const { container } = render(<StatixContent isOpen={true} />);
        
        // The component should render a div even without children
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toHaveStyle({
            position: "fixed",
            width: "100%",
            height: "70vh",
        });
    });

    it("should position at bottom of screen when isOpen is true", () => {
        const { container } = render(<StatixContent isOpen={true} />);
        
        const contentDiv = container.firstChild as HTMLElement;
        expect(contentDiv).toHaveStyle({
            bottom: "0",
        });
    });

    it("should position below viewport when isOpen is false", () => {
        const { container } = render(<StatixContent isOpen={false} />);
        
        const contentDiv = container.firstChild as HTMLElement;
        expect(contentDiv).toHaveStyle({
            bottom: "-70vh",
        });
    });

    it("should have correct styles applied", () => {
        const { container } = render(<StatixContent isOpen={true} />);
        
        const contentDiv = container.firstChild as HTMLElement;
        
        // Test key style properties
        expect(contentDiv).toHaveStyle({
            position: "fixed",
            width: "100%",
            height: "70vh",
            zIndex: 100000,
            padding: "20px",
        });
        
        // Convert hex color to RGB to avoid format mismatches
        const hexToRgb = (hex: string) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgb(${r}, ${g}, ${b})`;
        };
        
        expect(contentDiv).toHaveStyle({
            backgroundColor: hexToRgb(colors.bg.body),
        });
    });

    it("should work with different types of children", () => {
        const { rerender } = render(
            <StatixContent isOpen={true}>
                <span>Text content</span>
            </StatixContent>
        );

        expect(screen.getByText("Text content")).toBeInTheDocument();
        
        rerender(
            <StatixContent isOpen={true}>
                <svg data-testid="svg-content" />
            </StatixContent>
        );
        
        expect(screen.getByTestId("svg-content")).toBeInTheDocument();
        
        rerender(
            <StatixContent isOpen={true}>
                <div>
                    <button>Nested button</button>
                </div>
            </StatixContent>
        );
        
        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("Nested button")).toBeInTheDocument();
    });

    it("should have transition style for smooth animation", () => {
        const { container } = render(<StatixContent isOpen={true} />);
        
        const contentDiv = container.firstChild as HTMLElement;
        expect(contentDiv).toHaveStyle({
            transition: "bottom 0.3s ease-in-out",
        });
    });
});
