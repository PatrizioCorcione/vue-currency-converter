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
      <select
        class="form-select"
        aria-label="Dropdown select"
        v-model="selectedCurrencyEuro"
        @change="fetchExchangeRate"
      >
        <option
          v-for="(name, code) in currencies"
          :key="code"
          :value="code"
          :disabled="code === selectedCurrencyDollar"
        >
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
      <select
        class="form-select"
        aria-label="Dropdown select"
        v-model="selectedCurrencyDollar"
        @change="fetchExchangeRate"
      >
        <option
          v-for="(name, code) in currencies"
          :key="code"
          :value="code"
          :disabled="code === selectedCurrencyEuro"
        >
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
        rates: {},
        amount: 1
      },
      selectedCurrencyEuro: 'EUR',
      selectedCurrencyDollar: 'USD',
    };
  },
  mounted() {
    axios
      .get('https://api.frankfurter.app/currencies')
      .then(response => {
        this.currencies = response.data;
        console.log('Valute ricevute:', this.currencies);
        this.fetchExchangeRate();
      })
      .catch(error => {
        console.error('Errore durante la richiesta delle valute:', error);
      });
  },
  methods: {
    fetchExchangeRate() {
      if (isNaN(this.defaultcall.amount) || this.defaultcall.amount < 0) {
        console.warn('L\'importo deve essere un numero positivo.');
        return;
      }

      axios
        .get(`https://api.frankfurter.app/latest?amount=${this.defaultcall.amount}&symbols=${this.selectedCurrencyDollar}&base=${this.selectedCurrencyEuro}`)
        .then(response => {
          this.defaultcall.rates = response.data.rates;
          console.log('Tassi di cambio ricevuti:', this.defaultcall.rates);
        })
        .catch(error => {
          console.error('Errore durante la richiesta dei tassi di cambio:', error);
        });
    },
    fetchExchangeRateReverse() {
      const reverseAmount = parseFloat(this.defaultcall.rates[this.selectedCurrencyDollar]);
      if (isNaN(reverseAmount) || reverseAmount < 0) {
        console.warn('L\'importo deve essere un numero positivo.');
        return;
      }

      axios
        .get(`https://api.frankfurter.app/latest?amount=${reverseAmount}&symbols=${this.selectedCurrencyEuro}&base=${this.selectedCurrencyDollar}`)
        .then(response => {
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
