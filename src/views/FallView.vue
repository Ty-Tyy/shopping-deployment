<script setup>
import Footer from '../components/FooterPage.vue'
import MenHeader from '../components/MenHeader.vue'
import MenProductLayout from '@/components/MenProductLayout.vue'
</script>

<template>
  <main>
    <MenHeader />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://posters.freecaster.com/videos/louisvuitton/9cf7eff4-5bd8-4385-90cb-eea1d674ec86/G4RrYKjKJT18I5bR3LseaEUb/2400.jpg')] bg-cover bg-no-repeat text-white"
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
