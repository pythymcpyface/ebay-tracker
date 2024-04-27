export const useEbayAuth = async () => {
  const token = ref('');
  const pending = ref(false);

  const fetchToken = async () => {
    pending.value = true;
    try {
      const { data } = await $fetch('/api/ebayAuth');
      return data;
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    token.value = await fetchToken();
  };

  return {
    token,
    refresh,
    pending,
  };
};
