const redirectMiddleware = (req, res, next) => {
  if (req.session.userID) {
    return res.redirect('/users/dashboard');
  } else {
    next();
  }
};

export default redirectMiddleware;
