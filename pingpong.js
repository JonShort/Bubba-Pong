function PingPongGame() {
	var exports = this;

	var Direction = {
		Left: 1,
		Right: 2,
		Up: 3,
		Down: 4
	};

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
		initialize: function(left, top) {
			var _radius = 15;
			this.callSuper("initialize", {
				left: left - (_radius/2),
		  		top: top - (_radius / 2),
		  		radius: _radius
			});

			this.set("selectable", false);
			this.setColor("red");
			this.direction = Direction.Up;
			this.isInPlay = true;
		},

		animate: function(environment) {
			if (this.left > environment.width) {
				this.direction = Direction.Left;
			} else if (this.left < 0) {
				this.direction = Direction.Right;
			}

			switch(this.direction) {
				case Direction.Right:
					this.left++;
					break;
				case Direction.Left:
					this.left--;
					break;
				case Direction.Up:
					this.top--;
					break;
				case Direction.Down:
					this.top++;
					break;
			}
		}
	});

	var _initCanvas = function(width, height) {
		var canvas = new fabric.Canvas("game_canvas");
		canvas.selection = false;

		canvas.defaultCursor = "none";

		canvas.setDimensions({
			width: width,
			height: height
		});

		return canvas;
	};

	var _run = function(canvas) {
		canvas.forEachObject(function(object) {
			if (!object.animate) {
				return;
			}
			object.animate({
				width: canvas.getWidth(),
				height: canvas.getHeight()
			});
		});

		canvas.fire("x:after-animate");

		canvas.renderAll();
		requestAnimationFrame(function() {
			_run(canvas);
		});
	};

	var _setInitialState = function(canvas) {
		var minPlayerY = canvas.height * 0.75;

		
		var player = new bat(canvas.width / 2, minPlayerY);

		canvas.on("mouse:move", function(options) {
			player.left = options.e.clientX - player.width / 2;
			player.top = options.e.clientY - player.height / 2;

			if (player.top < minPlayerY) {
				player.top = minPlayerY;
			}
		});

		canvas.on("mouse:down", function(options) {
			if (!(exports.gameBall && exports.gameBall.isInPlay)) {
				exports.gameBall = new ball(options.e.clientX, options.e.clientY);
				canvas.add(exports.gameBall);
			}
		});

		canvas.on("x:after-animate", function() {
			// if (exports.gameBall.intersectsWithObject(player)) {
			// 	alert("boom");
			// }
		});

		
		canvas.add(player);
	};

	exports.start = function(options) {
		var canvas = _initCanvas(options.width, options.height);
		requestAnimationFrame(function() {
			_setInitialState(canvas);
			_run(canvas);
		});
	};
}
