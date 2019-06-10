import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


function PopUps(props) {
    
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{fontWeight: "bold"}}>{props.modaltxt}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.handleClose}>
                    Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PopUps;