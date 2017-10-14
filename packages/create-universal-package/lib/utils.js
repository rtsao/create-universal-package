exports.toErrorStack = function(err) {
  if (err._babel) {
    return `${err.name}: ${err.message}\n${err.codeFrame}`;
  } else {
    return err.stack;
  }
}
