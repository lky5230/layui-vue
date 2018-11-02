<template>
    <div class="pagetab">
        <div class="pagetab-left" @click="tabToRight">
            <i class="fa fa-angle-double-left"></i>
        </div>
        <div class="pagetab-home" :class="{'router-active': $route.path == '/'}" @click.stop="$router.push('/')">
            <i class="fa fa-home"></i>
        </div>
        <div class="pagetab-main">
            <div 
                class="pagetab-wrap" 
                ref="pagetab"
                :style="{transform: 'translateX('+tabTranslateX+'px)'}">
                    <div 
                        class="tab-item nowrap"
                        :class="{'router-active': $route.path == pagetab.url}"
                        @click.stop="$router.push(pagetab.url)"
                        :style="{left: pagetabIndex * 120 + 'px'}"
                        v-for="(pagetab, pagetabIndex)  in $store.state.pagetab" 
                        :key="pagetab.id">
                        <span :title="pagetab.title">{{pagetab.title}}</span>
                        <i class="tab-close" title="关闭该标签页" @click.stop="$store.commit('pagetabAction', {action: 'delete', data: pagetab});"></i>
                    </div>
            </div>
        </div>
        <div class="pagetab-right" @click="tabToLeft">
            <i class="fa fa-angle-double-right"></i>
        </div>

    </div>
</template>
<script>
export default {
    name: 'pagetab',
    data(){
        return {
            tabTranslateX: 0,

        }
    },
    watch: {
        '$store.state.tabToPos'(newVal){
            let pagetab = this.$store.state.pagetab;
            let tabItemWidth = 120;
            let tabFullWidth = pagetab.length * tabItemWidth;
            let tabPageWidth = this.$refs.pagetab.getBoundingClientRect().width;
            let currentTabTranslateX = this.tabTranslateX;
            if(tabFullWidth <= tabPageWidth) return ;
            if(newVal != ''){
                //增加标签页时，移到最右侧
                if(newVal.indexOf('insert') > -1){
                    this.tabTranslateX = -(tabFullWidth - tabPageWidth);
                }
                //切换标签页时，滑到合适位置
                if(newVal.indexOf('change') > -1){
                    let id = newVal.split('@')[1];
                    let posIndex = '';
                    for(let i=0; i<pagetab.length; i++){
                        if(pagetab[i].id == id){
                            posIndex = i;
                            break ;
                        }
                    }
                    //视口右侧
                    let dis = tabItemWidth * (+posIndex + 1) - (tabPageWidth + Math.abs(currentTabTranslateX));
                    if(dis > 0) this.tabTranslateX = currentTabTranslateX - dis;
                    //视口左侧
                    let dis2 = tabItemWidth * posIndex - Math.abs(currentTabTranslateX);
                    if(dis2 < 0) this.tabTranslateX = -tabItemWidth * posIndex;

                }
            };
        },
    },
    created(){
        
    },
    mounted(){
        this.$nextTick(()=>{
            
        });
    },
    methods: {
        //点击向左
        tabToLeft(e){
            e.preventDefault();
            let tabItemWidth = 120;
            let tabFullWidth = this.$store.state.pagetab.length * tabItemWidth;
            let tabPageWidth = this.$refs.pagetab.getBoundingClientRect().width;
            if(tabFullWidth <= tabPageWidth) return ;
            let canTransX = tabFullWidth - tabPageWidth;
            if(Math.abs(this.tabTranslateX) + tabItemWidth < canTransX){
                this.tabTranslateX -= tabItemWidth;
            }else{
                this.tabTranslateX = -canTransX;
            }
        },
        //点击向右
        tabToRight(e){
            e.preventDefault();
            let tabItemWidth = 120;
            let ol = this.tabTranslateX;
            if(+ol + tabItemWidth > 0){
                this.tabTranslateX = 0;
            }else{
                this.tabTranslateX += tabItemWidth;
            }
        },


    }

}
</script>

<style lang="less">
.pagetab{
    width: 100%;
    height: 40px;
    background: #fff;
    box-shadow: 0px 2px 4px #dfdfdf;
    display: flex;
    align-items: center;
    .pagetab-left,
    .pagetab-home,
    .pagetab-right {
        flex: none;
        width: 40px;
        height: 40px;
        border-right: 1px solid #f6f6f6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        &:hover,
        &.router-active{
            background: #f6f6f6;
        }
    }
    .pagetab-right{
        border-left: 1px solid #f6f6f6;
    }
    .pagetab-main{
        flex: auto;
        width: auto;
        height: 40px;
        overflow: hidden;
        border-right: 1px solid #f6f6f6;
        position: relative;
        .pagetab-wrap{
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform .3s;
            .tab-item{
                width: 120px;
                position: absolute;
                top: 0px;
                padding-left: 15px;
                padding-right: 26px;
                height: 40px;
                border-right: none;
                line-height: 40px;
                font-size: 14px;
                color: #666;
                border-right: 1px solid #f6f6f6;
                .tab-close{
                    position: absolute;
                    font-size: 12px;
                    right: 7px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: url(../assets/close.png) no-repeat center center;
                    background-size: contain;
                    &:hover{
                        background: url(../assets/close-active.png) no-repeat center center;
                        background-size: contain;
                    }
                }
                &.router-active{
                    background: #f6f6f6;
                    &:before{
                        width: calc(100% - 2px);
                    }
                }
                &:hover{
                    cursor: pointer;
                    background: #f6f6f6;
                    &:before{
                        width: calc(100% - 2px);
                    }
                }
                &:before{
                    position: absolute;
                    left: 1px;
                    top: 0px;
                    content: ' ';
                    height: 2px;
                    width: 0px;
                    transition: width .3s;
                    background: #333;
                }
            }
        }
    }
    .pagetab-home{
        position: relative;
        &.router-active{
            background: #f6f6f6;
            &:before{
                width: calc(100% - 2px);
            }
        }
        &:hover{
            cursor: pointer;background: #f6f6f6;
            &:before{
                width: calc(100% - 2px);
            }
        }
        &:before{
            position: absolute;
            left: 1px;
            top: 0px;
            content: ' ';
            height: 2px;
            width: 0px;
            transition: width .3s;
            background: #333;
        }
    }
}
</style>

