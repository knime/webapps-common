import type { PossibleValue } from "../types/ChoicesUiSchema";
import type Result from "./types/Result";

type GetChoices = (params: {
  method: "getChoices";
  options: [
    /**
     * name of the class of the ChoicesProvider
     */
    string,
  ];
}) => Promise<Result<PossibleValue[]>>;

export default (getChoices: GetChoices) => (choicesProviderClass: string) => {
  return getChoices({
    method: "getChoices",
    options: [choicesProviderClass],
  });
};
