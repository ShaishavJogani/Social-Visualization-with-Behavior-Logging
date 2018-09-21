var svg, pie, key, arc, outerArc, color, width, height, radius, div;

function displayBar(data, result) {
    // set the dimensions of the canvas
    var margin = {
            top: 30,
            right: 40,
            bottom: 70,
            left: 80
        },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    // define the axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")


    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    // add the SVG element
    var svg = d3.select("#div1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // load the data
    data.forEach(function(d) {
        d.tag = d.tag;
        d.view = +d.view;
    });

    // scale the range of the data
    x.domain(data.map(function(d) {
        return d.tag;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.view;
    })]);

    // add axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "-3.71em")
        .style("text-anchor", "middle")
        .text("Question Views");


    // Add bar chart
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.tag);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.view);
        })
        .attr("height", function(d) {
            return height - y(d.view);
        })
        .on("mouseover", change);
    // change(result.result[2].userstats);
}

function displayPie(data, dataStats) {
    svg = d3.select("#div3")
        .append("svg")
        .append("g")

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    width = 600,
        height = 350,
        radius = Math.min(width, height) / 2;

    pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.count;
        });

    arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    key = function(d) {
        return d.data.action;
    };

    color = d3.scale.ordinal()
        .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    div = d3.select("body").append("div").attr("class", "toolTip");
}


function change(dataStats) {
    var data = dataStats.userstats;
    if (!svg) {
        displayPie(data, dataStats);
    }

    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), key);


    slice.enter()
        .insert("path")
        .style("fill", function(d) {
            return color(d.data.action);
        })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d) {
            div.style("left", d3.event.pageX + 10 + "px");
            div.style("top", d3.event.pageY - 25 + "px");
            div.style("display", "inline-block");
            div.html("Total " + (d.data.action) + "s: " + (d.data.count) + "<br>Percentage of all actions: " + (d.data.percentage) + "%");
        });
    slice
        .on("mouseout", function(d) {
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labels").selectAll("text")
        .data(pie(data), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return d.data.action;
        });

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        });

    text.exit()
        .remove();



    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
    middleInfo(dataStats);
};

function middleInfo(dataStats) {
    /* ---- Center Text---- */
    d3.selectAll("#sometext").remove();
    var g = svg.selectAll(".arc")
        .data(pie(dataStats.userstats))
        .enter().append("g").attr('id', 'sometext');
    g.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '0.9em')
        .attr('y', 20)
        .attr('dy', "-2.7em")
        .text(function(d, i) {
            return dataStats.tag;
        });
    g.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '0.8em')
        .attr('y', 20)
        .attr('dy', "-1.5em")
        .text(function(d, i) {
            return "Views: " + dataStats.view;
        });
    g.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '0.75em')
        .attr('y', 15)
        .attr('dy', "0.0em")
        .text(function(d, i) {
            return "Activity engagement: ";
        });
    g.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '0.8em')
        .attr('y', 15)
        .attr('dy', "1.0em")
        .text(function(d, i) {
            return (dataStats.total / object.view).toFixed(2) + "%";
        });
}
