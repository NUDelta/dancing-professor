
var Player = function ($, window, document) {

    var timestamps = [];



    return {
        init: init,
        onPlayerStateChange: onPlayerStateChange,
        updatePlayerInfo: updatePlayerInfo
    }

}(jQuery, window, document);