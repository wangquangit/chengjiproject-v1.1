<template>
    <avue-crud :data="data" :option="option">
    </avue-crud>
</template>

<script>
    import { mapState } from 'vuex';
    export default{
        data() {
            return {
                data: [
                    {
                        name: '小明',
                        sex: '男',
                        age: 12,
                        class: 1,
                        score: 98,
                    },
                    {
                        name: '小明',
                        sex: '男',
                        age: 12,
                        class: 1,
                        score: 98,
                    },
                    {
                        name: '小明',
                        sex: '男',
                        age: 12,
                        class: 1,
                        score: 98,
                    },
                    {
                        name: '小明',
                        sex: '男',
                        age: 12,
                        class: 1,
                        score: 98,
                    },
                ],
                option: {
                    page: true,
                    align:'center',
                    menuAlign:'center',
                    addBtn: false,
                    menuBtn: true,
                    menuWidth: this.$store.state.menuWidth,
                    selection: true,
                    column: [
                        {
                            sortable: true,
                            label: '姓名',
                            prop: 'name',
                            search: true,
                        },
                        {
                            sortable: true,
                            label: '年龄',
                            prop: 'age',
                        },
                        {
                            sortable: true,
                            label: '性别',
                            prop: 'sex',
                            type: 'select',
                            search: true,
                            dicData: [
                                {
                                    label: '男',
                                    value: 0
                                },
                                {
                                    label: '女',
                                    value: 1
                                },
                            ]
                        },
                        {
                            sortable: true,
                            label: '班级',
                            prop: 'class',
                            type: 'select',
                            search: true,
                            dicData: [
                                {
                                    label: '一年级',
                                    value: 1
                                },
                                {
                                    label: '二年级',
                                    value: 2
                                },
                                {
                                    label: '三年级',
                                    value: 3
                                },
                                {
                                    label: '四年级',
                                    value: 4
                                },
                                {
                                    label: '五年级',
                                    value: 5
                                },
                                {
                                    label: '六年级',
                                    value: 6
                                },
                            ]
                        }
                    ]
                }
            }
        },
        computed: {
            ...mapState(['jsondata'])
        }
    }
</script>

<style scoped>

</style>
