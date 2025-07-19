import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchJSON } from "../utils/fetchJSON";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("fetchJSON", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return JSON data successfully", async () => {
    const mockData = { message: "Success" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValueOnce(mockData),
    });

    const result = await fetchJSON("https://api.example.com/data ");
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/data ");
  });

  it.each([
    [404, "Not Found"],
    [500, "Internal Server Error"],
    [401, "Unauthorized"],
  ])(
    "should throw error when HTTP status is %i",
    async (status, statusText) => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status,
        statusText,
      });

      await expect(fetchJSON("https://api.example.com/error ")).rejects.toThrow(
        `HTTP error! status: ${status}, url: https://api.example.com/error `,
      );
      expect(fetch).toHaveBeenCalledWith("https://api.example.com/error ");
    },
  );

  it("should throw network error", async () => {
    const networkError = new Error("Network error");
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(fetchJSON("https://api.example.com/data ")).rejects.toThrow(
      "Network error",
    );
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/data ");
  });

  it("should throw parsing error when JSON is invalid", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockRejectedValueOnce(new SyntaxError("Unexpected token")),
    });

    await expect(fetchJSON("https://api.example.com/invalid ")).rejects.toThrow(
      "Unexpected token",
    );
    expect(fetch).toHaveBeenCalledWith("https://api.example.com/invalid ");
  });
});
