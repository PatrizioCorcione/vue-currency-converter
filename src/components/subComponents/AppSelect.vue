<template>
  <div>
    <div class="input-group mb-3">

      <input type="text" class="form-control" aria-label="Text input with select dropdown" v-model="defaultcall.amount">

      <!-- Selezione per l'Euro -->
      <select class="form-select" aria-label="Dropdown select" v-model="selectedCurrencyEuro">
        <option v-for="(name, code) in currencies" :key="code" :value="code">
          {{ name }}
        </option>
      </select>
    </div>
    <div class="input-group mb-3">

      <input type="text" class="form-control" aria-label="Text input with select dropdown" v-model="defaultcall.amount">
      <!-- Selezione per il Dollaro -->
      <select class="form-select" aria-label="Dropdown select" v-model="selectedCurrencyDollar">
        <option v-for="(name, code) in currencies" :key="code" :value="code">
          {{ name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currencies: {},
      defaultcall: {},
      selectedCurrencyEuro: 'EUR',  // Valuta predefinita per il primo select
      selectedCurrencyDollar: 'USD', // Valuta predefinita per il secondo select
    };
  },
  mounted() {
    // Prima chiamata per ottenere le valute
    axios
      .get('https://api.frankfurter.app/currencies')  // URL dell'API per le valute
      .then(response => {
        this.currencies = response.data;  // Salva i dati delle valute ricevuti
        console.log('Valute ricevute:', this.currencies);
      })
      .catch(error => {
        console.error('Errore durante la richiesta delle valute:', error);
      });

    // Seconda chiamata per ottenere i tassi di cambio
    axios
      .get('https://api.frankfurter.app/latest?amount=1&symbols=USD')  // URL per i tassi di cambio
      .then(response => {
        this.defaultcall.rates = response.data.rates;  // Salva i tassi di cambio ricevuti
        console.log('Tassi di cambio ricevuti:', this.defaultcall.rates);
      })
      .catch(error => {
        console.error('Errore durante la richiesta dei tassi di cambio:', error);
      });
  },
};
</script>

<style scoped>
</style>
