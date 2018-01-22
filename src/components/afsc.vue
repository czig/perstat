<template>
<div>

<div id="dc-afsc-select2">
    <h3>
        AFSC 
        <span v-if="afscTools.Current>1">[ {{afscFilter}} ] </span>
        <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
        <button type="button" 
            class="btn btn-danger btn-sm btn-rounded reset" 
            style="visibility: hidden"
            @click="resetAfsc">Reset</button>
    </h3>
    <div id="afsc2" class="col-12">
	    <div id="dc-afsc2-rowchart">
	    </div>
	</div>
</div>


</div>
<!-- 
<div>END OF TEMPLATE</div>
<div>END OF TEMPLATE</div>
<div>END OF TEMPLATE</div>
<div>END OF TEMPLATE</div> 
-->
</template>

<script>

import dchelpers from '@/dchelpers'
import formats from '@/store/format'

export default {
	props:{
		ndx:{
			type: Object,
            required: true
		},
		ylabel:{
			type: String,
            required: true
		}
	},
	data(){
		return {
			searchAfsc: '',
			afscTools:{
		        Group: [],
		        Dim: [],
		        Sub: [],
		        Freeze: false,
		        Current: 1,
		        currOrd: '1st',
		    }
		}
	},
	computed:{
		afscFilter: function(){
	    	var word = this.searchAfsc.substring(0,this.afscTools.Current);
	        return word;
	    }
	},
	methods:{
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
	        this.resetChart('dc-afsc-select2')
	        this.resetChart('dc-afsc2-rowchart')
	    },
	    chooseAfscGroup(){
            var len = this.searchAfsc.length;
            
            this.submitStart(this.searchAfsc, 'dc-afsc-select2');
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc-select2' 
            }).forEach(chart=>{
                var results = chart.group().all().length;
                if ((!this.afscTools.Freeze) && results < 15){
                    this.afscChangeGroup(6)
                    this.afscTools.Freeze = true;
                } else if (results >=15){
                    this.afscChangeGroup(len)
                    this.afscTools.Freeze = false;
                }
            })
        },
        afscChangeGroup(val){
            this.afscTools.currOrd = formats.ordinalNum[val+1];
            this.afscTools.Current = val+1;
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc2-rowchart' 
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
        resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName().indexOf(id) !== -1
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
	mounted(){
		console.log('AFSC MOUNTED');
		var afscDim = this.ndx.dimension(function(d){return d.AFSC})
        var afscGrp = this.removeEmptyBins(afscDim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial));
        var afscChart = dc.selectMenu('#dc-afsc-select2');
        afscChart
                .dimension(afscDim)
                .group(afscGrp)       
                .numberVisible(10)
                .controlsUseVisibility(true);

        //AFSC Graph
        //Groups and Dim are Created by Vue for CONROL
        this.createAfscTools();

        var afscConfig = {};
        afscConfig.id = 'afsc2';
        afscConfig.dim = this.afscTools.Dim[0];
        afscConfig.group = this.afscTools.Group[0];
        afscConfig.minHeight = 200 
        afscConfig.aspectRatio = 2.15;
        afscConfig.margins = {top: 0, left: 20, right: 30, bottom: 20}
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
	}
}

</script>

<style scoped>
	
</style>