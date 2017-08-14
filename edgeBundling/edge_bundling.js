var edgeBundling = {
	svg:"",
	init: function(svg, data, index){
		this.svg = svg;

		var voxel = 7,
			nbNodes = 210;

		var width = svg.attr("width"),
			height = svg.attr("height");

		var tension = 0.7,
			indexNodes = 0,
			angle = (2*3.1416)/nbNodes;



		var diameter = Math.min(width, height),
		    radius = diameter / 2,
		    innerRadius = radius - 100;

		data.nodes.sort(function compareNodes(a, b){
				return parseFloat(a.group)-parseFloat(b.group);
			});

    	//rect is for the clickOut function to do de-selection
	    var rect = svg.append("rect")
	      .attr("x", 0).attr("y", 0)
	      .attr("width", width).attr("height", height)
	      .attr("fill", "#fff")
	        .on("click", function(){
	          //onClickOut();
	          d3.event.stopPropagation();
	        });

	    //replace target and source of links by the node object
	    data.links.forEach(function(d, i){
	    	if(typeof d.source==='string'){
	    		for(var i=0; i<nbNodes; ++i){
	    			if(data.nodes[i].id == d.source){
	    				d.source = data.nodes[i];
	    				break;
	    			}
	    		}
	    	}
	    	if(typeof d.target==='string'){
	    		for(var i=0; i<nbNodes; ++i){
	    			if(data.nodes[i].id == d.target){
	    				d.target = data.nodes[i];
	    				break;
	    			}
	    		}
	    	}
	    });


 /* link = link
    .data(data.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", line);*/


		var link = svg.append("g")
      		.attr("class", "links")
      		.selectAll("line")
      		.data(data.links)
      		.enter().append("line")
        	.attr("stroke", "black")
          	.attr("opacity", function(d){
            	return d.value;
          	})
      		.attr("stroke-width", 1.5);
      		//.attr("d", line);

      	var node = svg.append("g")
      		.attr("class", "nodes")
      		.selectAll("circle")
      		.data(data.nodes)
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
      		.attr("r", 3)
		       /* .on("mouseover", function(d){
		        	mouseOverAll(d); //all the nodes with the id of this node will be specified
		        })
		        .on("mouseout", function(d){
		          mouseOutAll(d);  //removes the mouseover effect for all the nodes with this id
		        })
            .on("click", function(d){
              onClickAll(d);
            })*/;




           function tick() {
           		node
          			.attr("cx", function(d){ return PositionNodeX(d);})
          			.attr("cy", function(d){ return PositionNodeY(d);})

	      		link
	          		.attr("x1", function(d) { //console.log(d);
	          			return d.source.x; })
	          		.attr("y1", function(d) { return d.source.y; })
	          		.attr("x2", function(d) { return d.target.x; })
	          		.attr("y2", function(d) { return d.target.y; });

      			

		        /*label
		            .attr("x", function(d) { return d.x+5;})
		            .attr("y", function(d) { return d.y-5;});*/

		    }
		    tick();

            function PositionNodeX(d){
            	//console.log(radius+" "+angle+" "+indexNodes);
            	indexNodes = indexNodes + 1;
            	var x =	width/2 + innerRadius*Math.sin(angle*indexNodes);
            	d.x = x;
				return x;
			};

			function PositionNodeY(d){
				indexNodes = indexNodes + 1;
				var y =	height/2 + innerRadius*Math.cos(angle*indexNodes);
				d.y = y;
				return y;
			};


			

            return this;

	}

}