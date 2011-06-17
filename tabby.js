var tabs = [];
var timerId, selected;
//var timeout = localStorage["time_out"] * 60 || 600; // default to ten minutes
var timeout = 10; // 'dev mode'

function Tab (tab) {
    this.id = tab.id;
    this.counter = 0;
    this.video = /youtube.com\/watch/.test(tab.url) ? true : false;
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
    chrome.tabs.remove(tab.id, function (){
        stopTimer(timerId);
        tabs.splice(tabs.indexOf(tab), 1);
    })(tab,timerId);
}
    
function checkTabs () {
    for (i = 0; i < tabs.length; i++) {
        tabs[i].counter = (tabs[i].id === selected) ? tabs[i].counter : tabs[i].counter + 2;
        if (tabs[i].counter >= timeout) {
            if (!tabs[i].video) {
                killTab(tabs[i], timerId);
            }
            // console.log(tabs[i].id + ': ' + tabs[i].counter);
        }
    }
}
// Chrome API interacitons
chrome.tabs.onCreated.addListener(function (tab) {
    new Tab(tab);
});

chrome.tabs.onRemoved.addListener(function (tab) {
    chrome.tabs.remove(tab.id);
    tabs.splice(tabs.indexOf(tab), 1);
});

chrome.tabs.onUpdated.addListener(function (youtube, sender, sendResponse) {
    if (youtube) {
        for (n = 0; n < tabs.length; n++) {
            if (tabs[n].id === tabId) {
                tabs[n].counter = 0;            
                if (changeInfo.status === "loading" || "complete") {
                    tabs[n].video = /youtube.com\/watch/.test(tab.url) ? true : false;
                }
            }
        }
    }
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
    selected = tabId;
});
