const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  console.log('number to pad', num)
  const paddedNumber =  sprintf('%05d', num);
  console.log("padded id ", paddedNumber);
  return paddedNumber
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      throw ('error reading counter');
    } else {
      console.log("from readcounter  ",Number(fileData));
      callback( Number(fileData) ,callback);

    }
  });
};

const writeCounter = (count, callback) => {
  console.log("write counter ", count, callback)
  var counterString = zeroPaddedNumber(count + 1);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      console.log('succsses incriminting id counter ', counterString)
      //callback
      callback(counterString)
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  return readCounter((count)=>{writeCounter(count, callback)})
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
