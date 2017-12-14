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
}

module.exports = {
  getOrdinalBarChart: getOrdinalBarChart,
  getRowChart: getRowChart,
  updateChartConfig: updateChartConfig,
  preRedraw: preRedraw,
  getBrushBarChart: getBrushBarChart
}
