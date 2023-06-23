export const getImageUrl = (
    store:any,
    resourceInfo: {baseUrl: string, path:string }
) => store.getters['api/uiExtResourceLocation']({
    resourceInfo
});

export const fetchImage = (url: string) => fetch(url, { mode: 'no-cors' })
    .then(response => response.blob())
    .then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }));
