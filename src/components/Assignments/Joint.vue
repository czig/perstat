<template>
	<div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="resetAll">Reset All</button>
                    </div>
                </div>
            	<div class="row">
	                <div v-show="select.length > 1" class="row">
	                    	<div class="col-auto">
		                        Count:
		                        <span id="count"></span>
		                    </div>
		                    <div class="col-auto">
		                        Match:
		                        <span id="match"></span>
		                    </div>
		                    <div class="col-auto">
		                        Percent:
		                        <span id="percent"></span>
		                    </div>
	                </div>
	                <div v-show="select.length <= 1" class="row">
	                    	<div class="col-auto">
		                        Count:
		                        <span id="count2"></span>
		                    </div>
		                    <div class="col-auto">
		                        Match:
		                        <span id="match2"></span>
		                    </div>
		                    <div class="col-auto">
		                        Percent:
		                        <span id="percent2"></span>
		                    </div>
	                </div>
                </div>
                <div class="row">
                	<div id="grp" class="col-3">
                                <div id="dc-grp-rowchart">
                                    <h3>Type <span style="font-size: 14pt; opacity: 0.87;">Percent</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-grp-rowchart')">Reset</button>
                                    </h3>
                                </div>
                    </div>
					<div class="col-4">
						<h3>Grade 
							<button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    v-show="select"
                                    @click="select='';resetChart('dc-gradeA-barchart')">Reset</button> 

                        </h3>
                        <div class="well">
                        	<transition-group name="expand">
							<div v-show="grp>=1" key="1">
								<div class='btn-grade'>
									<button v-for="g in gradesOff" :class="['btn',
											g==select?'btn-success':'btn-info','btn-sm','myBtn']"
							                @click.prevent.cancel="selectGrd(g)">
							                {{ g }}  
							        </button>
						        </div>
					    	</div>
					    	<div v-show="grp<=1" key="2">
								<div class='btn-grade'>
									<button v-for="g in gradesEnl" :class="['btn',
											g==select?'btn-success':'btn-info','btn-sm','myBtn']"
							                @click.prevent.cancel="selectGrd(g)">
							                {{ g }}  
							        </button>
						        </div>
					    	</div>
					    	</transition-group>
				    	</div>
				    	<div class="col-1" id='gradeA' style='display:none'>
				    		<div id="dc-gradeA-barchart"></div>
				    	</div>
				    	{{  }}
			        </div>
			        <div  id="bar" class="col-5">
			        		<transition name="expandMid">
	                        <div id="dc-bar-barchart" v-show="select.length > 1" key="1">
	                            <h3>Paired <span style="font-size: 14pt; opacity: 0.87;"> Count </span>
	                            <button type="button" 
	                                    class="btn btn-danger btn-sm btn-rounded reset" 
	                                    style="display: none"
	                                    @click="resetChart('dc-bar-barchart')">Reset</button>
	                            </h3>
	                        </div>
	                    	</transition>
	                </div>
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

	export default {
		data(){
			return {
				loaded: false,
				select: '',
				grp: 1,
				gradeADim: {},
				gradeAGroup: {all:function(){return ''}},
				grades: [],
				gradesAll: [ "(01) 2LT", "(02) 1LT", "(03) CPT", "(04) MAJ", "(05) LTC", "(E1) AB", "(E2) AMN", "(E3) A1C", "(E4) SRA", "(E5) SSG", "(E6) TSG", "(E7) MSG", "(E8) SMS" ],
				gradesOff: [ "(01) 2LT", "(02) 1LT", "(03) CPT", "(04) MAJ", "(05) LTC" ] ,
				gradesEnl : ["(E1) AB", "(E2) AMN", "(E3) A1C", "(E4) SRA", "(E5) SSG", "(E6) TSG", "(E7) MSG", "(E8) SMS"]
			}
		},
		watch:{
			'gradeAGroup': {
				handler(val){
			       var li = []
		        	if ('all' in val){
		        		//console.log(val.all())
		        		val.all().forEach((d)=>{
		        			if (d.value >0  )
		        				li.push(d.key);
		        		})
		        		this.grades= li;
		        	}
			    },
			    deep: true
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
	        gradeALen: function(){
	        	return this.gradeAGroup.all()
	        }
        },
        methods: {
        	selectGrd(g){
        		this.select=g;
        		this.submit(g, 'dc-gradeA-barchart');
        	},
          	resetAll(event){
          		this.selectGrd('')
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
	        },
	        createGradeA(){
	        	this.gradeADim = this.ndx.dimension(function(d){return d.gradeA});
	        	this.gradeAGroup = this.removeEmptyBins(
	        		this.gradeADim.group().reduceSum(function(d) {
	        			return d.count 
	        		})
	        	)
	        },
	        removeEmptyBins: (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value.count != 0
                            })
                        }
                    }
            },
	    },
        components: {
            'loader': Loader,
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')       
            //TEST AXIOS CALL:
            axios.post(axios_url_join_spouse).then(response => {
            	store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
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
                var output = [];

                for (i=0; i < data.length; i++) {
                    obj = {};
                    for (k = 0; k < keys.length; k++) {
                        obj[keys[k]] = data[i][k];
                    }
                    output.push(obj);
                }
                return output;
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
                                return d.value.percent != 0
                            })
                        }
                    }
                }

                //reduce functions
                function jointAdd(p,v) {
                    p.count = p.count + +v.count
                    p.match = p.match + +v.match
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.match/p.count === Infinity ? 0 : Math.round((p.match/p.count)*1000)/10 || 0
                    return p
                }
                function jointRemove(p,v) {
                    p.count = p.count - +v.count
                    p.match = p.match - +v.match
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.match/p.count === Infinity ? 0 : Math.round((p.match/p.count)*1000)/10 || 0
                    return p
                }
                function jointInitial(p,v) {
                   return {
                   		count: 0,
                        match: 0,
                        percent: 0,
                   }
                }

                //reduce functions
                function jointAdd2(p,v) {
                	if (v.Type == '1'){
	                    p.count = p.count + +v.count
	                    p.match = p.match + +v.match
                	} 
                	//if divide by 0, set to 0, and if NaN, set to zero
	                    p.percent = p.match/p.count === Infinity ? 0 : Math.round((p.match/p.count)*1000)/10 || 0

                    return p
                }
                function jointRemove2(p,v) {
                    if (v.Type == '1'){
	                    p.count = p.count - +v.count
	                    p.match = p.match - +v.match
                	} 
                	//if divide by 0, set to 0, and if NaN, set to zero
	                    p.percent = p.match/p.count === Infinity ? 0 : Math.round((p.match/p.count)*1000)/10 || 0
	                    
                    return p
                }
                


                

                //Number Display for Count
                var count = this.ndx.groupAll().reduceSum(function(d) { 
                	
                		return +d.count;
                	})
                var countND = dc.numberDisplay("#count")
                countND.group(count)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Number Display for Count2
                var count2 = this.ndx.groupAll().reduceSum(function(d) { 
                		if (d.Type == '1')
                			return +d.count;
                		else return 0;
                	})
                var countND2 = dc.numberDisplay("#count2")
                countND2.group(count2)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Number Display for Match
                var match = this.ndx.groupAll().reduceSum(function(d) {
                		return +d.match;
                	})
                var matchND = dc.numberDisplay("#match")
                matchND.group(match)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Number Display for Match2
                var match2 = this.ndx.groupAll().reduceSum(function(d) {
                		if (d.Type == '1')
                			return +d.match;
                		else return 0;
                	})
                var matchND2 = dc.numberDisplay("#match2")
                matchND2.group(match2)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Percent
                var percentGroup = this.ndx.groupAll().reduce(jointAdd,jointRemove,jointInitial)
                var percentND = dc.numberDisplay("#percent")
                percentND.group(percentGroup)
                    .formatNumber(d3.format(".2f"))
                    .valueAccessor(function(d) { return d.percent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })


                //Percent
                var percentGroup2 = this.ndx.groupAll().reduce(jointAdd2,jointRemove2,jointInitial)
                //console.log(percentGroup2.all())
                var percentND2 = dc.numberDisplay("#percent2")
                percentND2.group(percentGroup2)
                    .formatNumber(d3.format(".2f"))
                    .valueAccessor(function(d) {return d.percent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
       
                //barChart
                var barConfig = {}
                barConfig.id = 'bar'
                barConfig.dim = this.ndx.dimension(function(d){return d.gradeB})
                var barPercent = barConfig.dim.group().reduce(jointAdd,jointRemove,jointInitial)
                barConfig.group = removeEmptyBins(barPercent)
                barConfig.minHeight = chartSpecs.majcomChart.minHeight 
                barConfig.aspectRatio = chartSpecs.majcomChart.aspectRatio 
                barConfig.margins = chartSpecs.majcomChart.margins 
                barConfig.colors = [chartSpecs.majcomChart.color]
                var barChart = dchelpers.getOrdinalBarChart(barConfig)
                barChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value['count']
                    })
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-bar-barchart')
                        })
                    })

                //gradeA
                this.createGradeA();
                var gradeAConfig = {}
                gradeAConfig.id = 'gradeA'
                gradeAConfig.dim = this.gradeADim;
                var gradeAPercent = this.gradeAGroup;
                gradeAConfig.group = removeEmptyBins(barPercent)
                gradeAConfig.minHeight = chartSpecs.majcomChart.minHeight 
                gradeAConfig.aspectRatio = chartSpecs.majcomChart.aspectRatio 
                gradeAConfig.margins = chartSpecs.majcomChart.margins 
                gradeAConfig.colors = [chartSpecs.majcomChart.color]
                var gradeAChart = dchelpers.getOrdinalBarChart(gradeAConfig)
                
                 //grp 
                var grp = {
                	'1' : 'Enlisted - Enlisted',
                	'2' : 'Officer - Enlisted',
                	'3' : 'Officer - Officer',
                }

                var grpOrder= {
                	'Officer - Officer' : 0,
                	'Officer - Enlisted' : 1,
                	'Enlisted - Enlisted' : 2
                }

                var grpConfig = {};
                grpConfig.id = 'grp'
                grpConfig.dim = this.ndx.dimension(function (d) {
                    return grp[d.Group];
                })
                grpConfig.group = grpConfig.dim.group().reduce(jointAdd,jointRemove,jointInitial)
                grpConfig.minHeight = 200 
                grpConfig.aspectRatio = 5
                grpConfig.margins = {top: 0, left: 30, right: 30, bottom: 20}
                grpConfig.colors = d3.scale.category10()
                var grpChart = dchelpers.getRowChart(grpConfig)   

                grpChart
                    .valueAccessor((d) => {
                        return d.value['percent']
                    })
                    .ordering((d)=>{
                    	return grpOrder[d.key]
                    })
             
             	grpChart.on('filtered', (chart, filter)=>{
             		//console.log(chart.filters())
             		if (chart.filters().length){
             			var off = false;
             			var enl = false;
             			chart.filters().forEach((fil)=>{
             				if (fil.indexOf('E') > -1)
             					off = true;
             				if (fil.indexOf('O') > -1)
             					enl = true;
             				if (fil.indexOf('O') > -1 && fil.indexOf('E') > -1){
             					enl = true;
             					off = true;
             				}
             			})
             			var temp = 1;
             			if (off && !enl)
             				temp = 0;
             			else if (!off && enl)
             				temp = 2
             			this.grp = temp;
             		} else {
             			this.grp = 1;
             		}
             	})
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

<style src="../../../node_modules/dc/dc.css">
</style>

<style scoped>
	.myBtn{
		//padding-top: 15px;
		//padding-bottom: 15px;
		//padding-left: 5px;
		//padding-right: 5px;
		width: 100px;
		//height: 3px;
	}

	#bar{
		height: 200px;
	}

	.expand-enter-active, .expand-leave-active {
      transition: all 0.8s ease;
      max-height: 200px;
      overflow: hidden;
    }
    .expand-enter, .expand-leave-to {
      max-height: 0;
      opacity: 0;
    }

    .expandMid-enter-active, .expandMid-leave-active {
      transition: all 2s ease;
  
      overflow: hidden;
      margin-left: 0;
  
    }
    .expandMid-enter, .expandMid-leave-to {
      margin-left: 200px;
      opacity: 0;
    }

    .expandSlow-enter-active, .expandSlow-leave-active {
      transition: all 1s ease;
      max-height: 1200px;
      overflow: hidden;
    }
    .expandSlow-enter, .expandSlow-leave-to {
      max-height: 0;
      opacity: 0;
    }

    .fade-enter-active {
        transition: all 0.5s; }
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
