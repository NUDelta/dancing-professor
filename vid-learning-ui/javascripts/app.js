var model = {
  currentQuestion: {
    question: "What is the kinetic energy for a .250 kg ball traveling at .51 m/sec?",
    answers: [
      {
        image: "answer-2-moderate.png",
        explanation: "Melius principes concludaturque sed ne, idque luptatum efficiantur vim no, vis an postea vidisse omittantur. Cum cu alia harum praesent, ad etiam clita mel, eam et alii meliore platonem. Ipsum efficiantur qui ei. Te vero magna dicam sit. Ius volumus appellantur in, ut ius tamquam adolescens, sit cu ipsum evertitur reprimique.",
        correct: false
      },
      {
        image: "answer-3-bad.png",
        explanation: "this is why",
        correct: false
      },
      {
        image: "answer-1-best.png",
        explanation: "this is why",
        correct: true
      }
    ]
  }
};

var pageApp = angular.module("page-app", []);


/* Handling parameters for MTurk */
var prmstr = window.location.search.substr(1);
var prmarr = prmstr.split("&");
var params = {};
for (var i = 0; i < prmarr.length; i++) {
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

var vid = "EgKXcQ9PLuc"; // default video ID
if (params["id"]) {
  vid = params["id"]
}

var timestamps = [{"start": 154, "end": 290}];
var player;

function updatePlayerInfo() {
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
    quality: 'small',
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
  $scope.answersVisible = false;

  $scope.showQuestions = function () {
    $scope.answersVisible = true;
  };

  $scope.newResponse = function () {
    alert('foo bar');
  };

  $scope.validateAnswer = function (selection) {

  };
});

