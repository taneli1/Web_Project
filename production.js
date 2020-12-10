'use strict';

module.exports = (app, port) => {

  app.enable('trust proxy');
  app.use ((req, res, next) => {
    if (req.secure) {
      next();
      console.log("next")
    } else {
      const proxypath = process.env.PROXY_PASS || ''
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });

  app.listen(port, () => console.log(`App listen on port ${port}`));
};
