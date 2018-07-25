let http = require('http');
let request = require('request');
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

let shirts = {};
let page;

request('http://shirts4mike.com/shirts.php', function(err, res, html){
  let $ = cheerio.load(html);
  $('.products li').each((i, e) => {
    page = e.children[0].attribs.href;
    request(`http://shirts4mike.com/${page}`, function(err, res, html){
      console.log(html)
    })
  })
})
