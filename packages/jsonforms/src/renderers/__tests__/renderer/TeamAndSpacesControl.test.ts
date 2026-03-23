import { describe, expect, it } from "vitest";

import { KdsDropdown } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import TeamAndSpacesControl from "../../../uiComponents/TeamAndSpacesControl.vue";

const possibleTeamsMock = [
  {
    id: "account:team:1",
    text: "Team 1",
  },
  {
    id: "account:team:2",
    text: "Team 5",
  },
  {
    id: "account:team:3",
    text: "Team 99",
  },
];

const possibleSpacesMock = [
  {
    id: "account:team:1",
    spaces: [
      {
        id: "*1",
        text: "Space 1",
        ownerAccountId: "account:team:1",
      },
    ],
  },
  {
    id: "account:team:2",
    spaces: [
      {
        id: "*2",
        text: "Space 2",
        ownerAccountId: "account:team:2",
      },
    ],
  },
  {
    id: "account:team:3",
    spaces: [
      {
        id: "*3",
        text: "Space 3",
        ownerAccountId: "account:team:3",
      },
    ],
  },
];

const labelForId = "myLabelForId";

describe("TeamAndSpacesControl.vue", () => {
  const doMount = ({
    data = "*2",
    possibleTeams = possibleTeamsMock,
    possibleSpaces = possibleSpacesMock,
  } = {}) => {
    const props: VueControlTestProps<typeof TeamAndSpacesControl> = {
      control: {
        ...getControlBase("scopeOrSpaceId"),
        data,
        enabled: true,
        schema: {
          type: "string",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/scopeOrSpaceId",
          options: {
            possibleTeams,
            possibleSpaces,
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: true,
    };

    const { wrapper, changeValue } = mountJsonFormsControlLabelContent(
      TeamAndSpacesControl,
      {
        props,
        stubs: {
          KdsDropdown: true,
        },
      },
    );

    const findDropdowns = () => wrapper.findAllComponents(KdsDropdown);
    const findTeamsDropdown = () => findDropdowns().at(0);
    const findSpacesDropdown = () => findDropdowns().at(1);

    return {
      wrapper,
      changeValue,
      findDropdowns,
      findTeamsDropdown,
      findSpacesDropdown,
    };
  };

  it("renders", () => {
    const { findDropdowns } = doMount();
    expect(findDropdowns().length).toBe(2);
  });

  it("sets labelForId", () => {
    const { findDropdowns } = doMount();
    const dropdowns = findDropdowns();
    expect(dropdowns?.at(0)?.attributes("aria-label")).toBe("account-id");
    expect(dropdowns?.at(1)?.attributes("aria-label")).toBe("space-id");
  });

  it("sets new values for second dropdown if first changes", async () => {
    const { findTeamsDropdown, findSpacesDropdown } = doMount();

    await findTeamsDropdown()?.vm.$emit(
      "update:modelValue",
      possibleTeamsMock[0].id,
    );

    expect(findSpacesDropdown()?.props("possibleValues")).toStrictEqual(
      possibleSpacesMock.find(({ id }) => id === possibleTeamsMock[0].id)
        ?.spaces ?? [],
    );
  });

  it("calls changeValue when space dropdown is changed", async () => {
    const { changeValue, findSpacesDropdown } = doMount();
    const newSpaceId = "*3";

    await findSpacesDropdown()?.vm.$emit("update:modelValue", newSpaceId);

    expect(changeValue).toHaveBeenCalledWith(newSpaceId);
  });

  it("sets correct initial value", () => {
    const { findTeamsDropdown, findSpacesDropdown } = doMount({
      data: "*2",
    });

    expect(findTeamsDropdown()?.props("possibleValues")).toStrictEqual(
      possibleTeamsMock,
    );

    // Initial data is "*2" which belongs to account:team:2
    const expectedTeamId = "account:team:2";
    const expectedSpaces =
      possibleSpacesMock.find(({ id }) => id === expectedTeamId)?.spaces ?? [];

    expect(findSpacesDropdown()?.props("possibleValues")).toStrictEqual(
      expectedSpaces,
    );
  });

  it("sets correct label", () => {
    const { findTeamsDropdown, findSpacesDropdown } = doMount();

    expect(findTeamsDropdown()?.props("label")).toBe("Team");
    expect(findSpacesDropdown()?.props("label")).toBe("Space");
  });

  it("sets placeholder text correctly", () => {
    const { findTeamsDropdown, findSpacesDropdown } = doMount();

    expect(findTeamsDropdown()?.props("placeholder")).toBe("No team selected");
    expect(findSpacesDropdown()?.props("placeholder")).toBe(
      "No space selected",
    );
  });

  it("disables dropdown when there are no possible values", () => {
    const { findTeamsDropdown, findSpacesDropdown } = doMount({
      possibleSpaces: [],
      possibleTeams: [],
    });

    expect(findTeamsDropdown()?.props("disabled")).toBe(true);
    expect(findSpacesDropdown()?.props("disabled")).toBe(true);
  });

  it("disables dropdown when control is not enabled", () => {
    const props: VueControlTestProps<typeof TeamAndSpacesControl> = {
      control: {
        ...getControlBase("scopeOrSpaceId"),
        data: "*2",
        enabled: false,
        schema: {
          type: "string",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/scopeOrSpaceId",
          options: {
            possibleTeams: possibleTeamsMock,
            possibleSpaces: possibleSpacesMock,
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: true,
    };

    const { wrapper } = mountJsonFormsControlLabelContent(
      TeamAndSpacesControl,
      {
        props,
        stubs: {
          KdsDropdown: true,
        },
      },
    );

    const dropdowns = wrapper.findAllComponents(KdsDropdown);
    expect(dropdowns?.at(0)?.props("disabled")).toBe(true);
    expect(dropdowns?.at(1)?.props("disabled")).toBe(true);
  });

  it("updates team dropdown when first team is selected and calls changeValue", async () => {
    const { changeValue, findTeamsDropdown } = doMount();

    await findTeamsDropdown()?.vm.$emit(
      "update:modelValue",
      possibleTeamsMock[0].id,
    );

    // When team changes, the first space of that team should be selected automatically
    const expectedSpaceId =
      possibleSpacesMock.find(({ id }) => id === possibleTeamsMock[0].id)
        ?.spaces[0]?.id ?? null;

    expect(changeValue).toHaveBeenCalledWith(expectedSpaceId);
  });
});
