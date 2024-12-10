import { describe, expect, it } from "vitest";

import {
  getFileExtension,
  getFileMimeType,
  knimeFileFormats,
} from "../fileExtensions";

describe("fileExtensions", () => {
  const textFile = new File(["mock file"], "mock-text.txt", {
    type: "text/plain",
  });

  const csvFile = new File(["mock file"], "mock-csv.csv", {
    type: "text/csv",
  });

  const fileWithoutExtension = new File(["mock file"], "mock-unknown-file", {
    type: "",
  });

  const fileWithSomeCustomExtension = new File(
    ["mock file"],
    "mock-custom-file.custom",
    {
      type: "",
    },
  );

  const knwfFile = new File(["mock file"], "workflow.knwf", {
    type: "",
  });

  const knarFile = new File(["mock file"], "workflow-group.knar", {
    type: "",
  });

  describe("getFileExtension", () => {
    it("should get extension from file name", () => {
      expect(getFileExtension(textFile.name)).toBe("txt");
      expect(getFileExtension(csvFile.name)).toBe("csv");
      expect(getFileExtension(fileWithoutExtension.name)).toBe("");
      expect(getFileExtension(fileWithSomeCustomExtension.name)).toBe("custom");
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

    it("should get extension from file path with file protocol", () => {
      expect(
        getFileExtension(`file://some/path/to/file/${textFile.name}`),
      ).toBe("txt");

      expect(
        getFileExtension(
          `file://some/path/to/file/${fileWithoutExtension.name}`,
        ),
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
      expect(getFileMimeType(fileWithSomeCustomExtension)).toBe(
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
      expect(knimeFileFormats.KNWF.matches(fileWithSomeCustomExtension)).toBe(
        false,
      );
      expect(knimeFileFormats.KNWF.matches(knwfFile)).toBe(true);
      expect(knimeFileFormats.KNWF.matches(knarFile)).toBe(false);
    });

    it("matches knar correctly", () => {
      expect(knimeFileFormats.KNAR.matches(textFile)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(csvFile)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(fileWithoutExtension)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(fileWithSomeCustomExtension)).toBe(
        false,
      );
      expect(knimeFileFormats.KNAR.matches(knwfFile)).toBe(false);
      expect(knimeFileFormats.KNAR.matches(knarFile)).toBe(true);
    });

    it("should handle KNWF.getNameOrDefault", () => {
      expect(
        knimeFileFormats.KNWF.getNameOrDefault(textFile, textFile.name),
      ).toBe(textFile.name);

      expect(
        knimeFileFormats.KNWF.getNameOrDefault(textFile, "some-default"),
      ).toBe("some-default");

      expect(knimeFileFormats.KNWF.getNameOrDefault(textFile)).toBe("");

      expect(
        knimeFileFormats.KNWF.getNameOrDefault(knwfFile, "some-default"),
      ).toBe("workflow");
    });
  });
});
