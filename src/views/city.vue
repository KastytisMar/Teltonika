<template>
  <div id="app" class="container is-max-desktop">
    <div class="column is-flex">
      <h1 class="title is-2 mr-4">Miestai</h1> 
      <button class="button is-info" v-on:click="openModal">Pridėti</button>
      <citymodal v-bind:class="{'is-active': modalActive}" v-on:close-modal="closeModal" v-on:reload-posts="getCities"></citymodal>
    </div>
    <citytable></citytable>
  </div>  
</template>

<script>
import axios from "axios";
import citymodal from '../components/citymodal.vue';
import citytable from '../components/citytable.vue';

export default {
  data() {
    return {
      cities:[],
      searchValue: '',
      modalActive: false,
    }
  },  

  components: {
    citymodal,
    citytable,
  },

  created() {
    this.getCities() ;
  },

  methods: {
    searchCities() {
      this.getCities(this.searchValue)
    },
    getCities(searchValue) {
      const searchQuery = searchValue ? '?search=' + searchValue : '';
      axios
        .get(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities${searchQuery}`)
        .then(response => (this.cities = response.data.data));
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