<template>
  <div class="modal">
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
          <label class="country_name">Pavadinimas</label>
          <div class="control">
            <input
              class="input"
              v-model="name"
              type="text"
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Užimamas plotas</label>
              <input 
                class="input"
                v-model="area"
                type="number"
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="population">Gyventojų skaičius</label>
              <input 
                class="input"
                v-model="population"
                type="number"
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Pašto kodas</label>
              <input 
                class="input"
                v-model="postal_code"
                type="number"
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
      cities: [],
      name: undefined,
      area: undefined,
      population: undefined,
      postal_code: undefined,
    };
  },
  methods: {
    searchCities() {
      this.getCities(this.searchValue)
    },
    getCities(searchValue) {
      const searchQuery = searchValue ? '?search=' + searchValue : '';
      axios
        .get(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities${searchQuery}`)
        .then(response => (this.cities = response.data));
    },
    submitForm() {
      axios
        .post(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities`, {"data":{"type":"cities","id":'',"attributes":{"name":this.name,"area":this.area,"population":this.population,"postal_code":this.postal_code},"relationships":{"country":{"data":{"type":"countries","id":''}}}}})
        .then((response) => (console.log(response)))
        .then(alert("City added"))
        .then(() => (this.$emit('reload-cities')))
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
      this.postal_code = undefined
    }
  },
  created() {
    this.getCities();
  },
};
</script>