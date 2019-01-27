const routes = require('next-routes');

module.exports = routes()
  .add('/users/:id', 'account');
