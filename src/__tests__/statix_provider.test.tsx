import React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { act, render, RenderResult } from "@testing-library/react";

import { StatixProvider } from "../context/StatixProvider";
import { StatixContext } from "../context/StatixContext";
import { loadLocaleFiles } from "../utils/loadLocales";
import { LocalStorageKeys } from "../constants/localStorage";

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
      editable: false,
    });

    // Check if editable is false by default
    expect(getByTestId("editable").textContent).toBe("false");

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

  test("editable comes from config", async () => {
    const customConfig = {
      localePath: "public/locales",
      languagesKeys: {},
      editable: true,
    };

    let rendered!: RenderResult;

    await act(async () => {
      rendered = render(
        <StatixProvider config={customConfig}>
          <TestConsumer />
        </StatixProvider>,
      );
    });

    const { getByTestId } = rendered;

    // Editable should be true when config.editable is true
    expect(getByTestId("editable").textContent).toBe("true");
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
      localStorage.getItem(LocalStorageKeys.LOCALE_EDITS) || "{}",
    );
    expect(storedChanges).toEqual(pendingChanges);
  });

  test("resets changes", async () => {
    // Set initial localStorage value
    localStorage.setItem(
      LocalStorageKeys.LOCALE_EDITS,
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
    expect(localStorage.getItem(LocalStorageKeys.LOCALE_EDITS)).toBeNull();
  });

  test("saves changes with default behavior", async () => {
    // Set initial pendingChanges
    localStorage.setItem(
      LocalStorageKeys.LOCALE_EDITS,
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
    expect(localStorage.getItem(LocalStorageKeys.LOCALE_EDITS)).toBeNull();
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
      LocalStorageKeys.LOCALE_EDITS,
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
    localStorage.setItem(LocalStorageKeys.LOCALE_EDITS, JSON.stringify(initialChanges));

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
