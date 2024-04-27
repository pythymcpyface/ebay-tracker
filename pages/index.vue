<template>
  <section v-if="isFetching">
    Loading...
  </section>
  <section v-else-if="error">
    Error
  </section>
  <section v-else>
    <ul class="grid grid-cols-1 gap-4">
      <li
        v-for="repository in repositories"
        :key="repository.id"
        class="border border-gray-200 rounded-sm p-2 hover:bg-gray-100 font-mono"
      >
        <a
          :href="repository.html_url"
          target="_blank"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold">
                {{ repository.name }}
              </div>
              <p class="text-sm p-4">
                {{ repository.description }}
              </p>

            </div>
            <div class="p-2">
              {{ repository.stargazers_count }}★
            </div>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup>

const { isFetching, error, data } = await useFetch('https://api.github.com/users/pythymcpyface/repos');
const repositories = computed(
  () => data.value.sort((a, b) => b.stargazers_count - a.stargazers_count),
);

</script>
