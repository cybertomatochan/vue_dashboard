<template>
    <div>
    <loading :active.sync="isLoading"></loading>
       <table class="table mt-4">
            <thead>
            <tr>
                <th width=150>購買時間</th>
                <th width=200>Email</th>
                <th>購買款項</th>
                <th width=120>應付金額</th>
                <th width=100>是否付款</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="(item,key) in orders" :key='item.id'>
                    <td>{{item.paid_date}}</td>
                    <td>{{item.user.email}}</td>
                    <td>
                        <ul class="list-unstyled">
                        <li v-for="(product, i) in item.products" :key="i">
                            {{ product.product.title }} 數量：{{ product.qty }}
                            {{ product.product.unit }}
                        </li>
                        </ul>
                    </td>
                    <td class="text-right">{{item.total | currency}}</td>
                    <td v-if="item.is_paid==1" >
                        <span class="text-success">已付款</span>
                    </td>
                    <td v-else class="text-danger">未付款</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import $ from 'jquery';
export default{
    data(){
        return{
            orders:[],
            isLoading:false,
        };
    },

    methods: {
        getOrders(page=1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading=true;
            this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading=false;
                vm.orders = response.data.orders;
            });
        },
    },
    created() {
        this.getOrders();
    },
}
</script>