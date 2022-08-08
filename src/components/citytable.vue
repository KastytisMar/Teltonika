<template>
  <div id="app" class="container is-max-desktop">
    <div> 
      <div class="column is-flex">
            <input class="input mr-4" type="text" v-model="searchValue" placeholder="Ieškoti šalies">
            <button class="button is-info mr-4" @click="searchCities">Search</button>
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class="button" aria-haspopup="true" aria-controls="dropdown-menu"> Data filter </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item">Rikiuoti pagal datą(senesni)</a>
                <a class="dropdown-item">Rikiuoti pagal datą(naujesni)</a>
              </div>
            </div>
          </div>
        </div>  
      <div class="column">
        <table class="table is-bordered is-fullwidth">
          <thead>
            <tr>
              <th @click="sort('name'), sortedCities()" v-bind:class="[sortBy === 'name' ? sortDirection : '']">PAVADINIMAS</th>  
              <th>UŽIMAMAS PLOTAS</th>
              <th>GYVENTOJŲ SKAIČIUS</th>
              <th>PAŠTO KODAS</th>
              <th colspan="2" class="has-text-centered">VEIKSMAI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="city in cities.data"> 
              <td>{{city.attributes.name}}</td>
              <td>{{city.attributes.area}}</td>
              <td>{{city.attributes.population}}</td>
              <td>{{city.attributes.postal_code}}</td>
              <td class="has-text-centered">
                <button class="button is-success is-small" @click="openModal(city)">Edit</button>
              </td>
              <td class="has-text-centered">
                <button class="button is-danger is-small" v-on:click="deleteForm(city.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <patchcity v-bind:class="{'is-active': modalActive}" v-on:close-modal="closeModal" v-on:reload-posts="getCities" v-if="modalActive" :modalActive.sync="modalActive" :city="currCity"></patchcity>
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
          <ul class="pagination-list">
            <li v-for="link in cities.meta.links">
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
import patchcity from '../components/patchcity.vue';

export default {
  props: {
    city:{
      type: Object
    },
    id: Number,
    name: String,
    area: Number,
    population: Number,
    postal_code: String,
  },
  data() {
    return {
      cities:{
        meta:{
          links:{}
        }
      },
      searchValue: '',
      modalActive: false,
      sortBy: 'name',
      sortDirection: 'asc',
      currCity:null
    }
  },  
  created() {
    this.getCities() ;
  },
  components: {
    patchcity
  },
  methods: {
    changePage(page) {
      if (page === "Next") {
        this.current_page++
      } else if (page === "Previous" ) {
        this.current_page--
      } else {
        this.current_page = page
      }
      this.getCities(this.searchValue, this.current_page)
    },
    searchCities() {
      this.current_page = 0
      this.getCities(this.searchValue, this.current_page)
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
    getCities(searchValue, page) {
      const query = this.buildQuery(searchValue, page)
      axios
        .get(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities` + query)
        .then(response => (this.cities = response.data));
    },
    deleteForm(id) {
      axios
        .delete(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities/` + id, {
          "data":{
            "type":"cities",
            "id":'',
            "attributes":{
              "name":this.name,
              "area":this.area,
              "population":this.population,
              "postal_code":this.postal_code
            },
            "relationships":{
              "country":{
                "data":{
                  "type":"countries",
                  "id":''
                }
              }
            }
          }
        })
        .then((response) => (console.log(response)))
        .then(alert("City deleted"))
        .then(() => (this.$emit('reload-countries')))
        .then(() => (location.reload()))
        .catch(function (error) {
          console.log(error)
        })  
    },
    openModal(city) {
      this.modalActive = true
      this.currCity=city;
    },
    closeModal() {
      this.modalActive = false
    },
    sortedCities(){
      return this.cities.data.sort((a, b) => {
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
    },
    
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