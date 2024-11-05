<template>
  <div>
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        aria-label="Text input with select dropdown"
        v-model="defaultcall.amount"
        @keyup="fetchExchangeRate"
      />
      <!-- Selezione per l'Euro -->
      <select class="form-select" aria-label="Dropdown select" v-model="selectedCurrencyEuro" @change="fetchExchangeRate">
        <option v-for="(name, code) in currencies" :key="code" :value="code">
          {{ name }}
        </option>
      </select>
    </div>
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control"
        aria-label="Text input with select dropdown"
        v-model="defaultcall.rates[selectedCurrencyDollar]"
        @keyup="fetchExchangeRate"
      />
      <!-- Selezione per il Dollaro -->
      <select class="form-select" aria-label="Dropdown select" v-model="selectedCurrencyDollar" @change="fetchExchangeRate">
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
      defaultcall: {
        rates: {}, // Inizializza rates come un oggetto vuoto
        amount: 1 // Puoi impostare un valore predefinito se necessario
      },
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
        // Chiamata iniziale per ottenere i tassi di cambio
        this.fetchExchangeRate();
      })
      .catch(error => {
        console.error('Errore durante la richiesta delle valute:', error);
      });
  },
  methods: {
    fetchExchangeRate() {
      // Controlla se l'importo è un numero valido prima di procedere
      if (isNaN(this.defaultcall.amount) || this.defaultcall.amount <= 0) {
        console.warn('L\'importo deve essere un numero positivo.');
        return; // Esci se l'importo non è valido
      }

      // Fai la chiamata API per ottenere il tasso di cambio
      axios
        .get(`https://api.frankfurter.app/latest?amount=${this.defaultcall.amount}&symbols=${this.selectedCurrencyDollar}&base=${this.selectedCurrencyEuro}`)
        .then(response => {
          this.defaultcall.rates = response.data.rates; // Aggiorna i tassi di cambio
          console.log('Tassi di cambio ricevuti:', this.defaultcall.rates);
        })
        .catch(error => {
          console.error('Errore durante la richiesta dei tassi di cambio:', error);
        });
    },
  },
};
</script>

<style scoped>
</style>
