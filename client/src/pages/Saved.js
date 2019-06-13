import React, { Component } from "react";
// import SaveBtn from "../components/SaveBtn";
import API from "../utils/API";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
// import { FormBtn } from "../components/Form";
import Nav from "../components/Nav";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


class Saved extends Component {
    constructor (props) {
        super(props);
        this.state = {
            news:[],
            message:"",
            newsid:"",
            previousnotes:{newsid:"",notes:[]},
            show: false,
            handleClose() {
                this.setState({ show: false });
            },
            handleShow() {
                this.setState({ show: true });
            }
        }
    };

    componentDidMount() {
        API.getArticles()  
        .then(res => {
            this.setState({ news: res.data });
        })
        .catch(err => console.log(err));
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
    };

    addNotes = news => {
        this.setState({show:news.show, handleClose: news.handleClose, newsid:news._id,previousnotes:{newsid:"",notes:[]}});
        const notes={type:"getnotes",newsid: news._id}
        API.scrapeArticles(notes)
        .then(res => {
            this.setState({previousnotes: {newsid: res.data[0]._id, notes:res.data[0].notes}});
          })
        .catch(err => console.log(err));
    };

    notesToDb = news => {
        if(this.state.message !== ""){
        const notes={type:"addnote",notes:this.state.message,newsid:this.state.newsid}
        API.scrapeArticles(notes)
        .then(res => {
            this.setState({message:"",newsid:""});
            this.state.handleClose();
          })
        .catch(err => console.log(err));
        }else{
            this.state.handleClose();
        }
        
    };

    deletenote = id => {
        const deletetype={type:"deletenote",id:id.notesid,newsid:id.newsid}
        API.scrapeArticles(deletetype)
        .then(res => {
            let newlist = (this.state.previousnotes.notes).filter(function( obj ) {
                return obj._id !== res.data;
            });
            this.setState({ previousnotes:{newsid:this.state.previousnotes.newsid,notes:newlist}});
          })
        .catch(err => console.log(err));
    };

    delete = id => {
        const deletetype={type:"deletenews",id}
        API.scrapeArticles(deletetype)
        .then(res => {
            setTimeout(function(){ window.location.href = '/saved'; }, 100);
          })
        .catch(err => console.log(err));
    };


    render() {
        return (
            <>
            <Nav page={"savedpage"}/>
            <Container fluid>
                <Row>
                    <Col size="md-12">
                        <div className="row ml-5 mr-5 mt-5">
                        {/* Add notes modal */}
                        <>
                            <Modal show={this.state.show} onHide={this.state.handleClose}>
                                <Modal.Header closeButton>
                                    <h5 className="modal-title">Add Notes about this Article..</h5>
                                </Modal.Header>
                                <Modal.Body style={{fontWeight: "bold"}}>
                                    <List >
                                    {(this.state.previousnotes.notes).map((notes,index) => (
                                        <ListItem key={index}>{notes.usernote}
                                            <span data-id={this.state.previousnotes.newsid} style={{ float: "right"}} onClick={(event) => {
                                                        event.preventDefault();
                                                        this.deletenote({notesid:notes._id,newsid:this.state.previousnotes.newsid})}}
                                                    >
                                                X
                                            </span>
                                        </ListItem>
                                    ))}
                                    </List>
                                    <form id="updateform">
                                        <div className="form-group">
                                            <p>Notes</p>
                                            <textarea name="message" onChange={this.handleInputChange} rows="4" cols="60" ></textarea>
                                        </div>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={this.notesToDb}>
                                        Submit
                                    </Button>
                                    <Button variant="primary" onClick={this.state.handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
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
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        let handleCloseCopy = this.state.handleClose.bind(this);
                                                        news.show = true;
                                                        news.handleClose = handleCloseCopy;
                                                        this.addNotes(news)}}
                                                    >
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
