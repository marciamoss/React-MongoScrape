const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  usernote: String,
  news: [
    {
      type: Schema.Types.ObjectId,
      ref: "News"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;