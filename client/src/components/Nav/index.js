import React from "react";
import { FormBtn } from "../../components/Form";
function Nav(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
      <div className="container">
        <a className="navbar-brand" href="/">
          Mongo Scraper
        </a>
        <div>
          {!(props.page === "savedpage") ? (  
            <a className="navbar-brand" href="/saved">
              Saved Articles
            </a>
            ):(
              null
            )}
        </div>
        <form>  
          {!(props.page === "savedpage") ? (
          <FormBtn
              onClick={props.handleScrape}
          >
            Scrape Articles From NYTimes
          </FormBtn>
          ):(
            null
          )}
        </form>  
      </div>
    </nav>
  );
}

export default Nav;
