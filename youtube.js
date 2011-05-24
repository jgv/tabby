var port = chrome.extension.connect();

function onYouTubePlayerReady (tab) {
    ytplayer = document.getElementById("movie_player");
    state = ytplayer.getPlayerState();
    return state;
}
