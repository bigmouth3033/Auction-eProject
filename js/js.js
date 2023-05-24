let app = angular.module("auctionApp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider.when("/home", {
		templateUrl: "./html/home.html",
	});
});

app.service("DataService", function () {
	let paintingData = null;

	this.setPaintingData = function (data) {
		paintingData = data;
	};

	this.getPaintingData = function () {
		return paintingData;
	};
});

app.run(function ($http, DataService) {
	$http.get("../json/painting.json").then(
		function (response) {
			DataService.setPaintingData(response.data.abstractArt);
		},
		function (error) {
			console.log("something went horribly wrong with json file", error);
		}
	);
});

function myTimer(date, obj) {
	let now = new Date();
	let future = new Date(date);

	let timer = [];

	let timeLeft = future - now;
	let msLeft = timeLeft % 1000;

	let sTotal = (timeLeft - msLeft) / 1000;
	let sLeft = sTotal % 60;

	let mTotal = (sTotal - sLeft) / 60;
	let mLeft = mTotal % 60;

	let hTotal = (mTotal - mLeft) / 60;
	let hLeft = hTotal % 24;

	let dTotal = (hTotal - hLeft) / 24;

	timer.push(`${dTotal}d`);
	timer.push(`${hLeft}h`);
	timer.push(`${mLeft}m`);
	timer.push(`${sLeft}s`);

	obj.timer = timer.join(" : ");
}

app.controller("homeController", function ($scope, $interval, DataService) {
	$scope.paintingData = DataService.getPaintingData();

	for (let painting of $scope.paintingData) {
		$interval(function () {
			myTimer(painting.endDate, painting);
		}, 1);
	}
});
