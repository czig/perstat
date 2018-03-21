var getOrdinalBarChart = (config)=>{
    var config = updateChartConfig(config)
    var chart = dc.barChart("#dc-"+config.id+"-barchart")
    chart
      .width(config.width)
      .height(config.height)
      .margins(config.margins)
      .dimension(config.dim)
      .group(config.group)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal)
      .elasticY(true)
      .ordinalColors(config.colors)
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
    config.scale = config.width * 0.65
    config.width = config.scale * 0.9
    config.height = config.scale / 2.1
    var chart = dc.geoChoroplethChart("#dc-"+config.id+"-geoChoroplethChart")
    chart
      .width(config.width)
      .height(config.height)
      .transitionDuration(1000)
      .dimension(config.dim)
      .group(config.group)
      .colors(config.colors)
      .colorDomain(config.colorDomain)
      .colorAccessor(function(d){ if (d) return d[config.colorAccessor];})
      .projection(    
                      d3.geo.albersUsa()
                      .scale(config.scale)
                      .translate([config.width / 2, config.height / 2])
                  )
      .overlayGeoJson(config.features, config.geoName, function(d) {
                        return d.properties.name;
                    })
      .on('preRedraw', function(c){
        preRedraw(c, config)
      })
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
  else if (/\-geoChoroplethChart$/.test(chart.anchorName())){
    // chart.width(config.scale * 0.8)
    //      .height(config.scale/2)
  }
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
