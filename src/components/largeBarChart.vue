<!--######################################
USAGE:
    <largeBarChart :id="'unit'"         
                   :dimension="unitDim"
                   :group="unitGroup"
                   :widthFactor="0.90"
                   :aspectRatio="chartSpecs.unitChart.aspectRatio"
                   :minHeight="chartSpecs.unitChart.minHeight"
                   :selected="selected"
                   :ylabel="ylabel"
                   :reducer="manningAdd"
                   :accumulator="manningInitial"
                   :numBars="30"
                   :margin="chartSpecs.unitChart.margins"
                   :colorScale="unitColorScale"
                   :colorFunction="unitColorFun"
                   :title="'Units'"
                   :loaded="loaded"
                   :sortBy="value"
                   :orderBy="desc">
    </largeBarChart>

Props:
    id: string that will act as substring for all element ids
    dimension: a crossfilter dimension for data element (suggest making this a computed property)
    group: a crossfilter group with reduction already applied (suggest making this a computed property)
    widthFactor: multiplier to limit size of chart on render (makes less jumpy) 
    aspectRatio: width-to-height ratio of chart
    minHeight: minimum height for chart
    selected: data element to show for chosen dimension (percent, asgn, auth, etc.)
    ylabel: string describing the data element in 'selected'
    reducer: reduction function for generating 'others' bar
    accumulator: function that returns initial object that reducer can accumulate on
    numBars: default number of bars to display on chart
    margin: object giving top, right, bottom, and right margins (all numbers)
    colorScale: d3 scale that returns a color (needs domain and range - ensure range is an array of color values)
    colorFunction: function that tells chart how to choose colors for different bars  
    title: string for chart title
    loaded: Boolean indicating where data has been loaded
    sortBy: key or value.  If this prop is used, you must also use orderBy
    orderBy: asc or desc.  If this prop is used, you must also use sortBy

###########################################-->
<template>
    <div class ="row">
        <div :id="this.id + 'wrapper'" class="col-12">
            <div :id="this.id + 'title'" class="row">
                <h3 class="col-12 mb-0 pb-0">{{ title }} 
                    <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <span data-toggle="tooltip" 
                          data-placement="bottom"
                          title="Click on a bar to apply a filter. Ctrl+click the 'Others' bar to see bars aggregated within 'Others'. Pressing the 'Move up' button (displayed after Ctrl+clicking 'Others') is the opposite of Ctrl+clicking 'Others'. Use the scroll bar to select how many bars to show.">
                        <fontAwesomeIcon icon="info-circle" 
                                         size="xs"
                                         >
                        </fontAwesomeIcon>
                    </span>
                    <button :id="this.id + 'level'"
                            class="btn btn-success btn-sm"
                            style="visibility: hidden;"
                            @click="moveUp()">
                        Move Up
                    </button>
                    <button :id="this.id + 'reset'"
                            class="btn btn-danger btn-sm reset"
                            style="visibility: hidden;"
                            @click="filterAll()">
                        Reset
                    </button>
                    <button :id="this.id + 'sortAll'"
                            class="btn btn-primary btn-sm"
                            @click="sortAll()">
                        Sort 
                    </button>
                    <div :id="this.id + 'slider-container'"
                         style="display: inline-block;"
                         class="mb-0 pb-0">
                        <label  :id="this.id + 'slider-label'"
                                class="pt-0 pb-0 mt-0 mb-0"
                                style="font-size: 12px;">
                            Bars Displayed: {{ Number(lastBar) + 1 }}
                        </label>
                        <input  :id="this.id + 'slider'"
                                type="range"
                                class="form-control slider pt-0 pb-0 mt-0 mb-0"
                                style="cursor: pointer;"
                                min=1
                                :max="Math.min(dataAll().length,60)"
                                step="1"
                                v-model="lastBar"
                                @change="redraw()">
                    </div>
                </h3>
            </div>
        </div>
    </div>
</template>

<script>
import fontAwesomeIcon from '@fortawesome/vue-fontawesome' 
export default {
    data() {
        return {
            data: [],
            level: 0,
            original: true,
            direction: 'down',
            filters: [],
            nextData: [],
            lastBar: this.numBars || 30,
            sliderDisabled: false,
            svg: {},
            //chart object for registering with dc
            chart: {
                    id: this.id 
                    },
            w: document.documentElement.clientWidth*this.widthFactor - this.margin.left - this.margin.right,
            rendered: false,
            allSort: true,
            listeners: d3.dispatch(
                'preRender',
                'postRender',
                'preRedraw',
                'postRedraw',
                'filtered',
                'zoomed',
                'renderlet',
                'pretransition'
            )
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
        group: {
            type: Object,
            required: true,
        },
        widthFactor: {
            type: Number,
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
        selected: {
            type: String,
            required: false,  //if not supplied, group objects must have number for value property 
        },
        ylabel: {
            type: String,
            required: false,
        },
        reducer: {
            type: Function,
            required: true,
        },
        accumulator: {
            type: Function,
            required: true,
        },
        numBars: {
            type: Number,
            required: false, //if not supplied, defaults to 30
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
    components: {
        fontAwesomeIcon,   
    },
    computed: {
        h: function() {
            return Math.max(Math.round(this.w/this.aspectRatio) - this.margin.top - this.margin.bottom, this.minHeight - this.margin.top - this.margin.bottom);
        },
        minMax: function() {
            return d3.extent(this.data, d => (d.value[this.selected] || d.value))
        },
        minVal: function() {
            return this.minMax[0]
        },
        maxVal: function() {
            return this.minMax[1]
        },
        sortedBy: function() {
            return this.sortBy || 'value';
        },
        orderedBy: function() {
            return this.orderBy || 'desc';
        },
        xScale: function() {
            return d3.scale.ordinal()
                     .domain(this.data.map(function(d) {return d.key}))
                     .rangeRoundBands([0,this.w],0.1);        
        },
        yScale: function() {
            return d3.scale.linear()
                     .domain([0, this.maxVal])
                     .range([this.h,0]);
        },
        xAxis: function() {
            return d3.svg.axis()
                     .scale(this.xScale)
                     .orient("bottom"); 
        },
        yAxis: function() {
            return d3.svg.axis()
                     .scale(this.yScale)
                     .orient("left")
                     .ticks(5);
        },
        maxLevel: function() {
            return Math.floor((this.dataAll().length-1)/this.lastBar);
        }
    },
    watch: {
        //ensure chart updated when selected changes
        selected: function() {
            this.redraw()
        },
        //force redraw after rendered changes to true
        rendered: function() {
            if (this.rendered == true) {
                this.redraw()
            }
        }
    },
    methods: {
        //needed for 'resetChart' function
        anchorName: function() {
            return this.id
        },
        resetChart: (id) => {
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
        sortKey: function(order) {
            if (order == 'desc') {
                return this.removeEmptyBins(this.group).all().sort((a,b) => b.key.localeCompare(a.key));
            } else {
                return this.removeEmptyBins(this.group).all().sort((a,b) => a.key.localeCompare(b.key));
            }
        },
        sortValue: function(order) {
            if (order == 'desc') {
                return this.removeEmptyBins(this.group).all().sort((a,b) => (b.value[this.selected] === undefined ? b.value : b.value[this.selected]) - (a.value[this.selected] === undefined ? a.value : a.value[this.selected]));
            } else {
                return this.removeEmptyBins(this.group).all().sort((a,b) => (a.value[this.selected] === undefined ? a.value : a.value[this.selected]) - (b.value[this.selected] === undefined ? b.value : b.value[this.selected]));
            }
            
        },
        dataAll: function() {    
            //allSort toggles between key and value sort 
            if (this.allSort == true) {
                //sortedBy is initial sort type (key or value), orderedBy is ascending or descending
                if (this.sortedBy == "value") {
                    return this.sortValue(this.orderedBy);
                } else {
                    return this.sortKey(this.orderedBy);
                }
            } else {
                if (this.sortedBy == "value") {
                    return this.sortKey('asc');
                } else {
                    return this.sortValue('desc');
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
            // make "Others" object with correct properties/values
            // note: accumulator is a function so calling it returns an empty object 
            var othersObj = {key: "Others", value: nextVal.reduce(this.reducer, this.accumulator())}
            this.data.push(othersObj)
            this.data = this.data.filter(d => (d.value[this.selected] === undefined ? d.value : d.value[this.selected]) != 0)
        },
        sortAll: function() {
            this.allSort = !this.allSort
            this.redraw()
        },
        moveUp: function() {
            this.level = Math.max(this.level-1, 0)
            this.direction = 'up'
            this.original = true //always at original filter when go to new level
            console.log('moved up')
            this.updateData()

            this.dimension.filterAll() //remove filters from dimension
            if (this.level == 0) {
                //if top level, always remove all filters, but if no extra data to add, do a full reset
                this.filterAll(true)
            }
            else {
                // reset filters and reapply for new level
                this.filters = [] 
                this.filters = this.filters.concat(this.data.map(d => d.key).concat(this.nextData.map(g => g.key)))
                this.dimension.filterFunction(d => _.includes(this.filters,d))
            }
            console.log(this.filters)
            dc.redrawAll();
        },
        nextLevel: function(d) {
            if (d.key == "Others") {
                //reset filters so we can apply new ones at next level 
                this.filters = []
                //make up buttom visibile
                d3.select("#" + this.id + "level")
                    .style("visibility","visible");
                //apply filters for next level
                this.filters = this.filters.concat(this.nextData.map(g=>g.key))
                this.filters.push("Others")
                this.level += 1
                this.direction = 'down'
                this.original = true //always at original filter when go to new lwevel
                this.applyFilters()
            }
        },
        updateFilters: function(d) {
            if (this.original === true || (this.level == this.maxLevel && this.data.every(d=>_.includes(this.filters,d.key)))) {
                // if at original display for level, we have to reset all filters so the clicked bar can be filtered, also
                // if at last level and all data elements are currently filtered, reset filters
                this.filters = []    
            }                         
            //if clicked item filtered, remove filter
            if (_.includes(this.filters,d.key)) {
                if (d.key === "Others") {
                    this.filters = []
                } else {
                    var index1 = this.filters.indexOf(d.key)
                    this.filters.splice(index1,1)
                }
                //don't set original here because we don't know if at original filters for level yet 
            }
            //if clicked item not filtered, add filter
            else {
                // if others is clicked, filter on all next data
                if (d.key === "Others") {
                    this.filters = this.filters.concat(this.nextData.map(g=>g.key))
                    this.filters.push("Others")
                } else {
                    this.filters.push(d.key)
                }
                this.original = false //not original filters for this level
            }
            //if no filters and top level, full reset chart
            if (this.filters.length == 0 && this.level == 0) {
                this.filterAll(true)
            }
            // if we have some filters or not at top level, apply the filters 
            else {
                //apply filters for current level if not top level
                if (this.filters.length == 0 && this.level != 0) {
                    //only reset to current level, so add filters for current level and future levels 
                    this.filters = this.filters.concat(this.data.map(d => d.key).concat(this.nextData.map(g => g.key)))
                    this.original = true //original filters for this level
                } 
                console.log('filters at end:')
                console.log(this.filters)
                this.applyFilters()
            }
        },
        applyFilters: function() {
            //show reset button
            d3.select("#" + this.id + "reset")
              .style("visibility","visible");
            //disable slider
            this.sliderDisabled = true
            //disable sort button
            d3.select("#" + this.id + "sortAll")
                .property("disabled",true);

            this.dimension.filterFunction(d => _.includes(this.filters,d))
            if (this.filters !== undefined) {
                this.listeners.filtered(this.chart,this.filters)
            }
            dc.redrawAll()
        },
        render: function() {
            //wait until nextTick to render so that data is updated 
            this.$nextTick(() => {
                console.log('render')
                // assign vm to this to prevent conflicts
                var vm = this
                // call preRender
                vm.listeners.preRender(vm.chart)
                //key funciton for accessing key properties in data
                var key = function(d) {
                    return d.key;
                }
                //create data first time before drawing bars
                this.updateData()
                //clear any svg elements before rebuilding
                d3.select("#" + this.id + "svg").remove();

                var svg = d3.select("#" + this.id + "wrapper")
                            .append("svg")
                            .attr("id",this.id + "svg")
                            .attr("width",this.w + this.margin.left + this.margin.right)
                            .attr("height",this.h + this.margin.top + this.margin.bottom)
                            .classed("mt-0 pt-0",true)
                            .append("g")
                            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
                            
                var firstBars = svg.append("g")
                    .attr("id", this.id + "chart")
                    .attr("clip-path", "url(#" + this.id + "chart-area)")
                    .selectAll("rect")
                    .data(this.data,key)
                    .enter()
                    .append("rect")
                    .attr("id", function(d) {
                        //remove any not alpha-numeric characters - not really necessary
                        return d.key.replace(/[^a-z0-9]/gi,'');
                    })
                    .attr("x", function(d,i) {
                        return vm.xScale(d.key)
                    })
                    .attr("y", function(d) {
                        return vm.yScale((d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]));
                    })
                    .attr("width", this.xScale.rangeBand())
                    .attr("height", function(d) {
                        return vm.h-vm.yScale((d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]));
                    })
                    //color bars
                    .attr("fill", function(d) {
                        // if filtered, make desired color
                        if (_.includes(vm.filters,d.key)) {
                            // use color scale and color domain to set color
                            return typeof vm.colorFunction === "function" ? vm.colorFunction(d,vm.colorScale,vm.colorScale.domain()) : vm.colorScale(); 
                        } 
                        // if no filters, rever to default color
                        else if (vm.filters.length == 0){
                            // use color scale and color domain to set color
                            return typeof vm.colorFunction === "function" ? vm.colorFunction(d,vm.colorScale,vm.colorScale.domain()) : vm.colorScale(); 
                        }
                        else {
                            return "gray";
                        }
                    }) 
                    .on("click", function(d) {
                        if (d3.event.ctrlKey) {
                            vm.nextLevel(d);
                        } else {
                            vm.updateFilters(d);
                        }
                    })
                    .append("title")
                    .text(function(d) {
                        return d.key + ': ' + (d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]);
                    })
                    ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform","translate(0," + this.h + ")")
                    .call(this.xAxis)
                    .selectAll("text")
                    .style("text-anchor","end")
                    .style("cursor","pointer")
                    .attr("transform","translate(-8,3)rotate(-45)")
                    .on('click', function(d) {
                        //update filters expects object with key as property, spoof this for now
                        var obj = {key: d}
                        if (d3.event.ctrlKey) {
                            vm.nextLevel(obj);
                        } else {
                            vm.updateFilters(obj);
                        }
                    });

                svg.append("g")
                    .attr("class", "y axis")
                    .call(this.yAxis);

                svg.append("clipPath")
                    .attr("id",this.id + "chart-area")
                    .append("rect")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("width",this.w)
                    .attr("height",this.h);

                this.svg = svg
                console.log('endof render')
                this.rendered = true
            })
        },
        redraw: function() {
            //prevent calls to redraw before render
            if (this.rendered == true) {
                console.log('redraw')
                //allow use of 'this' within scoped functions
                var vm = this
                //call preRedraw
                vm.listeners.preRedraw(vm.chart)
                //key function for getting key for each object
                var key = function(d) {
                    return d.key;
                }
                //calculate new width (height computed prop) 
                this.w = document.getElementById(this.id + "wrapper").offsetWidth - this.margin.left - this.margin.right 

                d3.select("#" + this.id + "level").style("visibility", this.level <= 0 ? "hidden" : "visible");

                d3.select("#" + this.id + "svg").attr("width",this.w + this.margin.left + this.margin.right)
                            .attr("height",this.h + this.margin.top + this.margin.bottom);

                d3.select("#" + this.id + "chart-area").selectAll("rect")
                                               .attr("width",this.w)
                                               .attr("height",this.h);

                this.updateData()

                ////update number in slider to reflect length of data
                //d3.select('#' + this.id + 'slider-label')
                //  .text('Bars Displayed: ' + this.data.length);

                //d3.select('#' + this.id + 'slider')
                //   .attr("value",this.data.length)
                //   .attr("max",Math.min(this.dataAll().length,60));

                //setting value with d3 doesn't work, so use document element
                //document.getElementById(this.id + 'slider').value = this.data.length

                //select bars for entering, updating, and exiting bars
                var bars = d3.select("#" + this.id + "chart").selectAll("rect")
                            .data(this.data,key);

                //TODO: use cool enter transition when clicking others 
                // defines where to put new bars that will enter 
                bars.enter()
                    .append("rect")
                    .attr("id", function(d) {
                        //remove not alpha-numeric chars
                        return d.key.replace(/[^a-z0-9]/gi,'');
                    })
                    .attr("x", this.direction === 'down' ? this.w : 0)
                    .attr("y", this.h)
                    .on("click", function(d) {
                        if (d3.event.ctrlKey) {
                            vm.nextLevel(d);
                        } else {
                            vm.updateFilters(d);
                        }
                    })
                    .append("title")
                    .text(function(d) {
                        return d.key + ': ' + (d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]);
                    })
                    ;

                bars.select("title")
                    .text(function(d) {
                        return d.key + ': ' + (d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]);
                    });

                //defines bar color and specifies where entering bars end up
                bars.attr("fill", function(d) {
                        if (_.includes(vm.filters, d.key)) {
                            return typeof vm.colorFunction === "function" ? vm.colorFunction(d,vm.colorScale,vm.colorScale.domain()) : vm.colorScale(); 
                        } 
                        else if (vm.filters.length == 0){
                            return typeof vm.colorFunction === "function" ? vm.colorFunction(d,vm.colorScale,vm.colorScale.domain()) : vm.colorScale(); 
                        }
                        else {
                            return "gray";
                        }
                    }) 
                    .transition()
                    .duration(800)
                    .attr("x", function(d,i) {
                        return vm.xScale(d.key);
                    })
                    .attr("width", vm.xScale.rangeBand())
                    .attr("y", function(d) {
                        return vm.yScale((d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]));
                    })
                    .attr("height", function(d) {
                        return vm.h-vm.yScale((d.value[vm.selected] === undefined ? d.value : d.value[vm.selected]));
                    })
                    ;

                //defines where bars that are leaving screen end up
                bars.exit()
                    .transition()
                    .duration(800)
                    .attr("y", this.h)
                    .remove();

                d3.select("#" + this.id + "svg")
                              .select(".x.axis")
                              .transition()
                              .duration(800)
                              .attr("transform","translate(0," + this.h + ")")
                              .call(this.xAxis)
                              .selectAll("text")
                              .style("text-anchor","end")
                              .style("cursor","pointer")
                              .attr("transform","translate(-8,3)rotate(-45)");

                d3.select("#" + this.id + "svg")
                                .select(".x.axis")
                                .selectAll("text")
                                .on('click',function(d) {
                                    //update filters expects object with key as property, spoof this for now
                                    var obj = {key: d}
                                    if (d3.event.ctrlKey) {
                                        vm.nextLevel(obj);
                                    } else {
                                        vm.updateFilters(obj);
                                    }
                                });

                d3.select("#" + this.id + "svg")
                              .select(".y.axis")
                              .transition()
                              .duration(800)
                              .call(this.yAxis);

            }
        }
    },
    created: function() {
        console.log('created: large bar chart')
    },
    mounted: function() {
        console.log('mounted: large bar chart')
        //initialize tooltips
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
        //allow use of vue 'this' within scoped functions (need this for this.chart.filters --> function has to return vm.filters, this.filters causes the function to return itself)
        var vm = this
        //define chart object
        this.chart.anchorName = this.anchorName
        this.chart.dimension = function() { return vm.dimension }
        this.chart.redraw = this.redraw
        this.chart.render = this.render
        this.chart.filterAll = this.filterAll
        this.chart.filter = this.filterAll 
        this.chart.filters = function() { return vm.filters }
        this.chart.on = function (event, listener) {
            vm.listeners.on(event, listener);
            return vm.chart;
        }
        //register chart for dc
        dc.chartRegistry.register(this.chart)
        //call render (redraw always happens after render) if component is destroyed then created again
        if (this.loaded == true) {
            this.render()
        }
    },
    beforeUpdate: function() {
        console.log('beforeupdate: large bar chart')
    },
    destroyed: function() {
        console.log('destroyed: large bar chart')
    }
} 
</script>

<style> /* should be scoped */
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
