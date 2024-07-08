const express = require("express");

const router = express.Router();

const { blogDB, genID } = require("../db/DbUtils");

//1 列表接口
router.get("/list", async (req, res) => { //http://localhost:8080/category/list
    let sql = "SELECT * FROM `category`"
    let { err, rows } = await blogDB.async.all(sql, [])

    if (err === null) {
        res.send({
            code: 200,
            msg: "SEARCH category succeed",
            rows
        })
        // {
        //     "code": 200,
        //     "msg": "SEARCH category succeed",
        //     "rows": [
        //         {
        //             "id": 582307745022021,
        //             "name": "dajskdlasjlk123"
        //         },
        //         {
        //             "id": 582307863941189,
        //             "name": "前端教材"
        //         },
        //         {
        //             "id": 582308612677701,
        //             "name": "前端教材-2"
        //         }
        //     ]
        // }
    } else {
        res.send({
            code: 500,
            msg: "SEARCH category failed"
        })
    }
})



//2 添加接口
router.post("/_token/add", async (req, res) => {

    let { name } = req.body
    console.log(req.body)
    console.log(name)
    console.log('-----------------------------------------------')

    const insert_sql = "INSERT INTO `category` (`id`, `name`) VALUES (?,?)"

    let result = await blogDB.async.run(insert_sql, [genID.NextId(), name])
    console.log(result)


    if (result.err === null) {
        return res.send({
            code: 200,
            msg: "Add category succeed"
        })

    } else {
        return res.send({
            code: 500,
            msg: "Add category failed"
        })

    }
})

//3 修改接口
router.put("/_token/update", async (req, res) => {
    console.log(req.body)


    let { id, name } = req.body
    // {
    //     "id": 582307745022021,
    //     "name" : "dajskdlasjlk123"
    // }

    const update_sql = "UPDATE `category`  SET  `name` = ? WHERE `id` = ?"

    let { err, rows } = await blogDB.async.run(update_sql, [name, id])

    if (err === null) {
        return res.send({
            code: 200,
            msg: "UPDATE category succeed"
        })
        // {
        //     "code": 200,
        //     "msg": "UPDATE category succeed"
        // }
    } else {
        return res.send({
            code: 500,
            msg: "UPDATE category failed"
        })
    }
    return
})





//4 刪除接口
router.delete("/_token/delete", async (req, res) => {

    let id = req.query.id //  /category/delete?id=xxx
    // http://localhost:8080/category/delete?id=582309180584005
    const delete_sql = "DELETE FROM `category`  WHERE `id` = ?"

    let { err, rows } = await blogDB.async.run(delete_sql, [id])

    if (err === null) {
        res.send({
            code: 200,
            msg: "DELETE category succeed"
        })
        // {
        //     "code": 200,
        //     "msg": "DELETE category succeed"
        // }
    } else {
        res.send({
            code: 500,
            msg: "DELETE category failed"
        })
    }
})






















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
