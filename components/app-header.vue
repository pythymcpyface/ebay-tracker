<template>
  <header class="flex justify-between items-start md:items-center mt-5">
    <div class="flex items-center md:space-x-12">
      <div class="hidden md:block">
        <NuxtLink
          to="/"
          class="text-xl font-semibold p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          Ebay tracker
        </NuxtLink>
      </div>
    </div>

    <ClientOnly>
      <ColorModeSelector />
    </ClientOnly>
  </header>
</template>
