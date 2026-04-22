import './App.css'
import Login_Page from './pages/login'
import Stream_Page from './pages/stream_page'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element={<Login_Page />} />
          <Route path = "/stream" element={<Stream_Page />} />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
