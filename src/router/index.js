import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Backstage/Login'
import Dashboard from '@/components/Backstage/Dashboard'
import ProductsList from '@/components/Backstage/productsList'
import OrdersList from '@/components/Backstage/ordersList'
import CouponsList from '@/components/Backstage/couponsList'
import User from '@/view/User'
import Products from '@/components/User/Products'
import UserHome from '@/components/User/UserHome'
import Product from '@/components/User/Product'
import Coupons from '@/components/User/Coupons'
import Order from '@/components/User/Order'
import CheckOut from '@/components/User/CheckOut'
import Introduce from '@/components/User/Introduce'
import Favorite from '@/components/User/Favorite'


//防止重複路由的情況
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

export default new VueRouter({
    linkActiveClass: 'active',
    routes: [
        {
            path: '*',
            redirect: '/',
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        },
        {
            path: '/',
            component: User,
            children:[
                {
                    path: '/',
                    name: 'UserHome',
                    component: UserHome,
                },
                {
                    path: 'introduce',
                    name: 'Introduce',
                    component: Introduce,
                },
                {
                    path: 'products',
                    name: 'Products',
                    component: Products,
                },
                {
                    path: 'product/:productId',
                    name: 'Product',
                    component: Product,
                },
                {
                    path: 'coupons',
                    name: 'Coupons',
                    component: Coupons,
                },
                {
                    path: 'order',
                    name: 'Order',
                    component: Order,
                },
                {
                    path: 'checkout/:orderId',
                    name: 'CheckOut',
                    component: CheckOut,
                },
                {
                    path: 'favorite',
                    name: 'Favorite',
                    component: Favorite,
                },
            ]
        },
        {
            path: '/admin',
            name: 'Dashboard',
            component: Dashboard,
            meta: { requiresAuth: true },
            children: [
                {
                    path: 'productslist',
                    name: 'ProductsList',
                    component: ProductsList,
                    meta: { requiresAuth: true },
                },
                {
                    path: 'orderslist',
                    name: 'OrdersList',
                    component: OrdersList,
                    meta: { requiresAuth: true },
                },
                {
                    path: 'couponslist',
                    name: 'CouponsList',
                    component: CouponsList,
                    meta: { requiresAuth: true },
                },
            ],
        },
    ]
})