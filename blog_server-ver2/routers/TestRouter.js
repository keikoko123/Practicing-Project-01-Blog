const express = require("express");

const router = express.Router();

const { blogDB, genID } = require("../db/DbUtils");

//response methods
router.get("/test123", async (req, res) => {
  // // method1
  // blogDB.all("SELECT * FROM `admin`", [], (err, rows) => {
  //   console.log(rows);
  // });

  // // method2
  // blogDB.async.all("SELECT * FROM `admin`", []).then((res) => {
  //   console.log(res);
  // });

  // method3
  let out = await blogDB.async.all("SELECT * FROM `admin`", []);

  res.send({
    id: genID.NextId(), //{"id":581979978944581}
    out // == out: out
  });
});

module.exports = router;
