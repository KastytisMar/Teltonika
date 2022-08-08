<template>
  <div id="app" class="container is-max-desktop">
    <div class="column is-flex">
      <h1 class="title is-2 mr-4">Šalys</h1> 
      <button class="button is-info" v-on:click="openModal">Pridėti</button>
      <countrymodal v-bind:class="{'is-active': modalActive}" v-on:close-modal="closeModal" v-on:reload-posts="getCountries"></countrymodal>
    </div>
    <countrytable></countrytable>
  </div>  
</template>

<script>
import axios from "axios";
import countrymodal from '../components/countrymodal.vue';
import countrytable from '../components/countrytable.vue';

export default {
  data() {
    return {
      countries:[],
      searchValue: '',
      modalActive: false,
    }
  },  

  components: {
    countrymodal,
    countrytable,
  },

  created() {
    this.getCountries() ;
  },

  methods: {
    searchCountries() { 
      this.getCountries(this.searchValue)
    },

    getCountries(searchValue) {
      var searchQuery = searchValue ? '?search=' + searchValue : ''
      axios
        .get("https://akademija.teltonika.lt/countries_api/api/countries" + searchQuery)
        .then(response => (this.countries = response.data));
    },

    openModal() {
      this.modalActive = true
    },
    
    closeModal() {
      this.modalActive = false
    },
  }
};
</script>