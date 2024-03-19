
function get_ln() {
  const error = new Error();
  const stackLines = error.stack.split('\n');
  // Extract the third line, which contains the information about the calling function and line number
  const callingFunctionLine = stackLines[2].trim();
  // Extract the line number from the calling function information
  const lineNumber = callingFunctionLine.match(/:(\d+):/)[1];
  return `Line ${lineNumber}`;
}

export {get_ln}