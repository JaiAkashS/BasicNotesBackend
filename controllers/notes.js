const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/',(req,res) => {
  Note.find({}).then( notes => {
    res.json(notes)
  }
  )
})



notesRouter.get('/:id',(req,res,next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }})
    .catch(error => { next(error)
    })

})

notesRouter.delete('/:id',(req,res,next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(result => {
      if(result){console.log('Note has been deleted result:',result)
        res.status(204).end()}
      else{
        res.status(404).send({ error:'Note is not found' })
      }
    })
    .catch(error => next(error))
})


notesRouter.post('/', (req,res,next) => {
  const body = req.body


  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  note.save().then(saved => {
    res.json(saved)
  })
    .catch(error => next(error))
})


notesRouter.put('/:id',(req,res,next) => {
  const { content , important } = req.body

  Note.findById(req.params.id)
    .then(note => {
      if(!note){
        return res.status(404).send({ error:'Note not found' })
      }
      note.content = content
      note.important = important

      return note.save().then((newNote) => {
        res.json(newNote)
      })
    }).catch(error => next(error))

})

module.exports = { notesRouter }