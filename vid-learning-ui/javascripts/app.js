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
    question: "Which of these is the best explanation of variance?",
    answers: [
      {
        image: "VarianceI.png",
        explanation: "Variance measures how far a set of numbers is spread out. A variance of zero indicates that all the values are identical.",
        correct: false,
        followUp: "Two sets of data with the same variance can have different spread of data."
      },
      {
        image: "VarianceII.png",
        explanation: 'Variance describes the "spread" of data in a given distribution of values. The variance of data is captured by the deviation of each value from the data\'s average. In the video, Prof. calculates individual deviations by subtracting a datapoint (x) from the overall average (x^hat) and then taking the square root (mostly just to make sure the deviations are described as positive numbers). Finally, the overall "variance" is computed by obtaining the average of the tallied deviations across all values. Thus, distributions with "high variance" mean that the values are "spread" far away from each other. On the other hand, distributions with low variance mean that the datapoints are close to each other.',
        correct: true,
        followUp: "Correct! Good job!"
      },
      {
        image: "VarianceIII.png",
        explanation: "Variance is always non-negative: a small variance indicates that the data points tend to be very close to the median and hence to each other.",
        correct: false,
        followUp: "The variance is measured around the mean not the median."

      },
      {
        image: "VarianceIV.png",
        explanation: " Variance is calculated by first calculating the mean, then subtracting the mean from every number in the list, creating a new list. To make the new list all positive and workable, you square each value then take an average of the new list.",
        correct: false,
        followUp: "This is a definition of variance but it doesn't give intuition of what variance means."
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

var timestamps = [{"start": 280, "end": 290}];
var player;
var hasBeenPaused = false;

function updatePlayerInfo() {
  for (var i in timestamps) {
    var peak = timestamps[i];
    // only trigger the first time (video not paused)
    if (!hasBeenPaused && player.getPlayerState() != 2 && parseInt(player.getCurrentTime()) == parseInt(peak["end"])) {
      document.getElementById("hiddenTrigger").click();
      hasBeenPaused = true;
    }

    if (parseInt(player.getCurrentTime()) > parseInt(peak["end"]) || parseInt(player.getCurrentTime()) < parseInt(peak["end"])) {
      hasBeenPaused = false;
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
    if (parseInt(player.getCurrentTime()) > 30 && parseInt(player.getCurrentTime()) < 60) {
      $scope.model.currentQuestion = questions[0];
      $scope.emptyState = false;
    } else {
      $scope.emptyState = true;
    }

    if ($scope.answersVisible) {
      $scope.answersVisible = false
    } else {
      $scope.answersVisible = true;
      player.pauseVideo();
    }
  };

  $scope.newResponse = function () {
    $scope.emptyState = true;
    $scope.answersVisible = true;
  };

  $scope.triggerAuto = function () {
    $scope.model.currentQuestion = questions[1];
    $scope.emptyState = false;
    $scope.answersVisible = true;
    player.pauseVideo();
  };

  $scope.proceed = function () {
    $scope.answersVisible = false;
    $scope.emptyState = false;

    player.playVideo()
  };

  $scope.validateAnswer = function (answer) {
    if (answer.correct) {
      answer.colorGreen = true;
    } else {
      answer.colorRed = true;
    }
  };
});

