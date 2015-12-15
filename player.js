Player = fabric.util.createClass(fabric.Group, {
	initialize: function(sprite, args) {
		this.callSuper("initialize");

		this.left = args.initialLeft;
		this.top = args.initialTop;
		this.selectable = false;
		sprite.hasBorders = false;

		this.hitTarget = new fabric.Rect({
			left: 25,
	  		top: 5,
	  		width: 68,
	  		height: 66,
	  		fill: "rgba(0,255,0,0.5)",
	  		hasBorders:false
		});

		this.addWithUpdate(sprite);
		this.addWithUpdate(this.hitTarget);
	},

	hitTargetIntersectsWithObject: function(object) {
		this.hitTarget.setCoords();
		this.setCoords();
		object.setCoords();

		return this.hitTarget.intersectsWithObject(object);
	}
});