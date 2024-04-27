<template>
  <div class="flex justify-auto">
    <UInput
      v-model="item"
      type="text"
      size="sm"
      placeholder="Search"
      @keyup.enter="search"
    />
    <UButton
      class="ms-1"
      @click="search"
    >
      Search...
    </UButton>
  </div>
  <div class="flex">
    <SoldChart ref="soldChart" />
    <LiveChart ref="liveChart" />
  </div>
  <div class="flex flex-wrap">
    <USelectMenu
      v-model="selectedCategory"
      placeholder="Category"
      :options="categories"
      option-attribute="categoryName"
      value-attribute="categoryId"
    />
    <USelectMenu
      v-model="selectedBuyingOption"
      placeholder="Buying Option"
      :options="buyingOptions"
      option-attribute="buyingOption"
      value-attribute="buyingOption"
    />
    <USelectMenu
      v-model="selectedCondition"
      placeholder="Condition"
      :options="conditions"
      option-attribute="condition"
      value-attribute="condition"
    />
    <div
      v-for="aspect in aspects"
      :key="aspect.localizedAspectName"
    >
      <USelectMenu
        v-model="selectedAspect"
        :placeholder="aspect.localizedAspectName"
        :options="getAspectOptions(aspect)"
        option-attribute="categoryName"
        value-attribute="categoryId"
      />
    </div>
  </div>
</template>

<script setup>
import constants from '../constants';

const item = ref('');
const soldChart = ref(null);
const liveChart = ref(null);
const categories = ref([]);
const aspects = ref([]);
const buyingOptions = ref([]);
const conditions = ref([]);
const refinements = ref('');
const selectedCategory = ref(null);
const selectedAspect = ref(null);
const selectedBuyingOption = ref(null);
const selectedCondition = ref(null);

const search = () => {
  $fetch(
    '/api/ebayRefinements', {
      query: {
        item: item.value,
        category: selectedCategory.value,
        buyingOption: selectedBuyingOption.value,
        condition: constants.conditionsObj[selectedCondition.value],
      },
    },
  ).then((refinementsData) => {
    refinements.value = refinementsData.data;
    const {
      categoryDistributions,
      aspectDistributions,
      buyingOptionsDistributions,
      conditionDistributions,
    } = refinementsData.data.refinement;
    categories.value = categoryDistributions?.sort((a, b) => b.matchCount - a.matchCount);
    aspects.value = aspectDistributions?.sort((a, b) => {
      return b.aspectValueDistributions.length - a.aspectValueDistributions.length;
    });
    buyingOptions.value = buyingOptionsDistributions?.sort((a, b) => {
      return b.matchCount - a.matchCount;
    });
    conditions.value = conditionDistributions?.sort((a, b) => {
      return b.matchCount - a.matchCount;
    });
  });
  $fetch(
    '/api/ebaySold', {
      query: {
        item: item.value,
        category: selectedCategory.value,
        buyingOption: selectedBuyingOption.value,
        condition: constants.conditionsObj[selectedCondition.value],
      },
    },
  ).then((data) => {
    soldChart.value.updateSoldChart(data.data);
    selectedCategory.value = null;
  });
  $fetch(
    '/api/ebayLive', {
      query: {
        item: item.value,
        category: selectedCategory.value,
        buyingOption: selectedBuyingOption.value,
        condition: constants.conditionsObj[selectedCondition.value],
      },
    },
  ).then((data) => {
    const nowMilliseconds = new Date().getTime();
    const values = data.data.itemSummaries.map((itemSummary) => {
      const price = itemSummary?.price?.value;
      const endDate = itemSummary?.itemEndDate;
      const parsedEndDate = Date.parse(endDate);
      const endDateMilliseconds = endDate ? parsedEndDate : -1;
      const minutesRemaining = (endDateMilliseconds - nowMilliseconds) / (60 * 1000);
      return [minutesRemaining, price];
    });
    liveChart.value.updateLiveChart(values);
  });
};

const getAspectOptions = (aspect) => {
  return aspect.aspectValueDistributions.sort((a, b) => {
    return b.matchCount - a.matchCount;
  }).map((aspectValue) => {
    return aspectValue.localizedAspectValue;
  });
};

watch(selectedCategory, async () => {
  if (selectedCategory.value) {
    search();
  }
});

watch(selectedAspect, async () => {
  if (selectedAspect.value) {
    search();
  }
});

watch(selectedBuyingOption, async () => {
  if (selectedBuyingOption.value) {
    search();
  }
});

watch(selectedCondition, async () => {
  if (selectedCondition.value) {
    search();
  }
});
</script>
