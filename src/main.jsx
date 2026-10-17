import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//redux
import { Provider } from 'react-redux'
//import redux store.js
import store from './redux/store'
import './index.css'
import App from './App.jsx'
import './i18n'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
