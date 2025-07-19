/// <reference types="vitest" />
/// <reference types="vitest/globals" />

// Explicitly declare the vi namespace for TypeScript
declare namespace vi {
  function fn(): any;
  function mock(path: string, factory?: () => any): any;
  function clearAllMocks(): void;

  // Define Mock as a type that extends Function, so it can be used with function types
  type Mock<T = any> = {
    (...args: any[]): any;
    mockResolvedValueOnce(value: any): Mock<T>;
    mockRejectedValueOnce(error: Error): Mock<T>;
  };
}
