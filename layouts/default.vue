<template>
  <div class="container mx-auto max-w-8xl">
    <AppHeader />
    <div class="flex flex-col">
      <main class="p-2 mt-10">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const title = ref('Ebay price tracker and sales analysis');
const description = ref('Analyse sales price history and monitor live bargains on Ebay to get the best prices for your favorite items.');

useHead({
  titleTemplate: 'Ebay tracker',
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
      crossorigin: '',
    },
  ],
});
useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<style>
body {
  font-family: 'Roboto';
}

body, highchart, rect.highcharts-button-box {
  @apply bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
}

rect.highcharts-button-box {
  fill: none;
}

text.highcharts-title {
  @apply bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
}

</style>
