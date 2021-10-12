'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let requestId = 0;
// for now we only need any kind of id, not even unique, later will need unique ones
const generateRequestId = () => {
    requestId += 1;
    return requestId;
};

exports.generateRequestId = generateRequestId;
