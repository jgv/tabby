var port = chrome.extension.connect();

function onYouTubePlayerReady (tab) {
    ytplayer = document.getElementById("movie_player");
    return ytplayer.getPlayerState();
}