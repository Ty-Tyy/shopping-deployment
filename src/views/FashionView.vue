<script setup>
import WomenHeader from '@/components/WomenHeader.vue'
import Footer from '../components/FooterPage.vue'
import WomenProductLayout from '@/components/WomenProductLayout.vue'
</script>

<template>
  <main>
    <WomenHeader />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://www.louisvuitton.com/images/is/image/lv/W_BC_FashnJew_June24_0796_DI3.jpg?wid=2400')] bg-cover bg-no-repeat text-red-500"
    >
      <div
        class="absolute bottom-10 left-10 text-center md:bottom-20 md:left-20 lg:bottom-30 lg:left-30"
      >
        <h1 class="text-3xl md:text-5xl lg:text-6xl mb-20">Modern Fashion<br />Boutique Theme</h1>
        <p class="text-lg md:text-xl lg:text-2xl">
          Elevate your online fashion shop with its trendy design, <br />and robust WooCommerce -
          Elementor integration.
        </p>
      </div>
    </div>
    <WomenProductLayout />
    <Footer />
  </main>
</template>
