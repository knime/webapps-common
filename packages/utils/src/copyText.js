export const copyText = (text) => {
  let tmpElement = document.createElement("textarea");
  tmpElement.style = "position:fixed;pointer-events:none;opacity:0;";
  tmpElement.setAttribute("readonly", "");
  tmpElement.value = text;
  document.body.appendChild(tmpElement);
  tmpElement.select();
  document.execCommand("copy");
  document.body.removeChild(tmpElement);
};
