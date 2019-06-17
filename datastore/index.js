const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(
    (counterString)=>{ fs.writeFile(__dirname + '/data/'+counterString+'.txt',text ,'utf8', 
      (err)=>{
        if(err) throw err;
        console.log('succsses creating message')
        callback(null, { counterString, text });
      }
    )})
};

exports.readAll = (callback) => {
fs.readdir(__dirname+'/data', 'utf8',(err , fileNames)=>{
  if(err) {
    throw err
  } else {
    //make an array of messages
    //then...
    let messages = fileNames.map(fileName=>(fs.read))
    callback(null, fileNames);
  }
  
})
  
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(__dirname+'/data/'+id+'.txt' ,(err , data)=>{
    if(err) {callback(err)}
    else{
       callback(null , {id , data})
    }
   
  })
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
 
  fs.writeFile(__dirname+'/data/'+id+'.txt' , text , 'utf8',(err)=>{
     if(err) {
       callback(err)
    }else {
      callback(null,{id , text})
    }
  })
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
  fs.unlink(__dirname+'/data/'+id+'.txt', (err)=>{
    if(err){
      callback(err)
    }else{
      callback();
    }
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
