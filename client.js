function aBombClient() {
	var self = this,
	width = $('#map').width(),
	mapCanvasHeight = (width * 0.45);

	this.init = function() {
		self.drawMap();
		self.drawDetonation();
	}
 
	this.drawMap = function () {
		var data;
		// Most parts of D3 don't know anything about SVG—only DOM.

		self.svg = d3.select('#map').append('svg:svg')
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("viewBox", "0 0 " + width + " " + mapCanvasHeight);

		self.map = d3.geo.equirectangular().scale(width);
		self.path = d3.geo.path().projection(self.map);

		self.countries = self.svg.append('svg:g').attr('id', 'countries');
		d3.json("./world-countries.json", function(json) {
			self.countries.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", self.path)
			.on("mouseover", function(d) {
				d3.select(this).style("fill","#6C0");})
				.on("mouseout", function(d) {
					d3.select(this).style("fill","#000000");})
		});
	}

	this.drawDetonation = function () {
		d3.json("./detonations.json", function(json) {
			self.countries.selectAll("path")
			console.log(json.length)
			//.data(json)
			
		});
		var yield = "2.9";
		var depth = "-0.9";
		/// use longitude and latitude
		var mapCoords = this.map([-122.05740356445312, 37.4192008972168]);
		x = mapCoords[0]; // longitude
		y = mapCoords[1]; // latitude

		self.svg.append("svg:circle")
		.attr("r", 5)
		.attr("transform", function() { return "translate(" + x + "," + y + ")"; })
		.attr("class", "member")
		.style("fill", "steelblue")
		.on("mouseover", function(){
			d3.select(this).transition()
			.attr("r", 15)
		})
		.on("mouseout", function() {
			//this.parentNode.appendChild(this);
			d3.select(this).transition()
			.attr("r", 5)
		});
		// append the dettonation details
		self.svg.append("svg:text")
		.attr("x", x - 10)
		.attr("dy", y + 10)
		.style("fill", "red")
		.text(function(d) { return yield; });
	}

	this.init();
};

var aBombClient;
jQuery(function() {
	aBombClient = new aBombClient();
});