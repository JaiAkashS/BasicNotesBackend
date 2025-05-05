const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/',async (req,res) => {
  const notes = await Note.find({})
  res.json(notes)
})



notesRouter.get('/:id',async (req,res,next) => {
  try{
    const note = await Note.findById(req.params.id)
    if(note){
      res.json(note)
    }else{
      res.status(404).end()
    }
  }
  catch(exception){
    next(exception)
  }


})

notesRouter.delete('/:id', async (req,res) => {
  await Note.findByIdAndDelete(req.params.id)
  res.status(204).end()
})


notesRouter.post('/', async (req,res) => {
  const body = req.body

  const user = await User.findById(body.userId)


  const note = new Note({
    content: body.content,
    important: body.important || false,
    user:user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  res.status(201).json(savedNote)

})


notesRouter.put('/:id',async (req,res) => {
  const { content , important } = req.body
  const note = { content , important }
  const updatedNote = await Note.findByIdAndUpdate(req.params.id,note,{ new:true })
  return res.json(updatedNote)
})

module.exports = notesRouter