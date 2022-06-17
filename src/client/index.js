import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import { AppProvider } from './context'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
