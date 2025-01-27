import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './store';
import Theme from './features/theme/Theme';
import './css/index.css'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Theme />
      <App />
    </Provider>
  </StrictMode>,
)
