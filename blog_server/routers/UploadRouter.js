const express = require("express");

const router = express.Router();

const { blogDB, genID } = require("../db/DbUtils");

const fs = require("fs");

// https://www.wangeditor.com/v5/menu-config.html#%E6%9C%8D%E5%8A%A1%E7%AB%AF%E5%9C%B0%E5%9D%80 
router.post("/rich_editor_upload", async (req, res) => {

    console.log(req.files)
    if (!req.files) {
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "UPLOAD PHOTO IS FAILED, Check the request body is no problem "
        })
        return
    }

    let files = req.files
    let ret_files = []

    for (let file of files) {
        // file suffix
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1) //aa..a.jpg
        // random file name
        let file_name = genID.NextId() + "." + file_ext

        //執行 req file完成後 實際上是在儲存的位置
        fs.renameSync(
            process.cwd() + "/public/uploads/temp/" + file.filename,
            process.cwd() + "/public/uploads/" + file_name
        )

        //返回去 res file地址---------------------------------------------
        ret_files.push("/uploads/" + file_name)

    }

    // res.send({
    //     code: 200,
    //     data: {
    //         "url": ret_files[0]
    //     }
    // })

    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url": ret_files[0], // 图片 src ，必须
        }
    })
})



module.exports = router;
