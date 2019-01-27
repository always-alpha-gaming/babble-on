/**
 * Example account management routes
 */

const { MongoClient } = require('mongodb');

let requestsCollection;
if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return user connection
  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err);
    const dbName = process.env.MONGO_URI.split('/')
      .pop()
      .split('?')
      .shift();
    const db = mongoClient.db(dbName);
    requestsCollection = db.collection('requests');
  });
}

module.exports = (expressApp) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

  // Expose a route to return user profile if logged in with a session
  expressApp.get('/requests/', (req, res) => {
    // Check user is logged in and has admin access
    if (!req.user || !req.user.admin || req.user.admin !== true) {
      return res.status('403')
        .end();
    }

    const page = (req.query.page && parseInt(req.query.page, 10) > 0)
      ? parseInt(req.query.page, 10)
      : 1;
    const sort = (req.query.sort) ? { [req.query.sort]: 1 } : {};

    let size = 10;
    if (req.query.size
      && parseInt(req.query.size, 10) > 0
      && parseInt(req.query.size, 10) < 500) {
      size = parseInt(req.query.size, 10);
    }

    const skip = (size * (page - 1) > 0) ? size * (page - 1) : 0;

    const response = {
      requests: [],
      page,
      size,
      sort: req.params.sort,
      total: 0,
    };

    if (req.params.sort) response.sort = req.params.sort;

    let result;
    return new Promise((resolve, reject) => {
      result = requestsCollection
        .find()
        .skip(skip)
        .sort(sort)
        .limit(size);

      result.toArray((err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    })
      .then((results) => {
        response.results = results;
        return result.count();
      })
      .then((count) => {
        response.total = count;
        return res.json(response);
      })
      .catch(err => res.status(500)
        .json(err));
  });

  // Expose a route to allow users to update their profiles (name, email)
  expressApp.post('/request', (req, res) => {
    if (!req.body) {
      res.status(400)
        .json({ error: 'Must include a body' });
      return;
    }
    if (!req.user) {
      res.status(403)
        .json({ error: 'Must be signed in to make request' });
      return;
    }
    if (!['livechat', 'schedule', 'upload'].includes(req.body.type)) {
      res.status(400)
        .json({ error: 'req.body.type must be one of livechat, schedule, or upload' });
      return;
    }
    requestsCollection.insertOne({
      user_id: req.user.id,
      date: Date.now(),
      type: req.body.type,
    })
      .then(request => res.status(200)
        .json(request))
      .catch(() => res.status(500)
        .json({ error: 'Unable to create request' }));
  });

  // Expose a route to allow users to delete their profile.
  expressApp.post('/account/delete', (req, res) => {
    if (req.user) {
      functions.remove(req.user.id)
        .then(() => {
          // Destroy local session after deleting account
          req.logout();
          // When the account has been deleted, redirect client to
          // /auth/callback to ensure the client has it's local session state
          // updated to reflect that the user is no longer logged in.
          req.session.destroy(() => res.redirect('/auth/callback?action=signout'));
        })
        .catch(() => res.status(500)
          .json({ error: 'Unable to delete profile' }));
    } else {
      res.status(403)
        .json({ error: 'Must be signed in to delete profile' });
    }
  });
};
