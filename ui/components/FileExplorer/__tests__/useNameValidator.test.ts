import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useNameValidator } from "../useNameValidator";

describe("useNameValidator", () => {
  const blacklistedNames = ["foo", "bar"];

  it("should check for invalid characters", () => {
    const name = ref("");
    const { isValid, errorMessage } = useNameValidator({
      blacklistedNames: ref(blacklistedNames),
      name,
    });

    expect(errorMessage.value).toBe("");
    expect(isValid.value).toBe(true);

    name.value = "&*9a?/\\sdasd";

    expect(isValid.value).toBe(false);
    expect(errorMessage.value).toMatch("Name contains invalid characters");
  });

  it("should check for name collision", () => {
    const name = ref("foo");
    const { isValid, errorMessage } = useNameValidator({
      blacklistedNames: ref(blacklistedNames),
      name,
    });

    expect(isValid.value).toBe(false);
    expect(errorMessage.value).toMatch("Name is already in use");
  });

  it("should check for name character limit", () => {
    const newName = new Array(256)
      .fill(0)
      .map((_) => "a")
      .join("");
    const name = ref(newName);

    const { isValid, errorMessage } = useNameValidator({
      blacklistedNames: ref(blacklistedNames),
      name,
    });

    expect(isValid.value).toBe(false);
    expect(errorMessage.value).toMatch("exceeds 255 characters");
  });

  it("should check invalid leading dots (.)", () => {
    const name = ref("...some text.");

    const { isValid, errorMessage } = useNameValidator({
      blacklistedNames: ref(blacklistedNames),
      name,
    });

    expect(isValid.value).toBe(false);
    expect(errorMessage.value).toMatch("Name cannot start with a dot (.)");
  });

  it("should check invalid trailing dots (.)", () => {
    const name = ref("some text..");

    const { isValid, errorMessage } = useNameValidator({
      blacklistedNames: ref(blacklistedNames),
      name,
    });

    expect(isValid.value).toBe(false);
    expect(errorMessage.value).toMatch("Name cannot end with a dot (.)");
  });

  it("should return a function to clean name from leading and trailing spaces", () => {
    const name = ref("   some text    ");

    const { isValid, cleanName } = useNameValidator({
      blacklistedNames: ref(blacklistedNames),
      name,
    });

    expect(isValid.value).toBe(true);
    expect(cleanName(name.value)).toMatch("some text");
  });
});
