export const getImageUrl = (
  // TODO unfortunate coupling with pagebuilder internals - see NXT-1295
  // TODO: UIEXT-887 We don't want to have to access the store here.
  store: any,
  resourceInfo: { baseUrl: string; path: string },
) =>
  store.getters["api/uiExtResourceLocation"]({
    resourceInfo,
  });

export const fetchImage = (url: string) =>
  fetch(url, { mode: "no-cors" })
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );
