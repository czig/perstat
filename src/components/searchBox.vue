
<!--##########################################
<searchBox
    v-model:value="searchMajcom"
    label="Search MAJCOM"
    @sub="submit(searchMajcom,'dc-majcom-barchart')"
    color="red"
    button="true"
    buttonLabel="Feeling Lucky"
    btnColor="#5a95f5"
></searchBox>

TODO: Prevent typed text to overflow in the 'close-icon'
###########################################-->
<template>
	<form class="form-inline">
        <div class="form-group">
			<div style="position:relative">
		        <div class='searchTip' :style="getColor">
		            <span v-show="searchVar.length>0">
		                {{ label }}
		            </span>
		        </div>
		        <input type="text"  class="form-control" v-model="searchVar" :placeholder="label" @keydown.enter.stop.prevent="action"
		        @focus="focus = true" @blur="focus = false" :style="[getShadow,getBorderBottom]"
       			> 
		        <div v-show="searchVar.length>0" 
		             class='searchRemove'
		             @click="searchVar=''">
		            <i class="close-icon" @mouseenter="hover=true" @mouseleave="hover=false" :style="[getBackground, getIconShadow,]"></i>
		        </div>
		    </div>
		    <button v-if="bIf" class="btn btn-primary btn-sm" @click="action" :style="getBackgroundColor"> {{ bLabel }} </button>
    	</div>
    </form>
             
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
		button:{
			type: String,
			required: false
		},
		buttonLabel:{
			type: String,
			required: false
		},
		color:{
			type: String,
			required: false
		},
		btnColor:{
			type:String,
			required: false
		}
	},
	data(){
		return {
			searchVar: this.value,
			bLabel: this.buttonLabel ? this.buttonLabel : "Submit",
			bIf: this.button ? true : false,
			colorGiven: this.color ? this.color : "#4d8bf9",
			buttonColor: this.btnColor ? this.btnColor : this.color,
			hover: false,
			focus: false,
		}
	},
	computed:{
		getColor(){
			return {
				color: this.colorGiven
			}
		},
		getBackgroundColor(){
			return {
				'background-color': this.buttonColor + ' !important'
			}
		},
		getBackground(){
			return {
				background: '-webkit-linear-gradient(-45deg, transparent 0%, transparent 46%,' +  this.colorGiven + ' 46%,' +  this.colorGiven + ' 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%,' +  this.colorGiven + ' 46%,' + this.colorGiven + ' 56%,transparent 56%, transparent 100%)'
			}
		},
		getIconShadow(){
			if (this.hover)
				return {
					'box-shadow': '0px 0px 5px 3px ' + this.colorGiven,
				}
			else return {}
		},
		getShadow(){
			if (this.focus)
				return {
					'box-shadow': '0 1px 0 0 ' + this.colorGiven,
				}
			else return {}
		},
		getBorderBottom(){
			if (this.focus)
				return {
					'border-bottom': '2px solid ' + this.colorGiven,
				}
			else return {}
		}
	},
	watch: {
	    searchVar(val) {
	      	//Update Parent
	      	this.$emit('input', val);
	    },
	    value(val){
	    	//Update this from Parent
	    	this.searchVar = val;
	    },
	},
	methods:{
		action(){
			//tell Parent we want to submit input field
			this.$emit('sub');
		},
	},
}	

</script>

<style scoped>

.searchTip{
    position: absolute;
    top: -10px;
    left: 0;
    //color:blue;
    padding-left: 5px;
    font-size: 10px;
    font-weight:bold;
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
  //background: -webkit-linear-gradient(-45deg, transparent 0%, transparent 46%, blue 46%,  blue 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%, blue 46%,  blue 56%,transparent 56%, transparent 100%);
  background-color:transparent;
  //box-shadow:0px 0px 5px 2px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
}

.close-icon:hover{
    border-width:3px;
    //border-style: solid;
    //box-shadow:0px 0px 5px 2px blue;
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