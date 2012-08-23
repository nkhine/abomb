function aBombClient() {
	var self = this,
		width = $('#map').width(),
		mapCanvasHeight = (width * 0.45),
		data = [],
		t = 0,
		timeout;
	// Set up the thunder audio element
	var audioElement2 = document.createElement('audio');
	audioElement2.setAttribute('src', 'audio/thunder.wav');

	this.init = function() {
		self.drawMap();
		self.loadNext();
	}
 
	this.drawMap = function () {
		//var data;
		// Most parts of D3 don't know anything about SVG—only DOM.

		self.svg = d3.select('#map').append('svg:svg')
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("viewBox", "0 0 " + width + " " + mapCanvasHeight);

		self.map = d3.geo.equirectangular().scale(width);
		self.path = d3.geo.path().projection(self.map);

		self.countries = self.svg.append('svg:g').attr('id', 'countries');
		d3.json("./data/world-countries.json", function(json) {
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

	this.loadNext = function () {
		d3.json("./data/detonations.json", function(datum) {
			//self.data.push({time: ++t, value: datum});
			timeout = setTimeout(self.loadNext, 1000)
			for(var i = datum.length - 1; i >= 0; --i) {
				var o = datum[i];
				message = {
					country: o.country
					,date: o.date
					,depth: o.depth
					,lon: o.lon
					,lat: o.lat
					,type: o.type
					,yield: o.yeild
				};
				self.drawDetonation(message)
			}
		});
	}

	this.drawDetonation = function (message) {
		var country = message.country
				,date = message.date
				,depth = message.depth
				,lon = message.lon
				,lat = message.lat
				,type = message.type
				,yield = message.yield;
		/// use longitude and latitude
		var mapCoords = this.map([lon, lat]);
		x = mapCoords[0]; // longitude
		y = mapCoords[1]; // latitude
		self.svg.append("svg:circle")
		.attr("r", yield)
		.attr("transform", function() { return "translate(" + x + "," + y + ")"; })
		.attr("class", "abomb")
		.style("fill", "steelblue")
		.on("mouseover", function(){
			d3.select(this).transition()
			.attr("r", yield + 5)
		})
		.on("mouseout", function() {
			//this.parentNode.appendChild(this);
			d3.select(this).transition()
			.attr("r", yield)
		});
		self.audioElement2.play();
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