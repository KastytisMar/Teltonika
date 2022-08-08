<template>
  <div class="modal" >
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Pridėti</p>
        <button
          class="delete"
          aria-label="close"
          v-on:click="closeModal"
        ></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="country_name">Šalies Pavadinimas</label>
          <div class="control">
            <input
              class="input"
              v-model="name"
              type="text"
              placeholder="Pvz: Lietuva"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Šalies Plotas</label>
              <input 
                class="input"
                v-model="area"
                type="number"
                placeholder="Pvz: 123"
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="population">Populiacija</label>
              <input 
                class="input"
                v-model="population"
                type="number"
                placeholder="Pvz: 123"
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Šalies tel. kodas</label>
              <input 
                class="input"
                v-model="phone_code"
                type="number"
                placeholder="Pvz: 123"
              />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="submitForm">Save</button>
        <button class="button" v-on:click="closeModal">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      countries: [],
      name: '',
      area: '',
      population: '',
      phone_code: '',
    };
  },
  methods: {
    getCountries() {
      axios
        .get("https://akademija.teltonika.lt/countries_api/api/countries")
        .then(response => (this.countries = response.data));
    },
    submitForm() {
      axios
        .post("https://akademija.teltonika.lt/countries_api/api/countries", {
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
        .then(alert("Country added"))
        // .then(() => (this.$emit('reload-countries')))
        .then(() => (this.closeModal()))
        .then(() => (location.reload()))
    },
    closeModal() {
      this.resetFields()
      this.$emit('close-modal')
    },
    resetFields() {
      this.name = undefined
      this.area = undefined
      this.population = undefined
      this.phone_code = undefined
    }
  },
  created() {
    this.getCountries();
  },
};
</script>