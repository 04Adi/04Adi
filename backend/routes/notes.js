const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
// Route 1 :get All the notes using :GET"/api/auth/getuser".Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// Route 2 :Add a new Notes using :GET"/api/auth/getuser".Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // if there is any error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// Route 3 : update an existing Note using: Post "/api/auth/updatenote".Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try{
    const newNotes = {};
    if (title) { newNotes.title = title };
    if (description) { newNotes.description = description };
    if (tag) { newNotes.tag = tag };

    // Find the note to be update 
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNotes }, { new: true })
    res.json({ note });
}catch(error){
    console.error(error.message);
        res.status(500).send("Internal Server Error");
}
})

// Route 4 : delet an existing Note using: put "/api/notes/deletnote".Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    //const { title, description, tag } = req.body;
   try{
    // Find the note to be update and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not found") }
  // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id) 
    res.json({ "Success": "Note has been deleted",note:note });
}catch(error){
    console.error(error.message);
        res.status(500).send("Internal Server Error");

}
})


module.exports = router