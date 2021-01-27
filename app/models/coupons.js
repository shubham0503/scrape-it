const sql = require("./db.js");

exports.create = (couponData, result) => {
  sql.query("INSERT INTO coupons(coupon_code, brand, description, title) VALUES ?", [couponData], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...couponData });
  });
};

exports.getAll = result => {
  sql.query("SELECT * FROM coupons", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

exports.getOnlyCouponCodes = result => {
  sql.query("SELECT coupon_code FROM coupons", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};
