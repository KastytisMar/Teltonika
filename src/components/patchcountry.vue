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
          <label class="name">Šalies Pavadinimas</label>
          <div class="control">
            <input
              class="input"
              type="text"
              ref="put_name"
              :placeholder=[[country.attributes.name]]
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Šalies Plotas</label>
              <input 
                class="input"
                type="number"
                ref="put_area"
                :placeholder=[[country.attributes.area]]
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="population">Populiacija</label>
              <input
                class="input"
                type="number"
                ref="put_population"
                :placeholder=[[country.attributes.population]]
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="phone_code">Šalies tel. kodas</label>
              <input 
                class="input"
                type="string"
                ref="put_phone_code"
                :placeholder=[[country.attributes.phone_code]]
              />  
          </div>
        </div>
      </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="submitForm(country.id)">Save</button> 
          <button class="button" @click="closeModal">Cancel</button>
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
    };
  },
  props: {
    country:{
      type: Object,
    }
  },
  methods: {
    getCountries() {
      axios
        .get(`https://akademija.teltonika.lt/countries_api/api/countries`)
        .then(response => (this.countries = response.data));
    },
    submitForm(id) {
      const { put_name, put_area, put_population, put_phone_code} = this.$refs;
      axios
        .put(`https://akademija.teltonika.lt/countries_api/api/countries/` +id, {
          "data":{
            "type":"countries",
            "id":id,
            "attributes":{
              "name":put_name.value,
              "area":put_area.value,
              "population":put_population.value,
              "phone_code":put_phone_code.value
            },
            "relationships":{
              "cities":{
                "links":{
                  "related":`https:\/\/akademija.teltonika.lt\/countries_api\/api\/countries\/${id}\/cities`
                }
              }
            }
          }
        })
        .then((response) => (console.log(response)))
        .then(() => (this.$emit('reload-countries')))
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