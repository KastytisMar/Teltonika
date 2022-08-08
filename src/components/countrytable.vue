<template>
  <div id="app" class="container is-max-desktop">
    <div> 
      <div class="column is-flex">
            <input class="input mr-4" type="search" v-model="searchValue" placeholder="Ieškoti šalies">
            <button class="button is-info" @click="searchCountries">Ieškoti</button>
        </div>  
      <div class="column">
        <table class="table is-bordered is-fullwidth">
          <thead>
            <tr>
              <th @click="sort('name'), sortedCountries('name')" v-bind:class="[sortBy === 'name' ? sortDirection : '']">PAVADINIMAS</th>  
              <th>UŽIMAMAS PLOTAS</th>
              <th>GYVENTOJŲ SKAIČIUS</th>
              <th>ŠALIES TEL. KODAS</th>
              <th colspan="2" class="has-text-centered">VEIKSMAI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="country in countries.data" :key="country.attributes.name">
              <td><a :href="'/city?id=' + country.id">{{country.attributes.name}}</a></td>
              <td>{{country.attributes.area}}</td>
              <td>{{country.attributes.population}}</td>
              <td>{{country.attributes.phone_code}}</td>
              <td class="has-text-centered">
                <button class="button is-success is-small" @click="openModal(country)">Edit</button>
              </td>
              <td class="has-text-centered">
                <button class="button is-danger is-small" @click="deleteForm(country.id)">Delete</button>
              </td>
            </tr>
          </tbody>
          <patchcountry v-bind:class="{'is-active': modalActive}" v-on:close-modal="closeModal" v-on:reload-posts="getCountries" v-if="modalActive" :modalActive.sync="modalActive" :country="currCountry"></patchcountry>
        </table>
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
          <ul class="pagination-list">
            <li v-for="link in countries.meta.links">
              <button class="is button mr-4" v-on:click="changePage(link.label)">{{link.label}}</button>
            </li>
          </ul>
        </nav> 
      </div>
    </div>
  </div>    
</template>

<script>
import axios from "axios";
import patchcountry from '../components/patchcountry.vue';

export default {
  props: {
    country:{
      type: Object
    },
    id: Number,
    name: String,
    area: Number,
    population: Number,
    phone_code: String,
  },
  data() {
    return {
      countries:{
        links:{},
        meta: {
          current_page: Number,
          last_page: Number,
          from: Number,
          to: Number,
          total: Number,
          links:{
          }
        }
    },
      searchValue: '',
      modalActive: false, 
      sortBy: 'name',
      sortDirection: 'asc',
      currCountry:null,
    }
  },  
  created() {
    this.getCountries();
  },
  components: { 
    patchcountry,
  },
  methods: {
    changePage(page,current_page) {
      if (page == "Next &raquo;" && (current_page != this.countries.meta.last_page)) { //logika bloga
        this.current_page++ 
      } else if (page == "&laquo; Previous" && this.current_page != 1) {
        this.current_page--
      } else {
        this.current_page = page
      }
      this.getCountries(this.searchValue, this.current_page)
      console.log(this.current_page, this.countries.meta.last_page)
    },
    searchCountries() {
      this.current_page = 1
      this.getCountries(this.searchValue, this.current_page)
    },
    buildQuery(search, page) {
      var query = ''
      if (search) {
        query = "?search=" + search
      }
      if (page && query) {
        query += "&page=" + page
      } else if (page && !query) {
        query = "?page=" + page
      }
      return query
    },
    getCountries(searchValue, page) {
      const query = this.buildQuery(searchValue, page)
      axios
        .get(`https://akademija.teltonika.lt/countries_api/api/countries` + query)
        .then(response => (this.countries = response.data));
    },
    openModal(country) { 
      this.modalActive = true
      this.currCountry=country;
    },
    closeModal() {
      this.modalActive = false
    },
    deleteForm(id) {
      axios
        .delete(`https://akademija.teltonika.lt/countries_api/api/countries/`+ id, {
          "data":{
            "type":"countries",
            "id":'',
            "attributes":{
              "name":this.name,
              "area":this.area,
              "population":this.population,
              "phone_code":this.phone_code
            },
              "relationships":{
                "cities":{
                  "links":{
                    "related":""
                  }
                }
              }
            }
          })
        .then((response) => (console.log(response)))
        .then(alert("Country deleted"))
        .then(() => (this.$emit('reload-countries')))
        .then(() => (location.reload()))
        .catch(function (error) {
          console.log(error);            
    });
    },
    sortedCountries(){
      return this.countries.data.sort((a, b) => {
        let modifier = 1;
        if(this.sortDirection === 'desc') modifier = -1;
        if(a.attributes[this.sortBy] < b.attributes[this.sortBy]) return -1 * modifier; 
        if(a.attributes[this.sortBy] > b.attributes[this.sortBy]) return 1 * modifier;
        return 0;
      });
    },
    sort(s) {
      if(s === this.sortBy) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      }
      this.sortBy = s;
    }
  }
};
</script>

<style>
  .asc:after{
    content: "\25BC"
  }
  .desc:after{
    content: "\25B2"
  }
</style>
