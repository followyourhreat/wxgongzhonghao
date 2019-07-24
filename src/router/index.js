import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  // mode:'history',

  routes: [
    // {
    //   path: '/',
    //   redirect: {
    //     name: 'Home'
    //   }
    // },
    {
      path: '/',
      name: 'Home',
      meta: {
        title: '利达众'
      },
      component: resolve => require(['../pages/Home/home.vue'], resolve)
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '首页'
      },
      component: resolve => require(['../pages/Home/home.vue'], resolve)
    },
   
    {
      path: '/team',
      name: 'Team',
      meta: {
        title: '我的团队'
      },
      component: resolve => require(['../pages/Team/team.vue'], resolve)
    },
    {
      path: '/mine',
      name: 'mine',
      meta: {
        title: '个人中心'
      },
      component: resolve => require(['../pages/Mine/mine.vue'], resolve),
   
    },
    {
      path: '/counpon',
      name: 'counpon',
      meta: {
        title: '优惠券'
      },
      component: resolve => require(['../pages/counpon/counpon.vue'], resolve),
   
    },
    {
      path: '/detail',
      name: 'detail',
      title: '商品详情',
      component: resolve => require(['../pages/Home/detail'], resolve)
    },
    {
      path: '/order-list',
      name: 'orderlist',
      meta: {
        title: '我的账单'
      },
      component: resolve => require(['../pages/Mine/list.vue'], resolve),
   
    },
    {
      path: '/order-detail',
      name: 'orderDetail',
      meta: {
        title: '账单详情'
      },
      component: resolve => require(['../pages/Mine/orderDetail.vue'], resolve),
   
    },
    {
      path: '/finger-guide',
      name: 'fingerGuide',
     
      meta: {
        title: '新手指南'
      },
      component: resolve => require(['../pages/Mine/guide.vue'], resolve),
   
    },
    {
      path: '/contact-us',
      name: 'contact',
    
      meta: {
        title: '联系我们'
      },
      component: resolve => require(['../pages/Mine/contact.vue'], resolve),
   
    },
    {
      path: '/about-us',
      name: 'about',
     
      meta: {
        title: '关于我们'
      },
      component: resolve => require(['../pages/Mine/about.vue'], resolve),
   
    },
    {
      path: '/message',
      name: 'message',
      
      meta: {
        title: '消息中心'
      },
      component: resolve => require(['../pages/Mine/message.vue'], resolve),
   
    },
    {
      path: '/login',
      name: 'login',
      
      meta: {
        title: '登录'
      },
      component: resolve => require(['../pages/login/login.vue'], resolve)
    },
    {
      path: '/forget',
      name: 'forget',
      
      meta: {
        title: '忘记密码'
      },
      component: (resolve) => require(['../pages/login/forget.vue'], resolve)
    },
    {
      path: '/reg',
      name: 'reg',
      
      meta: {
        title: '注册'
      },
      component: (resolve) => require(['../pages/login/reg.vue'], resolve)
    },
    {
      path: '/map',
      name: 'map',
    
      meta: {
        title: '地图'
      },
      component: (resolve) => require(['../pages/home/map.vue'], resolve)
    },
    {
      path: '/setting',
      name: 'setting',
      
      meta: {
        title: '个人设置'
      },
      component: resolve => require(['../pages/Mine/setting.vue'], resolve),
    },
    {
      path: '/changeMobile',
      name: 'changeMobile',
      
      meta: {
        title: '绑定手机'
      },
      component: resolve => require(['../pages/Mine/changeMobile.vue'], resolve),
    },
    {
      path: '/recommend',
      name: 'recommend',
    
      meta: {
        title: '推荐'
      },
      component: resolve => require(['../pages/Home/recommend.vue'], resolve),
    },
    {
      path: '/cousumer-counpon',
      name: 'cousumerCounpon',
     
      meta: {
        title: '消费券'
      },
      component: resolve => require(['../pages/csmCounpon/cousumerCounpon.vue'], resolve),
     
    },
    {
      path:'/counpon/receive-list',
      name: 'receiveList',
     
      meta: {
        title: '领取列表'
      },
      component:resolve => require(['../pages/csmCounpon/receiveList.vue'], resolve)
    },
    {
      path:'/counpon/use-list',
      name: 'useList',
     
      meta: {
        title: '使用列表'
      },
      component:resolve => require(['../pages/csmCounpon/useList.vue'], resolve)
    },
    {
      path:'/counpon/getCounpon',
      name: 'getCounpon',
     
      meta: {
        title: '领取红包'
      },
      component:resolve => require(['../pages/csmCounpon/getCounpon.vue'], resolve)
    },
    {
      path:'/award',
      name: 'award',
     
      meta: {
        title: '消费券红包'
      },
      component:resolve => require(['../pages/Home/award.vue'], resolve)
    },
    {
      path:'/counpon/csmCounponDetail',
      name: 'csmCounponDetail',
      
      meta: {
        title: '消费券详情'
      },
      component:resolve => require(['../pages/csmCounpon/csmCounponDetail.vue'], resolve)
    },
    {
      path: '/integer',
      name: 'Integer',
     
      meta: {
        title: '我的积分'
      },
      component: resolve => require(['../pages/Home/integer.vue'], resolve)
    },
    {
      path: '/explain',
      name: 'Explain',
    
      meta: {
        title: '积分说明'
      },
      component: resolve => require(['../pages/Home/explain.vue'], resolve)
    },
    {
      path: '/allrecord',
      name: 'Allrecord',
     
      meta: {
        title: '积分记录'
      },
      component: resolve => require(['../pages/Home/allrecord.vue'], resolve)
    },
    {
      path: '/changeAward',
      name: 'changeAward',
     
      meta: {
        title: '领取积分奖励记录'
      },
      component: resolve => require(['../pages/Home/changeAward.vue'], resolve)
    },
    {
      path: '/rewards',
      name: 'Rewards',
     
      meta: {
        title: '积分奖励'
      },
      component: resolve => require(['../pages/Home/rewards.vue'], resolve)
    },
    {
      path: '/payment',
      name: 'payment',
      meta: {
        title: '支付'
      },
      component: resolve => require(['../pages/payment/payment.vue'], resolve)
    },
    {
      path: '/moreshops',
      name: 'Moreshops',
      meta: {
        title: '更多'
      },
      component: resolve => require(['../pages/Home/moreshops.vue'], resolve)
      },
      {
        path: '/teamrule',
        name: 'teamrule',
        meta: {
          title: '团队说明'
        },
        component: resolve => require(['../pages/Team/teamrule.vue'], resolve)
        },
      {
        path: '/payResult',
        name: 'payResult',
        meta: {
          title: '支付详情'
        },
        component: resolve => require(['../pages/payment/payResult.vue'], resolve)
      },
      {
        path: '/waiting-order',
        name: 'waitingOrder',
        meta: {
          title: '待支付订单'
        },
        component: resolve => require(['../pages/payment/waitingOrder.vue'], resolve)
      }, 
  ]
})
