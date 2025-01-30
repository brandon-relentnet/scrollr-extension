import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer.js'; // adjust path as needed

let store;

// Initialize the store by loading from chrome.storage
chrome.storage.local.get(['appState'], (result) => {
    const preloadedState = result.appState || undefined;
    store = configureStore({ reducer: rootReducer, preloadedState });

    // Persist to chrome.storage on every store update
    store.subscribe(() => {
        const state = store.getState();
        chrome.storage.local.set({ appState: state });
    });
});

// Listen for messages from popup/content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!store) {
        sendResponse({ error: 'Store not ready' });
        return true;
    }

    if (message.type === 'GET_STATE') {
        sendResponse({ state: store.getState() });
    } else if (message.type === 'DISPATCH_ACTION') {
        store.dispatch(message.action);
        // Respond with the updated state
        sendResponse({ state: store.getState() });
    }

    return true;
});