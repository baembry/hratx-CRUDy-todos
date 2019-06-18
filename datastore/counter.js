const fs = require("fs");
const path = require("path");
const sprintf = require("sprintf-js").sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = num => {
  const paddedNumber = sprintf("%05d", num);
  return paddedNumber;
};

const readCounter = (error, callback) => {
  if (error) {
    callback(error);
  }
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      throw new Error();
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (error, count, callback) => {
  console.log("WriteCounter", error, count);
  if (error) {
    callback(error);
  }
  var counterString = zeroPaddedNumber(count + 1);
  fs.writeFile(exports.counterFile, counterString, err => {
    if (err) {
      throw new Error();
    } else {
      console.log("succsses incriminting id counter ", counterString);
      //callback
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = function(hollerback) {
  readCounter(null, function(error, id, callback) {
    if (error) {
      callback(error);
    } else {
      writeCounter(error, id, function(error, idString, callback) {
        if (error) {
          callback(error);
        } else {
          hollerback(null, idString);
        }
      });
    }
  });
};

// readCounter(null, function(error, count, callback) {
//   writeCounter(error, count, function(error, callback) {
//     if (error) {
//       throw error;
//     }
//     fs.writeFile(
//       __dirname + "/data/" + counterString + ".txt",
//       text,
//       "utf8",
//       err => {
//         if (err) throw err;
//         console.log("succsses creating message", { id: counterString, text });
//         callback(null, { id: counterString, text });
//       }
//     );
//   });
// });
// count => {writeCounter(null, count, callback);
// });

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, "counter.txt");
