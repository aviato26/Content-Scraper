let request = require('request');
let fs = require('fs');
let cheerio = require('cheerio');
let csv = require('json2csv').Parser;

fs.readdir('data', function(e){
  if(e !== null){
    fs.mkdir('data', function(err){
      console.error(err)
    })
  }
})

let tableHead = ['Title', 'Price', 'ImageUrl', 'URL'];
let paths = [];
let counter;
let a = new csv({tableHead});
let data = [];

request('http://shirts4mike.com/shirts.php', function(err, res, html){
  let $ = cheerio.load(html);

  $('.products li').each((i, e) => {
    let path = e.children[0].attribs.href;
    paths.push(`http://shirts4mike.com/${path}`)
    counter = 0;

    request(`http://shirts4mike.com/${path}`, function(err, res, html){
      let shirtData = cheerio.load(html);
      data.push(
        {
          "Title": shirtData('title').text(),
          "Price": shirtData('.price').text()
          //shirtData('img').attr('src'),
          //paths[counter++]
        })
        
      fs.appendFile('./data/info.csv',data, (err) => {
        if(err)
        console.log('ddduuuuuhhhhhhh')
      })
    })
  })
})
