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
			this.setColor("green");
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

			this.deltaX = 5;
			this.deltaY = 5;
		},

		getRadius: function(yPosition, maxYPosition) {
			var _defaultRadius = 15;
			var bonusRadius = ((yPosition / maxYPosition) * 100) / 15;
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

			if (this.left < 0 || this.left > maxLeft) {
				this.deltaX = -this.deltaX;
			}
			if (this.top < 0 || this.top > maxTop) {
				this.deltaY = -this.deltaY;
			}

			this.left += this.deltaX;
			this.top += this.deltaY;

			this.radius = this.getRadius(this.top, maxTop);
		},

		invertDirection: function() {
			this.deltaY = -this.deltaY;
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

	var _setInitialState = function() {
		var minPlayerY = exports.canvas.height * 0.75;
		
		exports.player = new bat(exports.canvas.width / 2, minPlayerY);
		exports.gameBall = new ball(exports.player.left, exports.player.top, exports.canvas.width, exports.canvas.height);

		exports.canvas.on("mouse:move", function(args) {
			exports.player.left = args.e.clientX - exports.player.width / 2;
			exports.player.top = args.e.clientY - exports.player.height / 2;

			if (exports.player.top < minPlayerY) {
				exports.player.top = minPlayerY;
			}

			// Track Player when not in Play
			if (!exports.gameBall.isInPlay) {
				exports.gameBall.left = exports.player.left;
				exports.gameBall.top = exports.player.top;
			}
		});

		exports.canvas.on("mouse:down", function(args) {
			exports.gameBall.isInPlay = true;
		});
		
		exports.canvas.add(exports.player);
		exports.canvas.add(exports.gameBall);
	};

	exports.resizeCanvas = function(options) {
		exports.canvas.setDimensions({
			width: options.width,
			height: options.height
		});
	};

	exports.start = function() {
		requestAnimationFrame(function() {
			_setInitialState();
			_run();
		});
	};

	(function init(options) {
		exports.canvas = new fabric.Canvas("game_canvas");
		exports.canvas.selection = false;
		exports.canvas.defaultCursor = "none";
		exports.canvas.setDimensions({
			width: options.width,
			height: options.height
		});
	})(options);
}
