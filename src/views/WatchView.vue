<script setup>
import Footer from '../components/FooterPage.vue'
import WatchProductLayout from '@/components/WatchProductLayout.vue'
import MenuNav from '@/components/MenuNav.vue'
</script>

<template>
  <main>
    <MenuNav class="absolute text-white z-10" />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://hodinkee-production.s3.amazonaws.com/uploads/images/54d3db32-9ebb-4814-8c98-7210678b6eff/lv_opera-tambour-Crop-3-2.jpg')] bg-cover bg-no-repeat bg-center bg-black bg-opacity-20 bg-blend-overlay text-white relative z-0"
    >
      <div
        class="absolute bottom-10 left-10 text-center md:bottom-20 md:left-20 lg:bottom-30 lg:left-30 z-0"
      >
        <h1 class="text-3xl md:text-5xl lg:text-6xl mb-20">Modern Fashion<br />Boutique Theme</h1>
        <p class="text-lg md:text-xl lg:text-2xl">
          Elevate your online fashion shop with its trendy design, <br />and robust WooCommerce -
          Elementor integration.
        </p>
      </div>
    </div>
    <WatchProductLayout />
    <Footer />
  </main>
</template>
