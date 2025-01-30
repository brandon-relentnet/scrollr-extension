// content/proxyStore.js
// Identical to popup/proxyStore.js

let currentState = null;
let listeners = [];

function loadInitialState() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
            if (response && response.state) currentState = response.state;
            resolve();
        });
    });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.appState) {
        currentState = changes.appState.newValue;
        for (const listener of listeners) {
            listener();
        }
    }
});

function getState() {
    return currentState;
}

function dispatch(action) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'DISPATCH_ACTION', action }, (response) => {
            if (response && response.state) {
                currentState = response.state;
                for (const listener of listeners) {
                    listener();
                }
            }
            resolve(currentState);
        });
    });
}

function subscribe(listener) {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
}

function replaceReducer() { }

export async function initializeProxyStore() {
    await loadInitialState();
    return { getState, dispatch, subscribe, replaceReducer };
}