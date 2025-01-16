import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CounterContextProvider } from './CounterContext'

createRoot(document.getElementById('root')).render(
  <CounterContextProvider>
    <App />
  </CounterContextProvider>,
)
