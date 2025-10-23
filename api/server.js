import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'

app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true
}))

app.use(express.json())

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the API! Your auto-TLS setup is working correctly.',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.post('/api/echo', (req, res) => {
  const body = req.body
  res.json({
    echo: body,
    receivedAt: new Date().toISOString()
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`)
  console.log(`Allowed origin: ${ALLOWED_ORIGIN}`)
})
