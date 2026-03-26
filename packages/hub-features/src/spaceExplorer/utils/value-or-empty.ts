export const valueOrEmpty = <T>(condition: boolean, value: T) =>
  condition ? [value] : [];
