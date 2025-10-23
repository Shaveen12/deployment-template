import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function App() {
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [echoInput, setEchoInput] = useState('')
  const [echoResponse, setEchoResponse] = useState(null)

  const fetchHello = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/api/hello`)
      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendEcho = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/api/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: echoInput }),
      })
      const data = await response.json()
      setEchoResponse(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <div className="App">
      <h1>Auto-TLS React + Node Stack</h1>
      
      <div className="card">
        <h2>API Status</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {apiResponse && (
          <div className="response">
            <p><strong>Message:</strong> {apiResponse.message}</p>
            <p><strong>Time:</strong> {apiResponse.time}</p>
          </div>
        )}
        <button onClick={fetchHello} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="card">
        <h2>Echo Test</h2>
        <input
          type="text"
          value={echoInput}
          onChange={(e) => setEchoInput(e.target.value)}
          placeholder="Enter message to echo"
        />
        <button onClick={sendEcho} disabled={loading || !echoInput}>
          Send Echo
        </button>
        {echoResponse && (
          <div className="response">
            <p><strong>Echo:</strong> {JSON.stringify(echoResponse)}</p>
          </div>
        )}
      </div>

      <div className="info">
        <p>Frontend: <code>{window.location.origin}</code></p>
        <p>API Base: <code>{API_BASE}</code></p>
      </div>
    </div>
  )
}

export default App
