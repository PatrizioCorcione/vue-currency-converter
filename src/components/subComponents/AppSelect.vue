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
        @keyup="fetchExchangeRateReverse"
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
      // Controlla se l'importo è un numero valido
      if (isNaN(this.defaultcall.amount) || this.defaultcall.amount < 0) {
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
    fetchExchangeRateReverse() {
      // Controlla se l'importo è un numero valido
      const reverseAmount = parseFloat(this.defaultcall.rates[this.selectedCurrencyDollar]);
      if (isNaN(reverseAmount) || reverseAmount < 0) {
        console.warn('L\'importo deve essere un numero positivo.');
        return; // Esci se l'importo non è valido
      }

      // Chiamata API per ottenere il tasso di cambio con `selectedCurrencyDollar` come base
      axios
        .get(`https://api.frankfurter.app/latest?amount=${reverseAmount}&symbols=${this.selectedCurrencyEuro}&base=${this.selectedCurrencyDollar}`)
        .then(response => {
          // Aggiorna il valore del campo di input iniziale con l'importo convertito
          this.defaultcall.amount = response.data.rates[this.selectedCurrencyEuro];
          console.log('Tasso di cambio inverso ricevuto:', response.data.rates);
        })
        .catch(error => {
          console.error('Errore durante la richiesta dei tassi di cambio inverso:', error);
        });
    },
  },
};
</script>

<style scoped>
</style>
