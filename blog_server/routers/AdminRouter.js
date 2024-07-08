const express = require("express");

const router = express.Router();

const { blogDB, genID } = require("../db/DbUtils");

const { v4: uuidv4 } = require("uuid"); // node uuid

router.post("/login", async (req, res) => {


    //!                       = res.body
    let { account, password } = req.body
    // {   in json is like that, it is same as a js object
    //     "account" : "admin123",
    //     "password": "123456"
    // }


    let { err, rows } = await blogDB.async.all("select * from `admin` where `account` = ? and `password` = ?", [account, password])
    console.log("3----", { err, rows })
    // {
    //     err: null,
    //     rows: [
    //       {
    //         id: 1,
    //         account: 'admin123',
    //         password: '123456',
    //         token: '85f16127-d150-45f8-8fe4-ce49046690fa'
    //       }
    //     ]
    // }

    if (err === null && rows.length > 0) {

        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token` = ? WHERE `id` = ? ";
        await blogDB.async.run(update_token_sql, [login_token, rows[0].id]);

        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password = ""


        res.send({
            code: 200,
            msg: "Login succeed",
            data: admin_info
        });
        // {
        //     "code": 200,
        //     "msg": "Login succeed",
        //     "data": {
        //         "id": 1,
        //         "account": "admin123",
        //         "password": "",
        //         "token": "581ee6dd-8711-461f-8b06-76bcf31c3be0"
        //     }
        // }

    } else {
        res.send({
            // code: 400,
            code: 500,
            msg: "Login failed"
        });
    }


















    //   let { username, password } = req.body;

    //   let out = await blogDB.async.all(
    //     "SELECT * FROM `admin` WHERE `username` = ? AND `password` = ?",
    //     [username, password]
    //   );

    //   if (out.length > 0) {
    //     res.send({
    //       code: 200,
    //       msg: "Login success"
    //     });
    //   } else {
    //     res.send({
    //       code: 400,
    //       msg: "Login failed"
    //     });
    //   }
});

// //response methods
// router.get("/test123", async (req, res) => {
//   // method1
//   blogDB.all("SELECT * FROM `admin`", [], (err, rows) => {
//     console.log(rows);
//   });

//   // method2
//   blogDB.async.all("SELECT * FROM `admin`", []).then((res) => {
//     console.log(res);
//   });

//   // method3
//   let out = await blogDB.async.all("SELECT * FROM `admin`", []);

//   res.send({
//     id: genID.NextId(), //{"id":581979978944581}
//     out // == out: out
//   });
// });

module.exports = router;
