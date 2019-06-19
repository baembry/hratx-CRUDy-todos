const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");
const Promise = require("bluebird");

Promise.promisifyAll(fs);
// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = async (text, callback) => {
  // counter.getNextUniqueId(id => {
  //   // if (err) {
  //   //   throw new Error();
  //   // }

  //   fs.writeFile(exports.dataDir + "/" + id + ".txt", text, "utf8", err => {
  //     if (err) throw new Error();
  //     callback(null, { id: id, text });
  //   });
  // });

  //========Promisified version works===========
  // counter
  //   .getNextUniqueId()
  //   .then(id => {
  //     console.log("ID", id);
  //     fs.writeFile(exports.dataDir + "/" + id + ".txt", text, "utf8", err => {
  //       if (err) throw new Error();
  //       callback(null, { id: id, text });
  //     });
  //   })
  //   .catch(err => {
  //     throw err;
  //   });
  const date = new Date();
  let texDate =
    text +
    "    " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    "  " +
    date.getDay() +
    "/" +
    date.getMonth() +
    "/" +
    date.getFullYear();
  //=============Extra promisified version with Bluebird========
  // counter
  //   .getNextUniqueId()
  //   .then(id => {
  //     fs.writeFileAsync(exports.dataDir + "/" + id + ".txt", texDate, "utf8");
  //     return id;
  //   })
  //   .then(id => {
  //     callback(null, { id, text: texDate });
  //   })
  //   .catch(err => {
  //     throw err;
  //   });

  //===========ASYNC/AWAIT versino===========
  const id = await counter.getNextUniqueId();
  await fs.writeFileAsync(exports.dataDir + "/" + id + ".txt", texDate, "utf8");
  callback(null, { id, text: texDate });
};

exports.readAll = callback => {
  // fs.readdir(exports.dataDir, "utf8", (err, fileNames) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     //make an array of messages
  //     //then...
  //     let messages = fileNames.map(
  //       fileName =>
  //         new Promise((resolve, reject) => {
  //           fs.readFile(
  //             exports.dataDir + "/" + fileName,
  //             "utf8",
  //             (err, data) => {
  //               if (err) {
  //                 reject(err);
  //               } else {
  //                 resolve({ id: fileName.split(".")[0], text: data });
  //               }
  //             }
  //           );
  //         })
  //     );
  //     Promise.all(messages)
  //       .then(messages => {
  //         callback(null, messages);
  //       })
  //       .catch(err => {
  //         throw err;
  //       });
  //   }
  // });
  fs.readdirAsync(exports.dataDir, "utf8")
    .then(filenames => {
      return filenames.map(
        fileName =>
          new Promise((resolve, reject) => {
            fs.readFileAsync(
              exports.dataDir + "/" + fileName,
              "utf8",
              (err, data) => {
                resolve({ id: fileName.split(".")[0], text: data });
              }
            );
          })
      );
    })
    .then(messages => {
      return Promise.all(messages);
    })
    .then(messages => {
      callback(null, messages);
    });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + "/" + id + ".txt", "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  //==========Callback version works ===========
  const file = exports.dataDir + "/" + id + ".txt";
  // fs.access(file, fs.constants.F_OK, err => {
  //   if (err) {
  //     callback(err);
  //     return;
  //   }
  //   console.log("File found ", file);
  //   fs.writeFile(file, text, "utf8", (err, data) => {
  //     if (err) {
  //       callback(err);
  //     } else {
  //       callback(null, { id, text: data });
  //     }
  //   });
  // });
  //=============Promisified version==============
  fs.accessAsync(file, fs.constants.F_OK)
    .then(() =>
      fs.writeFileAsync(file, text, "utf8").then(() => {
        callback(null, { id, text: text });
      })
    )

    .catch(err => {
      throw err;
    });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  //   fs.unlink(exports.dataDir + "/" + id + ".txt", err => {
  //     if (err) {
  //       callback(err);
  //     } else {
  //       callback();
  //     }
  //   });

  //=============Promisified version==============

  fs.unlinkAsync(exports.dataDir + "/" + id + ".txt")
    .then(callback)
    .catch(err => {
      throw err;
    });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
