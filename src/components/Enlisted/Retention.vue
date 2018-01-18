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
                <input checked="checked" name="group4" type="radio" id="radio4" value="RR" v-model="selected" @click="radioButton">
                <label for="radio4">Re-enlistment Rate</label>
                 <input name="group5" type="radio" id="radio5" value="KR" v-model="selected" @click="radioButton">
                <label for="radio4">Keep Rate</label>
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
                <div id="cat" class="col-12">
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
            <div id="afsc-inputs" class="col-3">
                <div id="dc-afsc-select">
                    <h3>AFSC <span style="font-size: 14pt; opacity: 0.87;">  {{ylabel}}  </span>
                    </h3>
                    <form class="form-inline">
                         <div class="form-group">
                            <input id="searchAfsc" v-model="searchAfsc" placeholder="Search AFSC" @keydown.enter.stop.prevent="updateAfsc(searchAfsc, searchAfsc.length)">

                            <button class="btn btn-primary btn-sm" @click="updateAfsc(searchAfsc, searchAfsc.length)">Submit</button>
                            <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            @click="resetAfsc">Reset</button>
                         </div>
                         <div v-if="searchAfsc.length > 1"> 
                            <div> Go back to: </div>
                            <div>
                                <button v-for="(suggest, index) in afscTools.Sub" class="btn btn-primary btn-sm"
                                @click="updateAfsc(suggest, index)"> {{ suggest }}  </button>
                            </div>
                         </div>
                    </form>
                </div>
            </div>
            <div id="afsc" class="col-5">
                <div id="dc-afsc-rowchart">
                    <h3> <span style="font-size: 14pt; opacity: 0.87;"></span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-afsc-rowchart')">Reset</button>
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
                         <div class="form-group">
                            <input id="searchMajcom" v-model="searchMajcom" placeholder="Search MAJCOM" @keydown.enter="submit(searchMajcom,'dc-majcom-barchart')">
                            <button class="btn btn-primary btn-sm" @click="submit(searchMajcom,'dc-majcom-barchart')">Submit</button>
                         </div>
                    </form>
                    
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
                 <form class="form-inline">
                         <div class="form-group">
                            <input id="searchBase" v-model="searchBase" placeholder="Search Installation" @keydown.enter="submit(searchBase,'dc-base-barchart')">
                            <button class="btn btn-primary btn-sm" @click="submit(searchBase,'dc-base-barchart')">Submit</button>
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
                selected:'RR',
                searchMajcom: "",
                searchBase: "",
                searchAfsc:"",
                afscTools:{
                    Group: [],
                    Dim: [],
                    Sub: [],
                    Freeze: false
                },
            }
        },
        components:{
        	'autocomplete': AutoComplete
        },
        watch: {
            searchAfsc: function(val){
                var len = val.length;
                var arr = [];
                for (var i=1; i<len; i++){
                    arr.push(   val.substring( 0, i) + ''+ 
                                Array(6-i).join("X")
                            )
                }
                this.afscTools.Sub= arr;
            }
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
                return "Re-Enlist Rate (%)"
            }
            else {
                return "Keep Rate (%)"
            }
          },
        },
        methods: {
          addDigit(val){
             console.log('in ADD DIGIt')
            this.searchAfsc += '' + val;
            //console.log(this.searchAfsc)
            this.chooseAfscGroup();
          },
          updateAfsc(suggest, index){
            //Reset AFSC
            this.resetAfsc();
            //set searchAfsc
            this.searchAfsc = suggest.substring(0,index+1);
            //Update Charts
            this.chooseAfscGroup();
          },
          resetAfsc(){
            this.searchAfsc = '';
            this.afscTools.Freeze = false;
            //resetChart('dc-afsc-rowchart')
            this.afscChangeGroup(0);
            //this.resetChart('dc-afsc-select')
            this.resetChart('dc-afsc-select')
            this.resetChart('dc-afsc-rowchart')
          },
          chooseAfscGroup(){
            var len = this.searchAfsc.length;
            
            this.submitStart(this.searchAfsc, 'dc-afsc-select');
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc-select' 
            }).forEach(chart=>{
                var results = chart.group().all().length;
                if ((!this.afscTools.Freeze) && results < 11){
                    this.afscChangeGroup(6)
                    this.afscTools.Freeze = true;
                } else if (results >=11){
                    this.afscChangeGroup(len)
                    this.afscTools.Freeze = false;
                }
            })
          },
          afscChangeGroup(val){

            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc-rowchart' 
            }).forEach(chart=>{
                chart.filterAll()
                chart.dimension(this.afscTools.Dim[val]).group(this.afscTools.Group[val])
                //this.resetChart('dc-afsc-rowchart')
                dc.redrawAll()
            })
          },
          createAfscTools(){
            var xes = '';
            for (var i = 0;i<6;i++){
                xes = Array(5-i).join("X")
                this.afscTools.Dim[i] = this.ndx.dimension(function (d) {
                        return d.AFSC.substring(0,i+1) + xes;
                });

                this.afscTools.Group[i] = this.removeEmptyBins(this.afscTools.Dim[i].group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial));
            }
            this.afscTools.Dim[6] = this.ndx.dimension(function (d) {
                        return d.AFSC;
                }
            );

            this.afscTools.Group[6] = this.removeEmptyBins(this.afscTools.Dim[6].group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial));
          },
          resetAll(){
            dc.filterAll();
            //dc.redrawAll();
            this.afscTools.Freeze = false;

            //resetAfsc Calls dc.redrawAll()
            this.resetAfsc()
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
          submitStart: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id 
            }).forEach(chart=>{
                var mainArray = []
                chart.dimension().group().all().forEach((d) => {
                    mainArray.push(String(d.key))
                })
                var filterArray = mainArray.filter((d) => {
                    var element = d.toUpperCase() 
                    return element.startsWith(text.toUpperCase())
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
            
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_ret).then(response => {
                var axiosData = response.data.data
                var objData = makeObject(axiosData)
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
                    return "20" + d.FY;
                })
                yearConfig.group = yearConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                yearConfig.minHeight = 100 
                yearConfig.aspectRatio = 3
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
                catConfig.group = catConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                catConfig.minHeight = 100 
                catConfig.aspectRatio = 2
                catConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
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
                
        

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return formats.mpfFormat[d.MPF]})
                var baseGroup = baseConfig.dim.group().reduce(retentionAdd,retentionRemove,retentionInitial)
                baseConfig.group = removeEmptyBins(baseGroup)
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


                // **** AFSC ****

                //AFSC select -- this dc chart is invisibile used only to filter things from afsc graph
                var afscDim = this.ndx.dimension(function(d){return d.AFSC})
                var afscGrp = this.removeEmptyBins(afscDim.group().reduce(retentionAdd,retentionRemove,retentionInitial));
                var afscChart = dc.selectMenu('#dc-afsc-select');
                afscChart
                        .dimension(afscDim)
                        .group(afscGrp)       
                        .numberVisible(10)
                        .controlsUseVisibility(true);

                //AFSC Graph
                //Groups and Dim are Created by Vue for CONROL
                this.createAfscTools();

                var afscConfig = {};
                afscConfig.id = 'afsc';
                afscConfig.dim = this.afscTools.Dim[0];
                afscConfig.group = this.afscTools.Group[0];
                afscConfig.minHeight = 200 
                afscConfig.aspectRatio = 1.25;
                afscConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                afscConfig.colors = d3.scale.category10()
                var afscGraph = dchelpers.getRowChart(afscConfig)
                afscGraph
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    //.fixedBarHeight(38)

                //On Filter change Dim/Group from Vue Method
                afscGraph.on('filtered', (chart,filter)=> {
                    if (filter && (!this.afscTools.Freeze)){
                        var len = this.searchAfsc.length;
                        this.addDigit(filter.substring(len,len+1))
                    }
                });
                //Resize
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
        },
        destroyed() {
            console.log("destroyed")
        },
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
