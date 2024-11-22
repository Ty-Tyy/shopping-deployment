import axios from 'axios';

export const ProductPage = {
  async getProductsData() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getproduct`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Update other methods to use the new getProductsData method
  async getProductsMini() {
    const products = await this.getProductsData();
    return products.slice(0, 5);
  },

  async getProductsSmall() {
    const products = await this.getProductsData();
    return products.slice(0, 10);
  },

  async getProducts() {
    return await this.getProductsData();
  },

  async getProductsWithOrdersSmall() {
    const productsWithOrders = await this.getProductsWithOrdersData();
    return productsWithOrders.slice(0, 10);
  },

  async getProductsWithOrders() {
    return await this.getProductsWithOrdersData();
  }
};
