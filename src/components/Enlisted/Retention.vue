
<template>
	<div>
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div class="col form-group">
                        
                            <label class="custom-control custom-radio" >
                                <input class="custom-control-input" name="radio" type="radio" id="radio1" value="I" v-model="selected" @click="radioButton">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Inventory</span>
                            </label>
                
                        
                            <label class="custom-control custom-radio">
                                <input class="custom-control-input" name="group2" type="radio" id="radio2" value="E" v-model="selected" @click="radioButton">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Eligible</span>
                            </label>
                       
                        
                            <label class="custom-control custom-radio">
                                <input class="custom-control-input" name="group3" type="radio" id="radio3" value="K" v-model="selected" @click="radioButton">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Keep</span>
                            </label>
                       
                       
                            <label class="custom-control custom-radio">
                               <input class="custom-control-input" checked="checked" name="group4" type="radio" id="radio4" value="RR" v-model="selected" @click="radioButton">
                               <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Reenlistment Rate</span>
                            </label>
                      
                      
                            <label class="custom-control custom-radio">
                                <input class="custom-control-input" name="group5" type="radio" id="radio5" value="KR" v-model="selected" @click="radioButton">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description">Keep Rate</span>
                            </label>
                       
                    </div>
                    
                    <div class="col-auto">
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="searchAfsc='';searchMajcom='';searchBase='';resetAll()">Reset All</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto">
                        Inventory:
                        <span id="inv"></span>
                    </div>
                    <div class="col-auto">
                        Eligible:
                        <span id="elig"></span>
                    </div>
                    <div class="col-auto">
                        Keep:
                        <span id="keep"></span>
                    </div>
                    <div class="col-auto">
                        Re-Enlist Rate:
                        <span id="rr"></span>
                    </div>
                    <div class="col-auto">
                        Keep Rate:
                        <span id="kr"></span>
                    </div>
                    <!-- div class="col text-right" style="margin-right:5px">
                        As of Date: 
                        <span style="font-weight:bold"> {{ asDate }} </span>
                    </div -->
                </div>
                <div class="row">
                    <div id="year" class="col-3">
                        <div id="dc-year-rowchart">
                            <h3>Year <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-year-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="cat" class="col-3">
                        <div id="dc-cat-rowchart">
                            <h3>Category <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-cat-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <template class="AFSC-SECTION">
                        <div  v-if="!startAfsc" class="col-6"> 
                            <h3>
                                AFSC 
                                <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                                <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    >Reset</button>
                            </h3>
                        </div>
                        <div v-else class="col-6">
                            <afsc
                                :ndx="ndx"
                                :ylabel="ylabel"
                                :selected="selected"
                                :reduceAdd = "retentionAdd"
                                :reduceRemove = "retentionRemove"
                                :reduceInitial = "retentionInitial"
                                dataVar="AFSC"
                                removeBin = "I"
                            >
                            </afsc>
                        </div>
                    </template>
                </div>
                <div class="row">
                    <div id="majcom" class="col-12">
                        <div id="dc-majcom-barchart">
                            <h3>MAJCOM <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="searchMajcom='';resetChart('dc-majcom-barchart')">Reset</button>
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
                            <h3>MPF <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}} </span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="searchBase='';resetChart('dc-base-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model:value="searchBase"
                                size="3"
                                label="Search Installation"
                                @sub="submit(searchBase,'dc-base-barchart')"
                                button="true"
                                color="#2f9146"
                            ></searchBox>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
	</div>
</template>

<script>
	import dchelpers from '@/dchelpers'
	import axios from 'axios'
	import formats from '@/store/format'
    import afsc from '@/components/afsc'
    import { store } from '@/store/store'
    import Loader from '@/components/Loader'
    import searchBox from '@/components/searchBox'

	export default {
        data() {
            return {
                data: [],
                selected:'RR',
                searchMajcom: "",
                searchBase: "",
                startAfsc:false,
                loaded: false,
                asDate: 'Undetermined',
            }
        },
        components:{
            'afsc': afsc,
            'loader': Loader,
            'searchBox': searchBox,
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          ylabel: function() {
            if (this.selected === "I") {
                return "Inventory"
            }
            else if (this.selected === "E") {
                return "Eligible"
            }
            else if (this.selected === "K") {
                return "KEEP"
            }
            else if (this.selected === "RR") {
                return "Reenlist Rate(%)"
            }
            else {
                return "Keep Rate(%)"
            }
          },
        },
        methods: {
          resetAll(){
            store.state.resetAfsc = true;
            dc.filterAll();
            //dc.redrawAll();
            //resetAfsc Calls dc.redrawAll()
          },
          resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName().indexOf(id) !== -1
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
          },
          retentionAdd(p,v) {
            p.I = p.I + +v.INV
            p.E = p.E + +v.ELIG
            p.K = p.K + +v.KEEP
            //if divide by 0, set to 0, and if NaN, set to zero
            p.KR = p.K/p.I === Infinity ? 0 : Math.round((p.K/p.I)*1000)/10 || 0
            p.RR = p.K/p.E === Infinity ? 0 : Math.round((p.K/p.E)*1000)/10 || 0
            return p
          },
          retentionRemove(p,v) {
            p.I = p.I - +v.INV
            p.E = p.E - +v.ELIG
            p.K = p.K - +v.KEEP
            //if divide by 0, set to 0, and if NaN, set to zero
            p.KR = p.K/p.I === Infinity ? 0 : Math.round((p.K/p.I)*1000)/10 || 0
            p.RR = p.K/p.E === Infinity ? 0 : Math.round((p.K/p.E)*1000)/10 || 0
            return p
          },
          retentionInitial() {
            return {
                I: 0,
                E: 0,
                K: 0,
                RR: 0,
                KR: 0,
            }
          },
          removeEmptyBins:(source_group) => {
            return {
                all: () => {
                    return source_group.all().filter((d) => {
                        return d.value.I != 0
                    })
                }
            }
          }  
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_ret).then(response => {
                var axiosData = response.data.data
                console.log(response.data)
                store.state.asDate = response.data.asofdate
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
                //I = INV
                //E= ELIG
                //K = KEEP
                //RR= RE-ENL RATE
                //KR= KEEP RATE

                //***Totals***
                var tots = this.ndx.groupAll().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                //INV
                var invND = dc.numberDisplay("#inv")
                invND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.I;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //ELIG
                var eligND = dc.numberDisplay("#elig")
                eligND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.E;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //KEEP
                var keepND = dc.numberDisplay("#keep")
                keepND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.K;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //Re-enlist Rate
                var rrND = dc.numberDisplay("#rr")
                rrND.group(tots)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.RR})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                //Keep Rate
                var krND = dc.numberDisplay("#kr")
                krND.group(tots)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.KR})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                
                //YEAR
                var yearConfig = {};
                yearConfig.id = 'year';
                yearConfig.dim = this.ndx.dimension(function (d) {
                    return "20" + d.FY;
                })
                yearConfig.group = yearConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                yearConfig.minHeight = 100 
                yearConfig.aspectRatio = 2
                yearConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                yearConfig.colors = d3.scale.category10()
                var yearChart = dchelpers.getRowChart(yearConfig)
                yearChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })

                //CAT
                var catConfig = {};
                catConfig.id = 'cat';
                catConfig.dim = this.ndx.dimension(function (d) {
                    return formats.catFormat[d.CAT];
                })
                catConfig.group = catConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                catConfig.minHeight = 100 
                catConfig.aspectRatio = 1.4
                catConfig.margins = {top: 10, left: 40, right: 20, bottom: 20}
                catConfig.colors = d3.scale.category10()
                var catChart = dchelpers.getRowChart(catConfig)
                catChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })

                //Majcom
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return formats.majFormat[d.MAJ]})
                var majcomInv = majcomConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                majcomConfig.group = this.removeEmptyBins(majcomInv)
                majcomConfig.minHeight = 300
                majcomConfig.aspectRatio = 5
                majcomConfig.margins = {top: 10, left: 40, right: 30, bottom: 100}
                majcomConfig.colors = ["#1976d2"]
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', function(chart) {
                        chart.selectAll('rect.bar')
                            .classed('stack-deselected', function(d) {
                                //d.x is majcom and d.layer is assigned or stp
                                return chart.filter() && chart.filters().indexOf(d.x) === -1
                            })
                            .on('click', function(d) {
                                chart.filter(d.x)
                                dc.redrawAll()
                            })
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')

                    })
                
        

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return formats.mpfFormat[d.MPF]})
                var baseGroup = baseConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                baseConfig.group = this.removeEmptyBins(baseGroup)
                baseConfig.minHeight = 400
                baseConfig.aspectRatio = 5
                baseConfig.margins = {top: 30, left: 110, right: 30, bottom: 200}
                baseConfig.colors = ["#198632"]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
//                baseChart.stack(baseConfig.group, 'Inv',)
                baseChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })
                    .ordinalColors(["#198632"])
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //Call The AFSC Component HERE
                this.startAfsc = true;

                // after DOM updated redraw to make chart widths update
                this.$nextTick(() => {
                    dc.redrawAll()
                })

                //Resize
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }
                //create charts
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
    }
</script>

<style src="../../../node_modules/dc/dc.css">
</style>
<style scoped>
/* need to make this scoped */

.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}

.form-group{
    align-content: center;
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
