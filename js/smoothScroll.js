(function () {
	"use strict";
	angular
		.module("angularSmoothscroll", [])
		.directive("smoothScroll", [
			"$log",
			"$timeout",
			"$window",
			function (a, b, c) {
				var d, e, f;
				return (
					(d = function () {
						return c.pageYOffset
							? c.pageYOffset
							: c.document.documentElement && c.document.documentElement.scrollTop
							? c.document.documentElement.scrollTop
							: c.document.body.scrollTop
							? c.document.body.scrollTop
							: 0;
					}),
					(e = function (a) {
						var b, c, d;
						if ((b = document.getElementById(a))) {
							for (d = b.offsetTop, c = b; c.offsetParent && c.offsetParent !== document.body; ) (c = c.offsetParent), (d += c.offsetTop);
							return d;
						}
						return 0;
					}),
					(f = function (a, b) {
						var c, f, g, h, i, j, k, l, m;
						if (((i = d()), (k = e(a) - b), (c = k > i ? k - i : i - k), 100 > c)) return void scrollTo(0, k);
						if (
							((h = Math.round(c / 100)), h >= 20 && (h = 20), (j = Math.round(c / 25)), (g = k > i ? i + j : i - j), (l = 0), !(k > i))
						) {
							for (f = i, m = []; f > k; )
								setTimeout("window.scrollTo(0, " + g + ")", l * h), (g -= j), k > g && (g = k), l++, m.push((f -= j));
							return m;
						}
						for (f = i; k > f; ) setTimeout("window.scrollTo(0, " + g + ")", l * h), (g += j), g > k && (g = k), l++, (f += j);
					}),
					{
						restrict: "A",
						link: function (a, b, c) {
							return b.bind("click", function () {
								var a;
								return c.target ? ((a = c.offset || 100), f(c.target, a)) : 0;
							});
						},
					}
				);
			},
		])
		.directive("smoothScrollJquery", [
			"$log",
			function () {
				return {
					restrict: "A",
					link: function (a, b, c) {
						return b.bind("click", function () {
							var a, b, d;
							return c.target
								? ((a = c.offset || 100),
								  (d = $("#" + c.target)),
								  (b = c.speed || 500),
								  $("html,body")
										.stop()
										.animate({ scrollTop: d.offset().top - a }, b))
								: $("html,body").stop().animate({ scrollTop: 0 }, b);
						});
					},
				};
			},
		]);
}).call(this);
