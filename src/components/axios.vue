<template>
    <!--html here-->
</template>
<script>
import { store } from '@/store'
import { mapGetters } from 'vuex'

export default{
  data(){
    return {
      data: [],
    }
  },
  computed: {
    ndx(){
      return crossfilter(this.data)
    }
  },
  mounted: function(){
    //axios call
    window.axios.get('/endpoint').then(response => {
        this.data = response.data.data
        renderCharts()
    }).catch(console.error)

    //es6 arrow function
      var renderCharts = () => {

        // define charts here

        //draw charts
        dc.renderAll()
        dc.redrawAll()
      }
  },
  beforeDestroy: function(){
    // This clears all registered chart. Otherwise, it'll keep appending charts on top of empty DOM
    dc.chartRegistry.clear()
  },
}
</script>
<style>
</style> 
