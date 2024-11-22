<script setup>
import Footer from '../components/FooterPage.vue'
import PerfumeProductLayout from '@/components/PerfumeProductLayout.vue'
import MenuNav from '@/components/MenuNav.vue'
</script>

<template>
  <main>
    <MenuNav class="absolute" />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://eu.louisvuitton.com/content/dam/lv/online/high-end/unisex/Fragrances/U_Fr_World_Of_Fragrances_v3.html/jcr:content/assets/01_FRAGRANCE_WOF_VISUAL_06_LVCOM_2048x1152_DI3.jpg?imwidth=2400')] bg-cover bg-no-repeat bg-black bg-opacity-40 bg-blend-overlay text-white"
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
    <PerfumeProductLayout />
    <Footer />
  </main>
</template>
