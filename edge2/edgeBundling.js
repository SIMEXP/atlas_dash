var edgeBundling = {
	svg: "",
	diameter: 960,
	link:"",
	label: "",
	node: "",
	groupLabel: "",
	tension: 0.8,
	init: function(svg, classes, index){
		this.svg = svg;

	    var radius = this.diameter / 2,
	        innerRadius = radius - 120;

	    var colors = ["#FF0000", "#800000", "#FFFF00", "#808000", "#00FF00", "#008000", 
	                    "#00FFFF", "#008080", "#0000FF", "#000080", "#FF00FF", "#800080"];

	    var cluster = d3.cluster()
	        .size([360, innerRadius]);

	    var line = d3.radialLine()
	        .curve(d3.curveBundle.beta(this.tension))
	        .radius(function(d) { return d.y; })
	        .angle(function(d) { return d.x / 180 * Math.PI; });

	    link = svg.append("g").selectAll(".link"),
	    label = svg.append("g").selectAll(".label");

	           var root = this.packageHierarchy(classes)
            .sum(function(d) { return d.size; });

        cluster(root);

        console.log(this.packageImports(root.leaves()));

        link = link
            .data(this.packageImports(root.leaves()))
            .enter().append("path")
            .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
            .attr("class", "link")
            .attr("d", line);

        console.log(root.leaves());

        label = label
            .data(root.leaves())
            .enter().append("text")
            .attr("class", "label")
            .attr("dy", "0.31em")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .text(function(d) { return d.data.key; })
            .on("mouseover", this.mouseOver)
            .on("mouseout", this.mouseOut);

        node = svg.append("g").selectAll("circle")
            .attr("class", "node")
            .data(root.leaves())
            .enter().append("circle")
            .attr("id", function(d){
                return d.id+"_"+index;
            })
            .attr("fill", function(d){
                var group = d.data.name.charAt(7) + "";
		        if(d.data.name.charAt(8) != "."){
		            group += d.data.name.charAt(8);
		        }
                return colors[group];
            })
            .attr("r", 3)
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); });

        groupLabel = svg.append("g").selectAll(".groupLabel")
            .attr("class", "groupLabel")
            .data(this.packageParent(root.leaves()))
            .enter().append("text")
            .attr("dy", "0.5em")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 40) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .text(function(d) { return d.name; })

         console.log(this.packageParent(root.leaves()));


	},

	mouseOver: function(d) {
        label
            .each(function(n) { n.target = n.source = false; });

        link
            .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
            .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
            .filter(function(l) { return l.target === d || l.source === d; })
            .raise();

        label
            .classed("label--target", function(n) { return n.target; })
            .classed("label--source", function(n) { return n.source; });
    },

    mouseOut: function(d) {
        link
            .classed("link--target", false)
            .classed("link--source", false);

        label
            .classed("label--target", false)
            .classed("label--source", false);
    },

    // Lazily construct the package hierarchy from class names.
    packageHierarchy: function(classes) {
        var map = {};

        function find(name, data) {
            var node = map[name], i;
            if (!node) {
                node = map[name] = data || {name: name, children: []};
                if (name.length) {
                    node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                    node.parent.children.push(node);
                    node.key = name.substring(i + 1);
                }
            }
            return node;
        }

        classes.forEach(function(d) {
            find(d.name, d);
        });

        return d3.hierarchy(map[""]);
    },

    // Return a list of imports for the given array of nodes.
    packageImports: function(nodes) {
        var map = {},
            imports = [];

        // Compute a map from name to node.
        nodes.forEach(function(d) {
            map[d.data.name] = d;
        });

        // For each import, construct a link from the source to target node.
        nodes.forEach(function(d) {
            if (d.data.imports) d.data.imports.forEach(function(i) {
                imports.push(map[d.data.name].path(map[i]));
            });
        });

        return imports;
    },

    rangeChange: function(v){
        this.tension = v;

        line = d3.radialLine()
            .curve(d3.curveBundle.beta(this.tension))
            .radius(function(d) { return d.y; })
            .angle(function(d) { return d.x / 180 * Math.PI; });


        d3.select("#edge_1")
            .selectAll("path")
            .attr("d", line);
    },

    packageParent: function(nodes){
        var parents = [];
        var first = nodes[0];
        for(var i=0; i<nodes.length; i++){
            if(first.parent.data.key != nodes[i].parent.data.key){
                var obj = {};
                obj.name = first.parent.data.key;
                obj.x = (first.x +nodes[i-1].x)/2;
                obj.y = 360;
                parents.push(obj);
                first = nodes[i];
            }
        }
        var obj = {};
                obj.name = first.parent.data.key;
                obj.x = (first.x +nodes[nodes.length-1].x)/2;
                obj.y = 360;
                parents.push(obj);


        return parents;

    }

}