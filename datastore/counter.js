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
  //   return new Promise((resolve , reject)=>{
  //       fs.readFile(exports.counterFile, (err, fileData) => {
  //     if (err) {
  //       reject(err)
  //     } else {
  //       resolve( Number(fileData));
  //     }
  //   });
  //   }
  // )
};

const writeCounter = (error, count, callback) => {
  if (error) {
    callback(error);
  }
  var counterString = zeroPaddedNumber(count + 1);
  fs.writeFile(exports.counterFile, counterString, err => {
    if (err) {
      throw new Error();
    } else {
      //callback
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = function(recordMessage) {
  readCounter(null, function(error, id, callback) {
    writeCounter(error, id, function(error, idString, callback) {
      recordMessage(null, idString);
    });
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, "counter.txt");
