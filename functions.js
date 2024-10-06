function generateRandomId(userContext, events, done) {
  // Generate a random ID between 1 and 1000
  const randomId = Math.floor(Math.random() * 1000) + 1;
  userContext.vars.id = randomId.toString();
  return done();
}

module.exports = {
  generateRandomId
};