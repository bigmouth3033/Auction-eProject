let app = angular.module("auctionApp", ["ngRoute", "ngSanitize"]);

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
		})
		.when("/product", {
			templateUrl: "./html/product.html",
		});
});

function getLocalStorageItem(key) {
	return JSON.parse(localStorage.getItem(key));
}

app.service("AuctionItems", function () {
	const paintingKey = "painting";
	const carKey = "car";
	const furnitureKey = "furniture";
	const currentItemKey = "currentItem";

	this.findItem = function(id){
		if(id[0] == "P"){
			return paintingData.find(item => item.id == id);
		}

		if(id[0] == "C"){
			return carData.find(item => item.id == id);
		}

		if(id[0] == "F"){
			return furnitureData.find(item => item.id == id);
		}
	}

	let paintingData = getLocalStorageItem(paintingKey) || [];
	let carData = getLocalStorageItem(carKey) || [];
	let furnitureData = getLocalStorageItem(furnitureKey) || [];
	let currentItem = this.findItem(getLocalStorageItem(currentItemKey)) || null;

	

	this.updatePaintingJson = function () {
		localStorage.setItem(paintingKey, JSON.stringify(paintingData));
	};

	this.setPaintingData = function (data) {
		paintingData = data;
		this.updatePaintingJson();
	};

	this.getPaintingData = function () {
		return paintingData;
	};

	this.updateCarJson = function () {
		localStorage.setItem(paintingKey, JSON.stringify(carData));
	};

	this.setCarData = function (data) {
		carData = data;
		this.updateCarJson();
	};

	this.getCarData = function () {
		return carData;
	};

	this.updateFurnitureJson = function () {
		localStorage.setItem(furnitureKey, JSON.stringify(furnitureData));
	};

	this.setFurnitureData = function (data) {
		furnitureData = data;
		this.updateFurnitureJson();
	};

	this.getFurnitureData = function () {
		return furnitureData;
	};

	this.updateCurrentItemIDJson = function () {
		localStorage.setItem(currentItemKey, JSON.stringify(currentItem.id));
	};

	this.setCurrentItem = function (data) {
		currentItem = data;
		this.updateCurrentItemIDJson();
	};

	this.getCurrentItem = function () {
		return currentItem;
	};

});

app.service("UserData", function () {
	const allUserKey = "allUserArr";

	let isUser = false;
	let allUserData = getLocalStorageItem(allUserKey) || [];
	let currentUser = {};

	this.isUser = function () {
		return isUser;
	};

	this.loginSuccess = function () {
		isUser = true;
	};

	this.logout = function () {
		isUser = false;
	};

	this.updataUsersJson = function () {
		localStorage.setItem(allUserKey, JSON.stringify(allUserData));
	};

	this.setAllUserData = function (data) {
		allUserData = data;
		this.updataUsersJson();
	};

	this.getAllUserData = function () {
		return allUserData;
	};

	this.addNewUser = function (userData) {
		allUserData.push(userData);
		this.updataUsersJson();
	};

	this.getUser = function (username, password) {
		return allUserData.find((item) => item.username == username && item.password == password);
	};

	this.setCurrentUser = function (user) {
		currentUser = user;
	};

	this.getCurrentUser = function () {
		return currentUser;
	};
});

app.service("Timer", function ($interval, AuctionItems) {
	let paintingData = AuctionItems.getPaintingData();

	let stillCountData = [];
	let finishedCountData = [];


	for (let item of paintingData) {
		stillCountData.push(item);
	}

	function stopInterval(interval) {
		$interval.cancel(interval);
	}

	stillCountData.forEach(function (item) {
		let interval = $interval(function () {
			if (item.end) {
				finishedCountData.push(stillCountData.shift());
				stopInterval(interval);
				return;
			}
			console.log(item.timer);
			myTimer(item.endDate, item);
		}, 1000);
	});

});

app.run(function ($rootScope, $http, AuctionItems, Timer) {
	$rootScope.showBanner = true;

	if (AuctionItems.getPaintingData().length == 0) {
		$http.get("./json/painting.json").then(
			function (response) {
				AuctionItems.setPaintingData(response.data.painting);
			},
			function (error) {
				console.log("fuck this shit, you fucking stupid piece of shit", error);
			}
		);
	}

	// if (AuctionItems.getCarData().length == 0) {
	// 	$http.get("./json/car.json").then(
	// 		function (response) {
	// 			AuctionItems.setCarData(response.data.car);
	// 		},
	// 		function (error) {
	// 			console.log("fuck this shit, you fucking stupid piece of shit", error);
	// 		}
	// 	);
	// }

	// if (AuctionItems.getFurnitureData().length == 0) {
	// 	$http.get("./json/furniture.json").then(
	// 		function (response) {
	// 			AuctionItems.setFurnitureData(response.data.furniture);
	// 		},
	// 		function (error) {
	// 			console.log("fuck this shit, you fucking stupid piece of shit", error);
	// 		}
	// 	);
	// }

	$rootScope.indexUser = {};

	$rootScope.changeIndexUser = function (userObj) {
		$rootScope.indexUser = userObj;
	};
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

	obj.dayLeft = dTotal;
	obj.hourLeft = hLeft;
	obj.minuteLeft = mLeft;
	obj.secondLeft = sLeft;

	if (dTotal < 0 || hLeft < 0 || mLeft < 0 || sLeft < 0) {
		obj.end = true;
		obj.timer = "ALREADY END";
		return;
	}

	obj.timer = obj.dayLeft + "d " + obj.hourLeft + "h " + obj.minuteLeft + "m " + obj.secondLeft + "s";
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

app.controller("homeController", function ($scope, $interval, AuctionItems, UserData, Timer) {
	$scope.paintingData = AuctionItems.getPaintingData();
	$scope.carData = AuctionItems.getCarData();
	$scope.furnitureData = AuctionItems.getFurnitureData();

	$scope.numberOfDisplay = 3;
	$scope.paintingIterationIndex = getArrayOfIterationIndex($scope.paintingData.length, $scope.numberOfDisplay);

	$scope.changeDisplayNumber = function () {
		$scope.paintingIterationIndex = getArrayOfIterationIndex($scope.paintingData.length, $scope.numberOfDisplay);
	};

	$scope.changeToProductPage = function (product) {
		AuctionItems.setCurrentItem(product);
	};
});

app.controller("signInController", function ($scope, $location, UserData) {
	$scope.onSignin = function () {
		let user = UserData.getUser($scope.signinUsername, $scope.signinPassword);

		if (!user) {
			alert("wrong user name and password");
			return;
		}

		UserData.setCurrentUser(user);
		UserData.loginSuccess();

		$scope.changeIndexUser(UserData.getCurrentUser());

		alert("success");

		$location.path("/home");
	};
});

const EMAIL_REGEX = /^\w+@[0-9A-Za-z]+\.[0-9A-Za-z]+$/;
const USERNAME_REGEX = /^[0-9A-Za-z]+$/;
const PASSWORD_REGEX = /^[0-9A-Za-z]+$/;
const PHONE_REGEX = /^[0-9]+$/;

app.controller("signUpController", function ($scope, UserData) {
	$scope.onSignup = function () {
		let isOk = true;
		let allUserArr = UserData.getAllUserData();

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
			UserData.addNewUser({
				username: $scope.signupUsername,
				password: $scope.signupPassword,
				email: $scope.signupEmail,
				location: $scope.signupLocation,
				phone: $scope.signupPhone,
			});

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

app.controller("productController", function ($scope, $route, AuctionItems) {
	$scope.product = AuctionItems.getCurrentItem();
	$scope.productSuggestion;

	if ($scope.product.id[0] == "P") {
		$scope.productSuggestion = AuctionItems.getPaintingData();
	}

	if ($scope.product.id[0] == "F") {
		$scope.productSuggestion = AuctionItems.getFurnitureData();
	}

	if ($scope.product.id[0] == "C") {
		$scope.productSuggestion = AuctionItems.getCarData();
	}

	$scope.productSuggestion.sort((a, b) => 0.5 - Math.random());
	$scope.productSuggestion.length = 10;

	$scope.changeToProductPage = function (product) {
		AuctionItems.setCurrentItem(product);
		$route.reload();
	};
});
