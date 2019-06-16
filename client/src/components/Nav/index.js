import React from "react";
import { FormBtn } from "../../components/Form";
import { Link } from "react-router-dom";

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
              <Link to="/" style={{color:"white"}}>← Back to Scraper</Link>
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
