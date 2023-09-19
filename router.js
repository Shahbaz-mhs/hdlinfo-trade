const express = require("express");
const router = express.Router();
const trade = require("./model/hodlSchema");
const path = require("path");
const fetch = require("node-fetch");

//INSERT TRADE DATA INTO DB FROM EXTERNAL API
router.get("/", async (req, res) => {
  try {
    //DELETE OLD DATA
    trade
      .deleteMany({})
      .then(function () {
        console.log("Data Deleted"); // Deleted Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });

    //FETCH DATA FROM EXTERNAL API
    const fData = await fetch("https://api.wazirx.com/api/v2/tickers");
    const data = await fData.json();

    let result = Object.entries(data);
    result = result.slice(0, 10); //SPLIT DATA INTO 10 RECORDS EXTERNALLY

    let pushArray = [];
    for (let iterator of result) {
      pushArray.push(iterator[1]);
    }

    //PRICE FORMATTER FUNCTION
    const formatter = new Intl.NumberFormat("en-US", {
      // style: 'currency',
      // currency: 'INR',

      // These options are needed to round to whole numbers if that's what you want.
      minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    //CREATE OBJECT OF NEW FETCH DATA TO INSERT IN DB
    pushArray.forEach((Element) => {
      let { base_unit, last, sell, buy, name, volume } = Element;
      let diff = (buy * volume - last * volume) / 100;
      let savings = last * volume - buy * volume;

      //CALLING PRICE FORMATTER FUNCTION
      last = formatter.format(last);
      buy = formatter.format(buy);
      sell = formatter.format(sell);
      diff = formatter.format(diff);
      savings = formatter.format(savings);

      const obj = {
        base_unit,
        last,
        sell,
        buy,
        name,
        volume,
        diff,
        savings,
      };

      //INSERT NEW DATA
      trade
        .insertMany(obj)
        .then(function () {
          console.log("Data inserted"); // Success
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
    });
    //FETCH INSERTED DATA FROM DB
    const f_Data = await trade.find({}, { _id: 0, __v: 0 }).limit(10);

    //CALCULATE AVERAGE OF BUY
    const avg_Buy = await trade.aggregate([
      {
        $group: {
          _id: "_id",
          AverageValue: { $avg: "$buy" },
        },
      },
    ]);

    res.render(path.join(__dirname + "/views/index"), {
      data: f_Data,
      i: 1,
      avg_Buy,
    });
  } catch (error) {
    console.log(error);
  }
});

//FETCH TRADE DATA FROM DB
router.get("/fetch", async (req, res) => {
  const f_Data = await trade.find({}, { _id: 0, __v: 0 }).limit(10);
  res.send(f_Data);
});

module.exports = router;
