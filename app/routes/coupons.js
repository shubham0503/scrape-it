module.exports = app => {
  const coupons = require("../controllers/coupons.js");

  // Scrape coupons
  app.get("/scrape-coupons", coupons.scrape);

  // Retrieve all Coupons
  app.get("/coupon-list", coupons.findAll);
};
