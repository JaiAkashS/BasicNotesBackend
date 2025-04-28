require('dotenv').config()
const Note = require('./models/notes')
const express = require('express')
const app = express()



app.use(express.static('dist'))
app.use(express.json())

app.get('/api/notes',(req,res)=>{
    Note.find({}).then( notes =>{
      res.json(notes)
    }
    )
})



app.get('/api/notes/:id',(req,res,next)=>{
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

app.delete('/api/notes/:id',(req,res,next)=>{
  Note.findByIdAndDelete(req.params.id)
  .then(result=>{
    if(result){console.log("Note has been deleted result:",result)
    res.status(204).end()}
    else{
      res.status(404).send({error:"Note is not found"})
    }
  })
  .catch(error=>next(error))
})

  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
    note.save().then(saved=>{
      response.json(saved)
    })
})


app.put('/api/notes/:id',(req,res,next)=>{
  const {content , important} = req.body

  Note.findById(req.params.id)
  .then(note =>{
    if(!note){
      return res.status(404).send({error:'Note not found'})
    }
    note.content = content
    note.important = important
    
    return note.save().then((newNote)=>{
      res.json(newNote)
    })
  }).catch(error => next(error))

})



const errorHandler = (error,request,response,next) =>{
  console.log(error)
  if(error.name === 'CastError'){
    return response.status(404).send({error:'malformed Id'})
  }
  next(error)
}


app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)




