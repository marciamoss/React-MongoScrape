import React, { Component } from "react";
// import SaveBtn from "../components/SaveBtn";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
// import { List, ListItem } from "../components/List";
// import { FormBtn } from "../components/Form";
// import PopUps from "../components/PopUps";
import Nav from "../components/Nav";

class Articles extends Component {
    constructor (props) {
        super(props);
        this.state = {
            news:[],
            delay: false,
            display: false,
            show: false,
            handleClose() {
                this.setState({ show: false });
            },
            handleShow() {
                this.setState({ show: true });
            },
            modaltxt:""
        };
    };

    componentDidMount() {
        const type={type:"load"}
        API.scrapeArticles(type)  
        .then(res => {
            this.setState({ news: res.data, delay: false, display: true });
        })
        .catch(err => console.log(err));
    }

    handleScrape = event => {
        event.preventDefault();
        this.setState({ delay: true});
        const type={type:"scrape"}
        API.scrapeArticles(type)        
        .then(res =>  {
            this.setState({ news: res.data, display: true });
          setTimeout(function(){ window.location.href = '/'; }, 3000);
          
        })
      .catch(err => console.log(err));
    };

    saveArticle = id => {
        const type={type:"saved",id};
        API.scrapeArticles(type)
          .then(res => {
              let newlist = this.state.news.filter(function( obj ) {
                return obj._id !== res.data;
              });
              this.setState({ news: newlist});
            })
          .catch(err => console.log(err));
    };

    render() {
        return (
            <>
            <Nav handleScrape={this.handleScrape}/>
            <Container fluid>
                <Row>
                    <Col size="md-12">
                        {!this.state.delay ? (    
                            <div className="row ml-5 mr-5 mt-5">
                                <div  className="col-md-12 "> 
                                    {((this.state.news).length > 0 && !(this.state.display)) ? (
                                        null
                                    ) : (
                                        
                                        <div>
                                        {(this.state.display && (this.state.news).length === 0) ? (
                                            <h3 style={{color: "red", textAlign: "center", fontWeight: "bold"}}>Scrape Articles to Display</h3>
                                            ):(
                                                <div>
                                                    {this.state.news.map(news => (
                                                        <div className="card bg-light mb-3" key={news._id} data-id={news._id}>
                                                        <div className="card-header" style={{backgroundColor:"#e6ffe6", color: "purple", fontWeight: "bold"}}>{news.headline}</div>
                                                        <div className="card-body" style={{backgroundColor:"#ccffcc"}}>
                                                        <h5 className="card-title"><a href={news.url} target="blank">{news.url}</a></h5>
                                                            <p className="card-text"  style={{color: "blue", fontWeight: "bold"}}>{news.summary}</p>
                                                            <form className="form-inline my-2 my-lg-0">
                                                            <button className="btn btn-md btn-success font-weight-bold my-2 my-sm-0 mr-2 " 
                                                            onClick={(event) => {event.preventDefault();this.saveArticle(news._id)}} >Save Article!</button>
                                                            </form>
                                                        </div>
                                                        </div>
                                                    ))}
                                                </div>
                                        )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="row ml-5 mr-5 mt-5">
                                <div  className="col-md-12 "> 
                                    <h3 style={{color: "red", textAlign: "center", fontWeight: "bold"}}>Scraping Articles ....(takes about 3 seconds)</h3>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default Articles;
