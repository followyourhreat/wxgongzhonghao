/*
*用户信息状态树
*/
export default{
  state: {
    userInfo: localStorage.getItem("userInfo")?JSON.parse(localStorage.getItem("userInfo")):{real_name: '路人甲'},
    Payment:"false",
    shopId:"0",
  },
  actions: {
    setUserInfoAction({ commit }, data) {
      localStorage.setItem('userInfo', JSON.stringify(data));
      commit('setUserInfoMutation', data);
    },
    setPaymentAction({ commit }, data) {
      sessionStorage.setItem('Payment', JSON.stringify(data));
      commit('setPaymentMution', data);
    },
    setShopIdAction({commit},data){
      sessionStorage.setItem('shopId', data);
      commit('setShopIdMution', data);
    }


  },
  mutations: {
    setUserInfoMutation(state, data) {
      state.userInfo = Object.assign({}, state.userInfo, data);
    },
    PaymentMution(state,data){
      state.Payment = data;
    },
    setShopIdMution(state,data){
      state.shopId = data;
    }
  },
  getters: {
    userInfo: state => state.userInfo,
    Payment:state => state.Payment,
    shopId:state => state.shopId
  }
}
