let app = angular.module("auctionApp", ["ngRoute"]);

app.config(function ($routeProvider) {
	$routeProvider
		.when("/home", {
			templateUrl: "./html/home.html",
		})
		.when("/signin", {
			templateUrl: "./html/signin.html",
		})
		.when("/signup", {
			templateUrl: "./html/signup.html",
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

	let isUser = false;

	this.isUser = function () {
		return isUser;
	};

	this.loginSuccess = function () {
		isUser = true;
	};

	this.logout = function () {
		isUser = false;
	};

	let allUserData = localStorage.getItem("allUserObject") ? JSON.parse(localStorage.getItem("allUserObject")) : { users: [] };

	this.setAllUserData = function (data) {
		allUserData = data;
	};

	this.getAllUserData = function () {
		return allUserData;
	};

	this.addNewUser = function (userData) {
		allUserData.users.push(userData);
	};

	this.getUser = function (username, password) {
		return allUserData.users.find((item) => item.username == username && item.password == password);
	};

	let currentUser = null;

	this.setCurrentUser = function (user) {
		currentUser = user;
	};

	this.getCurrentUser = function () {
		return currentUser;
	};
});

app.run(function ($rootScope, $http, DataService) {
	$rootScope.showBanner = true;

	$http.get("./json/painting.json").then(
		function (response) {
			DataService.setPaintingData(response.data.painting);
		},
		function (error) {
			console.log("something went horribly wrong with json file", error);
		}
	);

	$rootScope.indexUser = {};
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
	obj.timer = timer.join(" : ");
}

function getArrayOfIterationIndex(length, numberOfItem) {
	let arr = [];

	for (let i = 0; i < length; i++) {
		let subArr = [];

		for (let j = i; j < i + numberOfItem; j++) {
			if (j < length) {
				subArr.push(j);
			} else subArr.push(j - length);
		}

		arr.push(subArr);
	}

	return arr;
}

app.controller("homeController", function ($scope, $interval, DataService) {
	$scope.paintingData = DataService.getPaintingData();

	for (let painting of $scope.paintingData) {
		$interval(function () {
			myTimer(painting.endDate, painting);
		}, 1000);
	}

	$scope.numberOfDisplay = 3;
	$scope.iterationIndex = getArrayOfIterationIndex(12, $scope.numberOfDisplay);

	$scope.changeDisplayNumber = function () {
		$scope.iterationIndex = getArrayOfIterationIndex(12, $scope.numberOfDisplay);
	};
});

app.controller("signInController", function ($scope, $location, DataService) {
	$scope.onSignin = function () {
		let user = DataService.getUser($scope.signinUsername, $scope.signinPassword);

		if (!user) {
			alert("wrong user name and password");
			return;
		}

		DataService.setCurrentUser(user);
		DataService.loginSuccess();
		alert("success");
		Object.assign($scope.indexUser,DataService.getCurrentUser());
		$location.path("/home");
	};
});

const EMAIL_REGEX = /^\w+@[0-9A-Za-z]+\.[0-9A-Za-z]+$/;
const USERNAME_REGEX = /^[0-9A-Za-z]+$/;
const PASSWORD_REGEX = /^[0-9A-Za-z]+$/;
const PHONE_REGEX = /^[0-9]+$/;

app.controller("signUpController", function ($scope, DataService) {
	$scope.onSignup = function () {
		let isOk = true;
		let allUserArr = DataService.getAllUserData().users;

		if (allUserArr.find((item) => item.username == $scope.signupUsername)) {
			$scope.existUsername = true;
			isOk = false;
		} else $scope.existUsername = false;

		if ($scope.signupUsername?.length < 6 || !$scope.signupUsername?.length) {
			$scope.userWrongLength = true;
			isOk = false;
		} else $scope.userWrongLength = false;

		if (USERNAME_REGEX.test($scope.signupUsername) == false) {
			$scope.wrongUsernameFormat = true;
			isOk = false;
		} else $scope.wrongUsernameFormat = false;

		if ($scope.signupPassword?.length < 6 || !$scope.signupPassword?.length) {
			$scope.passwordWrongLength = true;
			isOk = false;
		} else $scope.passwordWrongLength = false;

		if (PASSWORD_REGEX.test($scope.signupPassword) == false) {
			$scope.wrongPasswordFormat = true;
			isOk = false;
		} else $scope.wrongPasswordFormat = false;

		if ($scope.passwordConfirm != $scope.signupPassword) {
			$scope.wrongConfirm = true;
			isOk = false;
		} else $scope.wrongConfirm = false;

		if (allUserArr.find((item) => item.email == $scope.signupEmail)) {
			$scope.existEmail = true;
			isOk = false;
		} else $scope.existEmail = false;

		if (EMAIL_REGEX.test($scope.signupEmail) == false) {
			$scope.wrongEmailFormat = true;
			isOk = false;
		} else $scope.wrongEmailFormat = false;

		if (!$scope.signupLocation) {
			$scope.wrongLocationFormat = true;
			isOk = false;
		} else $scope.wrongLocationFormat = false;

		if (allUserArr.find((item) => item.phone == $scope.signupPhone)) {
			$scope.existPhone = true;
			isOk = false;
		} else $scope.existPhone = false;

		if (PHONE_REGEX.test($scope.signupPhone) == false) {
			$scope.wrongPhoneFormat = true;
			isOk = false;
		} else $scope.wrongPhoneFormat = false;

		if (isOk) {
			DataService.addNewUser({
				username: $scope.signupUsername,
				password: $scope.signupPassword,
				email: $scope.signupEmail,
				location: $scope.signupLocation,
				phone: $scope.signupPhone,
			});

			localStorage.setItem("allUserObject", JSON.stringify(DataService.getAllUserData()));

			$scope.signupUsername = "";
			$scope.signupPassword = "";
			$scope.signupEmail = "";
			$scope.signupLocation = "";
			$scope.signupPhone = "";
			$scope.passwordConfirm = "";

			alert("success");
		}
	};
});
