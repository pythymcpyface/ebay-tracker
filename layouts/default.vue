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
useHead({
  titleTemplate: '%s - Andrew Gibson',
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
</script>

<style>
body {
  font-family: 'Roboto';
}

body {
  @apply bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300
}
</style>
