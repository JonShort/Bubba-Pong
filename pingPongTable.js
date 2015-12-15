pingPongTable = fabric.util.createClass(fabric.Group, {
	initialize: function(args) {
		this.callSuper("initialize");

		var gridLineWidth = 5;
		var skewFactor = 0.1;

		// Add Table
		var tableTop = args.height * 0.15;
		var tableBottom = args.height * 0.9;
		var tableLeft = args.width * 0.1;
		var tableRight = args.width * 0.9;
		var tableSkew = args.width * skewFactor;
		this.add(new fabric.Polygon([
			{ x: tableLeft + tableSkew, y: tableTop },
			{ x: tableRight - tableSkew, y: tableTop },
			{ x: tableRight, y: tableBottom },
			{ x: tableLeft, y: tableBottom}],
			{
				fill: "#234F4A",
				stroke: "#FFFFFF",
				strokeWidth: gridLineWidth,
				shadow: {
					color: "rgba(0, 0, 0, 0.95)",
					offsetX: 0,
		        	offsetY: 40,
		        	blur: 20
				}
			}
		));

		// Add vertical white line
		var tableXMidPoint = (tableLeft + tableRight) / 2;
		this.add(new fabric.Polygon([
			{ x: tableXMidPoint, y: tableTop },
			{ x: tableXMidPoint, y: tableBottom }],
			{
				stroke: "#FFFFFF",
				strokeWidth: gridLineWidth
			}
		));

		// Add horizontal white line
		var tableYMidPoint = (tableTop + tableBottom) / (2 + skewFactor);
		var tableXMidPointAdjustment = (tableSkew / (2 - skewFactor));
		this.add(new fabric.Polygon([
			{ x: tableLeft + tableXMidPointAdjustment, y: tableYMidPoint },
			{ x: tableRight - tableXMidPointAdjustment, y: tableYMidPoint }],
			{
				stroke: "#FFFFFF",
				strokeWidth: gridLineWidth
			}
		));
	}
});