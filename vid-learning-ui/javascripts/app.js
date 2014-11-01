var model = {
  currentImage: randomPic(),
  jobList: randomJobs(),
  totalSelectMap: {},
  currentSelectMap: {}
};

var todoApp = angular.module("page-app", []);

todoApp.run(function ($http) {
//  do stuff
});


todoApp.controller("PageCtl", function ($scope, $http) {
  $scope.model = model;

});

