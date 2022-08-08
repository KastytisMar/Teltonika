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
              type="text"
              ref="put_name"
              :placeholder=[[city.attributes.name]]
            />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Užimamas plotas</label>
              <input 
                class="input"
                type="number"
                ref="put_area"
                :placeholder=[[city.attributes.area]]
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="population">Gyventojų skaičius</label>
              <input 
                class="input"
                ref="put_population"
                type="number"
                :placeholder=[[city.attributes.population]]
              />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <label class="area">Pašto kodas</label>
              <input 
                class="input"
                type="string"
                ref="put_postal_code"
                :placeholder=[[city.attributes.postal_code]]
              />
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" v-on:click="submitForm(city.id)">Save</button>
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
      cities: {
        meta: {
          links:{}
        }
      },
    };
  },
  props: {
    city:{
      type: Object
    }
  },
  methods: {
    getCities() {
      axios
        .get(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities`)
        .then(response => (this.cities = response.data));
    },
    submitForm(id) {
      const { put_name, put_area, put_population, put_postal_code} = this.$refs;
      axios
        .put(`https://akademija.teltonika.lt/countries_api/api/countries/${this.$route.query.id}/cities/` +id, {
          "data":{
            "type":"cities",
            "id":id,
            "attributes":{
              "name":put_name.value,
              "area":put_area.value,
              "population":put_population.value,
              "postal_code":put_postal_code.value
            },
            "relationships":{
              "country":{
                "data":{
                  "type":"countries",
                  "id":this.$route.query.id
                }
              }
            }
          }
        })
        .then((response) => (console.log(response)))
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
      this.phone_code = undefined
    }
  },
  created() {
    this.getCities();
  },
};
</script>