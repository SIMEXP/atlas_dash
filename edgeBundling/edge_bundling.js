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

		var cluster = d3.cluster()
    		.size([360, innerRadius]);

	
		var lineGenerator = d3.line()
		    .curve(d3.curveBundle.beta(0.7))
		    .x(function(d){return d[0];})
		    .y(function(d){return d[1];});


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

            tick();

            var link = svg.append("g")
		    	.attr("class", "links")
		    	.selectAll("path")
		    	.data(data.links)
		    	.enter().append("path")
		    	.each(function(d){
		    		d.coordinates = [
		    		[d.source.x, d.source.y], 
		    		[width/2, height/2],
		    		[d.target.x, d.target.y]
		    		];
		    	})
		   		.attr("class", "link")
		   		.attr("d", function(d){
		   			return lineGenerator(d.coordinates);
		   		});


           function tick() {
	      	/*	link
	          		.attr("x1", function(d) { //console.log(d);
	          			return d.source.x; })
	          		.attr("y1", function(d) { return d.source.y; })
	          		.attr("x2", function(d) { return d.target.x; })
	          		.attr("y2", function(d) { return d.target.y; });*/

      			node
          			.attr("cx", function(d){ d.x = PositionNodeX(d); return d.x;})
          			.attr("cy", function(d){ d.y = PositionNodeY(d); return d.y;})

		        /*label
		            .attr("x", function(d) { return d.x+5;})
		            .attr("y", function(d) { return d.y-5;});*/

		    }
			

            function PositionNodeX(d){
              	indexNodes = indexNodes + 1;
            	var x =	Math.round(width/2 + innerRadius*Math.sin(angle*indexNodes));
				return x;
			};

			function PositionNodeY(d){
				indexNodes = indexNodes + 1;
				var y =	Math.round(height/2 + innerRadius*Math.cos(angle*indexNodes));
				return y;
			};

			function pointArray(d){
				var dist = 1;


				d.coordinates = [
		    		[d.source.x, d.source.y], 
		    		[width/2, height/2],
		    		[d.target.x, d.target.y]
		    		];
			}


			

            return this;

	}

}