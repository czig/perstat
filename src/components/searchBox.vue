<template>
	<div style="position:relative">
        <div class='searchTip'>
            <span v-show="searchVar.length>0">
                {{ label }}
            </span>
        </div>
        <input type="text"  class="form-control" :id="searchVar" v-model="searchVar" :placeholder="label" > 
        <div v-show="searchVar.length>0" 
             class='searchRemove'
             @click="searchVar=''">
            <i class="close-icon"></i>
        </div>
    </div>
</template>

<script>

export default {
	props:{
		value: {
			type: String,
            required: true
		},
		label:{
			type: String,
            required: true
		},
	},
	data(){
		return {
			searchVar:this.value
		}
	},
	watch: {
	    searchVar(val) {
	      this.$emit('input', val);
	    },
	    value(val){
	    	this.searchVar = val;
	    }
	},
	methods:{
		action(){
			this.$emit('sub', true);
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
	}
}	

</script>

<style scoped>

.searchTip{
    position: absolute;
    top: -10px;
    left: 0;
    color:blue;
    padding-left: 5px;
    font-size: 10px;
    height: 10px;
}

.close-icon
{
  display:block;
  box-sizing:border-box;
  width:18px;
  height:18px;
  //border-width:3px;
  //border-style: solid;
  border-color:transparent;
  border-radius:100%;
  background: -webkit-linear-gradient(-45deg, transparent 0%, transparent 46%, blue 46%,  blue 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, blue 46%,  blue 56%,transparent 56%, transparent 100%);
  background-color:transparent;
  //box-shadow:0px 0px 5px 2px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
}

.close-icon:hover{
    border-width:3px;
    //border-style: solid;
    box-shadow:0px 0px 5px 2px rgba(0,0,255,0.5);
    background-color:white;
}

.searchRemove{
    position: absolute;
    top: 10px;
    right: 0px;
    color: black;
    padding-left: 5px;
    //font-size: 10px;
    height: 30px;
    width: 30px;
    cursor:pointer;
}

input[type="text"].form-control{
    color:black;
    padding:5px;
    border-radius: 5px;
    position: relative;
    top: 15px;
    transform: translateY(-50%);
    margin-bottom: 0px;
    box-sizing: border-box;
    background-color:rgba(222, 224, 226, 0.4);
}

</style>