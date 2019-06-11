const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

// Defining methods for the articlesController
module.exports = {
  scrape: function(req, res) {
    let newssections=[];
    if(req.body.type==="scrape"){
      //check if there is previous scraped data
      db.News
      .find({saved:false, displayed:false}).sort({'dateofarticle': -1}).limit(10)
      .then(dbModel => {
        if(dbModel.length > 0){
          //delete all records, once all are displayed for fresh scrape
          db.News.deleteMany({saved:false, displayed:true})
          .then(alldeleted => {
          })
          .catch(err => {
            console.log(err);
          }); 
          res.json("not scraped");
        }else{
          //delete all records, once all are displayed for fresh scrape
          db.News.deleteMany({saved:false, displayed:true})
          .then(alldeleted => {
            //get all the sections from NYTIMES
            axios.get("https://www.nytimes.com").then(sections => {
              const $ = cheerio.load(sections.data);
              
              $(".css-1d8a290").children("ul").children("li").children("a").each((j, sectionelement) => {
                const sectionsNYT = $(sectionelement).attr("href");
                newssections.push(sectionsNYT);
                getnews(sectionsNYT);
              });
              //console.log(newssections);
              // Make a request via axios for the news section 
              function getnews(sectionsNYT){
                axios.get(sectionsNYT).then(response => {  
                  // Load the html body from axios into cheerio
                  const $ = cheerio.load(response.data);
                  // For each element in latest news
                  $(".css-13mho3u").children("ol").children("li").each((j, element2) => {
                    // Save the text and href of each link enclosed in the current element
                    const section = sectionsNYT;
                    const url = "https://www.nytimes.com"+$(element2).children("div").children("div").children("a").attr("href");
                    const headline = $(element2).children("div").children("div").children("a").children("h2").text();
                    const summary = $(element2).children("div").children("div").children("a").children("p").text();
                    let dateofarticle;
                    
                    if (url && headline && summary){
                      const newsdate=($(element2).children("div").children("div").children("a").attr("href")).substr(1,10).split('/');
                      if(newsdate.length===3){
                        dateofarticle = new Date(newsdate.join("-"));
                      }
                    }
                    // If this found element had both a title and a link
                    if (url && headline && summary) {
                      // Insert the data in the scrapedData db
                      db.News.create({
                        section,
                        dateofarticle,
                        headline,
                        url,
                        summary,
                        saved: false
                      },
                      (err, inserted) => {
                        if (err) {
                          // Log the error if one is encountered during the query
                          console.log(err.errmsg);
                        }
                        else {
                          // Otherwise, log the inserted data
                          //console.log(inserted);    
                        }
                      });  
                    }
                  });
                });
              }
            },res.json("scraped"));
          })
          .catch(err => {
            console.log(err);
          }); 
        }
      })
      .catch(err => res.status(422).json(err));

    }else if(req.body.type==="load"){
      db.News
      .find({saved:false, displayed:false}).sort({'dateofarticle': -1}).limit(10)
      .populate("notes")
      .then(dbModel => {
        //delete all records, once all are displayed for fresh scrape
        if(dbModel.length===0){
          db.News.deleteMany({saved:false, displayed:true})
          .then(alldeleted => {
          })
          .catch(err => {
            console.log(err);
          }); 
        }
        for (var i=0;i<dbModel.length;i++){
          db.News.findOneAndUpdate({ _id: dbModel[i]._id }, { displayed: true })
          .then(update => {
          }).catch(err => {
            // If an error occurs, send it back to the client
            console.log(err);
          });
        }
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
    }else if(req.body.type==="saved"){
      let id=req.body.id;
      db.News.findOneAndUpdate({ _id: id }, { saved: true })
      .then(update => {
        console.log("update "+id);
        res.json(id);
      });
    }    
  },
  fetchsaved:  function(req, res) {
    db.News.find({ saved:true })
      // Specify that we want to populate the retrieved saved news with any associated notes
      .populate("notes")
      .then(dbSavedNews => {
        // If any saved news are found, send them to the client with any associated notes
        res.json(dbSavedNews);
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  },
  findById: function(req, res) {
    db.Article
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Article
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Article
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Article
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
