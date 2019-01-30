
export default {
    watch: {
      '$store.state.refreshMark'(newVal, oldVal){
        if(newVal != 0){
          let routeName = newVal.substr(+newVal.indexOf('@') + 1);
          if(this.refresh){
            this.refresh(routeName);
          }else{
            console.warn('请添加 refresh 函数')
          }
        }
      }
    },
    methods: {
      
    },
  }