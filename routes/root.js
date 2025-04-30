const express = require("express");
const path = require("path");
const router = express.Router();

router.use(express.static(path.join(
  process.cwd(), 'public'
)));

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/api/getInfo", async ({
  req, res
}) => {
  // TODO: add info's
});

module.exports = router;