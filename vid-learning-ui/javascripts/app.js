var model = {
  totalSelectMap: {},
  currentSelectMap: {}
};

var pageApp = angular.module("page-app", []);

var createPlayer = function () {
  var player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': function (event) {
        event.target.playVideo();
        //    player.stopVideo();
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

