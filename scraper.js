// collect all dependencies, dates and times
let request = require('request');
let fs = require('fs');
let cheerio = require('cheerio');
let csv = require('json2csv').Parser;
let shirtData;
let date = new Date().toISOString().substring(0, 10);
let time = new Date().toLocaleTimeString();

// function that checks if data and error directories exist
let dirCheck = (dir) => {
  fs.readdir(dir, function(e){
    if(e !== null){
      fs.mkdir(dir, function(err){
        console.error(`the ${dir} directory did not exist so it was created`)
      })
    }
  })
}

dirCheck('data');
dirCheck('errors');

/* function that gets called when there is a error and appends and creates the error message
   and time to the scraper-error file */
let writeToErrors = (err) => {
  if(err){
    let errorTime = `${new Date()} ${err} \n`;
    fs.appendFile('./errors/scraper-error.log', errorTime, function(err){
      if(err) throw err
    })
  }
}

// variables for building the csv file
let tableHead = ['Title', 'Price', 'ImageUrl', 'URL', 'Time'];
let paths = [];
let counter;
let headings = new csv({tableHead, quote: ''});
let parsedCsv;
let data = [];

// request the main page to check if there is any errors
request('http://shirts4mike.com/', function(err, res, html){
  if(err){
    console.error(`There's been a 404 error. Cannot connect to http://shirts4mike.com.`);
    writeToErrors(err)
  }
  else{
    //request page for all the shirts
    request('http://shirts4mike.com/shirts.php', function(err, res, html){
      if(err){
        console.error(`404 coming at yah, cannot connect to http://shirts4mike.com/shirts.php`);
        writeToErrors(err)
      }
      else{
        //looping through the shirts and getting the path individual shirt pages
        let $ = cheerio.load(html);

        $('.products li').each((i, e) => {
          let path = e.children[0].attribs.href;
          paths.push(`http://shirts4mike.com/${path}`)
          counter = 0;

            //request individual shirts to get the desired properties
            request(`http://shirts4mike.com/${path}`, function(err, res, html){
              if(err){
                console.error(`seems we have a 404 error, can not connect to http://shirts4mike.com/${path}`);
                writeToErrors(err);
              }
              else{
                // collect the properties for the shirts
                  shirtData = cheerio.load(html);
                  data.push(
                    {
                      "Title": shirtData('title').text().replace(',', ''),
                      "Price": shirtData('.price').text(),
                      "ImageURL": shirtData('img').attr('src'),
                      "URL": paths[counter++],
                      "Time": time
                    }
                  )

                  /* once the loop runs 8 times the array of properties is parsed
                     and the csv file is written or updated */
                  if(counter === 8){
                    parsedCsv = headings.parse(data);
                    fs.writeFile(`./data/${date}.csv`,parsedCsv, (err) => {
                    if(err)
                    console.error('dddoooooohhhhhhh');
                    writeToErrors(err)
                  })
                }
              }
            })
          })
        }
      })
    }
  })
