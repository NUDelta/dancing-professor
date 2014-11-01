var questions = [
  {
    question: "What is the kinetic energy for a .250 kg ball traveling at .51 m/sec?",
    answers: [
      {
        image: "answer-2-moderate.png",
        explanation: "Melius principes concludaturque sed ne, idque luptatum efficiantur vim no, vis an postea vidisse omittantur. Cum cu alia harum praesent, ad etiam clita mel, eam et alii meliore platonem. Ipsum efficiantur qui ei. Te vero magna dicam sit. Ius volumus appellantur in, ut ius tamquam adolescens, sit cu ipsum evertitur reprimique.",
        correct: false,
        followUp: "This is close, but we need to square the velocity"
      },
      {
        image: "answer-3-bad.png",
        explanation: "Id duis partiendo nec. Alia iuvaret alterum cu has, aliquip gloriatur vix in. Eu mei nullam animal, vis aperiam petentium at, dicat consul est et. His te velit aliquip conceptam.",
        correct: false,
        followUp: "Don't stop short in the solution, keep going!"
      },
      {
        image: "answer-1-best.png",
        explanation: "Stet quidam pertinacia ut sea, cu audire integre argumentum sed. Tation voluptua erroribus te duo. Ex congue euripidis referrentur mel, sanctus albucius percipit te pro.",
        correct: true,
        followUp: "This is the best and correct solution"
      }
    ]
  },
  {
    question: "What is the foo bim bazz?",
    answers: [
      {
        image: "answer-2-moderate.png",
        explanation: "Melius principes concludaturque sed ne, idque luptatum efficiantur vim no, vis an postea vidisse omittantur. Cum cu alia harum praesent, ad etiam clita mel, eam et alii meliore platonem. Ipsum efficiantur qui ei. Te vero magna dicam sit. Ius volumus appellantur in, ut ius tamquam adolescens, sit cu ipsum evertitur reprimique.",
        correct: false,
        followUp: "This is close, but we need to square the velocity"
      }
    ]
  }
];

var pageScope = null;
var model = {
  currentQuestion: {}
};

var pageApp = angular.module("myApp", []);


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

var vid = "2NIG1bt8aPU"; // default video ID
if (params["id"]) {
  vid = params["id"]
}

var timestamps = [{"start": 1, "end": 5}];
var player;
var hasBeenPaused = false;

function updatePlayerInfo() {
  for (var i in timestamps) {
    var peak = timestamps[i];
    // only trigger the first time (video not paused)
    if (!hasBeenPaused && player.getPlayerState() != 2 && parseInt(player.getCurrentTime()) == parseInt(peak["end"])) {
      document.getElementById("hiddenTrigger").click();
      player.pauseVideo();
      hasBeenPaused = true;
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
        setInterval(updatePlayerInfo, 1000);
      },
      'onStateChange': function (event) {
        if (event.data == YT.PlayerState.PLAYING) {
          //setTimeout(function () {
          //}, 6000);
        }
      }
    }
  });
};

pageApp.run(function ($http) {
  createPlayer();
});

pageApp.controller("PageCtl", function ($scope, $http) {
  pageScope = $scope;
  $scope.model = model;
  $scope.answersVisible = false;

  $scope.showQuestions = function () {
    model.currentQuestion = questions[1];

    if ($scope.answersVisible) {
      $scope.answersVisible = false
    } else {
      $scope.answersVisible = true;
    }
  };

  $scope.newResponse = function () {
    alert('foo bar');
  };

  $scope.triggerAuto = function () {
    $scope.model.currentQuestion = questions[0];
    $scope.answersVisible = true;
  };

  $scope.proceed = function () {
    if (!$scope.model.currentQuestion || !$scope.model.currentQuestion.question){
      return;
    }

    if ($scope.answersVisible) {
      $scope.answersVisible = false;
    } else {
      $scope.answersVisible = true;
    }

    if (player.getPlayerState() == 2){
      player.playVideo()
    }
  };

  $scope.validateAnswer = function (answer) {
    if (answer.correct) {
      answer.colorGreen = true;
    } else {
      answer.colorRed = true;
    }
  };
});

