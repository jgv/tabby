//(function(){

var tabs = timers = [], selected, timeout, timerIncrement = 2, dev = false;

// set the timeout
dev ? timeout = 10 : timeout = localStorage["time_out"] * 60 || 600;

function Tab (tab) {
  this.id = tab.id;
  this.counter = 0;
  this.url = tab.url;
  if (checkWhitelist(this.url) || tab.url.match("chrome-devtools")) this.persist = true
  return this;
}

function checkWhitelist (url) {
  if (localStorage["whitelist"]) {
    var urls = JSON.parse(localStorage["whitelist"]);
    if (urls.length > 0) {
      var re = new RegExp(urls.join("|", "i"));
      if (re.test(url)) {
        return true;
      } else {
        return false;
      }
    }
  }
}

function timer (id) {
  timers[id] = setInterval(checkTabs, 1000 * timerIncrement); // playing with the timer interval for performance
}

function stopTimer (id) {
  clearInterval(timers[id]);
}

function resetTimer (id) {
  for (tab in tabs){
    if (tabs[tab] && tabs[tab].id == id) tabs[tab].counter = 0;
  }
}

function killTab (tab) {
  var killing = tab.id;
  chrome.tabs.remove(killing);
  for (tab in tabs){
    if (tabs[tab].id == killing) {
      tabs.splice(tab, 1);
      break;
    }
  }
}

function checkTabs () {
  for (tab in tabs) {
    if (tabs[tab] || tabs[tab].id){
      tabs[tab].counter = (tabs[tab].id === selected) ? tabs[tab].counter = 0 : tabs[tab].counter + timerIncrement;
      if (tabs[tab].counter >= timeout && !tabs[tab].persist) killTab(tabs[tab]);
    }
  }
}

chrome.tabs.onRemoved.addListener(function(id, info){
  stopTimer(id);
  for (tab in tabs) {
    if (tabs[tab].id == id){
      tabs.splice(tab, 1)
      break;
    }
  }
});

chrome.tabs.onCreated.addListener(function(tab){
  var newTab = new Tab(tab);
  if (typeof newTab == "object") {
    timer(newTab.id);
    tabs.push(newTab);
  }
});

chrome.tabs.onUpdated.addListener(function(id, changeInfo, tab){
  if (tab.selected === true){
    selected = id;
    resetTimer(id);
  }
  for (tab in tabs) {
    if (tabs[tab].id == id && changeInfo.url) {
      tabs[tab].url = changeInfo.url;
      if (checkWhitelist(changeInfo.url)) tabs[tab].persist = true;
      break;
    }
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo){
  selected = activeInfo.tabId;
  resetTimer(activeInfo.tabId);
});

//}).call(this);
