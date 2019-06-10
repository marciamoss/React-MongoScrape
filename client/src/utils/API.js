import axios from "axios";

export default {
  // Gets all articles
  scrapeArticles: function(type) {
    return axios.post("/api/articles",type);
  }
  // Gets the article with the given id
  // getArticle: function(id) {
  //   return axios.get("/api/articles/" + id);
  // },
  // // Deletes the article with the given id
  // deleteArticle: function(id) {
  //   return axios.delete("/api/articles/" + id);
  // },

};
