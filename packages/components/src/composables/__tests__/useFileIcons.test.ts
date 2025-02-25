import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import FileIcon from "@knime/styles/img/icons/file.svg";

import { useFileIcon } from "../useFileIcons";

vi.mock("@knime/utils", async (importOriginal) => {
  const actual = await importOriginal();

  const icons = {
    csvIcon: "MockCSVComponent",
    docxIcon: "MockDocxComponent",
  };
  return {
    // @ts-expect-error Spread types may only be created from object types
    ...actual,
    icons,
    isIconExisting: (name: string) => name in icons,
  };
});

describe("useFileIcons", () => {
  it("should return the proper icon for the known extensions", () => {
    const filename1 = ref("file.csv");
    const filename2 = ref("file.docx");

    const { icon: icon1 } = useFileIcon({ filename: filename1 });
    const { icon: icon2 } = useFileIcon({ filename: filename2 });
    expect(icon1.value).toBe("MockCSVComponent");
    expect(icon2.value).toBe("MockDocxComponent");
  });

  it("should return the fallback icon when icon cannot be found", () => {
    const filename = ref("file.txt");

    const { icon } = useFileIcon({ filename });
    expect(icon.value).toEqual(FileIcon);
  });
});
