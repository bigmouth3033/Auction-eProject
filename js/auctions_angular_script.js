let app = angular.module("auctionApp", ["ngRoute", "ngSanitize", "slickCarousel"]);

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
		})
		.when("/blog", {
			templateUrl: "./html/blog.html",
		})
		.when("/category", {
			templateUrl: "./html/category.html",
		})
		.when("/howtobuy", {
			templateUrl: "./html/howtobuy.html",
		})
		.when("/whytosell", {
			templateUrl: "./html/whytosell.html",
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

	this.findItem = function (id) {
		if (id === null) return;

		if (id[0] == "P") {
			return paintingData.find((item) => item.id == id);
		}

		if (id[0] == "C") {
			return carData.find((item) => item.id == id);
		}

		if (id[0] == "F") {
			return furnitureData.find((item) => item.id == id);
		}
	};

	let paintingData = getLocalStorageItem(paintingKey) || [];
	let carData = getLocalStorageItem(carKey) || [];
	let furnitureData = getLocalStorageItem(furnitureKey) || [];
	let currentItem = this.findItem(getLocalStorageItem(currentItemKey)) || [];

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

app.service("Category", function (AuctionItems) {
	const categoryKey = "categoryItems";
	// patern list
	// C : car
	// P : painting

	this.setCategoryItemsByPattern = function (pattern) {
		let arr = [];

		if (pattern == "P") {
			for (let item of AuctionItems.getPaintingData()) {
				arr.push(item);
			}
		}

		if (pattern == "C") {
			for (let item of AuctionItems.getCarData()) {
				arr.push(item);
			}
		}

		updateLocalStorageCategoryPattern(pattern);

		return arr;
	};

	let categoryItems = this.setCategoryItemsByPattern(localStorage.getItem(categoryKey));

	this.getCategoryItems = function () {
		return categoryItems;
	};

	function updateLocalStorageCategoryPattern(pattern) {
		localStorage.setItem(categoryKey, pattern);
	}
});

app.service("UserData", function () {
	const allUserKey = "allUserArr";
	const currentUserKey = "currentUserStorage";

	this.isUser = function () {
		return isUser;
	};

	this.loginSuccess = function () {
		isUser = true;
	};

	this.findUser = function (username) {
		let user = allUserData.find((item) => item.username == username);

		if (user) this.loginSuccess();

		return user;
	};

	let isUser = false;
	let allUserData = getLocalStorageItem(allUserKey) || [];
	let currentUser = this.findUser(getLocalStorageItem(currentUserKey)) || {};

	this.logoutSuccess = function () {
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

	this.setCurrentUserUsernameJson = function (username) {
		localStorage.setItem(currentUserKey, JSON.stringify(username));
	};

	this.setCurrentUser = function (user) {
		currentUser = user;
		this.setCurrentUserUsernameJson(user.username);
	};

	this.getCurrentUser = function () {
		return currentUser;
	};
});

app.service("BlogData", function () {
	const blogsKey = "Blogs";
	const currentBlogKey = "currentBlog";

	this.findBlog = function (id) {
		if (id === null) return;

		return blogs.find((item) => item.id == id);
	};

	let blogs = getLocalStorageItem(blogsKey) || [];
	let currentBlog = this.findBlog(getLocalStorageItem(currentBlogKey)) || null;

	this.updateAllBlogJson = function (data) {
		localStorage.setItem(blogsKey, JSON.stringify(blogs));
	};

	this.getAllBlog = function () {
		return blogs;
	};

	this.setAllBlog = function (data) {
		blogs = data;
		this.updateAllBlogJson();
	};

	this.setCurrentBlogIDJson = function (id) {
		localStorage.setItem(currentBlogKey, JSON.stringify(id));
	};

	this.setCurrentBlog = function (data) {
		currentBlog = data;
		this.setCurrentBlogIDJson(data.id);
	};

	this.getCurrentBlog = function () {
		return currentBlog;
	};
});

app.filter("timeFilter", function () {
	return function (time) {
		if (time == "ALREADY END") {
			return "ALREADY END";
		}

		if (time === undefined) return "ALREADY END";

		let arr = [];

		arr = time.split(":");

		if (arr[0] > 0) {
			return arr[0] + "D LEFT";
		}

		if (arr[1] > 0) {
			return arr[1] + "H LEFT";
		}

		if (arr[2] > 0) {
			return arr[2] + "M LEFT";
		}

		if (arr[3] > 0) {
			return arr[3] + "S LEFT";
		}
	};
});

app.run(function ($rootScope, $http, $interval, AuctionItems, BlogData, UserData, Category) {
	$rootScope.navAndFoot = true;

	$rootScope.hideNavAndFoot = function () {
		$rootScope.navAndFoot = false;
	};

	$rootScope.showNavAndFoot = function () {
		$rootScope.navAndFoot = true;
	};

	// $rootScope.hideIndexPage = function () {
	// 	$rootScope.hideNavAndFoot();
	// };

	$rootScope.showBanner = true;

	if (AuctionItems.getPaintingData().length == 0) {
		$http.get("./json/painting.json").then(
			function (response) {
				for (item of response.data.painting) {
					item.endDateStr = new Date(item.endDate).toLocaleDateString("en-us", {
						weekday: "long",
						year: "numeric",
						month: "short",
						day: "numeric",
					});
				}

				AuctionItems.setPaintingData(response.data.painting);
			},
			function (error) {
				console.log("fuck this shit, you fucking stupid piece of shit", error);
			}
		);
	}

	if (BlogData.getAllBlog().length == 0) {
		$http.get("./json/blog.json").then(
			function (response) {
				BlogData.setAllBlog(response.data.blogs);
			},
			function (error) {
				console.log("some thing wrong");
			}
		);
	}

	$rootScope.indexUser = UserData.getCurrentUser();

	$rootScope.changeIndexUser = function (userObj) {
		$rootScope.indexUser = userObj;
	};

	$rootScope.logout = function () {
		$rootScope.indexUser = {};
		UserData.setCurrentUser({
			username: null,
			password: null,
			email: null,
			location: null,
			phone: null,
		});
		UserData.logoutSuccess();
	};

	function stopInterval(interval) {
		$interval.cancel(interval);
	}

	$rootScope.stillCounted = [];
	$rootScope.finishedCounted = [];

	for (let item of AuctionItems.getPaintingData()) {
		$rootScope.stillCounted.push(item);
	}

	for (let item of AuctionItems.getCarData()) {
		$rootScope.stillCounted.push(item);
	}

	for (let item of AuctionItems.getCarData()) {
		$rootScope.stillCounted.push(item);
	}

	$rootScope.stillCounted.sort((item1, item2) => new Date(item1.endDate) - new Date(item2.endDate));

	$rootScope.stillCounted.forEach(function (item) {
		let interval = $interval(function () {
			if (item.end) {
				stopInterval(interval);
				$rootScope.finishedCounted.push($rootScope.stillCounted.shift());
				return;
			}
			myTimer(item.endDate, item);
		}, 1000);
	});
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

	obj.timer = obj.dayLeft + ":" + obj.hourLeft + ":" + obj.minuteLeft + ":" + obj.secondLeft + "";
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

app.controller("homeController", function ($scope, $interval, AuctionItems, UserData, BlogData, Category) {
	$scope.showNavAndFoot();

	$scope.slickConfig = {
		enabled: true,
		autoplay: true,
		draggable: false,
		autoplaySpeed: 500,
		method: {},
		event: {
			beforeChange: function (event, slick, currentSlide, nextSlide) {},
			afterChange: function (event, slick, currentSlide, nextSlide) {},
		},
	};

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

	$scope.allBlogs = BlogData.getAllBlog();

	$scope.changeToBlogPage = function (blog) {
		BlogData.setCurrentBlog(blog);
	};

	$scope.viewPainting = function () {
		Category.setCategoryItemsByPattern("P");
	};
});

app.controller("signInController", function ($scope, $location, UserData) {
	$scope.hideNavAndFoot();

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
	$scope.hideNavAndFoot();

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
				biddingProducts: [],
				ownProducts: [],
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

app.controller("productController", function ($scope, $route, AuctionItems, UserData, Category) {
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

	$scope.changeToProductPage = function (product) {
		AuctionItems.setCurrentItem(product);
		$route.reload();
	};

	$scope.bid = function (price, product, user) {
		if (!UserData.isUser()) {
			alert("Please signup to bid");
			return;
		}

		if (+product.currentBid >= +price) {
			alert("wrong price");
			return;
		}

		if (product.biddingUsers[product.biddingUsers.length - 1] == user.username) {
			alert("you already bid");
			return;
		}

		product.numberOfBId++;
		product.currentBid = price;
		product.lastUserBid = user.username;

		let index;

		if ((index = product.biddingUsers.findIndex((biddingUsername) => biddingUsername == user.username)) == -1) {
			product.biddingUsers.push(user.username);
		} else {
			product.biddingUsers.splice(index, 1);
			product.biddingUsers.push(user.username);
		}

		if (!user.biddingProducts.find((productId) => productId == product.id)) {
			user.biddingProducts.push(product.id);
		}

		UserData.updataUsersJson();
		AuctionItems.updatePaintingJson();

		alert("bid success");
	};

	$scope.viewCategory = function () {
		Category.setCategoryItemsByPattern($scope.product.id[0]);
	};
});

app.controller("blogController", function ($scope, AuctionItems, BlogData) {
	$scope.currentBlog = BlogData.getCurrentBlog();
});

app.controller("categoryController", function ($scope, AuctionItems, Category) {
	$scope.data = Category.getCategoryItems();

	$scope.changeToProductPage = function (item) {
		AuctionItems.setCurrentItem(item);
	};
});

app.directive("slickCarousel", function () {
	return {
		restrict: "A",
		link: function (scope, element) {
			// Initialize the Slick Carousel plugin
			$(element).slick({
				dots: true,
				infinite: true,
				speed: 300,
				slidesToShow: 1,
				centerMode: true,
				variableWidth: true,
			});
		},
	};
});
