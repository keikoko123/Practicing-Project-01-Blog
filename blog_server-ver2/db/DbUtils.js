const express = require("express")
const multer = require("multer")
const path = require("path")
const app = express();
const { db, genid } = require("./db/DbUtils")
const port = 8080


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "*");

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  //? if (req.method === "OPTIONS") {
  //?   return res.sendStatus(200);
  //? }

  //! 忘記了 return lambda法則

  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});



app.use(express.json());
const update = multer({ dest: "./public/uploads/temp" });
app.use(update.any());

app.use(express.static(path.join(__dirname, "public"))); //指定靜態資源路徑



// category/add  
//           => /category/_token/add
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
  // console.log(req.path.indexOf(ADMIN_TOKEN_PATH))
  console.log(req.headers)
  console.log(req.token)

  if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {

    // let token = req.header.token
    let { token } = req.headers
    console.log(token)
    // console.log(req.header.token)
    // console.log('-----------------------------------------------')

    let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"

    let adminResult = await blogDB.async.all(admin_token_sql, [token])
    console.log(adminResult) //{ rows: [], err: null }
    console.log(adminResult.rows.length)

    if (adminResult.err != null || adminResult.rows.length == 0) {
      return res.send({
        code: 403,
        msg: "你仲未LOGIN"
      })
    } else {
      next()
    }

  } else {
    next()
  }

})





app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"));
app.use("/category", require("./routers/CategoryRouter"));
app.use("/blog123456", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));



app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
