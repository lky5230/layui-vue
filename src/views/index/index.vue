<template>
    <div class="index">
        index
    </div>
</template>

<script>
import baseMixin from '@/mixins/base.js'
export default {
    name: 'index',
    mixins: [baseMixin],
    created(){
        
    },
    methods: {
        refresh(name){
            if(name == 'index'){
                console.log('index  refresh')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.index{
    height: 2222px;
}
</style>
