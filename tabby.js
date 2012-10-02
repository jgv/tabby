var tabs = [], timers = [], selected, timeout, timerIncrement = 2, dev = true;

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
}    

function timer (id) {
  timers[id] = setInterval(checkTabs, 1000 * timerIncrement); // playing with the timer interval for performance
}

function stopTimer (id) {
  clearInterval(timers[id]);
}

function resetTimer (id) {
  for (i = 0; i < tabs.length; i++) {
    if (tabs[i].id == id) tabs[i].counter = 0;
  }
}

function killTab (tab) {
  chrome.tabs.remove(tab.id);
}

function checkTabs () {
  for (i = 0; i < tabs.length; i++) {
    tabs[i].counter = (tabs[i].id === selected) ? tabs[i].counter : tabs[i].counter + timerIncrement;
    if (tabs[i].counter >= timeout) {
      if(!tabs[i].persist) killTab(tabs[i]);
    }
  }
}

// Chrome API interacitons
chrome.tabs.onCreated.addListener(function (tab) {
  new Tab(tab);
});


chrome.tabs.onRemoved.addListener(function(id, info){
  stopTimer(id);
  for (i = 0; i < tabs.length; i++) {
    if (tabs[i].id == id) tabs.splice(i, 1);
  }
});

chrome.tabs.onSelectionChanged.addListener(function (id) {
  selected = id;
  resetTimer(id);
});
