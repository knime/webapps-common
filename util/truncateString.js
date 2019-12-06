const defaultMaxLength = 160;

// truncates a string to a given max length
export default (string = '', maxLength = defaultMaxLength) => {
    const dots = string.length > maxLength ? '…' : '';
    return `${string.substring(0, maxLength - 1)}${dots}`;
};
