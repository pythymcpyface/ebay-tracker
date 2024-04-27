export const useEbaySoldData = () => {
  const soldData = ref([]);
  const showSoldChart = ref(false);

  const fetchSoldData = async (search) => {
    showSoldChart.value = false;
    try {
      const { data } = await $fetch(`/api/ebaySold?item=${search}`);
      soldData.value = data;
    } finally {
      showSoldChart.value = true;
    }
  };

  const fetchRefinements = async (search) => {

  };

  const fetchCurrentData = async (search) => {

  };

  return {
    soldData,
    fetchSoldData,
    showSoldChart,
  };
};
