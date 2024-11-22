<script setup>
import Menu from '../components/MenuNav.vue'
import Layout from '../components/LayoutPage.vue'
import Footer from '../components/FooterPage.vue'
</script>

<template>
  <main>
    <Menu />
    <div class="container h-screen flex justify-center items-center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center p-10 mt-10">
        <div class="md:order-2">
          <img
            src="../components/icons/man-woman-fashion-models-looking-away-38190286.png"
            alt="Fashion models"
            class="max-w-full h-auto"
          />
        </div>
        <div class="md:order-1 text-center">
          <h1 class="text-3xl md:text-5xl mb-20">Modern Fashion<br />Boutique Theme</h1>
          <p class="text-lg md:text-xl">
            Elevate your online fashion shop with its trendy design, <br />and robust WooCommerce -
            Elementor integration.
          </p>
        </div>
      </div>
    </div>
    <Layout class="m-10" />
    <Footer />
  </main>
</template>
