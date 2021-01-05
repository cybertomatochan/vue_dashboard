<template>
    <div>
        <div>
            <loading :active.sync="isLoading"></loading>
        </div>

        <div class="text-center mt-4">
            <button class="btn btn-primary btn-lg" 
            @click="openCouponModal(true)">新增優惠券</button>
        </div> 

        <table class="table mt-4">
        <thead>
            <tr>
            <th>名稱</th>
            <th>折扣百分比</th>
            <th>到期日</th>
            <th>是否啟用</th>
            <th>編輯</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, key) in coupons" :key="key">
            <td>{{ item.title }}</td>
            <td>{{ item.percent }}%</td>
            <td>{{ item.due_date}}</td>
            <td>
                <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
                <span v-else class="text-muted">未起用</span>
            </td>
            <td>
                <button class="btn btn-outline-primary btn-sm"
                @click="openCouponModal(false,item)"
                >編輯</button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" 
                 @click="delObj(item.id)">刪除</button>
            </td>
            </tr>
        </tbody>
        </table>
        <!-- modal-->

        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="title">標題</label>
                            <input type="text" class="form-control" id="title" v-model="tempCoupon.title"
                                placeholder="請輸入標題">
                        </div>
                        <div class="form-group">
                            <label for="coupon_code">優惠碼</label>
                            <input type="text" class="form-control" id="coupon_code" v-model="tempCoupon.code"
                                placeholder="請輸入優惠碼">
                        </div>
                        <div class="form-group">
                            <label for="due_date">到期日</label>
                            <input type="date" class="form-control" id="due_date"
                                v-model="due_date">
                        </div>
                        <div class="form-group">
                            <label for="price">折扣百分比</label>
                            <input type="number" class="form-control" id="price"
                                v-model="tempCoupon.percent" placeholder="請輸入折扣百分比">
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox"
                                :true-value="1"
                                :false-value="0"
                                v-model="tempCoupon.is_enabled" id="is_enabled">
                                <label class="form-check-label" for="is_enabled">
                                是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary"
                        @click="updateCoupon()">更新優惠券</button>
                    </div>
                </div>
            </div>
        </div>




    </div>
</template>





<script>
import $ from 'jquery';
export default{
    data(){
        return{
            coupons: {},
            tempCoupon: {},
            isNew: false,
            due_date: new Date(),
            isLoading:false,
        };
    },
    watch: {
        due_date() {
            const vm = this;
            const timestamp = Math.floor(new Date(vm.due_date) / 1000);
            vm.tempCoupon.due_date = timestamp;
        },
    },

    methods: {
        getCoupons(page=1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading=true;
            this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading=false;
                vm.coupons = response.data.coupons;
            });
        },
        openCouponModal(isNew,item){
            const vm = this;
            $('#couponModal').modal('show'); 
            vm.isNew = isNew;
            if(vm.isNew){
                vm.tempCoupon = {};
            }else{
                vm.tempCoupon = Object.assign({},item);
                const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T');
                vm.due_date = dateAndTime[0];
            }
        },


        updateCoupon() {
            const vm = this;
            if (vm.isNew) {
                const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
                this.$http.post(url, { data: vm.tempCoupon }).then((response) => {
                console.log(response, vm.tempCoupon);
                $('#couponModal').modal('hide');
                this.getCoupons();
                });
            } else {
                const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                vm.due_date = new Date(vm.tempCoupon.due_date * 1000);
                this.$http.put(url, { data: vm.tempCoupon }).then((response) => {
                console.log(response);
                $('#couponModal').modal('hide');
                this.getCoupons();
                });
            }
        },

        delObj(id){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
            vm.isLoading=true;
            this.$http.delete(api).then((response) => {
                if(response.data.success){
                    vm.isLoading=false;
                    console.log(response.data);
                    vm.getCoupons();
                }else{
                    vm.isLoading=false;
                    console.log(response.data);
                }
            });
        },
    },
    created() {
        this.getCoupons();
    },
}
</script>