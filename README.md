# React-MongoScrape

**App Link** https://react-newsscraper.herokuapp.com/
* A web app that lets users view and leave comments on the latest news scraped using Mongoose and Cheerio from https://www.nytimes.com.
* Uses React and Reat-Router-Dom to render the pages.
* Allows user to scrape stories from nytimes news outlet and displays them for the user.
* Displays:
     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article
* Users can leave comments on the articles displayed and can revisit them later. The comments are saved to the database as well and associated    with their articles. 
* Users can also delete comments left on articles. All stored comments are visible to every user.
* All scraped stories are unique and no duplicates are saved.