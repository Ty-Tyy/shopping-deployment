<script setup>
import Footer from '../components/FooterPage.vue'
import WomenHeader from '@/components/WomenHeader.vue'
import WomenProductLayout from '@/components/WomenProductLayout.vue'
</script>

<template>
  <main>
    <WomenHeader />
    <div
      class="h-screen flex justify-center items-center bg-[url('https://eu.louisvuitton.com/content/dam/lv/online/high-end/women/handbags/W_LG_Neverfull_Inside_Out_v2.html/jcr:content/assets/inside_out_module/NEVERFULL_INSIDE_OUT_IMG02_LVCOM_2048x1152_DI3.jpg?imwidth=2400')] bg-cover bg-no-repeat text-red-500 relative"
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
