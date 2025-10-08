const express = require('express')
const multer = require('multer')
const fetch = require('node-fetch')
const FormData = require('form-data')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const upload = multer({ dest: path.join(__dirname, 'tmp') })

const OPENAI_KEY = process.env.OPENAI_API_KEY
if(!OPENAI_KEY) console.warn('OPENAI_API_KEY not set in env — /api endpoints will fail')

app.post('/api/whisper', upload.single('file'), async (req, res) => {
  try{
    const filePath = req.file.path
    const fd = new FormData()
    // include original filename and content type so OpenAI correctly recognizes the format
    fd.append('file', fs.createReadStream(filePath), { filename: req.file.originalname, contentType: req.file.mimetype })
    fd.append('model', 'whisper-1')

    const r = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: fd
    })
    const bodyText = await r.text()
    if(!r.ok){
      console.error('OpenAI transcription error', r.status, bodyText)
      // attempt to delete temp file
      try{ fs.unlinkSync(filePath) }catch(e){}
      return res.status(500).json({ error: bodyText })
    }
    let json
    try{ json = JSON.parse(bodyText) }catch(e){ json = { text: bodyText } }
    try{ fs.unlinkSync(filePath) }catch(e){}
    res.json({ transcript: json.text || '' })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

app.post('/api/chat', async (req, res) => {
  try{
    const { messages } = req.body
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages })
    })
    if(!r.ok){
      const txt = await r.text()
      throw new Error(txt)
    }
    const json = await r.json()
    res.json(json)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

const port = process.env.PORT || 3001
app.listen(port, ()=> console.log('server listening on', port))
