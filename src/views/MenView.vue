<script setup>
import Footer from '../components/FooterPage.vue'
import MenHeader from '../components/MenHeader.vue'
import MenTab from '../components/MenTab.vue'
</script>

<template>
  <main>
    <MenHeader />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://www.hommessingapore.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F95281%2F1726122574-lv-fall-capsule-mens-01.jpg%3Fauto%3Dformat%252Ccompress%26cs%3Dsrgb&w=1200&q=75')] bg-cover bg-no-repeat text-white"
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
    <MenTab />
    <Footer />
  </main>
</template>
