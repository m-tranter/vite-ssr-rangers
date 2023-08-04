<template>
  <div>
    <MyHeader />
    <div class="container my-2">
      <div id="contentTypesContainer" class="row events-container">
        <div class="col-lg-8">
             <Pagination
             />
          <div class="api-results-info">
            <p>
              Total results: <strong>{{ totalCount }}</strong>
            </p>
            <p>
              Current page: <strong>{{ pageIndex + 1 }}</strong>
            </p>
          </div>
          <div v-for="(_, i) in pages" :key="i"
            v-show="i === pageIndex"
            >
            <Card :i ="i" />
          </div>
            <Pagination />
      
        </div>
        <div class="col-lg-4 mt-3 mt-lg-0">
          <div
            class="search-options-container border-secondary border border-1 rounded p-3"
          >
            <h2 class="mt-0">Search for an event</h2>
            <div class="date-range">
              <h3>Date range</h3>
              <label for="start-date">From</label>
              <input
                type="date"
                id="start-date"
                v-model="fromDate"
                min="2022-09-01"
                max="2025-12-31"
              />
              <label for="end-date">To</label>
              <input
                type="date"
                id="end-date"
                v-model="toDate"
                min="2022-09-01"
                max="2025-12-31"
                v-on:change="searchFilter()"
              />
            </div>
            <div class="search-options mt-3">
              <div class="input-group content-type-search">
                <input
                  @input="searchFilter"
                  @focus="clearAlert"
                  autocomplete="off"
                  type="text"
                  class="form-control me-2 border-secondary border border-1"
                  placeholder="Type here..."
                  v-model="searchTerm"
                  aria-label="Search term"
                  id="contentTypeSearchInput"
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    v-on:click="searchFilter"
                    id="contentTypeSearchBtn"
                  >
                    Search
                  </button>
                </div>
                <button
                  class="btn btn-outline-secondary w-100 mt-3"
                  type="button"
                  v-on:click="resetSearch"
                >
                  Clear
                </button>
              </div>
              <div class="search-error-messages">
                <div
                  v-if="searchAlert === true"
                  class="alert alert-secondary mt-2"
                  role="alert"
                >
                  Please enter a search term.
                </div>
              </div>
            </div>
          </div>
          <div class="category-options pt=5 mt-5">
            <h3 class="mb-3">Or filter events by category</h3>
            <div
              class="form-check"
              v-for="category in categories"
              v-bind:key="category"
            >
              <input
                class="form-check-input"
                type="checkbox"
                v-bind:id="category"
                v-bind:ref="category"
                v-bind:checked="categoriesChecked.includes(category)"
                v-on:change="
                  () => {
                    applyFilters(category);
                  }
                "
              />
              <label class="form-check-label" v-bind:for="category">{{
                category
              }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MyFooter />
  </div>
</template>

<script>
export default {
  name: 'home',
  computed: {
    pages() {
      return this.$store.state.pages;
    },
    totalCount() {
      return this.$store.state.totalCount;
    },
    pageIndex() {
      return this.$store.state.pageIndex;
    },
    categories() {
      return this.$store.state.categories;
    },
    categoriesChecked() {
      return this.$store.state.categoriesChecked;
    },
    fromDate() {
      return this.$store.state.fromDate;
    },
    toDate() {
      return this.$store.state.toDate;
    },
    searchTerm: {
      get() {
      return this.$store.state.searchTerm;
    },
      set(value) {
        this.$store.dispatch('setSearchTerm', value);
      }},
  },
  methods: {
    searchAlert() {
      this.$store.dispatch('searchAlert');
    },
    searchFilter() {
      this.$store.dispatch('searchFilter');
    },
    clearAlert() {
      this.$store.dispatch('clearAlert');
    },
    resetSearch() {
      this.$store.dispatch('resetSearch');
    },
    applyFilters(cat) {
      this.$store.dispatch('applyFilters', cat);
    },
  },
  mounted() {
    console.log("reloading this page");
    this.$store.dispatch('applyFilters');
  }
};
</script>

<script setup>
import MyFooter from '../components/MyFooter.vue';
import MyHeader from '../components/MyHeader.vue';
import Pagination from '../components/Pagination.vue';
import Card from '../components/Card.vue';
</script>

