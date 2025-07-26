import { describe, expect, it } from "vitest";

import { cleanRedundantChanges } from "../../utils/cleanRedundantChanges";

describe("cleanRedundantChanges", () => {
  it("should remove changes that match original locale values", () => {
    const pendingChanges = {
      en: {
        title: "Hello",
        description: "World",
      },
    };

    const locales = {
      en: {
        title: "Hello",
        description: "Different",
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      en: {
        description: "World",
      },
    });
  });

  it("should handle nested object changes", () => {
    const pendingChanges = {
      en: {
        navigation: {
          home: "Home",
          about: "About",
        },
        footer: {
          copyright: "2023",
        },
      },
    };

    const locales = {
      en: {
        navigation: {
          home: "Home",
          about: "Different",
        },
        footer: {
          copyright: "2023",
        },
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      en: {
        navigation: {
          about: "About",
        },
      },
    });
  });

  it("should remove entire language if no changes remain", () => {
    const pendingChanges = {
      en: {
        title: "Hello",
        description: "World",
      },
      fr: {
        title: "Bonjour",
      },
    };

    const locales = {
      en: {
        title: "Hello",
        description: "World",
      },
      fr: {
        title: "Different",
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      fr: {
        title: "Bonjour",
      },
    });
  });

  it("should handle missing locale data", () => {
    const pendingChanges = {
      en: {
        title: "Hello",
      },
      fr: {
        title: "Bonjour",
      },
    };

    const locales = {
      en: {
        title: "Hello",
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      fr: {
        title: "Bonjour",
      },
    });
  });

  it("should handle deeply nested objects", () => {
    const pendingChanges = {
      en: {
        ui: {
          forms: {
            validation: {
              required: "Required",
              email: "Invalid email",
            },
          },
        },
      },
    };

    const locales = {
      en: {
        ui: {
          forms: {
            validation: {
              required: "Required",
              email: "Different email",
            },
          },
        },
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      en: {
        ui: {
          forms: {
            validation: {
              email: "Invalid email",
            },
          },
        },
      },
    });
  });

  it("should return empty object when all changes match originals", () => {
    const pendingChanges = {
      en: {
        title: "Hello",
        description: "World",
      },
    };

    const locales = {
      en: {
        title: "Hello",
        description: "World",
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({});
  });

  it("should handle empty pending changes", () => {
    const pendingChanges = {};
    const locales = {
      en: {
        title: "Hello",
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({});
  });

  it("should handle null and undefined values", () => {
    const pendingChanges = {
      en: {
        title: null,
        description: undefined,
        content: "Text",
      },
    };

    const locales = {
      en: {
        title: null,
        description: "Different",
        content: "Text",
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      en: {
        description: undefined,
      },
    });
  });

  it("should handle mixed primitive and object values", () => {
    const pendingChanges = {
      en: {
        title: "Hello",
        metadata: {
          author: "John",
          tags: ["tag1"],
        },
        count: 42,
      },
    };

    const locales = {
      en: {
        title: "Hello",
        metadata: {
          author: "Different",
          tags: ["tag1"],
        },
        count: 24,
      },
    };

    const result = cleanRedundantChanges(pendingChanges, locales);

    expect(result).toEqual({
      en: {
        metadata: {
          author: "John",
        },
        count: 42,
      },
    });
  });
});