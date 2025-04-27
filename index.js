require('dotenv').config()
const Note = require('./models/note')
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



app.get('/api/notes/:id',(req,res)=>{
    const id = req.params.id
    const note = notes.find(n => n.id === id)
    if(note){
        res.json(note)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/notes/:id',(req,res)=>{
    const id = req.params.id
    notes = notes.filter(note => note.id != id)

    res.status(204).end()
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
      console.log(saved,'has been saved!')
    })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)