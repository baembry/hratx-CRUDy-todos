const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(null, (err, id) => {
    if (err) {
      throw new Error();
    }
    fs.writeFile(__dirname + "/data/" + id + ".txt", text, "utf8", err => {
      if (err) throw new Error();
      console.log("succsses creating message", { id: id, text });
      callback(null, { id: id, text });
    });
  });
};

exports.readAll = callback => {
  fs.readdir(__dirname + "/data", "utf8", (err, fileNames) => {
    if (err) {
      throw err;
    } else {
      //make an array of messages
      //then...
      let messages = fileNames.map(
        fileName =>
          new Promise((resolve, reject) => {
            fs.readFile(
              __dirname + "/data/" + fileName,
              "utf8",
              (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({ id: fileName.split(".")[0], text: data });
                }
              }
            );
          })
      );
      Promise.all(messages)
        .then(messages => {
          console.log(messages);
          callback(null, messages);
        })
        .catch(err => {
          callback(err);
        });
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(__dirname + "/data/" + id + ".txt", (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, data });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.writeFile(__dirname + "/data/" + id + ".txt", text, "utf8", err => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text });
    }
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
  fs.unlink(__dirname + "/data/" + id + ".txt", err => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
