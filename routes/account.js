/**
 * Example account management routes
 */

module.exports = (expressApp, functions) => {
  if (expressApp === null) {
    throw new Error('expressApp option must be an express server instance');
  }

  // Expose a route to return user profile if logged in with a session
  expressApp.get('/account/user', (req, res) => {
    if (req.user) {
      functions.find({ id: req.user.id })
        .then((user) => {
          if (!user) {
            res.status(500)
              .json({ error: 'Unable to fetch profile' });
            return;
          }
          res.json({
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified && user.emailVerified === true,
          });
        })
        .catch(() => res.status(500)
          .json({ error: 'Unable to fetch profile' }));
    } else {
      res.status(403)
        .json({ error: 'Must be signed in to get profile' });
    }
  });

  // Expose a route to allow users to update their profiles (name, email)
  expressApp.post('/account/user', (req, res) => {
    if (req.user) {
      functions.find({ id: req.user.id })
        .then((user) => {
          if (!user) {
            return res.status(500)
              .json({ error: 'Unable to fetch profile' });
          }

          if (req.body.name) {
            // eslint-disable-next-line no-param-reassign
            user.name = req.body.name;
          }

          if (req.body.email) {
            // Reset email verification field if email address has changed
            if (req.body.email && req.body.email !== user.email) {
              // eslint-disable-next-line no-param-reassign
              user.emailVerified = false;
            }

            // eslint-disable-next-line no-param-reassign
            user.email = req.body.email;
          }
          return functions.update(user);
        })
        .then(() => res.status(204)
          .redirect('/account'))
        .catch(() => res.status(500)
          .json({ error: 'Unable to fetch profile' }));
    } else {
      res.status(403)
        .json({ error: 'Must be signed in to update profile' });
    }
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
