import React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { act, render, RenderResult } from "@testing-library/react";

import { StatixContext, StatixProvider } from "../context/StatixProvider";
import { loadLocaleFiles } from "../utils/loadLocales";

import "@testing-library/jest-dom";

// Mock the loadLocaleFiles utility
vi.mock("../utils/loadLocales", () => ({
  loadLocaleFiles: vi.fn().mockResolvedValue({
    en: { test: { key: "English Text" } },
    tr: { test: { key: "Turkish Text" } },
  }),
}));

// Test component to consume the context
const TestConsumer = () => {
  const context = React.useContext(StatixContext);
  if (!context) throw new Error("Context not provided");

  return (
    <div>
      <div data-testid="editable">{context.editable.toString()}</div>
      <div data-testid="locales">{JSON.stringify(context.locales)}</div>
      <div data-testid="pendingChanges">
        {JSON.stringify(context.pendingChanges)}
      </div>
      <button
        data-testid="toggleEditable"
        onClick={() => context.setEditable(!context.editable)}
      >
        Toggle Editable
      </button>
      <button
        data-testid="updateValue"
        onClick={() =>
          context.updateLocalValue("en", "test.key", "Updated Value")
        }
      >
        Update Value
      </button>
      <button data-testid="resetChanges" onClick={context.resetChanges}>
        Reset Changes
      </button>
      <button data-testid="saveChanges" onClick={context.saveChanges}>
        Save Changes
      </button>
    </div>
  );
};

describe("StatixProvider", () => {
  // Setup and teardown
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset mocks
    vi.clearAllMocks();
    // Mock window.confirm to return true
    vi.spyOn(window, "confirm").mockImplementation(() => true);
    // Mock window.alert
    vi.spyOn(window, "alert").mockImplementation(() => {});
    // Mock console.log
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initializes with default config", async () => {
    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Check if loadLocaleFiles was called with default config
    expect(loadLocaleFiles).toHaveBeenCalledWith({
      localePath: "public/locales",
      languagesKeys: {},
    });

    // Check if editable is true by default
    expect(getByTestId("editable").textContent).toBe("true");

    // Check if locales are loaded
    const localesContent = JSON.parse(
      getByTestId("locales").textContent || "{}",
    );
    expect(localesContent).toEqual({
      en: { test: { key: "English Text" } },
      tr: { test: { key: "Turkish Text" } },
    });

    // Check if pendingChanges is empty by default
    expect(getByTestId("pendingChanges").textContent).toBe("{}");
  });

  test("initializes with custom config", async () => {
    const customConfig = {
      localePath: "custom/path",
      languagesKeys: { en: "English", tr: "Turkish" },
    };

    await act(async () => {
      render(
        <StatixProvider config={customConfig}>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    // Check if loadLocaleFiles was called with custom config
    expect(loadLocaleFiles).toHaveBeenCalledWith(customConfig);
  });

  test("toggles editable state", async () => {
    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Initially editable should be true
    expect(getByTestId("editable").textContent).toBe("true");

    // Toggle editable
    await act(async () => {
      getByTestId("toggleEditable").click();
    });

    // Now editable should be false
    expect(getByTestId("editable").textContent).toBe("false");
  });

  test("updates locale value", async () => {
    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Initially pendingChanges should be empty
    expect(getByTestId("pendingChanges").textContent).toBe("{}");

    // Update a value
    await act(async () => {
      getByTestId("updateValue").click();
    });

    // Now pendingChanges should contain the updated value
    const pendingChanges = JSON.parse(
      getByTestId("pendingChanges").textContent || "{}",
    );
    expect(pendingChanges).toHaveProperty("en");
    expect(pendingChanges.en).toHaveProperty("test.key", "Updated Value");

    // Check if localStorage was updated
    const storedChanges = JSON.parse(
      localStorage.getItem("localeEdits") || "{}",
    );
    expect(storedChanges).toEqual(pendingChanges);
  });

  test("resets changes", async () => {
    // Set initial localStorage value
    localStorage.setItem(
      "localeEdits",
      JSON.stringify({
        en: { "test.key": "Initial Value" },
      }),
    );

    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Initially pendingChanges should contain the value from localStorage
    const initialPendingChanges = JSON.parse(
      getByTestId("pendingChanges").textContent || "{}",
    );
    expect(initialPendingChanges).toHaveProperty("en");

    // Reset changes
    await act(async () => {
      getByTestId("resetChanges").click();
    });

    // Now pendingChanges should be empty
    expect(getByTestId("pendingChanges").textContent).toBe("{}");

    // Check if localStorage was cleared
    expect(localStorage.getItem("localeEdits")).toBeNull();
  });

  test("saves changes with default behavior", async () => {
    // Set initial pendingChanges
    localStorage.setItem(
      "localeEdits",
      JSON.stringify({
        en: { "test.key": "Value to Save" },
      }),
    );

    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Save changes
    await act(async () => {
      getByTestId("saveChanges").click();
    });

    // Check if alert was called
    expect(window.alert).toHaveBeenCalledWith("Değişiklikler hazır!");

    // Check if console.log was called with the payload
    expect(console.log).toHaveBeenCalledWith("Payload:", expect.any(Object));

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith(
      "Değişiklikler kaydedildi. Yerel önbelleği temizlemek ister misiniz?",
    );

    // Since confirm returns true, localStorage should be cleared
    expect(localStorage.getItem("localeEdits")).toBeNull();
  });

  test("saves changes with custom onSave handler", async () => {
    const customOnSave = vi.fn();
    const customConfig = {
      localePath: "public/locales",
      languagesKeys: {},
      onSave: customOnSave,
    };

    // Set initial pendingChanges
    localStorage.setItem(
      "localeEdits",
      JSON.stringify({
        en: { "test.key": "Value to Save" },
      }),
    );

    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider config={customConfig}>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Save changes
    await act(async () => {
      getByTestId("saveChanges").click();
    });

    // Check if custom onSave was called with pendingChanges
    expect(customOnSave).toHaveBeenCalledWith(expect.any(Object));

    // Alert should not be called when using custom onSave
    expect(window.alert).not.toHaveBeenCalled();
  });

  test("loads pendingChanges from localStorage on init", async () => {
    // Set initial localStorage value
    const initialChanges = {
      en: { "test.key": "Initial Value" },
    };
    localStorage.setItem("localeEdits", JSON.stringify(initialChanges));

    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // pendingChanges should contain the value from localStorage
    const pendingChanges = JSON.parse(
      getByTestId("pendingChanges").textContent || "{}",
    );
    expect(pendingChanges).toEqual(initialChanges);
  });
});
