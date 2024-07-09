const express = require("express");

const router = express.Router();

const { blogDB, genID } = require("../db/DbUtils");


//1 添加BLOG
router.post("/_token/add", async (req, res) => {
    // const x = req.body
    // console.log(x)
    let { title, category_id, content } = req.body
    // {
    //     "name" : "用來刪除的數據",
    //     "nam12e" : "用來刪除的數據",
    //     "nam3213123e" : "用來刪除的數據",
    //     "na213me" : "用來刪除的數據",
    //     "name12312" : "用來刪除的數據"
    // }
    //------------------------------------------------------------------------------------------------------
    let id = genID.NextId()

    let create_time = new Date().getTime()

    const insert_sql = "INSERT INTO `blog` (`id`, `title`,  `category_id`, `content` , `create_time`) VALUES (?, ?,?,?,?)"

    let params = [id, title, category_id, content, create_time]

    // let { err, rows } = await blogDB.async.run(insert_sql, [genID.NextId(), title, content, category_id])
    let { err, rows } = await blogDB.async.run(insert_sql, params)

    if (err === null) {
        res.send({
            code: 200,
            msg: "Add blog succeed"
        })
    } else {
        res.send({
            code: 500,
            msg: "Add blog failed"
        })
    }
});







//2 修改BLOG
router.put("/_token/update", async (req, res) => {
    let { id, title, category_id, content } = req.body
    // {
    //     "title": "前端教材-2",
    //     "content": "XXXXXXXXXXX",
    //     "category_id": 582308612677701
    // }


    let create_time = new Date().getTime()

    const update_sql = "UPDATE `blog` SET `title` = ?, `category_id` = ?, `content` = ?, `create_time` = ? WHERE `id` = ?"
    let params = [title, category_id, content, create_time, id]

    let { err, rows } = await blogDB.async.run(update_sql, params)

    if (err === null) {
        res.send({
            code: 200,
            msg: "update blog succeed"
        })
    } else {
        res.send({
            code: 500,
            msg: "update blog failed"
        })
    }
});







//3 刪除BLOG
router.delete("/_token/delete", async (req, res) => {
    let id = req.query.id //  /category/delete?id=xxx
    // http://localhost:8080/category/delete?id=582309180584005
    const delete_sql = "DELETE FROM `blog`  WHERE `id` = ?"

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




//4 查詢BLOG - FOR ONE
router.get("/_token/serachOne", async (req, res) => {
    let { id } = req.query
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ?"
    let { err, rows } = await blogDB.async.all(detail_sql, [id])


    if (err === null) {
        res.send({
            code: 200,
            msg: "RETURN DATA succeed",
            rows
        })
        // {
        //     "code": 200,
        //     "msg": "DELETE category succeed"
        // }
    } else {
        res.send({
            code: 500,
            msg: "RETURN DATA  failed"
        })
    }
}
)


router.get("/serachOneForView", async (req, res) => {
    let { id } = req.query
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ?"
    let { err, rows } = await blogDB.async.all(detail_sql, [id])


    if (err === null) {
        res.send({
            code: 200,
            msg: "RETURN DATA succeed",
            rows
        })
        // {
        //     "code": 200,
        //     "msg": "DELETE category succeed"
        // }
    } else {
        res.send({
            code: 500,
            msg: "RETURN DATA  failed"
        })
    }
}
)




//4 查詢BLOG - FOR ALL
/* 
    keyword
    search part2 - title
    search part3 - content
    
    search part1 - category_id
    
    分頁：
    page 
    pageSize
*/
router.get("/search", async (req, res) => {
    //http://localhost:8080/blog123456/search?pageSize=1&keyword=標題

    console.log(req.query)
    let { keyword, category_id, page, pageSize } = req.query

    page = (page == null ? 1 : page)
    pageSize = (pageSize == null ? 10 : pageSize)
    category_id = (category_id == null ? 0 : category_id)
    keyword = (keyword == null ? "" : keyword)

    // console.log("| page-", page, "pageSize-", pageSize, "category_id-", category_id, "keyword-", keyword, " |")
    // "code": 200,
    // "msg": "search succeed",
    // "data": {
    //     "keyword": "",
    //     "category_id": 0,
    //     "page": 1,
    //     "pageSize": 10,
    //     "rows": [...]



    let params = []
    let whereSqls = []
    // [
    //   ' `category_id` = ?',
    //   ' `title` like  ?     OR   `content`   like   ?  '
    // ]

    if (category_id !== 0) {
        whereSqls.push(" `category_id` =  ? ")
        params.push(category_id)
    }

    if (keyword !== "") {
        // whereSqls.push(" `title` like '%" + keyword + "%'")
        // whereSqls.push(" `content` like '%" + keyword + "%'")
        // params.push(keyword)
        // params.push(keyword)
        whereSqls.push(" (  `title` like  ?     OR   `content`   like   ?  ) ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }


    //  WHERE  `category_id` = ? AND  `title` like  ?     OR   `content`   like   ? 
    let whereSqlsStr = ""
    if (whereSqls.length > 0) {
        whereSqlsStr = " WHERE " + whereSqls.join(" AND ")
    }
    //whereSqls =  ARRAY
    //whereSqlsStr = String  = where `category_id` = ?  AND  `title` like  ?     OR   `content`   like   ?


    //查X分頁的數據
    // let searchSubPageSQL = "SELECT * FROM `blog` " + whereSqlsStr + " ORDER BY `create_time` DESC LIMIT ?, ?"
    // let searchSubPageSQL = "SELECT `id` ,`category_id` ,`title`, substr(`content`, 0, 50) AS `content`, `content` FROM `blog` " + whereSqlsStr + " ORDER BY `create_time` DESC LIMIT ?, ?"
    let searchSubPageSQL = "SELECT `id` ,`category_id` ,`title`,  `create_time`, substr(`content`, 0, 50) AS `content` FROM `blog` " + whereSqlsStr + " ORDER BY `create_time` DESC LIMIT ?, ?"


    // 1 10  |  2 10  |   3  5
    // 0 10  | 10 10  |  10  5

    let searchSQLParams = params.concat([(page - 1) * pageSize, pageSize])

    console.log(searchSubPageSQL)
    console.log(searchSQLParams)

    //------------------------------------------------------------------------------------------------


    // 查數據總數
    //total 201  ,  201/10 = 21頁   最後1頁只有1個
    let searchCountSQL = "SELECT count(*) as `count` FROM `blog` " + whereSqlsStr
    let searchCountSQLParams = params

    //------------------------------------------------------------------------------------------------

    let searchResult = await blogDB.async.all(searchSubPageSQL, searchSQLParams)

    let countResult = await blogDB.async.all(searchCountSQL, searchCountSQLParams)

    console.log('\n\n ---- ', searchResult)
    console.log(countResult)


    if (searchResult.err === null && countResult.err === null) {
        res.send({
            code: 200,
            msg: "search succeed",
            data: {
                keyword,
                category_id,
                page,
                pageSize,
                rows: searchResult.rows,
                // countResult: countResult.rows[0]["count(*)"]
                countTotal: countResult.rows[0].count

            }
        })
    } else {
        res.send({
            code: 500,
            msg: "search failed"
        })
    }
});



module.exports = router;
