import { describe, expect, it } from "vitest";

import {
  getFileExtension,
  getFileMimeType,
  knimeFileFormats,
} from "../fileExtensions";

describe("fileExtensions", () => {
  const textFile = new File(["mock file"], "mock-file.txt", {
    type: "text/plain",
  });

  const csvFile = new File(["mock file"], "mock-file.csv", {
    type: "text/csv",
  });

  const fileWithoutExtension = new File(["mock file"], "mock-file", {
    type: "",
  });

  const fileWithSomeRandomExtension = new File(
    ["mock file"],
    "mock-file.random",
    {
      type: "",
    },
  );

  const knwfFile = new File(["mock file"], "workflow.knwf", {
    type: "",
  });

  const knarFile = new File(["mock file"], "workflow.knar", {
    type: "",
  });

  describe("getFileExtension", () => {
    it("should get extension from file name", () => {
      expect(getFileExtension(textFile.name)).toBe("txt");
      expect(getFileExtension(csvFile.name)).toBe("csv");
      expect(getFileExtension(fileWithoutExtension.name)).toBe("");
      expect(getFileExtension(fileWithSomeRandomExtension.name)).toBe("random");
      expect(getFileExtension(knwfFile.name)).toBe("knwf");
      expect(getFileExtension(knarFile.name)).toBe("knar");
    });

    it("should get extension from file path", () => {
      expect(getFileExtension(`/some/path/to/file/${textFile.name}`)).toBe(
        "txt",
      );

      expect(
        getFileExtension(`/some/path/to/file/${fileWithoutExtension.name}`),
      ).toBe("");
    });
  });

  describe("getFileMimeType", () => {
    it("should get correct mimeType", () => {
      expect(getFileMimeType(textFile)).toBe("text/plain");
      expect(getFileMimeType(csvFile)).toBe("text/csv");
      expect(getFileMimeType(fileWithoutExtension)).toBe(
        "application/octet-stream",
      );
      expect(getFileMimeType(fileWithSomeRandomExtension)).toBe(
        "application/octet-stream",
      );
      expect(getFileMimeType(knwfFile)).toBe(
        "application/vnd.knime.workflow+zip",
      );
      expect(getFileMimeType(knarFile)).toBe(
        "application/vnd.knime.workflow-group+zip",
      );
    });
  });

  describe("knimeFormats", () => {
    it("matches knwf correctly", () => {
      expect(knimeFileFormats.KNWF.matches(textFile)).toBe(false);
      expect(knimeFileFormats.KNWF.matches(csvFile)).toBe(false);
      expect(knimeFileFormats.KNWF.matches(fileWithoutExtension)).toBe(false);
      expect(knimeFileFormats.KNWF.matches(fileWithSomeRandomExtension)).toBe(
        false,
      );
      expect(knimeFileFormats.KNWF.matches(knwfFile)).toBe(true);
      expect(knimeFileFormats.KNWF.matches(knarFile)).toBe(false);
    });

    it("matches knar correctly", () => {
      expect(knimeFileFormats.KNAR.matches(textFile)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(csvFile)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(fileWithoutExtension)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(fileWithSomeRandomExtension)).toBe(
        false,
      );
      expect(knimeFileFormats.KNAR.matches(knwfFile)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(knarFile)).toBe(true);
    });
  });
});
