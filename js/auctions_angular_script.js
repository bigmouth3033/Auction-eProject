let app = angular.module("auctionApp", ["ngRoute", "ngSanitize", "slickCarousel", "ngAnimate", "angularSmoothscroll"]);

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
		})
		.when("/aboutUs", {
			templateUrl: "./html/aboutUs.html",
		})
		.when("/blogcategory", {
			templateUrl: "./html/blogcategory.html",
		})
		.when("/contactUs", {
			templateUrl: "./html/contactus.html",
		})
		.when("/disclaimer", {
			templateUrl: "./html/disclaimer.html",
		})
		.otherwise({
			templateUrl: "./html/home.html",
		});
});

//aution item service

app.service("AuctionItems", function () {
	const paintingKey = "painting";
	const carKey = "car";
	const furnitureKey = "furniture";
	const currentItemKey = "currentItem";

	// bunch of key

	// find item by id, get current user by id that saved in localstorage
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

	// return the first truthy value, if localstorage dont have item then initilize it with array
	let paintingData = getLocalStorageJsonItem(paintingKey) || [];
	let carData = getLocalStorageJsonItem(carKey) || [];
	let furnitureData = getLocalStorageJsonItem(furnitureKey) || [];
	let currentItem = this.findItem(getLocalStorageJsonItem(currentItemKey)) || {};

	//call this to update current painting data to json
	this.updatePaintingJson = function () {
		localStorage.setItem(paintingKey, JSON.stringify(paintingData));
	};

	//set painting and update it to localstorage
	this.setPaintingData = function (data) {
		paintingData = data;
		this.updatePaintingJson();
	};

	this.getPaintingData = function () {
		return paintingData;
	};

	// update car data to json
	this.updateCarJson = function () {
		localStorage.setItem(carKey, JSON.stringify(carData));
	};

	// set cardata and update to json
	this.setCarData = function (data) {
		carData = data;
		this.updateCarJson();
	};

	this.getCarData = function () {
		return carData;
	};

	// update funituredata to json
	this.updateFurnitureJson = function () {
		localStorage.setItem(furnitureKey, JSON.stringify(furnitureData));
	};

	// set furniture item and update to json
	this.setFurnitureData = function (data) {
		furnitureData = data;
		this.updateFurnitureJson();
	};

	this.getFurnitureData = function () {
		return furnitureData;
	};

	// upadate current item id to save current item when page is loaded
	this.updateCurrentItemIDJson = function () {
		localStorage.setItem(currentItemKey, JSON.stringify(currentItem.id));
	};

	// set current item and save its id to localstorage
	this.setCurrentItem = function (data) {
		currentItem = data;
		this.updateCurrentItemIDJson();
	};

	this.getCurrentItem = function () {
		return currentItem;
	};
});

// category service only save pattern
app.service("Category", function (AuctionItems) {
	const categoryTypeKey = "type";
	//category type key

	// get type by localstorage or empty string a initial value
	let type = getLocalStorageItem(categoryTypeKey) || "";

	// update type to local storage
	this.updateCategoryTypeJson = function () {
		localStorage.setItem(categoryTypeKey, type);
	};

	// set current type and update to local storage
	this.setCategoryType = function (data) {
		type = data;
		this.updateCategoryTypeJson();
	};

	//get category item by read the type
	this.getCategoryTypeItems = function () {
		let categoryItems = [];

		if (type === "Painting") {
			for (let item of AuctionItems.getPaintingData()) {
				categoryItems.push(item);
			}
		}

		if (type === "Car") {
			for (let item of AuctionItems.getCarData()) {
				categoryItems.push(item);
			}
		}

		return categoryItems;
	};

	this.getType = function () {
		return type;
	};
});

app.service("UserData", function () {
	const allUserKey = "allUserArr";
	const currentUserKey = "currentUserStorage";
	// key for all user and key of current user

	// check login status
	this.isUser = function () {
		return isUser;
	};

	// set login status to true
	this.loginSuccess = function () {
		isUser = true;
	};

	// get current user by username saved in localstorage
	this.getCurrentUser = function (username) {
		let user = allUserData.find((item) => item.username == username);

		if (user) this.loginSuccess();

		return user;
	};

	let isUser = false; // default to false
	// check for data in localstorage if not that get the initilize value
	let allUserData = getLocalStorageJsonItem(allUserKey) || [];
	let currentUser = this.getCurrentUser(getSessionStorageJson(currentUserKey)) || {};

	// change logout status
	this.logoutSuccess = function () {
		isUser = false;
	};

	// update all userdata json to localstorage
	this.updataUsersJson = function () {
		localStorage.setItem(allUserKey, JSON.stringify(allUserData));
	};

	// set all userdata then update its data to localstorage
	this.setAllUserData = function (data) {
		allUserData = data;
		this.updataUsersJson();
	};

	this.getAllUserData = function () {
		return allUserData;
	};

	// add new sign up user and update alluserdata localstorage
	this.addNewUser = function (userData) {
		allUserData.push(userData);
		this.updataUsersJson();
	};

	// check for login by username and password in alluserdata, if true then login success
	this.getUserByLogin = function (username, password) {
		return allUserData.find((item) => item.username == username && item.password == password);
	};

	// update current user username to localstorage to maintain login status of user when page is loaded
	this.setCurrentUserUsernameJson = function (username) {
		sessionStorage.setItem(currentUserKey, JSON.stringify(username));
	};

	// set current user when login success and save user username to localstorage
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
	// key to get json data from localstorage

	// find current blog by blog id, use to get current blog
	this.findBlog = function (id) {
		if (id === null) return;

		return blogs.find((item) => item.id == id);
	};

	// initialize data, find in localstorage if not then using [] and null
	let blogs = getLocalStorageJsonItem(blogsKey) || [];
	let currentBlog = this.findBlog(getLocalStorageJsonItem(currentBlogKey)) || null;

	//update all blogdata to localstorage
	this.updateAllBlogJson = function (data) {
		localStorage.setItem(blogsKey, JSON.stringify(blogs));
	};

	this.getAllBlog = function () {
		return blogs;
	};

	// set all blog data and save it to localstorage
	this.setAllBlog = function (data) {
		blogs = data;
		this.updateAllBlogJson();
	};

	// save current blog id to json to get current when page loaded
	this.setCurrentBlogIDJson = function (id) {
		localStorage.setItem(currentBlogKey, JSON.stringify(id));
	};

	//set current blog and update to json
	this.setCurrentBlog = function (data) {
		currentBlog = data;
		this.setCurrentBlogIDJson(data.id);
	};

	this.getCurrentBlog = function () {
		return currentBlog;
	};
});

// fifter to show time to home page properly
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

// using rootScope to handle all base set up for webpage
app.run(function ($rootScope, $http, $interval, AuctionItems, BlogData, UserData, Category, $window, $location, filterFilter) {
	$rootScope.navAndFoot = true; // stage of nav nad foot show it or not

	// change nav and foot state to hide
	$rootScope.hideNavAndFoot = function () {
		$rootScope.navAndFoot = false;
	};

	// change nav and foot state to show
	$rootScope.showNavAndFoot = function () {
		$rootScope.navAndFoot = true;
	};

	// $http service is asynchronous so need to using special practice to handle it so data can load properly
	// using async to load all data from json and only reload page one time instead of reload every time using $http
	// still not so sure how this shit work
	async function loadAllJsonData() {
		if (AuctionItems.getPaintingData().length == 0) {
			try {
				const paintingResponse = await $http.get("./json/painting.json");
				const blogResponse = await $http.get("./json/blog.json");
				const carResponse = await $http.get("./json/car.json");

				for (let item of paintingResponse.data.painting) {
					if (item.endDate === null) {
						item.endDate = new Date(Date.now() + randomizeFromMinToMaxByMilisecond(3, 45)).valueOf();
					}
				}
				for (let item of paintingResponse.data.painting) {
					item.endDateStr = new Date(item.endDate).toLocaleDateString("en-us", {
						weekday: "long",
						year: "numeric",
						month: "short",
						day: "numeric",
					});
				}

				AuctionItems.setPaintingData(paintingResponse.data.painting);
				BlogData.setAllBlog(blogResponse.data.blogs);

				for (let item of carResponse.data.car) {
					if (item.endDate === null) {
						item.endDate = new Date(Date.now() + randomizeFromMinToMaxByMilisecond(3, 15)).valueOf();
					}
				}

				for (let item of carResponse.data.car) {
					item.endDateStr = new Date(item.endDate).toLocaleDateString("en-us", {
						weekday: "long",
						year: "numeric",
						month: "short",
						day: "numeric",
					});
				}

				AuctionItems.setCarData(carResponse.data.car);

				$window.location.reload();
			} catch (error) {
				console.log("error loading data by json", error);
			}
		}
	}

	loadAllJsonData();

	$rootScope.searchItems = [];
	$rootScope.searchItems = AuctionItems.getPaintingData().concat(AuctionItems.getCarData());

	// index user to show user status in nav page
	$rootScope.indexUser = UserData.getCurrentUser();

	// using method to avoid confict when working with nested controller
	$rootScope.changeIndexUser = function (userObj) {
		$rootScope.indexUser = userObj;
	};

	// logout event when interact with nav bar
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

	// stop interval service for item that run out of time
	function stopInterval(interval) {
		$interval.cancel(interval);
	}

	$rootScope.stillCounted = [];
	$rootScope.finishedCounted = [];

	// sort items that end and not end to two diffent array that math their end status
	AuctionItems.getPaintingData().forEach(function (item) {
		if (item.end == false) {
			$rootScope.stillCounted.push(item);
			return;
		}
		$rootScope.finishedCounted.push(item);
	});

	AuctionItems.getCarData().forEach(function (item) {
		if (item.end == false) {
			$rootScope.stillCounted.push(item);
			return;
		}
		$rootScope.finishedCounted.push(item);
	});

	// sort stillCount
	$rootScope.stillCounted.sort((item1, item2) => new Date(item1.endDate) - new Date(item2.endDate));

	// run iterval to countdown time for item not end
	$rootScope.stillCounted.forEach(function (item) {
		let interval = $interval(function () {
			if (item.end) {
				AuctionItems.updatePaintingJson();
				stopInterval(interval);
				$rootScope.finishedCounted.push($rootScope.stillCounted.shift());
				return;
			}
			myTimer(item.endDate, item);
		}, 1000);
	});

	$rootScope.currentPage = "home";

	// save current page in order to perform return to previous page at any momment
	$rootScope.saveCurrentPage = function () {
		$rootScope.currentPage = $location.path();
	};

	// view all item in category

	window.addEventListener("storage", handleStorageChange);

	function handleStorageChange(event) {
		if (event.key === "signal" && event.newValue === "true") {
			$window.location.reload();
			localStorage.setItem("signal", "false");
		}
	}

	// view product page from search bar
	$rootScope.viewProductPageFromSearch = function (item) {
		AuctionItems.setCurrentItem(item);
		if ($location.path() == "/product") {
			$window.location.reload();
		}
	};

	// view painting category from nav
	$rootScope.viewPaintingIndex = function () {
		Category.setCategoryType("Painting");

		if ($location.path() == "/category") {
			$window.location.reload();
		}
	};

	// view car category from search bar
	$rootScope.viewCarIndex = function () {
		Category.setCategoryType("Car");

		if ($location.path() == "/category") {
			$window.location.reload();
		}
	};

	$rootScope.search = "";
	$rootScope.searchIndicator = "Enter a search query...";
	$rootScope.changeSearchIndicator = function (search) {
		let searchResult = filterFilter($rootScope.searchItems, { fullName: search });
		if (searchResult.length == 0) {
			$rootScope.searchIndicator = "No results found.";
			return;
		}

		if (search.length > 0) {
			$rootScope.searchIndicator = "Searching for: " + search;
			return;
		}

		if (search.length == 0) {
			$rootScope.searchIndicator = "Enter a search query...";
			return;
		}
	};
});

// controller of home
app.controller("homeController", function ($scope, AuctionItems, UserData, BlogData, Category, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot(); // make sure always show nav and foot when home is loaded

	// config for slick
	$scope.slickConfig = {
		enabled: true,
		draggable: true,
		infinite: false,
		dots: true,
		cssEase: "ease",
		edgeFriction: 0.5,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1008,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	// get all data to show
	$scope.paintingData = AuctionItems.getPaintingData();
	$scope.carData = AuctionItems.getCarData();
	$scope.furnitureData = AuctionItems.getFurnitureData();

	// change to product page event, set current product, save current product id to localstorage
	$scope.changeToProductPage = function (product) {
		AuctionItems.setCurrentItem(product);
	};

	// get blog data to show to home
	$scope.allBlogs = BlogData.getAllBlog();

	// change blog page, set current blog and save blog id
	$scope.changeToBlogPage = function (blog) {
		BlogData.setCurrentBlog(blog);
	};

	// change to category page: work in progress
	$scope.viewPainting = function () {
		Category.setCategoryType("Painting");
	};

	$scope.viewCar = function () {
		Category.setCategoryType("Car");
	};
});

app.controller("signInController", function ($scope, $location, UserData, $window) {
	$scope.hideNavAndFoot(); // hide nav and foot when signin is loaded

	// signin event
	$scope.onSignin = function () {
		let user = UserData.getUserByLogin($scope.signinUsername, $scope.signinPassword);

		if (!user) {
			alert("wrong user name and password");
			return;
		}

		UserData.setCurrentUser(user);
		UserData.loginSuccess();

		$scope.changeIndexUser(UserData.getCurrentUser());

		alert("success");

		$location.path($scope.currentPage);
	};
});

// regex to check for signup form
const EMAIL_REGEX = /^\w+@[0-9A-Za-z]+\.[0-9A-Za-z]+$/;
const USERNAME_REGEX = /^[0-9A-Za-z]+$/;
const PASSWORD_REGEX = /^[0-9A-Za-z]+$/;
const PHONE_REGEX = /^[0-9]+$/;

app.controller("signUpController", function ($scope, UserData, $location, $window) {
	$window.scrollTo(0, 0);
	$scope.hideNavAndFoot(); // hide nav and foot when signup is loaded

	$scope.termOfService = true;

	// check sign up event
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

		if ($scope.termOfService == false) {
			$scope.notcheck = true;
			isOk = false;
		} else $scope.notcheck = false;

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

			$location.path("/signin");
		}
	};
});

// controller for product page
app.controller("productController", function ($scope, $route, AuctionItems, UserData, Category, $location, $interval, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();

	//load current item
	$scope.product = AuctionItems.getCurrentItem();

	// product suggestion
	$scope.productSuggestion = [];

	// check for current item type to load suggestion items
	if ($scope.product.id[0] == "P") {
		for (let item of AuctionItems.getPaintingData()) {
			$scope.productSuggestion.push(item);
		}
		$scope.productType = "PAINTING";
		$scope.product.view++;
		AuctionItems.updatePaintingJson();
	}

	if ($scope.product.id[0] == "C") {
		for (let item of AuctionItems.getCarData()) {
			$scope.productSuggestion.push(item);
		}
		$scope.productType = "CAR";
		$scope.product.view++;
		AuctionItems.updateCarJson();
	}

	//randomize suggestion items
	$scope.productSuggestion.sort((a, b) => 0.5 - Math.random());
	$scope.productSuggestion.length = 3;

	// bid event
	$scope.bid = function (price, product, user) {
		if (!UserData.isUser()) {
			alert("Please signup to bid");
			return;
		}

		if (product.currentBid >= price) {
			alert("wrong price");
			return;
		}

		if (product.biddingUsers[product.biddingUsers.length - 1] == user.username) {
			alert("you already bid");
			return;
		}

		product.numberOfBid++;
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

		product.endDate = new Date(new Date(product.endDate).getTime() + 60000).valueOf();

		UserData.updataUsersJson();

		if (product.id[0] == "P") AuctionItems.updatePaintingJson();

		if (product.id[0] == "C") AuctionItems.updateCarJson();

		alert("bid success");
		localStorage.setItem("signal", true);
	};

	$scope.imgShow = $scope.product.img[0];

	// change current showing img of product page
	$scope.changeImgShow = function (imghref) {
		$scope.imgShow = imghref;
	};

	$scope.viewCategory = function () {
		if ($scope.productType == "CAR") {
			Category.setCategoryType("Car");
		}

		if ($scope.productType == "PAINTING") {
			Category.setCategoryType("Painting");
		}
	};
});

app.controller("blogCategoryController", function ($scope, BlogData, $window, $location) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();

	$scope.allBlogs = BlogData.getAllBlog();

	$scope.viewBlog = function (blog) {
		BlogData.setCurrentBlog(blog);
	};
});

app.controller("blogController", function ($scope, AuctionItems, BlogData, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();

	//get item blog
	$scope.currentBlog = BlogData.getCurrentBlog();
});

app.controller("categoryController", function ($scope, $window, AuctionItems, Category) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();

	let numberOfItemEachPage = 9; // number of item for each page
	$scope.productType = Category.getType(); // save pattern only one

	// get category array
	let categorySet = new Set();
	if ($scope.productType == "Painting") {
		AuctionItems.getPaintingData().forEach((item) => categorySet.add(item.category));
		$scope.arrCategory = Array.from(categorySet.values());
	} //set product category

	if ($scope.productType == "Car") {
		AuctionItems.getCarData().forEach((item) => categorySet.add(item.category));
		$scope.arrCategory = Array.from(categorySet.values());
	}

	//get category data
	$scope.categoryData = Category.getCategoryTypeItems();

	// data that divided to different array to show by page
	$scope.allPageData = sortItemToDifferentPage($scope.categoryData, numberOfItemEachPage);
	$scope.currentPage = $scope.allPageData[0]; // current page to show

	// array of page index
	$scope.pageIndex = [];
	$scope.allPageData.forEach((item) => $scope.pageIndex.push(false));
	$scope.pageIndex[0] = true;

	// turn to first page
	function turnToFirstPage() {
		for (let i = 0; i < $scope.pageIndex.length; i++) {
			if (i == 0) {
				$scope.pageIndex[i] = true;
				continue;
			}

			$scope.pageIndex[i] = false;
		}

		$scope.currentPage = $scope.allPageData[0];
	}

	// change to different page by index
	$scope.changePageIndex = function (index) {
		for (let i = 0; i < $scope.pageIndex.length; i++) {
			$scope.pageIndex[i] = false;
		}

		$scope.pageIndex[index] = true;
		$scope.currentPage = $scope.allPageData[index];
		$window.scrollTo(0, 0);
	};

	// change to specific product
	$scope.changeToProductPage = function (item) {
		AuctionItems.setCurrentItem(item);
	};

	$scope.categoryFilter = [];
	$scope.statusFilter = [];

	//update category filter, if not have argument then update only do not add more filter
	function upadateCategoryFilter(category) {
		if ($scope.categoryFilter.includes(category) == false && category !== undefined) {
			$scope.categoryFilter.push(category);
		}

		if ($scope.categoryFilter.length != 0) {
			$scope.categoryData = Category.getCategoryTypeItems().filter(function (item) {
				return $scope.categoryFilter.includes(item.category);
			});
		} else $scope.categoryData = Category.getCategoryTypeItems();

		if ($scope.statusFilter.length == 1) {
			let end = $scope.statusFilter[0] == "Still Going" ? false : true;

			$scope.categoryData = $scope.categoryData.filter((item) => item.end == end);
		}

		$scope.allPageData = sortItemToDifferentPage($scope.categoryData, numberOfItemEachPage);
	}

	$scope.addCategoryFilter = function (category) {
		upadateCategoryFilter(category);
		turnToFirstPage();
	};

	$scope.removeAllFilter = function () {
		$scope.categoryFilter.length = 0;
		$scope.statusFilter.length = 0;
		upadateStatusFilter();
		turnToFirstPage();
	};

	$scope.removeSpecificCategoryFilter = function (filter) {
		let index = $scope.categoryFilter.findIndex((item) => item == filter);

		$scope.categoryFilter.splice(index, 1);

		upadateCategoryFilter();
		turnToFirstPage();
	};

	function upadateStatusFilter(status) {
		if ($scope.statusFilter.includes(status) == false && status !== undefined) {
			$scope.statusFilter.push(status);
		}

		if ($scope.statusFilter.length == 0 || $scope.statusFilter.length == 2) {
			upadateCategoryFilter();
			return;
		}

		let end = status == "Still Going" ? false : true;

		$scope.categoryData = $scope.categoryData.filter((item) => item.end === end);
		$scope.allPageData = sortItemToDifferentPage($scope.categoryData, numberOfItemEachPage);
	}

	$scope.addStatusFilter = function (status) {
		upadateStatusFilter(status);
		turnToFirstPage();
	};

	$scope.removeSpecificStatusFilter = function (status) {
		let index = $scope.statusFilter.indexOf(status);

		$scope.statusFilter.splice(index, 1);

		upadateStatusFilter();
		turnToFirstPage();
	};
});

app.controller("howtobuyController", function ($scope, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();
});

app.controller("howtosellController", function ($scope, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();
});

app.controller("aboutusController", function ($scope, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();
});

app.controller("contactUsController", function ($scope, $window) {
	$scope.saveCurrentPage();
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();

	$scope.submit = function () {
		alert("We Have Received Your Message");
	};
});

app.controller("disclaimerController", function ($scope, $window) {
	$window.scrollTo(0, 0);
	$scope.showNavAndFoot();
});

// timer function to countdown, combine with interval
function myTimer(date, obj) {
	let now = new Date();
	let future = new Date(date);

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
		obj.finalPrice = obj.currentBid;
		obj.currentBid = null;
		obj.end = true;
		obj.timer = "ALREADY END";
		return;
	}

	obj.timer = obj.dayLeft + ":" + obj.hourLeft + ":" + obj.minuteLeft + ":" + obj.secondLeft + "";
}

function sortItemToDifferentPage(arr, numberOfItemEach) {
	let newArr = [];
	let outerLoopLenth = Math.ceil(arr.length / numberOfItemEach);

	for (let i = 0; i < outerLoopLenth; i++) {
		let innerArr = [];

		for (let j = i * numberOfItemEach; j < arr.length && j < (i + 1) * numberOfItemEach; j++) {
			innerArr.push(arr[j]);
		}

		newArr.push(innerArr);
	}

	return newArr;
}

// useless shit that took days for nothing
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

// get random minute from min to max and convert it to milisecond
function randomizeFromMinToMaxByMilisecond(min, max) {
	return Math.round(Math.random() * (max - min + 1) + min - 0.5) * 60000;
}

// load localstorage json item by key

function getLocalStorageJsonItem(key) {
	return JSON.parse(localStorage.getItem(key));
}

function getLocalStorageItem(key) {
	return localStorage.getItem(key);
}

function getSessionStorageJson(key) {
	return JSON.parse(sessionStorage.getItem(key));
}
