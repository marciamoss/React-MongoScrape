const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

// Defining methods for the articlesController
module.exports = {
  scrape: function(req, res) {
    let newssections=[];
    if(req.body.type==="scrape"){
      //get all the sections from NYTIMES
      axios.get("https://www.nytimes.com").then(sections => {
        const $ = cheerio.load(sections.data);
        
        $(".css-1d8a290").children("ul").children("li").children("a").each((j, sectionelement) => {
          const sectionsNYT = $(sectionelement).attr("href");
          if (sectionsNYT === 'https://www.nytimes.com/section/us' || sectionsNYT === 'https://www.nytimes.com/section/business' ||
              sectionsNYT === 'https://www.nytimes.com/section/technology' || sectionsNYT === 'https://www.nytimes.com/section/science' ||
              sectionsNYT ===  'https://www.nytimes.com/section/health' || sectionsNYT === 'https://www.nytimes.com/section/sports') {
            newssections.push(sectionsNYT);
            getnews(sectionsNYT);
          }
        });
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
                  dateofarticle = newsdate.join("-");
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
                    console.log("error while adding to db",err.errmsg);
                  }
                  else {
                    // Otherwise, log the inserted data
                    console.log("server log record inserted", JSON.stringify(inserted,null,1));
                  }
                });  
              }
            });
          });
        }
      },res.json("scraped"));
    }
    if(req.body.type==="load"){
      db.News
      .find({saved:false}).sort({'dateofarticle': -1})
      .populate("notes")
      .then(dbModel => {
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
    }
    if(req.body.type==="saved"){
      let id=req.body.id;
      db.News.findOneAndUpdate({ _id: id }, { saved: true })
      .then(update => {
        res.json(id);
      });
    }
    if(req.body.type==="addnote"){
      db.Note.create({usernote:req.body.notes, news: req.body.newsid })
      .then(dbNote => {
        return db.News.findOneAndUpdate({ _id: req.body.newsid }, { $push: { notes: dbNote._id } });
      })
      .then(dbNews => {
        res.json(dbNews);
      })
      .catch(err => {
        res.json(err);
      });
    }
    if(req.body.type==="getnotes"){
      db.News.find({ _id:req.body.newsid })
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
    }      
    if(req.body.type==="deletenews"){
      let id=req.body.id;
      //before deleting the news get all the noteids associated with it to remove from notes db
      db.News.find({ _id: id })
      .then(dbSavedNews => {
        let notes=dbSavedNews[0].notes;
        for(let i=0;i<notes.length;i++){
          db.Note.deleteOne({ _id: notes[i] })
          .then(dbNews => { 
          })
            .catch(err => {
              res.json(err);
          });  
        }
          //when article in unsaved remove all note associations
          db.News.findOneAndUpdate({ _id: id}, { saved: false, $pull: { notes: { $nin: [] } } },{ multi: true })
          .then(update => {
            res.json("article unsaved");
          });
      })
      .catch(err => {
        // If an error occurs, send it back to the client
        res.json(err);
      });
    }
    if(req.body.type==="deletenote"){
      let id=req.body.id;
      db.Note.deleteOne({ _id: id })
      .then(dbNews => {
        res.json(id);
      })
        .catch(err => {
          res.json(err);
      });  
      //when note is deleted remove associated note id in news
      db.News.findOneAndUpdate({ _id: req.body.newsid}, { $pull: { notes: { $in: [req.body.id] } } },{ multi: true })
      .then(update => {
      });
    }
  },
  fetchsaved: function(req, res) {
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
  remove: function(req, res) {
    db.News
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
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
  }
};
