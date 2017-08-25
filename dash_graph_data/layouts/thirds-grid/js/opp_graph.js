var nodeIsSelected = "";
var svg = [3];
var graphs = [3];
var brain = null;
var brainIsSelected = false;

$(window).load(function(){
  brain = brainsprite({
    canvas: "viewer",
    sprite: "spriteImg",
    nbSlice: { 'Y':233 , 'Z':189 },
    colorBackground: "#FFFFFF",
    colorFont: "#000000",
    flagCoordinates: true,
    voxelSize: 1.000,
    onclick: function(e){
      console.log(brain);
      var nodeIndex = this.numSlice.X%24;

      d3.select("#graph_1").selectAll("circle")
        .attr("inutile", function(d,i){
          if(i == nodeIndex){
            mouseOverAll(d);
            brainIsSelected = true;
            onClickAll(d);
            brainIsSelected = false;
          }
          return null;
        });
    },
    overlay: {
      sprite: "rmapAverage",
      nbSlice: {'Y':233 , 'Z':189 },
      smooth: true,
      opacity: 0.6
    },
    colorMap: {
      img: "colorMap",
      min: 1,
      max: 7,
    }
  });
});

var edge;

d3.json('edge_test.json', function(error, classes) {
  if (!error) {
    edge = Object.create(edgeBundling);

    var svg = d3.select("#edge").append("svg")
      .attr("id", "edge_1")
      .attr("width", edge.diameter)
      .attr("height", edge.diameter)
      .append("g")
      .attr("transform", "translate(" + edge.diameter/2 + "," + edge.diameter/2 + ")");

      edge.init(svg, classes, 0);
      edge.svg = svg;
  }else {
    console.error(error);
  }
});



//GRAPH PART EXAMPLE TO INTEGRATE EDGE BUNDLING *****************************************************************************************************
  /*   var svg1 = d3.select('#graph_1');
     d3.json('test_3.json', function(error, graph) {
        if (!error) {
          graphs[0] = Object.create(Graph);
          graphs[0].init(svg1, graph, 0);
          graphs[0].svg = svg1;
        }else {
          console.error(error);
        }
      });


    var mouseOutAll = function(nodeObj) {
      if(!(nodeObj.id == nodeIsSelected)){
        for(var i=0; i<graphs.length; i++){
          graphs[i].mouseOut(nodeObj.id+"_"+i);
        }
      }
    }


    var mouseOverAll = function(nodeObj) {
      for(var i=0; i<graphs.length; i++){
        graphs[i].mouseOver(nodeObj.id+"_"+i);
      }
    }

    var onClickAll = function(nodeObj){
      if(nodeIsSelected != nodeObj.id){
        if(nodeIsSelected != ""){
          onClickOut();
        }

        nodeIsSelected = nodeObj.id;
        d3.selectAll("line")
        .attr("class", function(d){
          if((nodeObj.group == d.target.group)&&(nodeObj.group == d.source.group)){
            return "highlight";
            graphs[0].mouseOver(d.target+"_0")
          }else{
            return null;
          }
        });

        d3.selectAll(".highlight")
          .attr("stroke", "black")
          .attr("stroke-width", 3);
      }

    	if(!brainIsSelected){
        //console.log(brain);
	    	brain.voxelValue = nodeObj.group;
	    	brain.drawAll();
    	}
    }

    var onClickOut = function(){
      d3.selectAll(".highlight")
          .attr("class", null)
          .attr("stroke","#999")
          .attr("stroke-width", 1.5);
      //remove highlight of the node of the previous click
      for(var i=0; i<graphs.length; i++){
          graphs[i].mouseOut(nodeIsSelected+"_"+i);
        }

      nodeIsSelected = "";
    }*/

