<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package MOCJ
 */

get_header();
?>

	
	<main id="main" class="site">

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content', get_post_type() );

			//the_post_navigation();

			// If comments are open or we have at least one comment, load up the comment template.
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<style>

</style>

<script src="https://d3js.org/d3.v5.min.js"></script>
<script>

//var charts = $()
var charts = d3.selectAll('.chart');

charts.each(function(d,i){
  var chart = d3.select(this);
});

var metricdata = []

var data2 = [
  {
    name: "2009",
    values: [
      {intervalLabel: "Q", interval: "0", value: "0"},
      {intervalLabel: "Q", interval: "1", value: "10"},
      {intervalLabel: "Q", interval: "2", value: "10"},
      {intervalLabel: "Q", interval: "3", value: "45"},
      {intervalLabel: "Q", interval: "4", value: "29"}
    ]
  },
  {
    name: "Canada",
    values: [
      {intervalLabel: "Q", interval: "0", value: "0"},
      {intervalLabel: "Q", interval: "1", value: "20"},
      {intervalLabel: "Q", interval: "2", value: "20"},
      {intervalLabel: "Q", interval: "3", value: "3"},
      {intervalLabel: "Q", interval: "4", value: "21"}
    ]
  },
];


var width = 300;
var height = 160;
var margin = 20;
var duration = 250;

var lineOpacity = "1";
// var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1px";
// var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 5;
var circleRadiusHover = 10;

var tooltip = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

function createChart(chart_id, data, max){

  var tickCount = data[0].values.length > 4 ? 3 : data[0].values.length - 1;
  var intLabel = '';
  /* Format Data */
  //var parseDate = d3.timeParse("%Y");
  data.forEach(function(d) { 
    d.values.forEach(function(d, i) {
      d.interval = +d.interval;
      d.value = +d.value; 
      intLabel = d.intervalLabel   
    });
  });
    

  /* Scale */
  // var xScale = d3.scaleTime()
  //   .domain(d3.extent(data[0].values, d => d.interval))
  //   .range([0, width-margin]);

  var xScale = d3.scaleLinear()
    .domain([0, data[0].values.length - 1]) // input
    .range([0, width]); // output

  var yScale = d3.scaleLinear()
    .domain([0, max])
    .range([height-margin, 0]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var colors = ['#2AC2E1','#074556'];
  
  /* Add SVG */
  var svg = d3.select(chart_id).append("svg")
    .attr("width", (width + margin)+"px")
    .attr("height", (height + margin)+"px")
    .attr("viewbox", "0 0 " + (width + margin) + " " +(height + margin))
    .attr("perserveAspectRatio", "xMinYMid")
    .append('g')
    .attr("transform", `translate(${margin/2}, ${margin/2})`);


  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(tickCount).tickFormat(function(d) { return d > 0 ? intLabel + d : '' });
  var yAxis = d3.axisLeft(yScale).ticks(0);
  // add the X gridlines
  svg.append("g")
    .attr("class", "bg")
      .append("rect")
      	.attr("fill", "#fff")
        .attr("x", 0)
        .attr("y", -margin)
        .attr("width", (width)+"px")
        .attr("height", (height)+"px")

  svg.append("g")     
      .attr("class", "grid")
      .attr("transform", "translate(0," + (height - margin) + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis)
    .selectAll("text") 
    .attr("y", 18)

  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.interval))
    .y(d => yScale(d.value));

  let lines = svg.append('g')
    .attr('class', 'lines');

  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', (d,i) => {return 'line-group yr-' + d.year + ((i == 0) ? ' curr' : '') + ((i == 1) ? ' comp' : '')})  
    // .on("mouseover", function(d, i) {
    //     svg.append("text")
    //       .attr("class", "title-text")
    //       .style("fill", colors[i])        
    //       .text(d.name)
    //       .attr("text-anchor", "middle")
    //       .attr("x", (width-margin)/2)
    //       .attr("y", 5);
    //   })
    // .on("mouseout", function(d) {
    //     svg.select(".title-text").remove();
    //   })
    .append('path')
    .attr('class', 'line')  
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => {console.log(i > 0); colors[(i != 0) ? 1 : 0]})
    .style('opacity', lineOpacity)
    // .on("mouseover", function(d) {
    //     d3.selectAll('.line')
    //         .style('opacity', otherLinesOpacityHover);
    //     d3.selectAll('.circle')
    //         .style('opacity', circleOpacityOnLineHover);
    //     d3.select(this)
    //       .style('opacity', lineOpacityHover)
    //       .style("stroke-width", lineStrokeHover)
    //       .style("cursor", "pointer");
    //   })
    // .on("mouseout", function(d) {
    //     d3.selectAll(".line")
    //         .style('opacity', lineOpacity);
    //     d3.selectAll('.circle')
    //         .style('opacity', circleOpacity);
    //     d3.select(this)
    //       .style("stroke-width", lineStroke)
    //       .style("cursor", "none");
    //   });
  var fill = null;

  /* Add circles in the line */

  lines.selectAll("point-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => colors[(i != 0) ? 1 : 0])
    .attr("class", (d,i) => {return "point-group yr-" + d.year + ((i == 0) ? ' curr' : '') + ((i == 1) ? ' comp' : '')})
    .on("mouseover", (d, i) =>{
      tooltip.classed('comp', i) 
    })
    .selectAll("rect")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "point")
    .attr('data-key', d => d.value)
    .attr('data-year', d => d.year)
    .on("mouseover", function(d,i) {
        if(i > 0)
        {
          var point = d3.select(this)
          var target = d3.select(d3.event.target)
          var left = parseInt(jQuery('.line-chart').offset().left) + parseInt(target.attr('x'));
  		    var top = jQuery(d3.event.target).offset().top - 50 - (jQuery('body.logged-in').length ? 45 : 0);
          tooltip.classed('flip', parseInt(target.attr('x')) > 280)
          
            .html('<span class="interval">' + d.intervalLabel + d.interval + ':</span><span class="value">'  + d.value + '</span>')  
              .style("left", left + "px")   
              .style("top", top + "px")
              .style("background", point.style('fill'))
              .style("border-color", point.style('fill'))
        }
      })
    .on("mouseout", function(d) {
       
    })
    .append("rect")
    .attr("x", d => xScale(d.interval) - circleRadius/2)
    .attr("y", d => yScale(d.value) - circleRadius/2)
    .attr("width", (d,i) => {return i > 0 ? circleRadius : 0})
    .attr("height", (d,i) => {return i > 0 ? circleRadius : 0})
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
          d3.select(this)
          .style("cursor", "pointer")
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
           tooltip.transition()    
          .duration(200)    
          .style("opacity", .9);    
        
    })
      .on("mouseout", function(d) {
         tooltip.transition()    
          .duration(500)    
          .style("opacity", 0); 

          d3.select(this) 
            .transition()
            .duration(duration)
            .attr("r", circleRadius);  
        });
  
  // gridlines in x axis function
  function make_x_gridlines() {   
      return d3.axisBottom(xScale)
          .ticks(tickCount)
  }
  
    
//animation

// var totalLength = [lines[0][0].getTotalLength(), lines[0][1].getTotalLength()];

// console.log(totalLength);


//    d3.select(lines[0])
//       .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] ) 
//       .attr("stroke-dashoffset", totalLength[0])
//       .transition()
//         .duration(5000)
//         .ease("linear")
//         .attr("stroke-dashoffset", 0);

//    d3.select(lines[1])
//       .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
//       .attr("stroke-dashoffset", totalLength[1])
//       .transition()
//         .duration(5000)
//         .ease("linear")
//         .attr("stroke-dashoffset", 0);

}
</script>


<?php
// get_sidebar();
get_footer();
