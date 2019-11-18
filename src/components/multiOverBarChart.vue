<!--######################################
USAGE:

    <multiOverBarChart :id="'Units'"
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
    </multiOverBarChart>

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
                        @click="resetMultiChart(id)">
                        <!-- @click="resetMultiChart(id) -->
                        <!--@click="resetChart('dc-' + id + '-barchart')"-->
                    Reset Bottom
                </button>
                <h6 class="col-lg-4 col-md-6 col-sm-6 col-12">
                    <label class="typo__label">Select {{ title }} dropdown</label>
                    <!-- v-model="filterArray.selected" => (needs to be two-way binding to input) returns "value" array

                        :placeholder="'Pick ' + title + ''"
                        :options="keys" majcom denominator 
                        :label="keys.key" used to display a label on the options dropdown
                        :track="keys.key" used to connect to other items on page => value.value
                        pre filterArray.selected => value
                             :multiple="true"
                             :close-on-select="false"
                             :clear-on-select="false"
                    -->
                    <multiselect 
                             :id="'multi-' + id + '-select'"
                             v-model="value" 
                             :options="keys"
                             :searchable="false"
                             :allow-empty="true"
                             :close-on-select="true"
                             :placeholder="'Pick ' + title + ''"
                             :label="options"
                             :track-by="options"             
                             :@click="renderDropdowns('dc-' + id + '-barchart',multiLabels)">
                        <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                    </multiselect>
                    <!--<pre class="language-json"><code>{{  value  }}</code></pre>-->
                </h6>
            </h3>
            <div :id="'dc-' + this.id + '-select'"></div>
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
import Multiselect from 'vue-multiselect'

    export default {
        data() {
            return {
                filterArray: [],
                chartSpecs: chartSpecs,
                overviewChart: {},
                overviewNormalChart: {},
                rendered: false,
                allSort: true,
                keys: [],
                value: [],
                options: null
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
            },            
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
            resetVal: function() {
                return this.value = ''
            },
            multiLabels: function() {
                return this.value || ''
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
            resetMultiChart: (id)=>{
              dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-'+id+'-barchart'
              }).forEach(chart=>{
                chart.filterAll()
              })

              //add enter class
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-enter', true)

              //add inner active class
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-enter-active', true)
              //adjust style
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').style('display', 'block')

              //toggle multiselect active
              //d3.select('#overview' + id + ' div.multiselect').classed('multiselect--active', true)       
              
              //pseudoclass
              //remove one class
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-enter', false)               
              //add one class
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-enter-to', true)

              //remove two classes
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-enter-active', false)              
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-enter-to', false)
// comment out above

              // halfway point               
              //remove active
              //d3.select('#overview' + id + ' .multiselect').classed('multiselect--active', false)  

// comment out below
              //add two classes      
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-leave', true)
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-leave-active', true)    

             //remove one class
             //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-leave', false)    
             //add one class
             //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-leave-to', true)  

// comment out above

              //remove selected
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper ul li span.multiselect__option.multiselect__option--selected').classed('multiselect__option--selected',false)
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper ul li span.multiselect__option.multiselect__option--highlight').classed('multiselect__option--highlight',false)

              

              //d3.select("'multi-' + id + '-select'").placeholder = "'Pick '+id "


// comment out below
              //remove two classes            
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-leave-active', false)  
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').classed('multiselect-leave-to', false)

              //adjust style  
              //d3.select('#overview' + id + ' div.multiselect div.multiselect__content-wrapper').style('display', 'none') 
// comment out above
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
            renderDropdowns: (id, value)=>{              
              //console.log('start') 
              dc.chartRegistry.list().forEach((d)=>{
                if (d.anchorName() == id) {
                    d.filter(null)                    
                    if (value !== null || typeof(value) !== 'null') {
                        let myDropdownArr = value
                        //console.log('dropDown: '+ myDropdownArr)
                        if (value.length > 0) {  
                            return d.filter(value)
                        } 
                        //else if (value.length <= 0 || typeof(value) == 'null') {
                        //    return d.filter(null)
                        //}   
                    } else {
                        //console.log('val equals null')
                        resetChart(d)                 
                        resetChart('multi-'+id+'-select')      
                        return d.filter(null)
                    }
                } 
              });
                // //Identify existing filters
                // if (chart.hasFilter()) {
                //     myFilters = Array.from(chart.filters())
                //     console.log('normalChart has filter: '+myFilters)
                //     myDropdownArr.forEach((d) => {
                //         console.log('myDropDownArr: '+d)
                //         if (myFilters.includes(d)) {
                //             myFilters.pop(d)
                //             console.log('Value removed. myFilters: '+myFilters)
                //             return chart.filter(myFilters)
                //         } else if (!myFilters.includes(d)) {
                //             myFilters.push(d)
                //             myFilters.sort()
                //             console.log('Value added. myFilters: '+myFilters)
                //             return chart.filter(myFilters)
                //         }                        
                //         //this should apply my filters into the chart filter
                //         //return chart.filter([myFilters])  
                //     })   
                    
                // } else if (!chart.hasFilter() && myDropdownArr.length > 0) {
                //     myDropdownArr.forEach((d) => {
                //         console.log(d)
                //         myFilters.push(d)
                //         myFilters.sort()
                //         console.log('no hasfilters & dropdown.length >0 '+myFilters)     
                                           
                //         return chart.filter(myFilters)
                //     })  
                   
              //   } else {
              //       console.log('None of the above criteria occurred')
              //       return chart.filter(null)
              //   }
              //   console.log('myFilters @ end: '+myFilters)
                
              // })    
              //console.log('end')
              dc.redrawAll()
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
                          //console.log(d)                                                     
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

                // create a select menu
                // var selDim = overviewNormalChart,
                //     selGroup = selDim.group()
                // var selectMenu = dc.selectMenu('#dc-' + vm.id + '-select')
                //   .dimension(selDim)
                //   .group(selGroup)
                //   .title((d)=>{
                //      return d.key
                //   })
                //dc.renderAll();
                //

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
            FontAwesomeIcon,
            Multiselect
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
