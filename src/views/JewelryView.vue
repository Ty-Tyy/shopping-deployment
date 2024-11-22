<script setup>
import Footer from '../components/FooterPage.vue'
import JewelleryProductLayout from '@/components/JewelleryProductLayout.vue'
import Menu from '@/components/MenuNav.vue'
</script>

<template>
  <main>
    <Menu class="absolute text-white" />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://firstclasse.com.my/wp-content/uploads/2021/07/BRAVERY_SHOOT-ALICIA_1200x1200.jpg')] bg-cover bg-center bg-no-repeat bg-black bg-opacity-40 bg-blend-overlay text-white"
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
    <JewelleryProductLayout />
    <Footer />
  </main>
</template>
