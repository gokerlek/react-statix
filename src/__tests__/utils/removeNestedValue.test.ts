import { describe, expect, it } from "vitest";

import { removeNestedValue } from "../../utils";

describe("removeNestedValue", () => {
  it("should remove top-level property", () => {
    const obj = {
      title: "Hello",
      description: "World",
      count: 42,
    };

    const result = removeNestedValue(obj, "title");

    expect(result).toEqual({
      description: "World",
      count: 42,
    });
    expect(obj).toEqual({
      title: "Hello",
      description: "World", 
      count: 42,
    }); // Original should be unchanged
  });

  it("should remove nested property", () => {
    const obj = {
      navigation: {
        home: "Home",
        about: "About",
      },
      footer: {
        copyright: "2023",
      },
    };

    const result = removeNestedValue(obj, "navigation.home");

    expect(result).toEqual({
      navigation: {
        about: "About",
      },
      footer: {
        copyright: "2023",
      },
    });
  });

  it("should remove deeply nested property", () => {
    const obj = {
      ui: {
        forms: {
          validation: {
            required: "Required",
            email: "Invalid email",
          },
          labels: {
            name: "Name",
          },
        },
      },
    };

    const result = removeNestedValue(obj, "ui.forms.validation.email");

    expect(result).toEqual({
      ui: {
        forms: {
          validation: {
            required: "Required",
          },
          labels: {
            name: "Name",
          },
        },
      },
    });
  });

  it("should clean up empty parent objects", () => {
    const obj = {
      navigation: {
        header: {
          title: "Header",
        },
      },
      footer: {
        copyright: "2023",
      },
    };

    const result = removeNestedValue(obj, "navigation.header.title");

    expect(result).toEqual({
      footer: {
        copyright: "2023",
      },
    });
  });

  it("should not clean up parent objects that still have properties", () => {
    const obj = {
      navigation: {
        header: {
          title: "Header",
          subtitle: "Subtitle",
        },
      },
    };

    const result = removeNestedValue(obj, "navigation.header.title");

    expect(result).toEqual({
      navigation: {
        header: {
          subtitle: "Subtitle",
        },
      },
    });
  });

  it("should return original object when path doesn't exist", () => {
    const obj = {
      title: "Hello",
      description: "World",
    };

    const result = removeNestedValue(obj, "nonexistent.path");

    expect(result).toBe(obj);
  });

  it("should return original object when intermediate path is null", () => {
    const obj = {
      navigation: null,
      footer: {
        copyright: "2023",
      },
    };

    const result = removeNestedValue(obj, "navigation.header.title");

    expect(result).toBe(obj);
  });

  it("should return original object when intermediate path is not an object", () => {
    const obj = {
      navigation: "string value",
      footer: {
        copyright: "2023",
      },
    };

    const result = removeNestedValue(obj, "navigation.header.title");

    expect(result).toBe(obj);
  });

  it("should handle empty path", () => {
    const obj = {
      title: "Hello",
    };

    const result = removeNestedValue(obj, "");

    expect(result).toBe(obj);
  });

  it("should handle null object", () => {
    const result = removeNestedValue(null, "title");

    expect(result).toBe(null);
  });

  it("should handle undefined object", () => {
    const result = removeNestedValue(undefined, "title");

    expect(result).toBe(undefined);
  });

  it("should handle removing property that doesn't exist at final level", () => {
    const obj = {
      navigation: {
        header: {
          title: "Header",
        },
      },
    };

    const result = removeNestedValue(obj, "navigation.header.nonexistent");

    expect(result).toEqual({
      navigation: {
        header: {
          title: "Header",
        },
      },
    });
  });

  it("should create deep copies without mutating original", () => {
    const obj = {
      level1: {
        level2: {
          target: "remove me",
          keep: "keep me",
        },
        other: "data",
      },
    };

    const result = removeNestedValue(obj, "level1.level2.target");

    // Check result is correct
    expect(result).toEqual({
      level1: {
        level2: {
          keep: "keep me",
        },
        other: "data",
      },
    });

    // Check original is unchanged
    expect(obj.level1.level2.target).toBe("remove me");
    
    // Check objects are different references
    expect(result).not.toBe(obj);
    expect(result.level1).not.toBe(obj.level1);
    expect(result.level1.level2).not.toBe(obj.level1.level2);
  });

  it("should handle complex cleanup scenario", () => {
    const obj = {
      a: {
        b: {
          c: {
            d: "target",
          },
        },
        sibling: "keep",
      },
    };

    const result = removeNestedValue(obj, "a.b.c.d");

    expect(result).toEqual({
      a: {
        sibling: "keep",
      },
    });
  });
});
