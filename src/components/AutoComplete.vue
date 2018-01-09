<template >
    <div style="position: relative" :class="{'md-form':true,'open':openSuggestion}">
        <input  type="text" class="form-control" :value="value" 
                @input="updateValue($event.target.value)" 
                @keydown.enter = 'enter'
                @keydown.down = 'down'
                @keydown.up = 'up'
                :placeholder="placeholder">
        <div    class="dropdown-menu" v-if="drop">
            <li >
                <a href="#" v-for="(suggestion, index) in matches"
                :class="{'dropdown-item':true,'active': isActive(index)}"
                @click.stop.prevent="suggestionClick(index)"> {{ suggestion.key }}</a>
            </li>
        </div>
    </div> 
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: true
        },
        suggestions: {
            type: Array,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            open: false,
            current: 0,
            drop:false,
            focus:false
        }
    },
    watch:{
        numOfMatches(val){
            if (this.value == '' && val == this.suggestions.length)
                this.drop= false;
            else{
                if (val > 1)
                   this.drop= true;
                else this.drop= false;
            }   
            //this.drop=true;
        }    
    },
    computed: {
        numOfMatches: function(){
            return this.matches.length;
        },
        notDrop(){
            if (this.matches.length > 1 && this.matches.length < this.suggestions.length)
                return true;
            //else if(this.matches.length == 1 && this.value != this.matches[0])
                //return true;
            else return false;   
        },
        matches() {
            return this.suggestions.filter((obj) => {
                return obj.key.indexOf(this.value.toUpperCase()) >= 0
            })
        },
        openSuggestion() {
            //console.log(this.matches)
            return this.matches.length !== 0    
        }
    },
    methods: {
        outside(){
            if (!(this.focuss)){
                this.drop= false;
                this.open=false;
            }
        },
        updateValue(value) {
            if (this.open === false) {
                this.open = true
                this.current = 0
            }
            this.$emit('input',value)
        },
        enter() {
            this.$emit('input',this.matches[this.current].key)
            this.open = false;
            this.drop= false;
        },
        up () {
            this.drop=true;
            if (this.current > 0) {
                this.current--
            }
        },
        down() {
            this.drop=true;
            if (this.current < this.matches.length - 1) {
                this.current++
            }
        },
        isActive(index) {
            return index === this.current
        },
        suggestionClick(index) {
            console.log(index)
            this.focus=true;
            this.$emit('input', this.matches[index].key)
            this.open = false;
            this.drop= false;
        }
    },
}
    
</script>

<style scoped>
    .dropdown-menu{
        display:block;
        height:100px;
        overflow: auto;
        margin-top: -10px;
    }

</style>
