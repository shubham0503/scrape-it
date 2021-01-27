const puppeteer = require('puppeteer');

exports.run = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`${process.env.SOURCE_BASE_URL}/ae/top/`);
        let urls = await page.evaluate(() => {
          let results = [];
          let items = document.querySelectorAll('li.type-code');
          items.forEach((item) => {
            results.push({
              url:  item.querySelector('.of__content h3 a').getAttribute('href')
            });
          });
          return results;
      })
      browser.close();
      return resolve(urls);
    } catch (e) {
      return reject(e);
    }
  })
}

exports.processingDetails = (couponUrls) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();

      let results = [];

      for (let i = 0; i < process.env.COUPON_RATE_LIMIT; i++) {
        const finalUrl = process.env.SOURCE_BASE_URL+couponUrls[i].url;

        let page = await browser.newPage();
        await page.goto(finalUrl, {waitUntil: 'networkidle2'});

        await page.waitForSelector('.modal__code-input', true);

        // The below code is for logging javascript code inside page.evaluate function
        // page.on("console", msg => console.log("PAGE LOG:", msg));

        couponData = await page.evaluate(() => {
          let couponCode = document.querySelector('.modal__code-input').value;
          let title = document.querySelector('.modal__title').textContent;
          let brand = document.querySelector('.modal__info p a').textContent;
          let description = document.querySelector('.modal__description').textContent;

          let couponData = [
            couponCode,
            brand,
            description,
            title
          ]

          return couponData;
        })

        results.push(couponData);
      }

      browser.close();
      return resolve(results);
    } catch (e) {
      console.log(e)
      return reject(e);
    }
  })
}
