import { useKdsDynamicModal } from "@knime/kds-components";

type NameCollisionHandling = "OVERWRITE" | "CANCEL" | "AUTORENAME";

export const usePromptCollisionStrategies = () => {
  const { askConfirmation } = useKdsDynamicModal();

  const promptCollisionStrategies =
    async (): Promise<NameCollisionHandling> => {
      let strategy: NameCollisionHandling = "CANCEL";

      const prompt = () =>
        askConfirmation({
          headline: "Name conflict",
          message:
            "An item of this name already exists in this location. Overwrite the existing item(s) or keep all by renaming automatically?",
          buttons: [
            {
              type: "cancel",
              label: "Cancel",
              variant: "transparent",
              flushLeft: true,
            },
            {
              type: "confirm",
              label: "Overwrite",
              variant: "outlined",
              customHandler: ({ confirm }) => {
                strategy = "OVERWRITE";
                confirm();
              },
            },
            {
              type: "confirm",
              variant: "filled",
              autofocus: true,
              label: "Rename",
              customHandler: ({ confirm }) => {
                strategy = "AUTORENAME";
                confirm();
              },
            },
          ],
        });

      await prompt();
      return strategy;
    };

  return {
    promptCollisionStrategies,
  };
};
