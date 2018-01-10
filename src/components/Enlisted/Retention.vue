<template>
	<div>
        <div class="row pt-2"> 
            <div id="radioSelect" class="col form-group">
                <input name="radio" type="radio" id="radio1" value="I" v-model="selected" @click="radioButton">
                <label for="radio">Inventory</label>
                <input name="group2" type="radio" id="radio2" value="E" v-model="selected" @click="radioButton">
                <label for="radio">Eligible</label>
                <input name="group3" type="radio" id="radio3" value="K" v-model="selected" @click="radioButton">
                <label for="radio3">Keep</label>
                <input name="group4" type="radio" id="radio4" value="RR" v-model="selected" @click="radioButton">
                <label for="radio4">Re-enlistment Rate</label>
                 <input checked="checked" name="group5" type="radio" id="radio5" value="KR" v-model="selected" @click="radioButton">
                <label for="radio4">Keep Rate</label>
            </div>
            <div class="col"></div>
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
        </div>
        <div class="row">
            <div id="year" class="col-4">
                <div id="dc-year-rowchart">
                    <h3>Year <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-year-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
             <div id="afsc" class="col-4">
                <div id="dc-afsc-select">
                    <h3>AFSC <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="searchAfsc='';resetChart('dc-afsc-select')">Reset</button>
                    </h3>
                    <form class="form-inline">
                        <div class="col-4">
                            <autocomplete 
                                :suggestions="afscAutoComplete"
                                placeholder="Search AFSC"
                                v-model="searchAfsc"
                                @input="submit($event,'dc-afsc-select')"
                                ref="afscAC"
                                v-clickOutside="afscOut">
        
                            </autocomplete>
                        </div>   
                    </form>
                </div>
            </div>
            <!-- div class="col-4 form-group">
                            <input id="searchAfsc" v-model="searchAfsc" placeholder="Search AFSC" @keydown.enter="submit(searchAfsc,'dc-afsc-barchart')">
                            <button class="btn btn-primary btn-sm" @click="submit(searchAfsc,'dc-afsc-barchart')">Submit</button>
            </div -->
            <div id="cat" class="col-4">
                <div id="dc-cat-rowchart">
                    <h3>Category <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-cat-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
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
                    <form class="form-inline">
                        <!-- div class="form-group">
                            <input id="searchMajcom" v-model="searchMajcom" placeholder="Search MAJCOM" @keydown.enter="submit(searchMajcom,'dc-majcom-barchart')">
                            <button class="btn btn-primary btn-sm" @click="submit(searchMajcom,'dc-majcom-barchart')">Submit</button>
                        </div -->
                        <div class="col-3">
                            <autocomplete 
                                :suggestions="majAutoComplete"
                                placeholder="Search MAJCOM"
                                v-model="searchMajcom"
                                @input="submit($event,'dc-majcom-barchart')"
                                ref="majAC"
                                v-clickOutside="majOut">
        
                            </autocomplete>
                        </div>   
                    </form>
                    
                </div>
            </div>
        </div>
        <div class="row">
            <div id="base" class="col-12">
                <div id="dc-base-barchart">
                    <h3>MPF <span style="font-size: 14pt; opacity: 0.87;"> Stacked Inventory/Elidgible/Keep </span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="searchBase='';resetChart('dc-base-barchart')">Reset</button>
                    </h3>
                 <form class="form-inline">
                        <!-- div class="form-group">
                            <input id="searchBase" v-model="searchBase" placeholder="Search Installation" @keydown.enter="submit(searchBase,'dc-base-barchart')">
                            <button class="btn btn-primary btn-sm" @click="submit(searchBase,'dc-base-barchart')">Submit</button>
                        </div -->
                    
                    <div class="col-3">
                            <autocomplete 
                                :suggestions="mpfAutoComplete"
                                placeholder="Search BASE"
                                v-model="searchBase"
                                @input="submit($event,'dc-base-barchart')"
                                ref="mpfAC"
                                v-clickOutside="mpfOut">
                            </autocomplete>
                    </div> 
                </form>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	import dchelpers from '@/dchelpers'
	import axios from 'axios'
	import formats from '@/store/format'
	import AutoComplete from '../AutoComplete'

	export default {
        data() {
            return {
                data: [],
                selected:'KR',
                searchMajcom: "",
                searchBase: "",
                searchAfsc:"",
                majAutoComplete: [{key:''}],
                mpfAutoComplete: [{key:''}],
                afscAutoComplete: [{key:''}]
            }
        },
        components:{
        	'autocomplete': AutoComplete
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
                return "Re-Enlistment Rate (%)"
            }
            else {
                return "Keep Rate (%)"
            }
          },
        },
        methods: {
          afscOut(){
            this.$refs.afscAC.outside();
          },
          majOut(){
            this.$refs.majAC.outside();
          },
          mpfOut(){
            this.$refs.mpfAC.outside();
          },
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
          majcomSub(){
            this.submit(searchMajcom,'dc-majcom-barchart');
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
          chartAutoComplete:(text, id) =>{
            var outObj = []
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
                filterArray.forEach((d)=>{
                    outObj.push({
                        key:d
                    })
                })
            })
                            console.log('in Method ' + id)
                console.log(outObj)
                return outObj;
          }
        },
        components: {
            'autocomplete': AutoComplete
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            //axios request - can change to a get request and change to the "get" endpoint to see a get request
            
            //PROD AXIOS CALL:  
            /*
                var querystring = require('querystring');
                const formData = {
                    _PROGRAM:"/REN - Dashboard Home V1/makeHTML_collab",
                    nPage:"off"
                }
                var myData = axios.post('', querystring.stringify(formData)).then(response => {
            */
            
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_ret).then(response => {
                var axiosData = response.data.data
                var objData = makeObject(axiosData)
                objData.forEach((d)=>{
                    //Add 2000 to make year 4 digit
                    d.FY += 2000;
                })
                //console.log(objData)
                this.data = objData
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

                //reduce functions
                function retentionAdd(p,v) {
                    p.I = p.I + +v.INV
                    p.E = p.E + +v.ELIG
                    p.K = p.K + +v.KEEP
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.KR = p.K/p.I === Infinity ? 0 : Math.round((p.K/p.I)*1000)/10 || 0
                    p.RR = p.K/p.E === Infinity ? 0 : Math.round((p.K/p.E)*1000)/10 || 0
                    return p
                }
                function retentionRemove(p,v) {
                    p.I = p.I - +v.INV
                    p.E = p.E - +v.ELIG
                    p.K = p.K - +v.KEEP
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.KR = p.K/p.I === Infinity ? 0 : Math.round((p.K/p.I)*1000)/10 || 0
                    p.RR = p.K/p.E === Infinity ? 0 : Math.round((p.K/p.E)*1000)/10 || 0
                    return p
                }
                function retentionInitial() {
                    return {
                        I: 0,
                        E: 0,
                        K: 0,
                        RR: 0,
                        KR: 0,
                    }
                }
                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value[this.selected] != 0
                            })
                        }
                    }
                }

                //***Totals***
                var tots = this.ndx.groupAll().reduce(retentionAdd,retentionRemove,retentionInitial)
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
                    return d.FY;
                })
                yearConfig.group = yearConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                yearConfig.minHeight = 200 
                yearConfig.aspectRatio = 2
                yearConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                yearConfig.colors = d3.scale.category10()
                var yearChart = dchelpers.getRowChart(yearConfig)
                yearChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    //.ordering(function(d){
                    //  return formats.gradeOrder[d.key]
                    //})  

                //CAT
                var catConfig = {};
                catConfig.id = 'cat';
                catConfig.dim = this.ndx.dimension(function (d) {
                    return formats.catFormat[d.CAT];
                })
                catConfig.group = catConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                catConfig.minHeight = 200 
                catConfig.aspectRatio = 2
                catConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                catConfig.colors = d3.scale.category10()
                var catChart = dchelpers.getRowChart(catConfig)
                catChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    //.ordering(function(d){
                    //  return formats.gradeOrder[d.key]
                    //})                      

                //Majcom
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return formats.majFormat[d.MAJ]})
                var majcomInv = majcomConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                majcomConfig.group = removeEmptyBins(majcomInv)
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
                    .yAxis().tickFormat(function(v) {return v + "%";})
                
        

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return formats.mpfFormat[d.MPF]})
                var baseI = baseConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                baseConfig.group = removeEmptyBins(baseI)
                baseConfig.minHeight = 400
                baseConfig.aspectRatio = 5
                baseConfig.margins = {top: 10, left: 110, right: 30, bottom: 200}
                baseConfig.colors = ["#1976d2"]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)


                baseChart.stack(baseConfig.group, 'Inv',)
                baseChart
                    .elasticX(true)
                    
                    .group(baseConfig.group, "K",(d) => {
                        return d.value.K
                    })
                    .stack(baseConfig.group, "E",(d) => {
                        return d.value.E
                    })
                    .stack(baseConfig.group, "I",(d) => {
                        return d.value.I
                    })
                    .ordinalColors(["#1976d2","#ff4500","#228b22"])
                    .title(function(d) {
                        return d.key + '\n' + formats.enlRetFormat[this.layer] + ': ' + d.value[this.layer];
                    })
                    /*
                    .title( function(d){
                        return d.key + 
                               "\nInv: " + d.value.I + 
                               "\nElig: " + d.value.E + 
                               "\nKeep: " + d.value.K;
                    })
                    */
                    //.ordinalColors(["#1976d2","#ff4500",'darkgrey'])
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //AFSC
                var afscDim = this.ndx.dimension(function(d){return d.AFSC})
                var afscGrp = afscDim.group().reduceCount();
                var afscChart = dc.selectMenu('#dc-afsc-select');
                afscChart
                        .dimension(afscDim)
                        .group(afscGrp)
                        .numberVisible(10)
                        .controlsUseVisibility(true);

                //Resize
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }

                this.majAutoComplete= this.chartAutoComplete('', 'dc-majcom-barchart');
                
                this.mpfAutoComplete = this.chartAutoComplete('', 'dc-base-barchart');

                this.afscAutoComplete= this.chartAutoComplete('', 'dc-afsc-select');

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
        },
        destroyed() {
            console.log("destroyed")
        },
        directives: {
            clickOutside: {
              bind: function (el, binding, vnode) {
                el.event = function (event) {
                  // here I check that click was outside the el and his childrens
                  if (!(el == event.target || el.contains(event.target))) {
                    // and if it did, call method provided in attribute value
                    vnode.context[binding.expression](event);
                  }
                };
                document.body.addEventListener('click', el.event)
              },
              unbind: function (el) {
                document.body.removeEventListener('click', el.event)
              },
            }
        }
    }
</script>

<style src="../../../node_modules/dc/dc.css">
</style>
<style>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
.dc-select-menu{
    display:none;
}
</style>