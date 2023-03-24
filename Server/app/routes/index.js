
const profileRouter = require("./profile.route");
const loginRouter = require("./auth.route");

function route(app) {
  app.use('/api/v1/auth', loginRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/', () => {
    console.log('/');
  })
}

module.exports = route;