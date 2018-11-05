
export default {
    watch: {
      '$store.state.refreshMark'(newVal, oldVal){
        if(newVal != 0){
          let routeName = newVal.substr(+newVal.indexOf('@') + 1);
          this.refresh(routeName);
        }
      }
    },
    methods: {
      
    },
  }