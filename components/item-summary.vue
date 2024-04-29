<template>
  <div class="grid grid-cols-3 gap-2 m-1">
    <div class="m-1">
      <div>
        <a
          target="_blank"
          :href="item.itemHref"
        >
          <div>
            <img
              :src="item.image.imageUrl"
              :alt="item.title"
            >
          </div>
        </a>
      </div>
    </div>
    <div class="col-span-2 m-1">
      <div>
        <div>
          <span>
            <span>Ends in {{ utils.calculateMinutesRemaining(item.itemEndDate) }} minutes</span>
          </span>
        </div>
      </div>
      <a
        target="_blank"
        :href="item.itemHref"
      >
        <div>
          <h1>
            {{ item.title }}
          </h1>
        </div>
      </a>
      <div>
        <div>
          <span>
            <span>
              {{ item.currentBidPrice.value }} {{ item.currentBidPrice.currency }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import utils from '../utils';

const { item } = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

</script>
