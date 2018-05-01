<template>
    <div class="container">
        <div class="row">
            <h1 class="col"> {{ pageName }}

                <span> 
                </span>
            </h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            Reserve/Guard will be incorporated in the near future
            <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="cursor: pointer;">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" id="loader" key="loader"></loader>
            <div v-show="loaded" id="content" key="content">
                <div class="row">
                    <div class="col-auto">
                        Inventory:
                        <span id="inv"></span>
                    </div>
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="resetAll">Reset All</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="row">
                            <div id="type" class="col-12">
                                <div id="dc-type-rowchart">
                                    <h3>Type <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-type-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="grade" class="col-8">
                        <div id="dc-grade-barchart">
                            <h3> Grade/Rank <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="majcom" class="col-12">
                        <div id="dc-majcom-barchart">
                            <h3>MAJCOM <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-majcom-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model:value="searchMajcom"
                                size="3"
                                label="Search MAJCOM"
                                @sub="submit(searchMajcom,'dc-majcom-barchart')"
                                button="true"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="base" class="col-12">
                        <div id="dc-base-barchart">
                            <h3>Base <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-base-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model:value="searchBase"
                                size="3"
                                label="Search Installation"
                                @sub="submit(searchBase,'dc-base-barchart')"
                                button="true"
                                :color="baseColor"
                                :btnColor="baseColor"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <div class ="row">
                    <div id="majcom-chart-wrapper" class="col-12"></div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import searchBox from '@/components/searchBox'

    export default {
        data() {
            return {
                data: [],
                searchMajcom: '',
                searchBase: '',
                selected: "percent",
                ylabel: 'Inventory',
                loaded: false,
                baseColor: chartSpecs.baseChart.color,
                majcomColor: chartSpecs.majcomChart.color,
                pageName: 'TF_Inventory',
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          asDate: function(){
            return store.state.asDate;
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
        },
        methods: {
          resetAll: (event)=>{
            dc.filterAll()
            dc.redrawAll()
          },
          resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName() == id
            }).forEach(chart=>{
              chart.filterAll()
            })
            dc.redrawAll()
          },
          radioButton: () => {
            setTimeout(function() {
                dc.redrawAll()
            },10)
          },
          submit: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id 
            }).forEach(chart=>{
                var mainArray = []
                chart.dimension().group().all().forEach((d) => {
                    mainArray.push(String(d.key))
                })
                var filterArray = mainArray.filter((d) => {
                    var element = d.toUpperCase() 
                    return element.indexOf(text.toUpperCase()) !== -1
                })
                chart.filter(null)
                if (filterArray.length != mainArray.length) {
                    chart.filter([filterArray])
                }
            })
            dc.redrawAll()
          }
        },
        components: {
            'loader': Loader,
            searchBox
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')       
            $('[data-toggle="tooltip"]').tooltip({delay: {"show":100, "hide":100}})
            //TEST AXIOS CALL:
            axios.post(axios_url_adman).then(response => {
                //console.log(response)
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                //console.log(axiosData)
                var objData = makeObject(axiosData)
                this.data = objData
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            var makeObject = (data) => {
                var keys = data.shift()
                var i = 0
                var k = 0
                var obj = null
                var obj2 = null
                var output = [];

                for (i=0; i < data.length; i++) {
                    obj = {};
                    for (k = 0; k < keys.length; k++) {
                        obj[keys[k]] = data[i][k];
                    }
                    var obj2 = {};
                    obj2 = formatData(obj)
                    obj2 = testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.File_Type = formats.type[given.type]
                obj.Grade = formats.gradeFormat[given.grade]
                obj.MAJCOM = formats.majFormat[given.maj]
                obj.MPF = formats.mpfFormat[given.mpf]
                obj.Inventory = given.count

                return obj;
            }

            var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === undefined){
                        console.log('Empty Value of ' + key)
                        console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //console.log(this.data[0])
                //reduce functions

                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value != 0
                            })
                        }
                    }
                }

                //type 
                var typeConfig = {};
                typeConfig.id = 'type'
                typeConfig.dim = this.ndx.dimension(function (d) {
                    return d.File_Type;
                })
                typeConfig.group = typeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;})
                typeConfig.minHeight = 200 
                typeConfig.aspectRatio = 3
                typeConfig.margins = {top: 0, left: 30, right: 30, bottom: 20}
                typeConfig.colors = d3.scale.category10()
                var typeChart = dchelpers.getRowChart(typeConfig)   

                //Location
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return d.MAJCOM})
                var majcomPercent = majcomConfig.dim.group().reduceSum(function(d){
                    return +d.Inventory 
                })
                majcomConfig.group = removeEmptyBins(majcomPercent)
                majcomConfig.minHeight = chartSpecs.majcomChart.minHeight 
                majcomConfig.aspectRatio = chartSpecs.majcomChart.aspectRatio 
                majcomConfig.margins = chartSpecs.majcomChart.margins 
                majcomConfig.colors = [chartSpecs.majcomChart.color]
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-8,0)rotate(-45)')
                             .on('click', (d)=>{
                                this.submit(d, 'dc-majcom-barchart')
                             })
                    })

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return d.MPF})
                var basePercent = baseConfig.dim.group().reduceSum(function(d) {return +d.Inventory;})
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight 
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = [chartSpecs.baseChart.color]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-9,0)rotate(-45)')
                             .on('click', (d)=>{
                                 this.submit(d, 'dc-base-barchart')
                             })
                    })

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var inv = this.ndx.groupAll().reduceSum(function(d) { return +d.Inventory })
                var invND = dc.numberDisplay("#inv")
                invND.group(inv)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })


                 //grade
                var gradeConfig = {}
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.Grade;
                })
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                gradeConfig.minHeight = 200
                gradeConfig.aspectRatio = 2.6
                gradeConfig.margins = {top: 10, left: 45, right: 30, bottom: 110}
                gradeConfig.colors = ["#108b52"]
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
                gradeChart
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-grade-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                gradeChart
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })  

                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = typeConfig.dim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT ' + this.pageName + ' ' + store.state.asDate + myFilters + ' .csv');
                });

                //make majcom bar chart
                var margin = {top: 10, bottom: 100, left: 50, right:30}
                var w = document.documentElement.clientWidth*0.90 - margin.left - margin.right
                var h = 300 - margin.top - margin.bottom 

                var key = function(d) {
                    return d.key;
                }

                var majcomDim = this.ndx.dimension(function(d) {return d.MAJCOM;})
                var majcomGroup = majcomDim.group().reduceSum(function(d) {
                    return +d.Inventory;
                })
                var majcomShow = removeEmptyBins(majcomGroup).all()
                var minVal = d3.min(majcomShow, function(d) {
                    return d.value;
                })
                var maxVal = d3.max(majcomShow, function(d) {
                    return d.value;
                })
                var xScale = d3.scale.ordinal()
                                .domain(majcomShow.map(function(d) {return d.key}))
                                .rangeRoundBands([0,w],0.1);
                var yScale = d3.scale.linear()
                                .domain([0, maxVal])
                                .range([h,0])

                var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom");
                var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(5);

                var newChart = {}
                newChart.id = "majcom-chart"
                newChart.anchorName = function() {
                    return newChart.id
                }
                newChart.dimension = majcomDim
                newChart.group = majcomGroup
                newChart.lastBar = 30
                newChart.dataAll = removeEmptyBins(majcomGroup).all().sort(function(a,b) {
                    return b.value-a.value;
                })
                newChart.data = newChart.dataAll.slice(newChart.lastBar*newChart.level,newChart.lastBar*(newChart.level+1))
                newChart.nextData = newChart.dataAll.slice(newChart.lastBar*(newChart.level+1),newChart.lastBar*(newChart.level+2))
                newChart.data.push({key: "Others", value: d3.sum(newChart.nextData, function(d) {return d.value;})})
                newChart.dataAdd = []
                newChart.level = 0
                newChart.xAxis = xAxis
                newChart.yAxis = yAxis
                newChart.filters = []
                newChart.filterAll = function() {
                    d3.select("#majcom-chart")
                        .selectAll("rect")
                        .attr("fill","steelblue")
                        .attr("opacity",1);
                    d3.select("#majcom-chart-reset")
                        .style("visibility","hidden");
                    d3.select("#majcom-up-level")
                        .style("visibility","hidden");
                    d3.select("#slider")
                        .property("disabled",false)
                        .style('cursor','pointer')
                        .style('opacity',1);
                    newChart.dataAdd = []
                    newChart.filters = []
                    newChart.dimension.filterAll()
                    newChart.level = 0
                    dc.redrawAll()
                }
                newChart.updateFilters = function(d) {
                    if (d.key == "Others") {
                        if (newChart.level != 0 && newChart.filters.includes("Others")) {
                            //remove filters if clicking others again with Others currently in filter
                            newChart.filters = []
                        } 
                        d3.select("#majcom-up-level")
                            .style("visibility","visible");
                        //add filters for next set of items
                        newChart.nextData.map(function(g) {
                            newChart.filters.push(g.key);
                        })
                        newChart.dataAdd.map(function(g) {
                            newChart.filters.push(g.key)
                        })
                        newChart.level += 1
                    } else {
                        if (newChart.level != 0 && newChart.filters.includes("Others")) {
                            //we have filtered by Others at least once and not clicked Others and Others is in filters,
                            //so reset filters so we can apply the one we clicked 
                            newChart.filters = []    
                            newChart.dataAdd.map(function(g) {
                                newChart.filters.push(g.key)
                            })
                        }
                    }
                    // if clicked item already filtered, remove filter    
                    if (newChart.filters.includes(d.key)) {
                        var index1 = newChart.filters.indexOf(d.key)
                        newChart.filters.splice(index1,1)
                    }
                    //if clicked item not filtered, add filter
                    else {
                        newChart.filters.push(d.key)
                        if (d.key != "Others") {
                            var temp = newChart.data.filter((g) => {
                                return g.key == d.key;
                            })
                            newChart.dataAdd.push(temp[0])
                            console.log(newChart.dataAdd)
                        }
                    }
                    //if no filters and top level, full reset chart
                    if (newChart.filters.length == 0 && newChart.level == 0) {
                        newChart.filterAll()
                    }
                    // if we have some filters or not at top level, apply the filters 
                    else {
                        //apply filters for current level if not top level
                        if (newChart.filters.length == 0 && newChart.level != 0) {
                            //only reset to current level, so add filters for current level 
                            newChart.data.map(function(d) {
                                newChart.filters.push(d.key);
                            })
                        } 
                        console.log(newChart.filters)
                        d3.select("#majcom-chart-reset")
                          .style("visibility","visible");
                        d3.select("#slider")
                            .property("disabled",true)
                            .style("cursor","default")
                            .style("opacity", 0.5);
                        majcomDim.filterFunction(function(d) {
                            return newChart.filters.includes(d)
                        })
                        dc.redrawAll()
                    }
                }
                newChart.render = function() {
                    //clear any svg elements before rebuilding
                    d3.select("#majcom-svg").remove();
                    //set title
                    var btnUp = d3.select("#majcom-chart-wrapper")
                                    .append("div")
                                    .attr("id","majcom-title")
                                    .classed("row",true)
                                    .append("h3")
                                    .classed("col-12",true)
                                    .text("MAJCOM Chart")
                                    .append("button")
                                    .attr("id","majcom-up-level")
                                    .text("Move Up")
                                    .classed("btn btn-success btn-sm",true)
                                    .style("visibility","hidden")
                                    .on("click", function() {
                                        newChart.level -= 1
                                        console.log('moved up')
                                        //get new data now that level changed
                                        newChart.data = newChart.dataAll.slice(newChart.lastBar*newChart.level,newChart.lastBar*(newChart.level+1))
                                        newChart.nextData = newChart.dataAll.slice(newChart.lastBar*(newChart.level+1),newChart.lastBar*(newChart.level+2))
                                        newChart.data.push({key: "Others", value: d3.sum(newChart.nextData, function(d) {return d.value;})})
                                        newChart.data = newChart.data.filter((d)=>{return d.value!=0;})

                                        newChart.filters = []
                                        newChart.dimension.filterAll()
                                        if (newChart.level > 0) {
                                            newChart.data.map(function(d) {
                                                newChart.filters.push(d.key);
                                            })
                                            newChart.dataAdd.map(function(g) {
                                                newChart.filters.push(g.key)
                                            })
                                            majcomDim.filterFunction(function(d) {
                                                return newChart.filters.includes(d)
                                            })
                                            console.log(newChart.filters)
                                            dc.redrawAll();
                                        }
                                        else {
                                            newChart.filterAll();
                                        }
                                    })

                    var btnReset = d3.select("#majcom-title")
                                    .selectAll("h3")
                                    .append("button")
                                    .attr("id","majcom-chart-reset")
                                    .text("Reset")
                                    .classed("btn btn-danger btn-sm reset",true)
                                    .style("visibility","hidden")
                                    .on("click", function() {
                                        newChart.filterAll()
                                    });

                    var sliderContainer = d3.select("#majcom-title")
                                            .selectAll("h3")
                                            .append("div")
                                            .attr("id","slider-container")
                                            .style("display","inline-block");

                    sliderContainer.append("label")
                       .attr("id","slider-label")
                       .text("Number of bars: " + newChart.lastBar)
                       .style("font-size","12px");

                    sliderContainer.append("input")
                                   .attr("id", "slider")
                                   .attr("type","range")
                                   .classed("form-control",true)
                                   .attr("min",1)
                                   .attr("max",newChart.dataAll.length)
                                   .attr("step",1)
                                   .attr("value",30)
                                   .style('cursor','pointer')
                                   .on("input", function() {
                                        newChart.lastBar = this.value
                                        d3.select('#slider-label')
                                          .text('Number of Bars: ' + Math.min(+this.value+1,62));
                                        newChart.redraw() 
                                   })
                                   ;

                    var svg = d3.select("#majcom-chart-wrapper")
                                .append("svg")
                                .attr("id","majcom-svg")
                                .attr("width",w + margin.left + margin.right)
                                .attr("height",h + margin.top + margin.bottom)
                                .append("g")
                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    svg.append("g")
                        .attr("id", "majcom-chart")
                        .attr("clip-path", "url(#majcom-chart-area)")
                        .selectAll("rect")
                        .data(newChart.data,key)
                        .enter()
                        .append("rect")
                        .attr("id", function(d) {
                            return d.key.replace(/[^a-z0-9]/gi,'');
                        })
                        .attr("x", function(d,i) {
                            return xScale(d.key)
                        })
                        .attr("y", function(d) {
                            return yScale(d.value);
                        })
                        .attr("width", xScale.rangeBand())
                        .attr("height", function(d) {
                            return h-yScale(d.value);
                        })
                        .attr("fill", function(d) {
                            if (newChart.filters.includes(d.key)) {
                               return "steelblue"; 
                            } 
                            else if (newChart.filters.length == 0){
                               return "steelblue"; 
                            }
                            else {
                                return "gray";
                            }
                        }) 
                        .on("click", function(d) {
                            newChart.updateFilters(d);
                        })
                        ;

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform","translate(0," + h + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor","end")
                        .attr("transform","translate(-8,3)rotate(-45)");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                    svg.append("clipPath")
                        .attr("id","majcom-chart-area")
                        .append("rect")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",w)
                        .attr("height",h);

                    newChart.svg = svg
                }
                newChart.redraw = function() {
                    var w = document.getElementById("majcom-chart-wrapper").offsetWidth - margin.left - margin.right 

                    d3.select("#majcom-svg").attr("width",w + margin.left + margin.right)
                                .attr("height",h + margin.top + margin.bottom);

                    d3.select("#majcom-chart-area").selectAll("rect")
                                                   .attr("width",w)
                                                   .attr("height",h);

                    newChart.data = newChart.dataAll.slice(newChart.lastBar*newChart.level,newChart.lastBar*(newChart.level+1))
                    newChart.nextData = newChart.dataAll.slice(newChart.lastBar*(newChart.level+1),newChart.lastBar*(newChart.level+2))
                    newChart.data.push({key: "Others", value: d3.sum(newChart.nextData, function(d) {return d.value;})})
                    newChart.data = newChart.dataAdd.concat(newChart.data)
                    newChart.data = newChart.data.filter((d)=>{return d.value!=0;})

                    var minVal = d3.min(newChart.data, function(d) {
                        return d.value;
                    })
                    var maxVal = d3.max(newChart.data, function(d) {
                        return d.value;
                    })

                    xScale.domain(newChart.data.map(function(d) {return d.key}))
                            .rangeRoundBands([0,w],0.1);
                    yScale.domain([0,maxVal])
                            .range([h,0]);

                    var bars = d3.select("#" + newChart.id).selectAll("rect")
                                .data(newChart.data,key);

                    bars.enter()
                        .append("rect")
                        .attr("id", function(d) {
                            return d.key.replace(/[^a-z0-9]/gi,'');
                        })
                        .attr("x", function(d,i) {
                            return xScale(d.key);
                        })
                        .attr("width", xScale.rangeBand())
                        .attr("y", function(d) {
                            return h;
                        })
                        .attr("height", function(d) {
                            return h-yScale(d.value);
                        })
                        .attr("fill", function(d) {
                            if (newChart.filters.includes(d.key)) {
                               return "steelblue"; 
                            } 
                            else if (newChart.filters.length == 0){
                               return "steelblue"; 
                            }
                            else {
                                return "gray";
                            }
                        }) 
                        .on("click", function(d,i) {
                            newChart.updateFilters(d);
                        });

                    bars.attr("fill", function(d) {
                            if (newChart.filters.includes(d.key)) {
                               return "steelblue"; 
                            } 
                            else if (newChart.filters.length == 0){
                               return "steelblue"; 
                            }
                            else {
                                return "gray";
                            }
                        }) 
                        .transition()
                        .duration(800)
                        .attr("x", function(d,i) {
                            return xScale(d.key);
                        })
                        .attr("width", xScale.rangeBand())
                        .attr("y", function(d) {
                            return yScale(d.value);
                        })
                        .attr("height", function(d) {
                            return h-yScale(d.value);
                        })
                        ;
                    
                    bars.exit()
                        .transition()
                        .duration(800)
                        .attr("y", function(d) {
                            return h;
                        })
                        .remove();

                    newChart.svg.select(".x.axis")
                                  .transition()
                                  .duration(800)
                                  .call(newChart.xAxis)
                                  .selectAll("text")
                                  .style("text-anchor","end")
                                  .attr("transform","translate(-8,3)rotate(-45)");

                    newChart.svg.select(".y.axis")
                                  .transition()
                                  .duration(800)
                                  .call(newChart.yAxis);
                }

                dc.chartRegistry.register(newChart)
                console.log(dc.chartRegistry.list())

                // after DOM updated redraw to make chart widths update
                this.$nextTick(() => {
                    dc.redrawAll()
                })

                //make responsive
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }

                //create charts
                dc.renderAll()
                dc.redrawAll()
            }
        },
        beforeUpdate() {
            console.log("beforeupdate")
        },
        beforeDestroy() {
            console.log("beforeDestroy")
            dc.chartRegistry.clear()
            store.state.asDate = 'Undetermined'
        },
        destroyed() {
            console.log("destroyed")
        }
    }
</script>

<style src="../../node_modules/dc/dc.css">
</style>
<style>
.axis line,
.axis path {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
.axis text {
    font-family: sans-serif; 
    font-size: 11px;
    transform: translate(-18,0) rotate(45deg);
}
rect:hover {
    cursor: pointer;
    opacity: 0.5;
}
</style>
<style scoped>
#base >>> text{
    font: 8px sans-serif;
}

text.baseText{
    font: 8px sans-serif;
}
.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}
.fade-enter-active {
    transition: all 0.5s;
}
.fade-leave-active {
    transition: all 0.2s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave {
    opacity: 1;
}

</style>
