<script setup>
import Footer from '../components/FooterPage.vue'
import MenHeader from '../components/MenHeader.vue'
import MenProductLayout from '@/components/MenProductLayout.vue'
</script>

<template>
  <main>
    <MenHeader />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://posters.freecaster.com/videos/louisvuitton/23965861-d7f3-371b-ac5e-de4631f302d9-1716990344/2400.jpg')] bg-cover bg-no-repeat text-white"
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
    <MenProductLayout />
    <Footer />
  </main>
</template>
