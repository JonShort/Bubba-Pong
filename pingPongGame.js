function PingPongGame(options) {
	var exports = this;

	var assetManager = new AssetManager("assets/");

	var scoreBoard = fabric.util.createClass(fabric.Rect, {
		initialize: function(args) {
			var _width = 200;
			var _height = 50;
			this.callSuper("initialize", {
				left: args.canvasWidth - _width,
		  		top: 0,
		  		width: _width,
		  		height: _height,
		  		selectable: false
			});

			this.setColor("brown");
		}
	});

	var ball = fabric.util.createClass(fabric.Circle, {
		initialize: function(left, top, maxLeft, maxTop) {
			this.callSuper("initialize", {
				left: left,
		  		top: top,
		  		radius: this.getRadius(top, maxTop),
		  		selectable: false
			});

			this.radius = this.getRadius(this.top, maxTop);

			this.hitProcessed = false;

			this.setColor("orange");
			this.isInPlay = false;

			this.deltaX = 1;
			this.deltaY = 5;

			this.setShadow({
				color: "rgba(0, 0, 0, 0.7)",
				offsetY: 5,
	        	blur: 20
			});
		},

		getRadius: function(yPosition, maxYPosition) {
			var _defaultRadius = 10;
			var bonusRadius = (((yPosition / maxYPosition) * 100) / 2) * 0.1;
			return _defaultRadius + bonusRadius;
		},

		updatePosition: function(maxLeft, maxTop, player) {
			if (player.hitTargetIntersectsWithObject(exports.gameBall)) {
			//if (exports.gameBall.intersectsWithObject(player.hitTarget)) {
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
		//exports.player.hitTarget.setCoords();
		//exports.gameBall.setCoords();
		//exports.bubba.setCoords();

		if (exports.gameBall.isInPlay) {
			exports.gameBall.updatePosition(exports.canvas.width, exports.canvas.height, exports.player);
		}

		exports.bubba.updatePosition();

		exports.canvas.renderAll();
		requestAnimationFrame(function() {
			_run();
		});
	};

	var _setInitialState = function() {


		var theScoreBoard = new scoreBoard({ canvasWidth: exports.canvas.width });

		
		

		var playerBounds = exports.canvas.height * 0.75;

		var pingPongBatSprite = assetManager.getLoadedAsset("bat.png");
		exports.player = new Player(pingPongBatSprite, {
			initialLeft: exports.canvas.width / 2,
			initialTop: playerBounds
		});

		exports.gameBall = new ball(exports.player.left, exports.player.top, exports.canvas.width, exports.canvas.height);

		


		

		
		
	
		exports.bubba = assetManager.getLoadedAsset("bubba-with-bat.png");
		exports.bubba.set({
			left: 200,
			top: (exports.canvas.height * 0.15) - 85,
	  		selectable: false
		});
		exports.bubba.updatePosition = function() {
			var moveSpeed = 10;
			if (exports.gameBall.left < (exports.bubba.left - moveSpeed)) {
				exports.bubba.left = exports.bubba.left - moveSpeed;
			} else if (exports.gameBall.left > (exports.bubba.left + moveSpeed)) {
				exports.bubba.left = exports.bubba.left + moveSpeed;
			}

			// dont leave the table
			var leftEdge = (exports.canvas.width * 0.1) + (exports.canvas.width * 0.1);
			var rightEdge = (exports.canvas.width * 0.9) - (exports.canvas.width * 0.1);

			if (exports.bubba.left < leftEdge) {
				exports.bubba.left = leftEdge;
			} else if (exports.bubba.left + exports.bubba.width > rightEdge) {
				exports.bubba.left = rightEdge - exports.bubba.width;
			}
		};
		

		exports.canvas.on("mouse:move", function(args) {
			exports.player.left = args.e.clientX - exports.player.width / 2;
			exports.player.top = args.e.clientY - exports.player.height / 2;

			if (exports.player.top < playerBounds) {
				exports.player.top = playerBounds;
			}

			// Ball should track Player when not in Play
			if (!exports.gameBall.isInPlay) {
				exports.gameBall.left = exports.player.left + exports.player.width / 2;
				exports.gameBall.top = exports.player.top;
			}
		});
		

		exports.canvas.on("mouse:down", function(args) {
			exports.gameBall.isInPlay = true;
		});

		

		


		exports.canvas.add(new PingPongTable({
			width: exports.canvas.width,
			height: exports.canvas.height
		}));
		exports.canvas.add(exports.bubba);
		exports.canvas.add(exports.gameBall);
		exports.canvas.add(exports.player);		
		exports.canvas.add(theScoreBoard);
	};

	exports.start = function() {
		var assetsToLoad = ["bubba-with-bat.png", "bat.png"];
		assetManager.loadAssets(assetsToLoad, function() {
			requestAnimationFrame(function() {
				_setInitialState();
				_run();
			});
		});
	};

	(function init(options) {
		exports.canvas = new fabric.Canvas("game_canvas");
		exports.canvas.selection = false;
		//exports.canvas.defaultCursor = "none";
		exports.canvas.backgroundColor = "gray";
		exports.canvas.setDimensions({
			width: options.width,
			height: options.height
		});
	})(options);
}
