var Graph = {
  svg: "",
	init: function(svg, graph, index){

		this.svg = svg;

		var width = svg.attr("width"),
			height = svg.attr("height");

    //rect is for the clickOut function to do de-selection
    var rect = svg.append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", width).attr("height", height)
      .attr("fill", "#fff")
        .on("click", function(){
          onClickOut();
          d3.event.stopPropagation();
        })


		//var color = d3.scaleOrdinal(d3.schemeCategory20);

		var simulation = d3.forceSimulation()
      		.force("link", d3.forceLink().id(function(d) { return d.id; }))
      		.force("charge", d3.forceManyBody())
      		.force("center", d3.forceCenter(width / 2, height / 2));

      	var link = svg.append("g")
      		.attr("class", "links")
      		.selectAll("line")
      		.data(graph.links)
      		.enter().append("line")
          .attr("stroke", "black")
          .attr("opacity", function(d){
            return d.value;
          })
      		.attr("stroke-width", 1.5);

      	var node = svg.append("g")
      		.attr("class", "nodes")
      		.selectAll("circle")
      		.data(graph.nodes)
      		.enter().append("circle")
          .attr("id", function(d){
            return d.id+"_"+index;
          })
          .attr("fill", function(d){
            switch(d.group-1){
              case 0:
                return "#0099ff";
              case 1:
                return "#66ffff";
              case 2:
                return "#66ff33";
              case 3:
                return "#ffff00";
              case 4:
                return "#ff6600";
              case 5:
                return "#ff0000";
              case 6:
                return "#663300";


            }
          })
      		.attr("r", 6)
		        .on("mouseover", function(d){
		        	mouseOverAll(d); //all the nodes with the id of this node will be specified
		        })
		        .on("mouseout", function(d){
		          mouseOutAll(d);  //removes the mouseover effect for all the nodes with this id
		        })
            .on("click", function(d){
              onClickAll(d);
            });

        var label = svg.append("g")
          .attr("class", "labels")
          .selectAll("text")
          .data(graph.nodes)
          .enter().append("text")
          .attr("id", function(d){
            return d.id+"_"+index+"_text";
          })
          .attr("visibility", "hidden")
          .text(function(d){
            return d.name;
          })
          .attr("font-size", 16);


      	simulation
        	.nodes(graph.nodes)
        	.on("tick", ticked);

    	simulation.force("link")
        	.links(graph.links);

    	function ticked() {
      		link
          		.attr("x1", function(d) { return d.source.x; })
          		.attr("y1", function(d) { return d.source.y; })
          		.attr("x2", function(d) { return d.target.x; })
          		.attr("y2", function(d) { return d.target.y; });

      		node
          		.attr("cx", function(d) { return d.x; })
          		.attr("cy", function(d) { return d.y; });

          label
              .attr("x", function(d) { return d.x+5;})
              .attr("y", function(d) { return d.y-5;});
    		}

    	


      	return graph;
	},
  //removes the effects of the mouseover function
  mouseOut: function(nodeId){
    d3.selectAll("circle")
      .style("stroke","#fff")
      .style("stroke-width", 1.5)

    d3.select("#"+nodeId+"_text")
      .attr("visibility", "hidden");
  },

  //change the color and makes the id of the node visible
	mouseOver: function(nodeId){
    d3.select("#"+nodeId)
    	.style("stroke","black")
      .style("stroke-width", 1.5);

    d3.select("#"+nodeId+"_text")
      .attr("visibility", "visible");   
  }
}
