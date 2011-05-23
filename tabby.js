var tabs = [];
var timeout = 20; // fifteen minutes... this seems to go by really quick though
var timerId, selected;

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

function tabIsSelected (id) {
    selected = id;
}

function Tab (tabId, changeInfo, tab) {
    this.id = tabId.id;
    this.counter = 0;
    tabs.push(this);
    timer(this.id);
}

function timer (id) {
    timerId = setInterval(checkTabs, 2000); // playing with the timer interval for performance
}

function stopTimer (timerId) {
    clearInterval(timerId);
}

function killTab (tab, timerId) {
    chrome.tabs.remove(tab.id);
    stopTimer(timerId);
    tabs.splice(tabs.indexOf(tab, 1));    
}

function checkTabs () {
    for (i = 0; i < tabs.length; i++) {
        if (tabs[i].id != selected) {
            tabs[i].counter++;
        }
        if (tabs[i].counter >= timeout) {            
            killTab(tabs[i], timerId);
        }
  //      console.log(tabs[i].id + ': ' + tabs[i].counter);
    }
}

chrome.tabs.onCreated.addListener(tabWasCreated);
chrome.tabs.onUpdated.addListener(tabWasUpdated);
chrome.tabs.onSelectionChanged.addListener(tabIsSelected);
chrome.tabs.onRemoved.addListener(killTab);