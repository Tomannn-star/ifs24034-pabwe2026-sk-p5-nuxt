import { describe, it, expect } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("should initialize with default empty string", () => {
    const [value] = useInput();
    expect(value.value).toBe("");
  });

  it("should initialize with provided initial value", () => {
    const [value] = useInput("test");
    expect(value.value).toBe("test");
  });

  it("should update value via onValueChange with event object", () => {
    const [value, onChange] = useInput("");
    onChange({ target: { value: "hello" } });
    expect(value.value).toBe("hello");
  });

  it("should update value via onValueChange with direct value", () => {
    const [value, onChange] = useInput("");
    onChange("direct-value");
    expect(value.value).toBe("direct-value");
  });

  it("should update value via setValue directly", () => {
    const [value, , setValue] = useInput("init");
    setValue("new-value");
    expect(value.value).toBe("new-value");
  });
});

