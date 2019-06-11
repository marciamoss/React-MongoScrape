import React, { Component } from "react";
// import SaveBtn from "../components/SaveBtn";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
// import { List, ListItem } from "../components/List";
// import { FormBtn } from "../components/Form";
// import PopUps from "../components/PopUps";
import Nav from "../components/Nav";

class Saved extends Component {
    constructor (props) {
        super(props);
        this.state = {
            news:[]
        }
    };

    componentDidMount() {
        API.getArticles()  
        .then(res => {
            this.setState({ news: res.data });
        })
        .catch(err => console.log(err));
    }

    addNotes = id => {
        console.log("add notes",id);
    };

    delete = id => {
        console.log("delete",id);
    };


    render() {
        return (
            <>
            <Nav page={"savedpage"}/>
            <Container fluid>
                <Row>
                    <Col size="md-12">
                        <div className="row ml-5 mr-5 mt-5">
                            <div  className="col-md-12 "> 
                                {((this.state.news).length > 0 ) ? (
                                    <div>
                                        {this.state.news.map(news => (
                                            <div className="card bg-light mb-3" key={news._id} data-id={news._id}>
                                            <div className="card-header" style={{backgroundColor:"#e6ffe6", color: "purple", fontWeight: "bold"}}>{news.headline}</div>
                                            <div className="card-body" style={{backgroundColor:"#ccffcc"}}>
                                            <h5 className="card-title"><a href={news.url} target="blank">{news.url}</a></h5>
                                                <p className="card-text"  style={{color: "blue", fontWeight: "bold"}}>{news.summary}</p>
                                                <form className="form-inline my-2 my-lg-0">
                                                    <button className="btn btn-md btn-info font-weight-bold my-2 my-sm-0 mr-2" data-id={news._id}
                                                    onClick={(event) => {event.preventDefault();this.addNotes(news._id)}}>
                                                        Add Notes
                                                    </button>
                                                    <button className="btn btn-md btn-danger font-weight-bold my-2 my-sm-0 mr-2" data-id={news._id}
                                                    onClick={(event) => {event.preventDefault();this.delete(news._id)}}>
                                                        Delete from saved
                                                    </button>
                                                </form>
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                    ) : (
                                        null
                                    )}
                            </div>
                        </div>       
                    </Col>
                </Row>
            </Container>
            </>
        );
    }

}

export default Saved;
