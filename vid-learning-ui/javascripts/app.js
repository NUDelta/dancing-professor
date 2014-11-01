var model = {
  totalSelectMap: {},
  currentSelectMap: {}
};

var pageApp = angular.module("page-app", []);


/* Handling parameters for MTurk */
var prmstr = window.location.search.substr(1);
var prmarr = prmstr.split("&");
var params = {};
for ( var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
}

var id = params["id"];
var isPreview = false;
if (typeof params["assignmentId"] === "undefined" || params["assignmentId"] == "ASSIGNMENT_ID_NOT_AVAILABLE")
    isPreview = true;
if (typeof params["preview"] !== "undefined" && params["preview"] == 0)
    isPreview = false;

var workerId = "";
if (typeof params["workerId"] !== "undefined")
    workerId = params["workerId"];

var vid = "2NIG1bt8aPU"; // default video ID
if (params["id"]) {
    vid = params["id"]
}

var timestamps = [{"start": 154, "end": 290}];
var player;

function updatePlayerInfo(){
  for (var i in timestamps) {
    var peak = timestamps[i];
    // only trigger the first time (video not paused)
    if (player.getPlayerState() != 2 && parseInt(player.getCurrentTime()) == parseInt(peak["end"])) {
      console.log("End of a peak, prompt!");
    }
  }
}

var createPlayer = function () {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: vid,
    events: {
      'onReady': function (event) {
        event.target.playVideo();
        //    player.stopVideo();
        setInterval(updatePlayerInfo, 1000);
      },
      'onStateChange': function (event) {
        if (event.data == YT.PlayerState.PLAYING) {
          setTimeout(function () {
            player.pauseVideo();
          }, 6000);
        }
      }
    }
  });
};

pageApp.run(function ($http) {
  createPlayer();


});

pageApp.controller("PageCtl", function ($scope, $http) {
  $scope.model = model;
});

