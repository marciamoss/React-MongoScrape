import React from "react";


// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
function DeleteBtn(props) {
  return (
    <button {...props} style={{ float: "right", marginBottom: 10}} className="delete-btn btn btn-danger ml-1">
      Delete
    </button>
  );
}

export default DeleteBtn;
