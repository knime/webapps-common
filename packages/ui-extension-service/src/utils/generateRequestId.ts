let requestId = 0;

// for now we only need any kind of id, not even unique, later will need unique ones
export const generateRequestId = () => {
  requestId += 1;
  return requestId;
};
