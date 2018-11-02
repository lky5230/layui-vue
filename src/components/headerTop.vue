<template>
    <div class="top clearfix">
        <div class="top-wrap fl">
            <div class="item fl" @click="$store.commit('changeSidebarLeft')">
                <i class="menu-icon"></i>
            </div>
            <div class="item fl" @click="$store.commit('refreshMarkMut')" title="刷新">
                <i class="refresh-icon"></i>
            </div>
        </div>
        <div class="top-wrap fr">
            <div class="item tag-item fl" title="笔记" @click.stop.prevent="ixcTagShow">
                <i class="tag-icon"></i>
                <div class="tag-content" @click.stop v-show="tagShow">
                    <div class="tag-title">笔记 <i title="关闭" @click.stop="tagShow = false" class="tag-close"></i></div>
                    <textarea spellcheck="false" class="tag-textarea" :value="tagValue" @input="tagValueInput"></textarea>
                </div>
            </div>
            <div class="item user-list-wrap fl" style="position: relative;">
                {{'红了仨'}}&nbsp;&nbsp;<i class="fa fa-caret-down"></i>
                <div class="user-list">
                    <div class="user-list-item nowrap">基本资料</div>
                    <div class="user-list-divide"></div>
                    <div class="user-list-item nowrap">退出</div>
                </div>
            </div>
            <div class="item fl">
                <i class="fa fa-ellipsis-v"></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "headerTop",
    data(){
        return {
            tagShow: false,
            tagValue: '',
            userShow: false,

        }
    },
    created(){

    },
    methods: {
        ixcTagShow(){
            this.tagShow = !this.tagShow;
            this.tagValue = localStorage.getItem(process.env.VUE_APP_ID + '-tagvalue');
        },
        tagValueInput(e){
            let v = e.target.value;
            localStorage.setItem(process.env.VUE_APP_ID + '-tagvalue', v);
            this.tagValue = v;
        },
    },

}
</script>

<style lang="less" scoped>
.top{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #f6f6f6;
    background: #fff;
    .top-wrap{
        height: 100%;
    }
    .item{
        padding: 0 20px;
        color: #555;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        &:hover{
            cursor: pointer;
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
        .tag-content{
            z-index: 1001;
            width: 260px;
            height: 180px;
            box-shadow: 0px 4px 8px #afafaf;
            position: absolute;
            right: 0px;
            top: 42px;
            background: #fff;
            cursor: auto;
            .tag-title{
                height: 50px;
                line-height: 50px;
                background: #222;
                color: #fff;
                font-size: 14px;
                padding-left: 20px;
                padding-right: 20px;
                position: relative;
                .tag-close{
                    width: 16px;
                    height: 16px;
                    background: url(../assets/close-fff.png) no-repeat center center;
                    background-size: contain;
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .tag-textarea{
                width: 100%;
                height: 130px;
                border: none;
                resize:none;
                outline: none;
                padding: 16px;
                font-size: 16px;
            }
        }
        .user-list{
            display: none;
            position: absolute;
            z-index: 1002;
            box-shadow: 0px 4px 8px #afafaf;
            border: 1px solid #f2f2f2;
            top: 42px;
            right: 0px;
            width: 92px;
            padding-top: 6px;
            padding-bottom: 6px;
            background: #fff;
            .user-list-item{
                width: 100%;
                height: 36px;
                line-height: 36px;
                text-align: center;
                font-size: 14px;
                &:hover{
                    background: #f2f2f2;
                }
            }
            .user-list-divide{
                width: 100%;
                height: 1px;
                background: #f2f2f2;
                margin-top: 6px;
                margin-bottom: 6px;
                
            }
        }
        &.user-list-wrap:hover{
            .user-list{
                display: block;
            }
        }
        .menu-icon,
        .tag-icon,
        .refresh-icon{
            width: 16px;
            height: 16px;
            display: block;
        }
        
        .menu-icon{
            background: url(../assets/menu.png) no-repeat center center;
            background-size: contain;
        }
        .refresh-icon{
            background: url(../assets/refresh.png) no-repeat center center;
            background-size: contain;
        }
        .tag-icon{
            background: url(../assets/tag.png) no-repeat center center;
            background-size: contain;
        }
    }
}
</style>
