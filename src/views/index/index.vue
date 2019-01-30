<template>
    <div class="index">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="活动名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间">
                <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            
            <el-form-item label="即时配送">
                <el-switch v-model="form.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="s数量">
                <el-input-number v-model="num1" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="条数">
                <el-slider v-model="value1"></el-slider>
            </el-form-item>
            <el-form-item label="平分">
                <el-rate v-model="value2"></el-rate>
            </el-form-item>
            
            <el-form-item label="活动性质">
                <el-checkbox-group v-model="form.type">
                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                <el-checkbox label="地推活动" name="type"></el-checkbox>
                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="特殊资源">
                <el-radio-group v-model="form.resource">
                <el-radio label="线上品牌商赞助"></el-radio>
                <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活动形式">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="xanma">
                <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    filter-placeholder="请输入城市拼音"
                    v-model="value3"
                    :data="data2">
                </el-transfer>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import baseMixin from '@/mixins/base.js'
export default {
    name: 'index',
    mixins: [baseMixin],
    data(){
        const generateData2 = _ => {
            const data = [];
            const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
            const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
            cities.forEach((city, index) => {
            data.push({
                label: city,
                key: index,
                pinyin: pinyin[index]
            });
            });
            return data;
        };
        return {
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            num1: 1,
            value1: 0,
            value2: 1,
            data2: generateData2(),
            value3: [],
            filterMethod(query, item) {
                return item.pinyin.indexOf(query) > -1;
            }


        }
    },
    created(){
        
    },
    methods: {
        refresh(routeName){
            if(routeName == 'index'){
                console.log('index  refresh')
            }
        },
        onSubmit() {
            this.$confirm('确认新建一个单子?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    message: '创建成功',
                    type: 'success'
                });
            }).catch(() => {});
        },
        handleChange(value) {
            console.log(value);
        }
    }
}
</script>

<style lang="less" scoped>
.index{
    
}
</style>
