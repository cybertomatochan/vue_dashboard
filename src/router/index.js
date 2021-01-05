//路由配置檔
import Vue from 'vue';
import VueRouter from 'vue-router';
//官方的元件


//自訂分頁元件
//import 自取名稱 from 路徑

import Dashboard from '@/components/Dashboard';
import Login from '@/components/pages/login';
import Products from '@/components/pages/Products';
import Order from '@/components/pages/order';
import Coupon from '@/components/pages/coupon';
import Custom from '@/components/pages/custom';
import CustomCheckout from '@/components/pages/customCheckout';
//啟用方式
Vue.use(VueRouter);

export default new VueRouter({
    // mode:'history',//不需要# 但使用後端的路由 如果要啟用的話 需配合後端
    routerLinkActive : 'active',//針對標籤替換 
    routes:[
        {            
        path: '/', // 對應的虛擬路徑
        name: 'Login', // 元件呈現的名稱
        component: Login, // 對應的元件
        },
        {
            path:'*',//為了防止未定的網址
            redirect:'/login',
        },
        {
            name: 'Login', // 元件呈現的名稱
            path: '/login', // 對應的虛擬路徑
            component: Login, // 對應的元件
        },
        {
            path: '/admin', // 對應的虛擬路徑
            name: 'Dashboard', // 元件呈現的名稱
            component: Dashboard, // 對應的元件
            children:[
                {
                name: 'Products',
                path: 'products', 
                component: Products,
                meta: { requiresAuth: true },
                } ,
                {
                    name: 'Order',
                    path: 'order', 
                    component: Order,
                    meta: { requiresAuth: true },
                } ,
                {
                    name: 'Coupon',
                    path: 'coupon', 
                    component: Coupon,
                    meta: { requiresAuth: true },
                } ,
                        //訂購
                {
                    name: 'Custom',
                    path: 'custom', 
                    component: Custom,
                    meta: { requiresAuth: true },
                    children:[
                        {
                            name: 'CustomCheckout',
                            path: 'custom_checkout/:orderId', 
                            component: CustomCheckout,
                            meta: { requiresAuth: true },
                        } ,
                        
                    ],
                },


            ],
        },
    ],
});
