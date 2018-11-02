
export default {
    watch: {
      '$store.state.refreshMark'(newVal, oldVal){
        if(newVal != 0){
          let name = newVal.substr(+newVal.indexOf('@') + 1);
          this.refresh(name);
        }
      }
    },
    methods: {
      
    },
  }