var tabs = [];
var timerId, selected;
var timeout = localStorage["time_out"] * 60 || 600; // default to ten minutes
//var timeout = 20; // 'dev mode'


function youTube (tab) {
    ytplayer = document.getElementById("watch-player");
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    function onytplayerStateChange (newState) {
        if (newState === 'stopped') {  // pseduo code
            tabs.splice(tabs.indexOf(tab, 1));
            // kill the tab
        }
    }
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
    chrome.tabs.remove(tab.id, function (){
        stopTimer(timerId);
        tabs.splice(tabs.indexOf(tab), 1);  
    })(tab,timerId);
}
    
function checkTabs () {
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

// Chrome API interacitons
chrome.tabs.onCreated.addListener(function (tabId, changeInfo, tab) {
    new Tab(tabId, changeInfo, tab);
});

chrome.tabs.onRemoved.addListener(function (tab) {
    chrome.tabs.remove(tab.id);
    tabs.splice(tabs.indexOf(tab), 1);    
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    for (n = 0; n < tabs.length; n++) {
        if (tabs[n].id === tabId) {
            tabs[n].counter = 0;
        }
    }
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
    selected = tabId;
});
