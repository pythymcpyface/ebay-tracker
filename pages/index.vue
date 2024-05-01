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
      v-model="selectedMarketplace"
      :ui-menu="{ width: 'min-w-max' }"
      placeholder="Marketplace"
      :options="marketplaces"
      option-attribute="marketplaceText"
      value-attribute="marketplaceCode"
    />
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
  <UTabs :items="tabs">
    <template #auction>
      <ItemSummary
        v-for="auctionItemSummary in auctionItemSummaries"
        :key="auctionItemSummary.itemId"
        :item="auctionItemSummary"
      />
    </template>
    <template #bin>
      <ItemSummary
        v-for="binItemSummary in binItemSummaries"
        :key="binItemSummary.itemId"
        :item="binItemSummary"
      />
    </template>
  </UTabs>
</template>

<script setup>
import constants from '../constants';
import utils from '../utils';

const item = ref('');
const symbol = ref('');
const soldChart = ref(null);
const liveChart = ref(null);
const categories = ref([]);
const marketplaces = ref([]);
const aspects = ref([]);
const buyingOptions = ref([]);
const conditions = ref([]);
const refinements = ref('');
const selectedCategory = ref(null);
const selectedAspect = ref({});
const selectedBuyingOption = ref(null);
const selectedCondition = ref(null);
const selectedMarketplace = ref('');
const auctionItemSummaries = ref(null);
const binItemSummaries = ref(null);
const priceElements = ref(null);

const tabs = [{
  slot: 'auction',
  label: 'Auction',
}, {
  slot: 'bin',
  label: 'Buy-it-now',
}];

const search = async () => {
  if (item.value) {
    $fetch('/api/ebayAuth').then(() => {
      $fetch(
        '/api/ebayRefinements', {
          query: {
            item: item.value,
            category: selectedCategory.value,
            buyingOption: selectedBuyingOption.value,
            marketplace: selectedMarketplace.value,
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
        '/api/ebayLive', {
          query: {
            item: item.value,
            category: selectedCategory.value,
            marketplace: selectedMarketplace.value,
            buyingOption: selectedBuyingOption.value,
            condition: selectedCondition.value,
            ...selectedAspect.value,
          },
        },
      ).then((liveData) => {
        auctionItemSummaries.value = liveData.data.auction.itemSummaries;
        binItemSummaries.value = liveData.data.bin.itemSummaries;
        const currency = liveData.data.auction.itemSummaries[0].price?.currency || liveData.data.auction.itemSummaries[0]?.currentBidPrice?.currency;
        const values = liveData.data.auction.itemSummaries.map((auctionItemSummary) => {
          const price = auctionItemSummary?.price?.value || auctionItemSummary?.currentBidPrice?.value;
          const minutesRemaining = utils.calculateMinutesRemaining(auctionItemSummary.itemEndDate);
          return [minutesRemaining, price];
        });
        symbol.value = currency;
        liveChart.value.updateLiveChart(values, currency);
        $fetch(
          '/api/ebaySold', {
            query: {
              item: item.value,
              category: selectedCategory.value,
              marketplace: utils.getCountryDomain(selectedMarketplace.value.replace('EBAY_', '')),
              buyingOption: selectedBuyingOption.value,
              condition: constants.conditionsObj[selectedCondition.value],
              ...selectedAspect.value,
            },
          },
        ).then((soldData) => {
          priceElements.value = soldData.data;
          soldChart.value.updateSoldChart(soldData.data, currency);
        });
      });
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
  soldChart.value.updateSoldChart([]);
  liveChart.value.updateLiveChart([[]]);
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

marketplaces.value = constants.marketplaces.map((marketplace) => {
  return {
    marketplaceCode: marketplace,
    marketplaceText: utils.getCountryName(marketplace.replace('EBAY_', '')),
  };
});

watch(selectedMarketplace, async () => {
  if (selectedMarketplace.value) {
    search();
  }
});

watch(selectedCategory, async () => {
  if (selectedCategory.value) {
    search();
  }
});

watch(selectedAspect, async () => {
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
