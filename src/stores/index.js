import { createStore } from 'vuex'
import cart from './CartOrder'

const store = createStore({
  modules: {
  cart}
})

store.commit('cart/loadCart') // Automatically load cart on store initialization

export default store
