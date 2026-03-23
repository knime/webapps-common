export const renameItem = ({
  id,
  newName,
}: {
  id: string;
  newName: string;
}) => {
  // TODO
  return Promise.resolve();
  //   if (!this.item?.canonicalPath) {
  //     consola.error(
  //       "renameItem failed: current folder is not set or has no canonicalPath",
  //     );
  //     return;
  //   }
  //   const catalogRepository = useCatalogRepository();
  //   const targetCanonicalPath = `${this.item.canonicalPath}/${newName}`;
  //   await requestAction({
  //     request: async () => {
  //       await catalogRepository.moveRepositoryItem({
  //         id,
  //         canonicalPath: targetCanonicalPath,
  //       });
  //     },
  //     toastService: { show: useToasts().show },
  //     errorNotificationKey: "renameItemKey",
  //   });
};
