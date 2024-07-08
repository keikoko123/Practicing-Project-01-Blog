let whereSqls = []
let params = []

whereSqls.push(" `category_id` = ?")
// params.push(" '%" + keyword + "%'")
// params.push(" '%" + keyword + "%'")

whereSqls.push(" `title` like  ?     OR   `content`   like   ?  ")
console.log(whereSqls)



let whereSqlsStr = ""

whereSqlsStr = " WHERE " + whereSqls.join(" AND ")
console.log(whereSqlsStr)
