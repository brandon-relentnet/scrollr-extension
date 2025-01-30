(function () {
  let iframe = null;

  function injectIframe() {
    if (!document.getElementById("scrollr-ticker-iframe")) {
      console.log("Injecting iframe");
      iframe = document.createElement("iframe");
      iframe.src = chrome.runtime.getURL("content.html");
      iframe.id = "scrollr-ticker-iframe";
      iframe.style.position = "fixed";
      iframe.style.bottom = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.zIndex = "9999";
      iframe.style.border = "none";
      iframe.style.height = "166px";
      iframe.style.pointerEvents = "auto";
      iframe.style.overflow = "hidden";
      document.body.appendChild(iframe);
    }
  }

  function removeIframe() {
    if (iframe) {
      iframe.remove();
      iframe = null;
      console.log("Iframe removed");
    }
  }

  // Check initial state
  chrome.storage.local.get(['appState'], (result) => {
    if (result.appState?.iframe?.enabled) {
      injectIframe();
    }
  });

  // Listen for toggle messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'TOGGLE_IFRAME') {
      message.enabled ? injectIframe() : removeIframe();
    }
  });
})();