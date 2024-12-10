const getDeepActiveElement = () => {
  let element = document?.activeElement;
  while (element?.shadowRoot) {
    element = element?.shadowRoot?.activeElement;
  }
  return element;
};

export default getDeepActiveElement;
