import { User } from '../models/User.js';

const authMiddleware = (req, res, next) => {
  User.findById(req.session.userID, (err, user) => {
    if (err || !user) {
      res.redirect('/login');
    }
  });
  next();
};

export default authMiddleware;
