const sqlite3 = require("sqlite3").verbose();

const GenId = require("../utils/GenId");

var blogDB = new sqlite3.Database("./db/blog.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the blog database.");
});

const genID = new GenId({ WorkerId: 1, DataCenterId: 1 });

// ---------------------------------------------------------------------

blogDB.async = {}; // async declare as a obj

blogDB.async.all = (sql, params) => {

  return new Promise((resolve, reject) => {

    blogDB.all(sql, params,
      (err, rows) => {
        resolve({ rows, err });

        // if (err) {
        //   console.log(err);
        //   reject(err);
        // } else {
        //   resolve(rows, err); // resolve(rows, err);
        // }

      });

  });

};







blogDB.async.run = (sql, params) => {

  return new Promise((resolve, reject) => {

    blogDB.run(sql, params,
      (err, rows) => {
        resolve({ rows, err });
        // if (err) {
        //   console.log(err);
        //   reject(err);
        // } else {
        //   resolve(rows, err); // resolve(rows, err);
        // }
      });
  });

};



module.exports = { blogDB, genID };

