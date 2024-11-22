export default {
  namespaced: true,
  state: {
    cartItems: [],
    total: 0,
    discount: 0,
  },
  getters: {
    cartItems: (state) => state.cartItems,
    total: (state) => state.total,
    discount: (state) => Number(state.discount),
    ProductCount: (state) => state.cartItems.length
  },
  mutations: {
    addToCart(state, item) {
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.product_qty++;
      } else {
        state.cartItems.push({ ...item, product_qty: 1 });
      }
      // Commit updateTotal to recalculate the total
      this.commit('cart/updateTotal');
    },
    removeItem(state, itemId) {
      const index = state.cartItems.findIndex((i) => i.id === itemId);
      if (index !== -1) {
        const itemPrice = state.cartItems[index].product_price * state.cartItems[index].product_qty;
        state.total -= itemPrice;
        state.cartItems.splice(index, 1);
        // Commit updateTotal to recalculate the total
        this.commit('cart/updateTotal');
      }
    },
    updateQuantity(state, { itemId, product_qty }) {
      const item = state.cartItems.find((i) => i.id === itemId);
      if (item) {
        state.total += (product_qty - item.product_qty) * item.product_price;
        item.product_qty = product_qty;
        this.commit('cart/updateTotal');
      }
    },
    applyDiscount(state, newDiscount) {
      state.discount = newDiscount;
      // Commit updateTotal to recalculate the total after discount
      this.commit('cart/updateTotal');
    },
    updateTotal(state) {
      state.total = state.cartItems.reduce((sum, item) => {
        return sum + (item.product_price * item.product_qty);
      }, 0);
      // Apply discount if any
      state.total -= (state.total * state.discount) / 100;
    },
    saveCart(state) {
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
      localStorage.setItem('discount', state.discount);
    },
    loadCart(state) {
      const cart = localStorage.getItem('cart');
      const discount = localStorage.getItem('discount');
      if (cart) {
        state.cartItems = JSON.parse(cart);
        state.discount = discount ? parseFloat(discount) : 0; // Default to 0
        this.commit('cart/updateTotal');
      }
    },
    clearCart(state) {
      state.cartItems = [];
      state.total = 0;
      state.discount = 0;
      localStorage.removeItem('cart');
      localStorage.removeItem('discount');
    },
  },
  actions: {
    addToCart({ commit }, item) {
      commit('addToCart', item);
    },
    removeItem({ commit }, itemId) {
      commit('removeItem', itemId);
    },
    updateQuantity({ commit }, { itemId, product_qty }) {
      commit('updateQuantity', { itemId, product_qty });
    },
    saveCart({ commit }) {
      commit('saveCart');
    },
    loadCart({ commit }) {
      commit('loadCart');
    },
    clearCart({ commit }) {
      commit('clearCart');
    },
  },
};
