window.onload = function(){

  var input = document.getElementById("time_out");
  var addUrl = document.getElementById("add_url");
  var urlList = document.getElementById("urls");
  var save = document.getElementById("save");

  if (localStorage["time_out"]) input.value = localStorage["time_out"];
  if (localStorage["whitelist"]) populateList();

  function populateList(){
    var firstField = document.getElementById("whitelist_0");
    urlList.removeChild(firstField);
    var urls = JSON.parse(localStorage["whitelist"]);
    for(i = 0; i < urls.length; i++) {
      if (urls[i]) {
        var newUrl = document.createElement("input");
        newUrl.className = "whitelist";
        newUrl.value = urls[i];
        var inputFields = document.getElementsByClassName("whitelist");
        urlList.insertBefore(newUrl, inputFields[0]);
      }
    }
  }

  addUrl.addEventListener("click", function() {
    var newUrl = document.createElement("input");
    newUrl.className = "whitelist";
    var inputFields = document.getElementsByClassName("whitelist");
    urlList.insertBefore(newUrl, inputFields[0]);
  }, false);

  save.addEventListener("click", function(){
    // save timeout
    var input = document.getElementById("time_out");
    var time_out = input.value;
    localStorage["time_out"] = time_out;

    // save whitelist
    var urls = document.getElementsByClassName("whitelist"), urlList = [];
    for (i=0; i < urls.length; i++) {
      if (urls[i].value && urls[i].value !== "") urlList.push(urls[i].value);
    }
    localStorage["whitelist"] = JSON.stringify(urlList);

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Saved!";
    setTimeout(function() {
      status.innerHTML = "";
    }, 750);
  }, false);

}
