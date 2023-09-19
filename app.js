const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
const router = require("./router");

app.use(router);
app.use(express.static(__dirname + "/views"));
// Set EJS as templating engine
app.set("view engine", "ejs");

app.listen(port, () => {
  console.log(`App listning on port ${port}`);
});
