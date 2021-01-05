<template>
  <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
            <div class="card border-0 shadow-sm">
                <div style="height: 150px; background-size: cover; background-position: center"
                    :style="{backgroundImage:`url(${item.imageUrl})`}">
                </div>
                <div class="card-body">
                <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                <h5 class="card-title">
                    <a href="#" class="text-dark">{{item.title}}</a>
                </h5>
                <p class="card-text">{{item.content}}</p>
                <div class="d-flex justify-content-between align-items-baseline">
                    <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
                    <del class="h6" v-if="item.price">原價{{item.origin_price}}</del>
                    <div class="h5" v-if="item.price">特價{{item.price}}</div>
                </div>
                </div>
                <div class="card-footer d-flex">
                <button type="button" class="btn btn-outline-secondary btn-sm"
                @click="getProduct(item.id)">
                    <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                    查看更多
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm ml-auto"
                @click="addtoCart(item.id)">
                    <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                    加到購物車
                </button>
                </div>
            </div>
            </div>
        </div>
      

      <!-- CartList-->
      <div v-if="cartLength != 0" class="container">
        <table class="table mt-5 "  >
            <thead>
                <th width="80"></th>
                <th>產品名稱</th>
                <th width="80">數量</th>
                <th width="120">單價</th>
            </thead>
            <tbody>
                <tr v-for="item in cart.carts" :key='item.id'>
                    <td>
                        <button class="btn btn-outline-danger btn-sm" 
                        @click="removeCartItem(item.id)"><i class="fas fa-trash-alt"></i></button>
                    </td>
                    <td>
                      {{item.product.title}}
                      <div class="text-success" v-if="item.coupon">
                        已套用優惠碼
                      </div>
                    </td>
                    <td>{{item.qty}}</td>
                    <td class="text-right">{{item.final_total | currency}}</td>
                </tr>
                
            </tbody>
            <tfoot>
                <tr>
                  <td colspan="3" class="text-right">總計</td>
                  <td class="text-right">{{cart.total | currency}}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                  <td colspan="3" class="text-right text-success">折扣價</td>
                  <td class="text-right text-success">{{cart.final_total | currency}}</td>
                </tr>
            </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="addCouponCode">
              套用優惠碼  
            </button>
          </div>
        </div>
        <!-- 訂單表單 -->
        <div class="my-5 row justify-content-center">
          <ValidationObserver  class="col-md-6"  @submit.prevent="createOrder" 
              v-slot="{ invalid }" tag="form">
            <ValidationProvider name="Email"  class="form-group"
              rules="required|email"  v-slot="{ failed, errors }" tag="div">
              <label for="useremail">Email</label>
              <input type="email"  class="form-control" name="email" id="useremail"
                v-model="form.user.email" :class="{ 'is-invalid': failed }" placeholder="請輸入 Email" required>
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          
            <ValidationProvider name='姓名' class="form-group" rules="required" 
              v-slot="{ failed, errors }" tag="div">
              <label for="username">收件人姓名</label>
              <input type="text" class="form-control" name="name" id="username"
                v-model="form.user.name" :class="{ 'is-invalid': failed }"  placeholder="輸入姓名">
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          
            <ValidationProvider name="電話" class="form-group" rules="required" 
              v-slot="{ failed, errors }" tag="div"> 
              <label for="usertel">收件人電話</label>
              <input type="tel" :class="{ 'is-invalid': failed }" class="form-control" id="usertel" 
              v-model="form.user.tel"  placeholder="請輸入電話">
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          
            <ValidationProvider name="地址" class="form-group" rules="required" 
              v-slot="{ failed, errors }" tag="div">
              <label for="useraddress">收件人地址</label>
              <input type="text" class="form-control" name="address" id="useraddress" 
              v-model="form.user.address" :class="{ 'is-invalid': failed }"  placeholder="請輸入地址">
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          
            <div class="form-group">
              <label for="comment">留言</label>
              <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
            </div>
            <div class="text-right">
              <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
            </div>
              
          </ValidationObserver>
        </div>
       

      </div>

    <!-- modal-->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">

      <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            
            <div class="modal-body">
                <img :src="product.imageUrl" class="img-fluid" alt="">
                <blockquote class="blockquote mt-3">
                  <p class="mb-0">{{ product.content }}</p>
                  <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                </blockquote>
                <div class="d-flex justify-content-between align-items-baseline">
                  <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                  <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                  <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
                </div>
                <select name="" class="form-control mt-3" v-model="product.num">
                  <option :value="num" v-for="num in 10" :key="num">
                    選購 {{num}} {{product.unit}}
                  </option>
                </select>
            </div>

            <div class="modal-footer">
                <div class="text-muted text-nowrap mr-3">
                  小計 <strong>{{ product.num * product.price }}</strong> 元
                </div>
                <button type="button" class="btn btn-primary"
                  @click="addtoCart(product.id,product.num)">
                  
                  加到購物車
                </button>
            </div>
          </div>
        </div>
      </div>

     

    
    </div>

  </div>
</template>





<script>
import $ from 'jquery';

export default {
  data() {
    return {
      products: [],
      product: {},
      cart:[],
      cartLength:'',
      coupon_code:'',
      status:{
        loadingItem:"",
      },
      form:{
        "user": {
          "name": "",
          "email": "",
          "tel": "",
          "address": ""
        },
        "message": ""
      },
      isLoading: false,
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;
        console.log(response);
        vm.isLoading = false;
      });
    },
    getProduct(id){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then((response) => {
        vm.product=response.data.product;
        $('#productModal').modal('show');
        console.log(response);
        vm.status.loadingItem = "";
      });
    },
    addtoCart(id,qty =1){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.status.loadingItem = id;
      const cart = {
        product_id:id,
        qty,
      };
      this.$http.post(url,{ data : cart }).then((response) => {
        console.log(response);
        vm.status.loadingItem = "";
        vm.getCart();
        $('#productModal').modal('hide');
      });
    },
    getCart(){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        console.log(response.data);
        vm.cart = response.data.data;
        vm.cartLength=response.data.data.carts.length; 
        vm.isLoading = false;
      });
    },
    removeCartItem(id){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then((response) => {
        console.log(response.data);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    addCouponCode(){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon ={
        code:vm.coupon_code,     
      };
      vm.isLoading = true;
      this.$http.post(url, {data:coupon}).then((response) => {
        console.log(response);
        vm.getCart();
        vm.isLoading = false;
      });
    },
    createOrder(){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      const order = vm.form;
      vm.isLoading = true;
      this.$http.post(url, {data:order}).then((response) => {
        console.log('訂單已建立',response);
        if(response.data.success) {
          vm.$router.push(`/admin/custom/custom_checkout/${response.data.orderId}`)
        }
        vm.isLoading = false;
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
  },
};
</script>