import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import store from './store';
import Theme from './features/theme/Theme';
import './css/index.css'
import App from './App.jsx'
import Accent from './features/accent/Accent.jsx';
import FontFamily from './features/font-family/FontFamily.jsx';
import './utils/fontAwesome';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <Theme />
      <Accent />
      <FontFamily />
      <App />
    </Provider>
)
