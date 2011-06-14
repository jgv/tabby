(function () {
    var port = chrome.extension.connect();

    var youtubeCheck = onYouTubePlayerReady();
    chrome.extension.sendRequest(youTubeCheck);

    function onYouTubePlayerReady (tab) {
        ytplayer = document.getElementById("movie_player");
        state = ytplayer.getPlayerState();
        return state;
    }
}();
