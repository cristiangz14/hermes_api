module.exports = function(decoded, request, callback) {
  // This is a simple check that the `sub` claim
  // exists in the access token. Modify it to suit
  // the needs of your application
  
  if (decoded && decoded.sub) {
    return callback(null, true, {
      scope: decoded.scope.split(' ')
    });
  }

  return callback(null, false);
}
