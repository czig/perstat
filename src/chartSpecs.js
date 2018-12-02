var standardBarChart = {
    minHeight: 180,
    aspectRatio: 5,
    margins: {top: 10, left: 30, right: 10, bottom: 40}
}
var standardRowChart = {
    minHeight: 150,
    aspectRatio: 2,
    margins: {top: 10, left: 30, right: 10, bottom: 20}
}

var baseChart = {
    minHeight: 240,
    aspectRatio: 3.8,
    margins: {top: 5, left: 60, right: 10, bottom: 100},
    color: "#dfaf00"
}

var majcomChart = {
    minHeight: 200,
    aspectRatio: 4.2,
    margins: {top: 5, left: 50, right: 10, bottom: 100},
    color: "#1976d2"
}

var coreChart = {
    minHeight: 250,
    aspectRatio: 4,
    margins: {top: 5, left: 30, right: 10, bottom: 50},
    color: "#35978f"
}

var highEdChart = {
    minHeight: 300,
    aspectRatio: 3,
    margins: {top: 10, left: 50, right: 10, bottom: 50},
    color: "#cc5500"
}

var offGroupChart = {
    minHeight: 300,
    aspectRatio: 3,
    margins: {top: 10, left: 50, right: 10, bottom: 50},
    color: "#5F9EA0"
}

var typeChart = {
    minHeight: 200,
    aspectRatio: 3,
    margins: {top: 10, left: 30, right: 10, bottom: 25},
    color: d3.scale.category10()
}

var empCatChart = {
    minHeight: 200,
    aspectRatio: 3,
    margins: {top: 30, left: 50, right: 10, bottom: 80},
    color: "#FF8C00"
}

var afscGroupChart = {
    minHeight: 300,
    aspectRatio: 3,
    margins: {top: 10, left: 40, right: 10, bottom: 100},
    color: "#108b52"
}

var yearChart = {
    minHeight: 300,
    aspectRatio: 4,
    margins: {top: 10, left: 50, right: 10, bottom: 45},
    color: "#dfaf00"
}

var boardChart = {
    minHeight: 250,
    aspectRatio: 5,
    margins: {top: 5, left: 40, right: 30, bottom: 60},
    color: "#1976d2"
}

var yrgpChart = {
    minHeight: 300,
    aspectRatio: 3,
    margins: {top: 30, left: 50, right: 30, bottom: 50},
    color: "#ff9900"
}

var stateChart = {
    minHeight: 200,
    aspectRatio: 4.2,
    margins: {top: 5, left: 50, right: 30, bottom: 100},
    color: "#108b52"
}

//make color grade color scale (gradePairs is for readability)
//note: could link this up with formats.gradeOrder
var blue = d3.rgb(51,172,255)
var gradePairs = {
    "[E1-E3] AMN": blue.brighter(1).toString(),
    "AMN": blue.brighter(1).toString(),
    "A1C": blue.brighter(0.9).toString(),
    "SRA": blue.brighter(0.8).toString(),
    "SSG": blue.brighter(0.7).toString(),
    "TSG": blue.brighter(0.6).toString(),
    "MSG": blue.brighter(0.5).toString(),
    "SMS": blue.brighter(0.4).toString(),
    "CMS": blue.brighter(0.3).toString(),
    "[01-02] LT": blue.brighter(0.2).toString(),
    "2LT": blue.brighter(0.2).toString(),
    "1LT": blue.brighter(0.1).toString(),
    "CPT": blue.darker(0.2).toString(),
    "MAJ": blue.darker(0.3).toString(),
    "LTC": blue.darker(0.4).toString(),
    "COL": blue.darker(0.5).toString(),
    "BG": blue.darker(0.6).toString(),
    "MG": blue.darker(0.7).toString()
}
var gradeDomain = Object.keys(gradePairs)
var gradeRange = Object.values(gradePairs) 
var gradeChartColorScale = d3.scale.ordinal().domain(gradeDomain).range(gradeRange)

export default {
    standardBarChart,
    standardRowChart,
    baseChart,
    majcomChart,
    coreChart,
    highEdChart,
    offGroupChart,
    typeChart,
    empCatChart,
    afscGroupChart,
    yearChart,
    boardChart,
    yrgpChart,
    stateChart,
    gradeChartColorScale
}
