var tabs = [];
var timeout = localStorage["time_out"] * 60000 || 60000; // default to ten minutes
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
    tabs.splice(tabs.indexOf(tab), 1);    
    console.log('killing:' + tabs.indexOf(tab, 0));
}

function checkTabs () {
    console.log(timeout);
    for (i = 0; i < tabs.length; i++) {
        if (tabs[i].id != selected) {
            tabs[i].counter = tabs[i].counter + 2; // bc the timeout is at 2 seconds
        }
        if (tabs[i].counter >= timeout) {            
            killTab(tabs[i], timerId);
        }
        // console.log(tabs[i].id + ': ' + tabs[i].counter);
    }
}

chrome.tabs.onCreated.addListener(tabWasCreated);
chrome.tabs.onUpdated.addListener(tabWasUpdated);
chrome.tabs.onSelectionChanged.addListener(tabIsSelected);
chrome.tabs.onRemoved.addListener(killTab);