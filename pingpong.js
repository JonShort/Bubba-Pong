function PingPongGame(options) {
	var exports = this;

	var bat = fabric.util.createClass(fabric.Rect, {
		initialize: function(left, top) {
			var _width = 60;
			var _height = 20;
			this.callSuper("initialize", {
				left: left - (_width/2),
		  		top: top - (_height / 2),
		  		width: _width,
		  		height: _height
			});

			this.set("selectable", false);
			this.setColor("pink");
		}
	});

	var ball = fabric.util.createClass(fabric.Circle, {
		initialize: function(left, top, maxLeft, maxTop) {
			this.callSuper("initialize", {
				left: left,
		  		top: top,
		  		radius: this.getRadius(top, maxTop)
			});

			this.radius = this.getRadius(this.top, maxTop);

			this.hitProcessed = false;

			this.set("selectable", false);
			this.setColor("red");
			this.isInPlay = false;

			this.deltaX = 1;
			this.deltaY = 5;
		},

		getRadius: function(yPosition, maxYPosition) {
			var _defaultRadius = 10;
			var bonusRadius = (((yPosition / maxYPosition) * 100) / 2) * 0.1;
			return _defaultRadius + bonusRadius;
		},

		updatePosition: function(maxLeft, maxTop, player) {
			if (exports.gameBall.intersectsWithObject(player)) {
				if (!this.hitProcessed) {
					exports.gameBall.invertDirection();
				}
				this.hitProcessed = true;
			} else {
				this.hitProcessed = false;
			}

			if (this.left < 0 || this.left + this.radius > maxLeft) {
				this.deltaX = -this.deltaX;
			}
			if (this.top < 0 || this.top + this.radius > maxTop) {
				this.deltaY = -this.deltaY;
			}

			this.left += this.deltaX;
			this.top += this.deltaY;

			this.radius = this.getRadius(this.top, maxTop);
		},

		invertDirection: function() {
			var getRandomIntInclusive = function(min, max) {
			  return Math.floor(Math.random() * (max - min + 1)) + min;
			};

			this.deltaY = -this.deltaY;
			this.deltaX = getRandomIntInclusive(-2, 2);
		}
	});

	var _run = function() {
		// Update coordinates for Collision Detection
		exports.player.setCoords();
		exports.gameBall.setCoords();

		if (exports.gameBall.isInPlay) {
			exports.gameBall.updatePosition(exports.canvas.width, exports.canvas.height, exports.player);
		}

		exports.canvas.renderAll();
		requestAnimationFrame(function() {
			_run();
		});
	};

	var getBubba = function() {
		
	};

	var setupTable = function() {
		var tableTop = exports.canvas.height * 0.15;
		var tableBottom = exports.canvas.height * 0.9;
		var tableLeft = exports.canvas.width * 0.1;
		var tableRight = exports.canvas.width * 0.9;

		var tableSkew = exports.canvas.width * 0.1;
		var table = new fabric.Polygon([
			{
				x: tableLeft + tableSkew,
				y: tableTop
			}, {
				x: tableRight - tableSkew,
				y: tableTop
			}, {
				x: tableRight,
				y: tableBottom
			}, {
				x: tableLeft,
				y: tableBottom
			}
		], {
			fill: "#234F4A",
			stroke: "white",
			strokeWidth: 5
		});
		table.setShadow({
			color: "black",
			offsetX: 0,
        	offsetY: 40,
        	blur: 20
		});

		var lineHorizontal = new fabric.Polygon([
			{
				x: tableLeft + (tableSkew / 1.9),
				y: (tableTop + tableBottom) / 2.1
			}, {
				x: tableRight - (tableSkew / 1.9),
				y: (tableTop + tableBottom) / 2.1
			}
		], {
			stroke: "white",
			strokeWidth: 5
		});

		var lineVertical = new fabric.Polygon([
			{
				x: (tableLeft + tableRight) / 2,
				y: tableTop
			}, {
				x: (tableLeft + tableRight) / 2,
				y: tableBottom
			}
		], {
			stroke: "white",
			strokeWidth: 5
		});

		var tableGroup = new fabric.Group([table, lineVertical, lineHorizontal]);
		tableGroup.set("selectable", false);

		exports.canvas.add(tableGroup);
	};

	var _setInitialState = function() {
		setupTable();

		var playerBounds = exports.canvas.height * 0.75;

		exports.player = getAsset("bat.png");

		exports.player.set({
			left: exports.canvas.width / 2,
			top: playerBounds
		});

		exports.player.set("selectable", false);

		exports.canvas.on("mouse:move", function(args) {
			exports.player.left = args.e.clientX - exports.player.width / 2;
			exports.player.top = args.e.clientY - exports.player.height / 2;

			if (exports.player.top < playerBounds) {
				exports.player.top = playerBounds;
			}

			// Track Player when not in Play
			if (!exports.gameBall.isInPlay) {
				exports.gameBall.left = exports.player.left;
				exports.gameBall.top = exports.player.top;
			}
		});


		exports.canvas.add(exports.player);

		
		//exports.player = new bat(exports.canvas.width / 2, playerBounds);
		exports.gameBall = new ball(0, 0, exports.canvas.width, exports.canvas.height);

	



		fabric.Image.fromURL("bubba-with-bat.png", function(img) {
			img.set({
				left: 200,
				top: (exports.canvas.height * 0.15) - 85
			});

			img.scale(0.5);

			exports.canvas.add(img);
		});

		

		exports.canvas.on("mouse:down", function(args) {
			exports.gameBall.isInPlay = true;
		});

		exports.canvas.add(exports.gameBall);
	};

	exports.resizeCanvas = function(options) {
		exports.canvas.setDimensions({
			width: options.width,
			height: options.height
		});
	};

	var _loadedAssets = [];
	var _loadAssets = function(assetsNamesToLoad, successCallback) {
		assetsNamesToLoad.forEach(function(assetName) {
			fabric.Image.fromURL(assetName, function(asset) {
				_loadedAssets.push({
					assetName: assetName,
					asset: asset
				});

				if (_loadedAssets.length === assetsNamesToLoad.length) {
					successCallback();
				}
			});
		});
	};

	var getAsset = function(assetName) {
		for (var i = 0; i < _loadedAssets.length; i++) {
			if (_loadedAssets[i].assetName === assetName) {
				return _loadedAssets[i].asset;
			}
		}
		throw "Asset " + assetName + " not loaded.";
	};

	exports.start = function() {
		_loadAssets(["bubba-with-bat.png", "bat.png"], function() {
			requestAnimationFrame(function() {
				_setInitialState();
				_run();
			});
		});
	};

	(function init(options) {
		exports.canvas = new fabric.Canvas("game_canvas");
		exports.canvas.selection = false;
		exports.canvas.defaultCursor = "none";
		exports.canvas.backgroundColor = "gray";
		exports.canvas.setDimensions({
			width: options.width,
			height: options.height
		});
	})(options);
}
