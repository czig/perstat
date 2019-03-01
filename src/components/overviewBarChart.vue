<!--######################################
USAGE:

    <overviewBarChart :id="'Units'"
                      :dimension="unitDim"
                      :aspectRatio="3.8"
                      :minHeight="240"
                      :normalToOverviewFactor="2.5"
                      :selected="selected"
                      :ylabel="ylabel"
                      :reducerAdd="manningAdd"
                      :reducerRemove="manningRemove"
                      :accumulator="manningInitial"
                      :numBars="15"
                      :margin="chartSpecs.baseChart.margins"
                      :colorScale="baseColorScale"
                      :colorFunction="dcBarColorFun"
                      :title="'Units'"
                      :loaded="loaded"
                      :sortBy="'value'"
                      :orderBy="'desc'"
                      >
    </overviewBarChart>

Props:
    id: string that will act as substring for all element ids
    dimension: a crossfilter dimension for data element (suggest making this a computed property)
    aspectRatio: width-to-height ratio of chart   
    minHeight: minimum height for chart
    normalToOverviewFactor: factor changing size difference between overview chart and 'normal' bar chart 
    selected: data element to show for chosen dimension (percent, asgn, auth, etc.)
    ylabel: string describing the data element in 'selected'
    reducerAdd: reduction function for adding in data
    reducerRemove: reduction function for removing data 
    accumulator: function that returns initial object that reducer can accumulate on
    numBars: default number of bars to display on bar chart (sets brush size on overview chart)
    margin: object giving top, right, bottom, and right margins (all numbers)
    colorScale: d3 scale that returns a color (needs domain and range - ensure range is an array of color values)
    colorFunction: NOT REQUIRED; function that tells chart how to choose colors for different bars; default to first color value 
    title: string for chart title
    loaded: Boolean indicating where data has been loaded
    sortBy: key or value.  If this prop is used, you must also use orderBy
    orderBy: asc or desc.  If this prop is used, you must also use sortBy    

###########################################-->
<template>
    <div class="row">
        <div :id="'overview' + id" class="col-12">
            <h3 class="mb-0 pb-0"> {{ title }}
                <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                <span data-toggle="tooltip" 
                      data-placement="right"
                      title="Use the brush on the top bar chart to filter the bottom bar chart. The bottom bar chart applies filters to other charts. Each chart has it's own reset.">
                    <FontAwesomeIcon icon="info-circle" 
                                     size="xs"
                                     >
                    </FontAwesomeIcon>
                </span>
<!--                 <button :id="this.id + 'sortAll'"
                        class="btn btn-primary btn-sm"
                        @click="sortAll()">
                    Sort 
                </button> -->
                <button type="button" 
                        class="btn btn-danger btn-sm btn-rounded reset" 
                        :id="'btn-overview-' + id + '-reset'"
                        style="visibility: hidden"
                        @click="resetChart('dc-overview' + id + '-barchart')">
                    Reset Top
                </button>
                <button type="button" 
                        :id="'btn-' + id + '-reset'"
                        class="btn btn-danger btn-sm btn-rounded reset" 
                        style="visibility: hidden"
                        @click="resetChart('dc-' + id + '-barchart')">
                    Reset Bottom
                </button>
            </h3>
            <div :id="'dc-overview' + this.id + '-barchart'">
            </div>
        </div>
        <div :id="id" class="col-12">
            <div :id="'dc-' + id + '-barchart'">
            </div>
        </div>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    export default {
        data() {
            return {
                filterArray: [],
                chartSpecs: chartSpecs,
                overviewChart: {},
                overviewNormalChart: {},
                rendered: false,
                allSort: true,
                keys: []
            }
        },
        props: {
            id: {
                type: String,
                required: true,
            },
            dimension: {
                type: Object,
                required: true,
            },
            aspectRatio: {
                type: Number,
                required: true,
            },           
            minHeight: {
                type: Number,
                required: true,
            },
            normalToOverviewFactor: {
                type: Number,
                required: false
            },
            selected: {
                type: String,
                required: false,
            },
            ylabel: {
                type: String,
                required: false,
            },
            reducerAdd: {
                type: Function,
                required: true,
            },
            reducerRemove: {
                type: Function,
                required: true,
            },
            accumulator: {
                type: Function,
                required: true,
            },
            numBars: {
                type: Number,
                required: false, //if not supplied, defaults to 15
                default: 15,
            },
            margin: {
                type: Object,
                required: true,
            },
            colorScale: {
                type: Function,
                required: true,
            },
            colorFunction: {
                type: Function,
                required: false, //if not supplied, only uses first color in range
                default: function(d,i) {return i;},
            },
            title: {
                type: String,
                required: true,
            },
            loaded: {
                type: Boolean,
                required: true,
            },
            sortBy: {
                type: String,
                required: false,
            },
            orderBy: {
                type: String,
                required: false,
            }
        },
        computed: {
            overviewGroup: function() {
                return this.removeError(this.dimension.group().reduce(this.reducerAdd,this.reducerRemove,this.accumulator))
            },
            overviewConfig: function() {
                return {
                    'id': 'overview' + this.id,
                    'dim': this.dimension,
                    'group': this.id_group(this.overviewGroup),
                    'minHeight': this.minHeight/(2*this.normalToOverviewFactor),
                    'aspectRatio': this.aspectRatio*this.normalToOverviewFactor,
                    'margins': {top: this.margin.top, left: this.margin.left, right: this.margin.right, bottom: 10},
                    'x': d3.scale.linear().domain([0,this.keys.length]),
                    'xUnits': this.keys.length,
                    'colors': this.colorScale,
                }
            },
            overviewNormalConfig: function() {
                return {
                    'id': this.id,
                    'dim': this.dimension,
                    'group': this.removeEmptyBinsAndNonBrush(this.overviewGroup),
                    'minHeight': this.minHeight,
                    'aspectRatio': this.aspectRatio,
                    'margins': {top: 10, left: this.margin.left, right: this.margin.right, bottom: this.margin.bottom},
                    'colors': this.colorScale,
                }
            },
            sortedBy: function() {
                return this.sortBy || 'value';
            },
            orderedBy: function() {
                return this.orderBy || 'desc';
            }
        },
        methods: {
            resetChart: (id)=>{
              dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id
              }).forEach(chart=>{
                chart.filterAll()
              })
              dc.redrawAll()
            },
            //remove empty function (es6 syntax to keep correct scope)
            removeEmptyBins: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {  
                            return (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0
                        })
                    }
                }
            },
            //remove empty function (es6 syntax to keep correct scope)
            removeError: (source_group) => {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return d.key != "error" && d.key != "**ERROR**"
                        })
                    }
                }
            },              
            removeNonBrush: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return _.includes(this.filterArray,d.key);
                        })
                    }
                }
            },
            removeEmptyBinsAndNonBrush: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            if (this.filterArray.length > 0) {
                                return (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0 && _.includes(this.filterArray, d.key);
                            } else {
                                return (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0; 
                            }
                        })
                    }
                }
            },
            //group to return for overview chart (brush bar chart)
            //note: brush bar chart needs a linear scale, and must return key 
            //number in order to support linear scale
            id_group: function(group) {
                return {
                    all: () => {
                        return group.all().map(function(kv,i) {
                            return {key: i, value: kv.value}; 
                        });
                    }
                }
            },
            dataAll: function() {    
                //allSort toggles between key and value sort 
                if (this.allSort == true) {                    
                    //sortedBy is initial sort type (key or value), orderedBy is ascending or descending
                    if (this.sortedBy == "value") {
                        if (this.orderedBy == 'desc') {
                            //console.log("Quantity sort: allSort true, sortedBy value, orderedBy desc+")
                            return this.overviewGroup.all().sort((a,b) => (b.value[this.selected] === undefined ? b.value : b.value[this.selected]) - (a.value[this.selected] === undefined ? a.value : a.value[this.selected]));
                        } else {
                            //console.log("allSort true, sortedBy value, orderedBy asc")
                            //return this.overviewGroup.all().sort((a,b) => (a.value[this.selected] === undefined ? a.value : a.value[this.selected]) - (b.value[this.selected] === undefined ? b.value : b.value[this.selected]));
                        }
                        //return this.sortValue(this.orderedBy);
                    } else {
                        if (this.orderedBy == 'desc') {
                            //console.log("allSort true, sortedBy key, orderedBy desc")                    
                            //return this.overviewGroup.all().sort((a,b) => b.key.localeCompare(a.key));
                        } else {
                            //console.log("allSort true, sortedBy key, orderedBy asc")
                            //return this.overviewGroup.all().sort((a,b) => a.key.localeCompare(b.key));
                        }                        
                        //return this.sortKey(this.orderedBy);
                    }
                } else {
                    if (this.sortedBy == "value") {
                        if (this.orderedBy == 'desc') {
                            //console.log("Alpha sort: allSort false, sortedBy key, orderedBy desc+")                    
                            return this.overviewGroup.all().sort((a,b) => a.key.localeCompare(b.key));
                        } else {
                            //console.log("allSort false, sortedBy key, orderedBy asc")
                            //return this.overviewGroup.all().sort((a,b) => b.key.localeCompare(a.key));                            
                        }                        
                        //return this.sortKey('asc');
                    } else {
                        if (this.orderedBy == 'desc') {
                            //console.log("allSort false, sortedBy value, orderedBy desc")
                            //return this.overviewGroup.all().sort((a,b) => (b.value[this.selected] === undefined ? b.value : b.value[this.selected]) - (a.value[this.selected] === undefined ? a.value : a.value[this.selected]));
                        } else {
                            //console.log("allSort false, sortedBy value, orderedBy asc")
                            //return this.overviewGroup.all().sort((a,b) => (a.value[this.selected] === undefined ? a.value : a.value[this.selected]) - (b.value[this.selected] === undefined ? b.value : b.value[this.selected]));
                        }                        
                        //return this.sortValue('desc');
                    }
                }
            },
            filterAll: function(all) {
                 //all is boolean. true for all, false for partial
                 console.log('filterAll: no filters')
                 var all = all == undefined ? true : all 
                 d3.select("#" + this.id)
                    .selectAll("rect")
                    // on reset, always fill all with first color in color domain
                    .attr("fill",this.colorScale(this.colorScale.domain()[0]))
                    .attr("opacity",1);
                 //hide reset button
                 d3.select("#" + this.id + "reset")
                     .style("visibility",  all ? "hidden" : "visible");
                 //hide 'move up' button
                 d3.select("#" + this.id + "level")
                     .style("visibility","hidden");
                 // enable slider
                 this.sliderDisabled = !all 
                 //enable sort
                 d3.select("#" + this.id + "sortAll")
                    .property("disabled",false);
                 this.filters = []
                 this.dimension.filterAll()
                 this.level = 0
                 this.original = true
                 dc.redrawAll()
            },
            updateData: function() {                
                //data to display now
                this.data = this.dataAll().slice(this.lastBar*this.level,this.lastBar*(this.level+1)) 
                //remaining data that gets group into others
                this.nextData = this.dataAll().slice(this.lastBar*(this.level+1))
                // pull out value object from all data
                var nextVal = this.nextData.map(d => d.value)
                this.data = this.data.filter(d => (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0)
            },
            sortAll: function() {
                this.allSort = !this.allSort
                //key function for accessing key properties in data
                var key = function(d) {
                    return d.key;
                }                
                this.updateData()
                this.renderOverviewCharts()
            },
            renderOverviewCharts: function() {
                var vm = this
                this.keys = this.overviewGroup.all().map(dc.pluck('key')).slice()
                var overviewChart = dchelpers.getBrushBarChart(this.overviewConfig)
                overviewChart
                    .controlsUseVisibility(true)
                    .colorAccessor(this.colorFunction)
                    .valueAccessor((d) => {
                        return d.value[this.selected] === undefined ? d.value : d.value[this.selected]
                    })
                    .xAxis().ticks([]);

                //set up filter to enable brush (by default no brush for ordinal chart)
                overviewChart.hasFilterHandler(function(filters, filter) {
                    if (filter === null || typeof(filter) === 'undefined') {
                        if (filters.length > 0) {
                            return filters[0][0] !== vm.keys[0] || filters[0][1] !== vm.keys[14];    
                        } else {
                            return filters.length === 0;
                        }
                    } else {
                        //if filter is defined, we are in the process of applying filters,
                        //so return false
                        return false;
                    } 

                })
                //prevent "resetAll" function from wiping out brush by replacing default filterAll function with our own
                //note: do not call filter(null) on this chart!
                overviewChart.filterAll = function() {
                    //subtract by 0.01 to keep numBars correct but set brush to correct point
                    overviewChart.replaceFilter(dc.filters.RangedFilter(0,vm.numBars-0.01));
                }
                overviewChart.filterHandler(function(dimension, filters) {
                    //apply filters (have to go from number to string as specified in dimension)
                    var rangeFilterDecode = filters.map(function(rangefilt) {
                        //both pairs (low,high) and (lowNum,highNum) are required!
                        //find units on low end and high end of range
                        //note: floor on low end and ceil on high end to keep bars at ends of brush
                        var low = vm.keys[Math.floor(rangefilt[0])]
                        var high = vm.keys[Math.floor(rangefilt[1])] || 'zzz';
                        //find number corresponding to high and low end of range
                        //note: floor on low end and ceil on high end to keep bars at ends of brush
                        var lowNum = Math.max(Math.floor(rangefilt[0]),0) 
                        var highNum = Math.min(Math.floor(rangefilt[1]),vm.overviewGroup.all().length)
                        //reset filter array
                        vm.filterArray = []
                        //put all units within range to an array (creates array of length (highNum - lowNum)
                        for (var i = lowNum; i < highNum + 1; i++) {
                            vm.filterArray.push(vm.keys[i])
                        }
                        return dc.filters.RangedFilter(low,high)
                    });
                    return rangeFilterDecode;
                });
                //override existing filter function - makes filter(null) a no-op to prevent wiping out brush
                var existingFunction = overviewChart.filter
                overviewChart.oldFilter = existingFunction
                overviewChart.filter = function(args) {
                    if (!arguments.length) {
                        var filters = overviewChart.filters()
                        return filters.length > 0 ? filters[0] : null;
                    }
                    else if (args == null || args.length == 0) {
                        return overviewChart;
                    } else {
                        overviewChart.oldFilter(args);
                    }  
                    return overviewChart;
                }
                //once user moves brush, store starting position of brush
                overviewChart.brushStart = []
                var b = overviewChart.brush()
                b.on('brushstart.custom', function() {
                    overviewChart.brushStart = overviewChart.extendBrush()
                })
                //override existing _brushing function (_brushing is called everytime brush moves), which does:
                //1. renames old _brushing function to __brushing
                //2. uses function supplied as last argument to dc.override as new _brushing function
                //3. adds a check before calling __brushing. This check resets the start and end of the brush to their 
                //   positions before the brush was moved if the difference between the start and end of the brush is 
                //   too small to capture a data element/bar
                dc.override(overviewChart, '_brushing', function() {
                    //extendBrush() returns an array where the first element is the left most (smallest) side of brush and
                    //the second element is the right most (largest) side of brush
                    var extent = overviewChart.extendBrush();
                    if (Math.abs(extent[1]-extent[0]) < 1) {
                        overviewChart.brush().extent(overviewChart.brushStart);
                    } 
                    overviewChart.__brushing();
                })
                //override existing fadeDeselectedArea function to make sure selected area (non-gray bars) aligns
                //with bars in normal bar chart
                overviewChart.fadeDeselectedArea = function() {
                    //change of context, 'this' refers to chart object, not vue 
                    var _chart = this;
                    var bars = _chart.chartBodyG().selectAll('rect.bar');
                    var extent = _chart.brush().extent();
                    if (!_chart.brushIsEmpty(extent)) {
                        //start and end are decimal numbers representing start and end of brush
                        var start = extent[0]
                        var end = extent[1]

                        //bar x values(d.x) will be integers, but start and end are decimal
                        //if bar is within brush or ends of brush sit on bar, highlight bar
                        bars.classed(dc.constants.DESELECTED_CLASS, function(d) {
                            return d.x < Math.floor(start) || d.x > end;
                        })
                    } else {
                        bars.classed(dc.constants.DESELECTED_CLASS, false);
                    }
                }
                //override turnOnControls and turnOffControls for top brush chart to make only "Reset Top" button shown when filtering brush chart 
                overviewChart.turnOnControls = function() {
                    d3.select('#btn-overview-'+vm.id+'-reset').style('visibility','visible');
                }
                overviewChart.turnOffControls = function() {
                    d3.select('#btn-overview-'+vm.id+'-reset').style('visibility','hidden');
                }
                this.overviewChart = overviewChart

                //unit
                var overviewNormalChart = dchelpers.getOrdinalBarChart(this.overviewNormalConfig)
                overviewNormalChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .colorAccessor(this.colorFunction)
                    .valueAccessor((d) => {
                        return d.value[this.selected] === undefined ? d.value : d.value[this.selected]
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .style('text-anchor', 'end')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d) => {
                            chart.filter(d) 
                            dc.redrawAll()
                        })
                    });
                //override turnOnControls and turnOffControls for bottom bar chart to allow reset button to be shown in first chart header
                overviewNormalChart.turnOnControls = function() {
                    d3.select('#btn-'+vm.id+'-reset').style('visibility','visible');
                }
                overviewNormalChart.turnOffControls = function() {
                    d3.select('#btn-'+vm.id+'-reset').style('visibility','hidden');
                }                
                this.overviewNormalChart = overviewNormalChart
                this.updateData()
                //render and redraw
                this.overviewChart.render()
                this.overviewNormalChart.render()
                //move brush to 'reset' position - subtract 0.01 to keep selection correct and only use number of bars inputted
                this.overviewChart.filter(dc.filters.RangedFilter(0,this.numBars-0.01)) 
                this.overviewChart.redraw()                
                this.overviewNormalChart.redraw()
            },
            
        },
        watch: {
            //render charts once loaded changes from false to true
            loaded: function() {
                console.log('loaded changed')
                if (this.loaded == true) {
                    console.log('loaded true')
                    this.renderOverviewCharts()
                }
            },
            //force redraw after rendered changes to true
            rendered: function() {
                if (this.rendered == true) {
                    this.updateData()
                }
            }            
        },
        components: {
            FontAwesomeIcon
        },
        mounted() {
            console.log('mounted: overview')
            //In case we go through mounted after everything is loaded, still render charts (more for hot reloading)
            // note: this part AND the watcher are required
            if (this.loaded == true) {
                this.renderOverviewCharts()
            }
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })
        },
        beforeDestroy() {
            console.log('before destroy: overview')
        },
        destroyed() {
            console.log('destroyed: overview')
        }
    }
</script>

<style>
    
</style>
