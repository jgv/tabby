var tabs = [];
var timeout = 900; // fifteen minutes... this seems to go by really quick though
var timerId;

function tabWasCreated (tabId, changeInfo, tab) {
    new Tab(tabId, changeInfo, tab);
}

function tabWasUpdated (tabId, changeInfo, tab) {
    for (n = 0; n < tabs.length; n++) {
        if (tabs[n].id === tabId) {
            tabs[n].counter = 0;
        }
    }
}

function tabWasRemoved (tabId, removeInfo) {
    for (i = 0; i < tabs.length; i++) {
        if (tabs[i].id === tabId.id) {
            tabs.splice(tabs.indexOf(tabs[i]), 1);
        }
    }
}

function Tab (tabId, changeInfo, tab) {
    this.id = tabId.id;
    this.counter = 0;
    tabs.push(this);
    timer(this.id);
}

function timer(id) {
    timerId = setInterval(checkTabs, 1000);
}

function stopTimer(timerId) {
    clearInterval(timerId);
}

function checkTabs () {
    for (i = 0; i < tabs.length; i++) {
        tabs[i].counter = tabs[i].counter + 1;
        if (tabs[i].counter >= timeout) {
            chrome.tabs.remove(tabs[i].id);
            tabs.splice(tabs.indexOf(tabs[i]), 1);
            stopTimer(timerId);
        }
    }
}

chrome.tabs.onCreated.addListener(tabWasCreated);
chrome.tabs.onUpdated.addListener(tabWasUpdated);
chrome.tabs.onRemoved.addListener(tabWasRemoved);
