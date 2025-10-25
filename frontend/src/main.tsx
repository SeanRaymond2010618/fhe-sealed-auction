import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './auctions/App.tsx'
import './auctions/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)