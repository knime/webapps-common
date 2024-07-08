/**
 * Copies the given text to the clipboard
 * @param text
 */
export const copyText = async (text: string) => {
  const type = "text/plain";
  const blob = new Blob([text], { type });
  const data = [new ClipboardItem({ [type]: blob })];
  await navigator.clipboard.write(data);
};
