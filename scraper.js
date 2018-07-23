let fs = require('fs');
let cheerio = require('cheerio');
let csv = require('csv');

fs.readdir('data', function(e){
  if(e !== null){
    fs.mkdir('data', function(err){
      console.error(err)
    })
  }
})
