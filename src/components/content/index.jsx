// content/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import ContentApp from './ContentApp.jsx';
import { initializeProxyStore } from '../../store/proxyStore.js';

import '../../css/index.css';
import '../../utils/fontAwesome';

initializeProxyStore().then((store) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <ContentApp />
        </Provider>
    );
});