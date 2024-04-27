<template>
  <div class="flex flex-wrap">
    <UInput
      v-model="item"
      type="text"
      size="sm"
      placeholder="Search"
      @keyup.enter="search"
    />
    <UButton
      class="ms-1 me-2"
      @click="search"
    >
      Search...
    </UButton>
    <UButton
      class="ms-1 me-2"
      @click="clear"
    >
      Clear filters
    </UButton>
    <USelectMenu
      v-model="selectedCategory"
      :ui-menu="{ width: 'min-w-max' }"
      placeholder="Category"
      :options="categories"
      option-attribute="categoryName"
      value-attribute="categoryId"
    />
    <USelectMenu
      v-model="selectedBuyingOption"
      :ui-menu="{ width: 'min-w-max' }"
      placeholder="Buying Option"
      :options="buyingOptions"
      option-attribute="buyingOption"
      value-attribute="buyingOption"
    />
    <USelectMenu
      v-model="selectedCondition"
      :ui-menu="{ width: 'min-w-max' }"
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
        v-model="selectedAspect[aspect.localizedAspectName]"
        :ui-menu="{ width: 'min-w-max' }"
        class="mb-1"
        :placeholder="aspect.localizedAspectName"
        :options="getAspectOptions(aspect)"
        option-attribute="value"
        value-attribute="value"
      />
    </div>
  </div>
  <div class="flex">
    <SoldChart ref="soldChart" />
    <LiveChart ref="liveChart" />
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
const selectedAspect = ref({});
const selectedBuyingOption = ref(null);
const selectedCondition = ref(null);

const search = () => {
  if (item.value) {
    $fetch(
      '/api/ebayRefinements', {
        query: {
          item: item.value,
          category: selectedCategory.value,
          buyingOption: selectedBuyingOption.value,
          condition: constants.conditionsObj[selectedCondition.value],
          ...selectedAspect.value,
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
          ...selectedAspect.value,
        },
      },
    ).then((data) => {
      soldChart.value.updateSoldChart(data.data);
    });
    $fetch(
      '/api/ebayLive', {
        query: {
          item: item.value,
          category: selectedCategory.value,
          buyingOption: selectedBuyingOption.value,
          condition: constants.conditionsObj[selectedCondition.value],
          ...selectedAspect.value,
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
  }
};

const clear = () => {
  item.value = '';
  categories.value = [];
  aspects.value = [];
  buyingOptions.value = [];
  conditions.value = [];
  refinements.value = '';
  selectedCategory.value = null;
  selectedAspect.value = {};
  selectedBuyingOption.value = null;
  selectedCondition.value = null;
  soldChart.value.updateSoldChart(['-1', '0', '1']);
  liveChart.value.updateLiveChart([[0, 0]]);
};

const getAspectOptions = (aspect) => {
  const name = aspect.localizedAspectName;
  return aspect.aspectValueDistributions.sort((a, b) => {
    return b.matchCount - a.matchCount;
  }).map((aspectValue) => {
    return {
      value: aspectValue.localizedAspectValue,
      name,
    };
  });
};

watch(selectedCategory, async () => {
  if (selectedCategory.value) {
    search();
  }
});

watch(selectedAspect, async () => {
  console.log(selectedAspect.value);
  if (Object.keys(selectedAspect.value).length) {
    search();
  }
}, {
  deep: true,
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
