import Vuex from 'vuex';
export { createStore };

function createStore() {
  const store = Vuex.createStore({
    state() {
      return {
        item: {},
        items: [],
        copyItems: [],
        searchedItems: [],
        filteredItems: [],
        categoriesChecked: [],
        dateOptions: {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        pageIndex: 0,
        totalCount: 0,
        pageSize: 10,
        pageCount: 0,
        pageBtns: [],
        searchFields: ['title', 'description'],
        searchAlert: false,
        searchTerm: '',
        lastSearch: '',
        fromDate: '',
        toDate: '',
        filterField: 'tags',
        categories: [
          'Bring a packed lunch',
          'Bring binoculars if you have them',
          'Car parking charge',
          'Children must be accompanied by an adult',
          'Easy walking grade',
          'Full accessibility - level or ramped access. Accessible toilets available',
          'Healthy walk / Event',
          'Historial walk / Event',
          'Ideal for families and accompanied children',
          'Moderate walking grade',
          'Partial accessibility - level or ramped access',
          'Partnership event',
          'Places limited - please book in advance',
          'Please leave your dog at home',
          'Please wear suitable boots and clothing',
          'Refreshment shop, opportunity for refreshments',
          'Strenuous walking grade',
          'There is a charge for this event',
          'Wildlife walk / Event',
        ],
      };
    },
    actions: {
      setItem({ commit }, obj) {
        commit('SET_ITEM', obj);
      },
      searchFilter({ commit }) {
        commit('SEARCH_FILTER');
        commit('CALCULATE_PAGES');
        commit('CREATE_PAGES');
      },
      setSearchTerm({ commit }, v) {
        commit('SET_SEARCH_TERM', v);
      },
      setItems({ commit }, arr) {
        commit('SET_ITEMS', arr);
        commit('CALCULATE_PAGES');
        commit('CREATE_PAGES');
      },
      goToPage({ commit }, i) {
        commit('SET_PAGE_INDEX', i);
      },
      clearAlert({ commit }) {
        commit('CLEAR_ALERT');
      },
      resetSearch({ commit }) {
        commit('RESET_SEARCH');
        commit('CALCULATE_PAGES');
        commit('CREATE_PAGES');
      },
      applyFilters({ commit }, cat) {
        if (cat) {
          commit('APPLY_FILTERS', cat);
        }
        commit('FILTER_BY_CATEGORIES');
        commit('SEARCH_FILTER');
        commit('CALCULATE_PAGES');
        commit('CREATE_PAGES');
      },
    },
    mutations: {
      SET_ITEM(state, obj) {
        state.item = obj;
      },
      SET_SEARCH_TERM(state, v) {
        state.searchTerm = v;
      },
      FILTER_BY_CATEGORIES(state) {
        state.filteredItems = [];
        if (state.categoriesChecked.length === 0) {
          state.filteredItems = state.copyItems.slice();
        } else {
          state.filteredItems = state.copyItems.filter((elem) => {
            return elem[state.filterField]
              .map((a) => a.name)
              .some((cat) => state.categoriesChecked.includes(cat));
          });
        }
      },
      SEARCH_FILTER(state) {
        let fromDate =
          state.fromDate.length > 0 ? new Date(state.fromDate) : false;
        let toDate = state.toDate.length > 0 ? new Date(state.toDate) : false;
        state.searchedItems = state.filteredItems.filter((item) =>
          state.searchFields.some((term) => {
            return (
              (!state.searchTerm ||
                item[term]
                  .toLowerCase()
                  .includes(state.searchTerm.toLowerCase())) &&
              (!fromDate || item.dateStartEnd.to > fromDate) &&
              (!toDate || item.dateStartEnd.to < toDate)
            );
          })
        );
      },
      APPLY_FILTERS(state, cat) {
        const index = state.categoriesChecked.indexOf(cat);
        if (index > -1) {
          state.categoriesChecked.splice(index, 1);
        } else {
          state.categoriesChecked.push(cat);
        }
      },
      RESET_SEARCH(state) {
        state.searchTerm = '';
        state.fromDate = '';
        state.toDate = '';
        state.searchedItems = state.filteredItems.slice();
      },
      CLEAR_ALERT(state) {
        state.searchAlert = false;
      },
      SET_PAGE_INDEX(state, i) {
        state.pageIndex = i;
        state.lastSearch = state.searchTerm;
      },
      CALCULATE_PAGES(state) {
        state.totalCount = state.searchedItems.length;
        state.pageCount = Math.ceil(state.totalCount / state.pageSize);
        state.pageIndex = 0;
        state.pageBtns = Array.from(
          { length: state.pageCount },
          (_, i) => i + 1
        );
      },
      CREATE_PAGES(state) {
        state.pages = [
          ...Array(Math.ceil(state.searchedItems.length / state.pageSize)),
        ].map(() => state.searchedItems.splice(0, state.pageSize));
        state.items = state.pages[0];
      },
      SET_ITEMS(state, arr) {
        state.copyItems = arr.slice();
        state.filteredItems = arr.slice();
        state.searchedItems = arr.slice();
      },
    },
  });
  return store;
}
