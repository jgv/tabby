var tabs = [], timerId, selected, timeout, tabId, dev = false;

// set the timeout
dev ? timeout = 10 : localStorage["time_out"] * 60 || 600; 

function Tab (tab) {
  this.id = tab.id;
  this.counter = 0;
  if (localStorage["whitelist"]) {
    var urls = JSON.parse(localStorage["whitelist"]);
    var re = new RegExp(urls.join("|", "i"));
    var url = tab.url;
    if (url.match(re)) this.persist = true;
  }
  tabs.push(this);
  timer(this.id);
  console.log(this);
}    

function timer (id) {
  timerId = setInterval(checkTabs, 2000); // playing with the timer interval for performance
}

function stopTimer (timerId) {
  clearInterval(timerId);
}

function killTab (tab, timerId) {
  if (tab !== undefined && tab.id !== undefined) {
    chrome.tabs.remove(tab.id, function (){
      stopTimer(timerId);
      tabs.splice(tabs.indexOf(tab), 1);
    })(tab,timerId);
  }
}

function checkTabs () {
  for (i = 0; i < tabs.length; i++) {
    tabs[i].counter = (tabs[i].id === selected) ? tabs[i].counter : tabs[i].counter + 2;
    if (tabs[i].counter >= timeout) {
      if (!tabs[i].persist) {
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

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
  selected = tabId;
});
