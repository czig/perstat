var getOrdinalBarChart = (config)=>{
    var config = updateChartConfig(config)
    var chart = dc.barChart("#dc-"+config.id+"-barchart")
    chart
      .width(config.width)
      .height(config.height)
      .margins(config.margins)
      .dimension(config.dim)
      .group(config.group)
      .barPadding(0.15)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal)
      .elasticY(true)
      .colors(config.colors)
      .on('preRedraw', function(c){
        preRedraw(c, config)
      })
    return chart
  }

var getBrushBarChart = (config)=>{
  var config = updateChartConfig(config)
  var chart = dc.barChart("#dc-"+config.id+"-barchart")
  chart
    .width(config.width)
    .height(config.height)
    .margins(config.margins)
    .dimension(config.dim)
    .group(config.group)
    .brushOn(true)
    .x(config.x)
    .xUnits(function() {return config.xUnits})
    .elasticY(true)
    .colors(config.colors)
    .on('preRedraw', function(c){
      preRedraw(c, config)
    })
  return chart
}
var getRowChart = (config)=>{
  config = updateChartConfig(config)
  var chart = dc.rowChart("#dc-"+config.id+"-rowchart")
  chart
  .width(config.width)
  .minHeight(config.minHeight)
  .height(config.height)
  .margins(config.margins)
  .elasticX(true)
  .dimension(config.dim)
  .group(config.group)
  //.gap(config.height/100)
  .colors(config.colors)
  .on('preRedraw', function(c){
    preRedraw(c, config)
  })
  return chart
}
var getPieChart = (config)=>{
    config = updateChartConfig(config)
    var chart = dc.pieChart("#dc-"+config.id+"-piechart")
    chart
      .width(config.width)
      .minHeight(config.minHeight)
      .height(config.height)
      .radius(config.radius || config.height/2)
      .innerRadius(config.innerRadius)
      .externalLabels(config.externalLabels)
      .externalRadiusPadding(config.externalRadiusPadding)
      .drawPaths(true)
      .minAngleForLabel(0)
      .dimension(config.dim)
      .group(config.group)
      .on('preRedraw', function(c){
        preRedraw(c, config)
      })
    return chart
}

var getGeoChart = (config)=>{
    config = updateChartConfig(config)
    config.xOffset = config.width/config.xRatio
    config.yOffset = config.height/config.yRatio
    var chart = dc.geoChoroplethChart("#dc-"+config.id+"-geoChoroplethChart")
    chart
      .dimension(config.dim)
      .group(config.group)
      .valueAccessor(config.valueAccessor)
      .colors(config.colors)
      .colorAccessor(config.colorAccessor)
      .width(config.width)
      .minWidth(config.width)
      .height(config.height)
      .minHeight(config.minHeight)
      //Resize the geo map 
      .projection(config.projection.scale(Math.round(config.width/config.scale))
                    .translate([config.xOffset, config.yOffset])
                  )
      //Hook the geo map
      .overlayGeoJson(config.json.features, config.geoName, function(d) {
                        return d.properties[config.propName];
                    });

    chart.on("preRedraw", function(c) {
      preRedraw(c, config)
      var rangeFunc = function(d) {
        var g = config.valueAccessor(d)
        return config.colorAccessor(g)
      }
      var range = d3.extent(chart.group().all(), rangeFunc);
      chart.colorDomain(range);
    });
    return chart
}

var updateChartConfig = (config)=>{
  var layout_length = document.getElementById(config.id).className.match(/col\-(\d+)/)[1]
  var documentWidth = document.documentElement.clientWidth
  const smallScreenFactor = 0.96
  config.width = documentWidth > 960 ? Math.round(documentWidth*(layout_length/12)) : Math.round(documentWidth*smallScreenFactor)
  config.height = config.width/config.aspectRatio < config.minHeight ? config.minHeight : config.width/config.aspectRatio
  return config
}

var preRedraw = (chart, config) => {
  var minHeight = config.minHeight
  var newWidth = document.getElementById(config.id).offsetWidth
  var newHeight = newWidth/config.aspectRatio < config.minHeight ? config.minHeight : newWidth/config.aspectRatio
  chart
  .width(newWidth)
  .height(newHeight)
  .root().select('svg').attr('width',newWidth).attr('height',newHeight)
  //Make axis integer
  if (/\-rowchart$/.test(chart.anchorName())){
    chart.xAxis().tickFormat(d3.format("d")).ticks(3)
  }
  else if (/\-barchart$/.test(chart.anchorName())){
    chart.yAxis().tickFormat(d3.format("d")).ticks(3)
    chart.rescale()
  }
  else if (/\-piechart$/.test(chart.anchorName())){
    chart.radius(config.radius || newHeight/2)
  }
  else if (/\-geoChoroplethChart$/.test(chart.anchorName())) {
    var newXOffset = newWidth/config.xRatio
    var newYOffset = newHeight/config.yRatio
    chart.projection(config.projection.scale(newWidth/config.scale)
                        .translate([newXOffset, newYOffset]));
  }
  config.width = newWidth
  config.height = newHeight
}

module.exports = {
  getOrdinalBarChart: getOrdinalBarChart,
  getRowChart: getRowChart,
  updateChartConfig: updateChartConfig,
  preRedraw: preRedraw,
  getBrushBarChart: getBrushBarChart,
  getPieChart: getPieChart,
  getGeoChart: getGeoChart
}
