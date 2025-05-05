const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.get('/',async (req,res) => {
  const notes = await Note.find({}).populate('user',{ username:1,name:1 })
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


notesRouter.post('/', async (request,response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)


  const note = new Note({
    content: body.content,
    important: body.important || false,
    user:user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)

})


notesRouter.put('/:id',async (req,res) => {
  const { content , important } = req.body
  const note = { content , important }
  const updatedNote = await Note.findByIdAndUpdate(req.params.id,note,{ new:true })
  return res.json(updatedNote)
})

module.exports = notesRouter