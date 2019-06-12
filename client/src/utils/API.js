import axios from "axios";

export default {
  // SCRAPES all articles
  scrapeArticles: function(type) {
    return axios.post("/api/articles",type);
  },
  // Gets the saved article 
  getArticles: function() {
    return axios.get("/api/articles/");
  },

  // // Deletes the article with the given id
  // deleteArticle: function(id) {
  //   return axios.delete("/api/articles/" + id);
  // },

};
