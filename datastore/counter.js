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

const readCounter = async (error, callback) => {
  //=============Callback version works========
  // if (error) {
  //   callback(error);
  // }
  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     throw new Error();
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
  //=============Promisified version works========
  // return new Promise((resolve, reject) => {
  //   fs.readFile(exports.counterFile, (err, fileData) => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       resolve(Number(fileData));
  //     }
  //   });
  // });
  //================Async/Await version===============
  try {
    var fileData = await fs.readFileAsync(exports.counterFile, "utf8");
  } catch (error) {
    throw error;
  }
  return fileData;
};

const writeCounter = async (count, callback) => {
  //=============Callback version works========

  // if (error) {
  //   callback(error);
  // }
  // var counterString = zeroPaddedNumber(count + 1);
  // fs.writeFile(exports.counterFile, counterString, err => {
  //   if (err) {
  //     throw new Error();
  //   } else {
  //     //callback
  //     callback(null, counterString);
  //   }
  // });

  //=============Promisified version works========

  // return new Promise((resolve, reject) => {
  //   var counterString = zeroPaddedNumber(count + 1);
  //   fs.writeFile(exports.counterFile, counterString, err => {
  //     if (err) {
  //       reject(err);
  //     } else {
  //       //callback
  //       resolve(counterString);
  //     }
  //   });
  // });
  count = Number(count);
  var counterString = zeroPaddedNumber(count + 1);
  try {
    fs.writeFileAsync(exports.counterFile, counterString);
  } catch (error) {
    console.log(error);
  }
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = async function(recordMessage) {
  // readCounter(null, function(error, id, callback) {
  //   writeCounter(error, id, function(error, idString, callback) {
  //     recordMessage(null, idString);
  //   });
  // });

  //+++++Promisified version++++++
  // readCounter()
  //   .then(id => {
  //     return writeCounter(id);
  //   })
  //   .then(idString => {
  //     return recordMessage(idString);
  //   })
  //   .catch(err => {
  //     throw err;
  //   });

  // return new Promise(function(resolve, reject) {
  //   readCounter()
  //     .then(id => {
  //       return writeCounter(id);
  //     })
  //     .then(idString => {
  //       resolve(idString);
  //     })
  //     .catch(err => {
  //       reject(err);
  //     });
  // });
  try {
    var counter = await readCounter();
    await writeCounter(zeroPaddedNumber(counter));
    return counter;
  } catch (error) {
    throw error;
  }

  // callback(zeroPaddedNumber(counter));
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, "counter.txt");
