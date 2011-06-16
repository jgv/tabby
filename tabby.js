var tabs = [];
var timerId, selected;
var localhostOpt = localStorage["localhost"] || true; // assume we want to block localhost from closing
var timeout = localStorage["time_out"] ? localStorage["time_out"] * 60 : 600; // default to ten minutes
//var timeout = 10; // 'dev mode'

// tab constructor
function Tabby (tab) {
    this.id = tab.id;
    this.counter = 0;
    this.tab = tab;
    tabs.push(this);
    this.timer = setInterval(checkTabs, 2000);
}

// destroy timer
function stopTimer (timerId) {
    clearInterval(timerId);
}

// destroy tab, stop its timer, and remove it from tab array
function killTab (tab) {
    chrome.tabs.remove(tab.id, function (){
        stopTimer(tab.timer);
        tabs.splice(tabs.indexOf(tab), 1);  
    }); 
}

// tab polling    
function checkTabs () {    
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id != selected) {
            tabs[i].counter = tabs[i].counter + 2; // bc the timeout is at 2 seconds
        }
        if (tabs[i].counter >= timeout) {
            killTab(tabs[i]);
        }
        // console.log(tabs[i].id + ': ' + tabs[i].counter);
    }
}

// Chrome API interacitons
chrome.tabs.onCreated.addListener(function (tab) {
    new Tabby(tab);
});

chrome.tabs.onRemoved.addListener(function (tabId) {
   for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === tabId) {            
            return false;
        } else {
            chrome.tabs.remove(tabId, function() {
                                   tabs.splice(tabs.indexOf(tabs[i]), 1);  
                               });   
        }       
    }
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {                                      
    // i want to keep dev tabs open
    if (localStorage["localhost"] && (/localhost/.test(changeInfo.url) || /127.0.0.1/.test(changeInfo.url))){
        stopTimer(timerId);
        return false;
    } else {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].id === tabId) {
                tabs[i].counter = 0;
            }
        }                              
    }           
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
    selected = tabId;
});
