<template>
	<div>
		<div class="container">
	        <transition-group name="fade" mode="out-in">
	        <loader v-show="!loaded" key="loader"></loader>
	        <div v-show="loaded" key="content">
		        <div class="row pt-2">
		        	<div class="col" id="category">
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="1st" type="radio" value="EFMP ASSIGNMENT" v-model="category" @click="singleSubmit('EFMP ASSIGNMENT', 'dc-type-rowchart')">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">EFMP Assignment</span>
                        </label>
                        <label class="custom-control custom-radio">
                            <input class="custom-control-input" name="2nd" type="radio" value="HUMANITARIAN ASSIGNMENT" v-model="category" @click="singleSubmit('HUMANITARIAN ASSIGNMENT', 'dc-type-rowchart')">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Humanitarian Assignment</span>
                        </label>
                        <label class="custom-control custom-radio">
                            <input class="custom-control-input" name="career" type="radio" value="EXPEDITED TRANSFER" v-model="category" @click="singleSubmit('EXPEDITED TRANSFER', 'dc-type-rowchart')">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Expedited Transfer</span>
                        </label>
                    </div>
		        	<div class="col-auto">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button> 
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="searchAfsc='';searchMajcom='';searchBase='';resetAll()">Reset All</button>
                    </div>
		        </div> 
		        <div class="row">
		        	<div class="col-auto">
                        Assignment Actions:
                        <span id="cnt"></span>
                    </div>
		        </div>
		        <div class="row">
                    <div class="col-3" id="year">
                    	<div id="dc-year-barchart">
                    		<h3>Year <span style="font-size: 14pt; opacity: 0.87;"></span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="display: none"
	                                @click="resetChart('dc-year-barchart')">Reset</button>
	                        </h3>
                    	</div>
                    </div>
                    <div class="col-4" id="marital">
                		<div id="dc-marital-rowchart">
                    		<h3>Marital Status <span style="font-size: 14pt; opacity: 0.87;"></span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="display: none"
	                                @click="resetChart('dc-marital-rowchart')">Reset</button>
	                        </h3>
                    	</div>
                	</div>
                	<div class="col-5" id="grade">
                    	<div id="dc-grade-barchart">
                    		<h3>Grade <span style="font-size: 14pt; opacity: 0.87;"></span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="display: none"
	                                @click="resetChart('dc-grade-barchart')">Reset</button>
	                        </h3>
                    	</div>
                    </div>
                </div>
                <div v-show="false" class="row">
                	<div class="col-6" id="type">
                    	<div id="dc-type-rowchart">
                    		<h3>Type <span style="font-size: 14pt; opacity: 0.87;"></span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="display: none"
	                                @click="resetChart('dc-type-rowchart')">Reset</button>
	                        </h3>
                    	</div>
                    </div>
                </div>
                <div class="row">
                    <div id="majcom" class="col-12">
                        <div id="dc-majcom-barchart">
                            <h3>MAJCOM <span style="font-size: 14pt; opacity: 0.87;"></span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-majcom-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model="searchMajcom"
                                size="3"
                                label="Search MAJCOM"
                                @sub="submit(searchMajcom,'dc-majcom-barchart')"
                                button="true"
                                :color="majcomColor"
                                :btnColor="majcomColor"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="base" class="col-12">
                        <div id="dc-base-barchart">
                            <h3>Servicing MPF <span style="font-size: 14pt; opacity: 0.87;"></span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-base-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model="searchBase"
                                size="3"
                                label="Search MPF"
                                @sub="submit(searchBase,'dc-base-barchart')"
                                button="true"
                                :color="baseColor"
                                :btnColor="baseColor"
                            ></searchBox>
                        </div>
                    </div>
                </div>
	    	</div>
	    	</transition-group>
	    </div>
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
    		category:'EFMP ASSIGNMENT',
    		searchMajcom: "",
            searchBase: "",
            loaded: false,
            baseColor: chartSpecs.baseChart.color,
            majcomColor: chartSpecs.majcomChart.color
    	}
    },
    computed: {
      	ndx: function(){
        	return crossfilter(this.data)
      	},
      	allGroup: function(){
        	return this.ndx.groupAll()
      	},
    },
    methods: {
      resetAll(event){
      	this.category = 'EFMP ASSIGNMENT'
        dc.filterAll()
        this.singleSubmit('EFMP ASSIGNMENT' , 'dc-type-rowchart')
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
      singleSubmit: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id
            }).forEach(chart=>{
                chart.filterAll()
                chart.filter(text)
            })
            dc.redrawAll()
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
    mounted() {
        console.log('mounted')

        //TEST AXIOS CALL:
        axios.post(axios_url_efmp).then(response => {
            console.log('FLA DEPLOY');
        	var axiosData = response.data.data
        	store.state.asDate = response.data.ASOFDATE
            var objData = makeObject(axiosData)
            console.log(objData)
            this.data = objData
            this.loaded = true
            renderCharts()
        })

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
                obj2 = {};
                obj2 = formatData(obj)
                obj2 = testData(obj2, obj)
                output.push(obj2);
            }
            return output;
        }

        var formatData = (given) =>{
            var obj = {}

            obj.Grade = given.ahk4_t
            obj.Marital = given.ale_t
            obj.Cnt = given.cnt
            obj.Majcom = formats.majFormat[given.cmd]
            obj.Mpf = formats.mpfFormat[given.mpf]
            obj.Type = given.type
            obj.Year = given.year

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

            //TOTAL
            var tots = this.ndx.groupAll().reduceSum((d)=>{ 
            	return d.Cnt
            })
            var invND = dc.numberDisplay("#cnt")
            invND.group(tots)
                 .formatNumber(d3.format("d"))
                 .valueAccessor(function(d) { return d;})
                 .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                 })

            //efmp
            var efmpGroup = this.ndx.groupAll().reduceSum((d)=>{ 
            	if (d.Type == 'EFMP ASSIGNMENT')
            		return +d.Cnt
            	else return 0
            })
            var efmpChart = dc.numberDisplay("#efmp")
            efmpChart.group(efmpGroup)
                 .formatNumber(d3.format("d"))
                 .valueAccessor(function(d) { return d;})
                 .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                 })

            //hum
            var humGroup = this.ndx.groupAll().reduceSum((d)=>{ 
            	if (d.Type == 'HUMANITARIAN ASSIGNMENT')
            		return +d.Cnt
            	else return 0
            })
            var humChart = dc.numberDisplay("#hum")
            humChart.group(humGroup)
                 .formatNumber(d3.format("d"))
                 .valueAccessor(function(d) { return d;})
                 .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                 })

            //exp
            var expGroup = this.ndx.groupAll().reduceSum((d)=>{ 
            	if (d.Type == 'EXPEDITED TRANSFER')
            		return +d.Cnt
            	else return 0
            })
            var expChart = dc.numberDisplay("#exp")
            expChart.group(expGroup)
                 .formatNumber(d3.format("d"))
                 .valueAccessor(function(d) { return d;})
                 .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                 })

            //YEAR
            var yearConfig = {};
            yearConfig.id = 'year';
            yearConfig.dim = this.ndx.dimension(function (d) {
                return d.Year;
            })
            yearConfig.group = yearConfig.dim.group().reduceSum((d)=>{
            	return d.Cnt
            })
            yearConfig.minHeight = 310
            yearConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
            yearConfig.margins = {top: 10, left: 45, right: 30, bottom: 100}
            yearConfig.colors = [chartSpecs.baseChart.color]
            var yearChart = dchelpers.getOrdinalBarChart(yearConfig)

            yearChart
                .elasticX(true)
                .on('pretransition', (chart)=> {
                    chart.selectAll('g.x text')
                    .attr('transform', 'translate(-8,0)rotate(-45)')
                    .on('click', (d)=>{
                        this.submit(d, 'dc-year-barchart')
                    })
                })
            yearChart.barPadding(0.2)

            //TYPE
            var typeConfig = {};
            typeConfig.id = 'type';
            typeConfig.dim = this.ndx.dimension(function (d) {
                return d.Type;
            })
            typeConfig.group = typeConfig.dim.group().reduceSum((d)=>{
            	return d.Cnt
            })
            typeConfig.minHeight = 300 
            typeConfig.aspectRatio = 2
            typeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
            typeConfig.colors = d3.scale.category10()
            var typeChart = dchelpers.getRowChart(typeConfig)

            typeChart.filter(this.category)
            
            //Marital marital
            var maritalConfig = {};
            maritalConfig.id = 'marital';
            maritalConfig.dim = this.ndx.dimension(function (d) {
                return d.Marital;
            })
            maritalConfig.group = maritalConfig.dim.group().reduceSum((d)=>{
            	return d.Cnt
            })
            maritalConfig.minHeight = 230 
            maritalConfig.aspectRatio = 2
            maritalConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
            maritalConfig.colors = d3.scale.category10()
            var maritalChart = dchelpers.getRowChart(maritalConfig)

            //Projection
            var gradeConfig = {};
            gradeConfig.id = 'grade';
            gradeConfig.dim = this.ndx.dimension(function (d) {
                return d.Grade;
            })
            gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduceSum((d)=>{
            	return d.Cnt
            }))
            gradeConfig.minHeight = 260
            gradeConfig.aspectRatio = 3
            gradeConfig.margins = {top: 10, left: 50, right: 30, bottom: 50}
            var c = d3.rgb(51,172,255)
            var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
            gradeChart
                .elasticX(true)
                .colorAccessor(function(d){
                    return d.key;
                })
                .colors(d3.scale.ordinal().domain(["(01) 2LT", "(02) 1LT", "(03) CPT", "(04) MAJ", "(05) LTC", "(E2) AMN", "(E3) A1C",
                                                     "(E4) SRA", "(E5) SSG", "(E6) TSG", "(E7) MSG", "(E8) SMS", "(E9) CMS"])
                .range([c.brighter(1).toString(), c.brighter(0.9).toString(), c.brighter(0.8).toString(), 
                                        c.brighter(0.7).toString(), c.brighter(0.6).toString(), c.brighter(0.5).toString(), c.brighter(0.4).toString(), 
                                        c.brighter(0.3).toString(), c.brighter(0.2).toString(), c.brighter(0.1).toString(), c.darker(0.2).toString(), 
                                        c.darker(0.3).toString(), c.darker(0.4).toString()]))
            .on('pretransition', (chart)=> {
                chart.selectAll('g.x text')
                .attr('transform', 'translate(-8,0)rotate(-45)')
                .on('click', (d)=>{
                    this.submit(d, 'dc-grade-barchart')
                })
            })
            //projChart.barPadding(0.2)

            //MAJCOM
            var majcomConfig = {}
            majcomConfig.id = 'majcom'
            majcomConfig.dim = this.ndx.dimension(function(d){return d.Majcom})
            var majcomPercent = majcomConfig.dim.group().reduceSum((d)=>{
            	return d.Cnt
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
            baseConfig.dim = this.ndx.dimension(function(d){return d.Mpf})
            var basePercent = baseConfig.dim.group().reduceSum((d)=>{
            	return d.Cnt
            })
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
                    .attr('transform', 'translate(-8,0)rotate(-45)')
                    .on('click', (d)=>{
                        this.submit(d, 'dc-base-barchart')
                    })
                })


            //Download Raw Data button
            d3.select('#download')
            .on('click', ()=>{
                var data = yearConfig.dim.top(Infinity);
                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                var myFilters = '';
                dc.chartRegistry.list().forEach((d)=>{
                    if (d.filters()[0])
                        myFilters += ' (' + d.filters() + ')'
                })

                FileSaver.saveAs(blob, 'PERSTAT EFMP' + ' ' + store.state.asDate + myFilters + ' .csv');
            });

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
    },
    components: {
    	'loader': Loader,
        searchBox, 
    }
}

</script>

<style scoped>
.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}

.form-group{
    align-content: center;
}
</style>