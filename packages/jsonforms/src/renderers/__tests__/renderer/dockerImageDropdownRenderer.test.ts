import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("DockerImageDropdown", () => {
  const schema = {
    type: "object",
    properties: {
      dockerImageName: {
        oneOf: [
          {
            const: "image-1",
            title: "Docker Image 1",
          },
          {
            const: "image-2",
            title: "Docker Image 2",
          },
        ],
      },
    },
  };

  it("renders DockerImageDropdown", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dockerImageName",
      options: {
        format: "dockerImageDropdown",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe(
      "DockerImageDropdownRenderer",
    );
  });
});
