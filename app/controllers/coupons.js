const Coupons = require("../models/coupons");
const { run, processingDetails } = require("../utils/coupons");

// Scrape and save new coupons
exports.scrape = async (req, res) => {
  try {
    const couponUrls = await run();
    let scrapedCouponData = await processingDetails(couponUrls);
    let clonedScrapedCouponData = await JSON.parse(JSON.stringify(scrapedCouponData));

    Coupons.getOnlyCouponCodes(async (err, existingCouponData) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving coupons."
        });
      } else {
        let existingCouponArray = Object.values(JSON.parse(JSON.stringify(existingCouponData)));

        let allExistingCouponCodes = existingCouponArray.map(x => x.coupon_code);

        let i = 0;
        await scrapedCouponData.forEach(async scrapedCoupon => {
          if (allExistingCouponCodes.includes(scrapedCoupon['0'])) {
            await clonedScrapedCouponData.splice(i, 1);
          }
          i++;
        });

        if (clonedScrapedCouponData.length) {
          // Save Coupons in the database
          Coupons.create(scrapedCouponData, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while inserting coupons in the db."
              });
            else res.send({message: "Coupons scraped successfully!", isNewCoupon: true});
          });
        } else {
          res.status(200).send({message: "Coupons already scraped!", isNewCoupon: false});
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// Retrieve all coupons from the database.
exports.findAll = (req, res) => {
  Coupons.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving coupons."
      });
    else res.send({data: data, message: "Coupon fetched successfully!"});
  });
};
