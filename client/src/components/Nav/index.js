import React from "react";
import { FormBtn } from "../../components/Form";
function Nav(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info">
      <div className="container">
      <a className="navbar-brand" href="/">
        Mongo Scraper
      </a>
      <a className="navbar-brand" href="/">
        Saved Articles
      </a>
      <form>  
        
        <FormBtn
            onClick={props.handleScrape}
        >
          Scrape Articles From NYTimes
        </FormBtn>
      </form>  
      </div>
    </nav>
  );
}

export default Nav;
