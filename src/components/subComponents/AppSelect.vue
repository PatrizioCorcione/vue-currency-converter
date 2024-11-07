<template>
  <div>
    <!-- Formatta solo l'importo in Euro -->
    <p class="m-0 text-color">{{ formattedAmount }} {{ selectedCurrencyEuro }} è uguale a :</p>

    <!-- Formatta solo il tasso di cambio in USD -->
    <h2>{{ formattedRate }} {{ selectedCurrencyDollar }}</h2>

    <!-- Input per la valuta in entrata e importo -->
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control input-bg"
        aria-label="Text input with select dropdown"
        v-model="defaultcall.amount"
        @keyup="fetchExchangeRate"
      />
      <select
        class="form-select input-bg"
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

    <!-- Input per la valuta in uscita e importo -->
    <div class="input-group mb-3">
      <input
        type="text"
        class="form-control input-bg"
        aria-label="Text input with select dropdown"
        v-model="defaultcall.rates[selectedCurrencyDollar]"
        @keyup="fetchExchangeRateReverse"
      />
      <select
        class="form-select input-bg"
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

    <!-- Componente del grafico -->
    <AppGrafic
      :selected-currency-from="selectedCurrencyEuro"
      :selected-currency-to="selectedCurrencyDollar"
      :amount="defaultcall.amount"
    />
  </div>
</template>

<script>
import axios from 'axios';
import AppGrafic from './AppGrafic.vue';

export default {
  components: {
    AppGrafic,
  },
  data() {
    return {
      currencies: {},
      defaultcall: {
        rates: {},
        amount: 1,
      },
      selectedCurrencyEuro: 'EUR', // Valuta di partenza (Euro)
      selectedCurrencyDollar: 'USD', // Valuta di destinazione (USD)
    };
  },
  mounted() {
    // Carica la lista delle valute
    axios
      .get('https://api.frankfurter.app/currencies')
      .then((response) => {
        this.currencies = response.data;
        console.log('Valute ricevute:', this.currencies);
        this.fetchExchangeRate();
      })
      .catch((error) => {
        console.error('Errore durante la richiesta delle valute:', error);
      });
  },
  methods: {
    fetchExchangeRate() {
      if (isNaN(this.defaultcall.amount) || this.defaultcall.amount < 0) {
        console.warn("L'importo deve essere un numero positivo.");
        return;
      }

      // Ottieni il tasso di cambio per la selezione corrente
      axios
        .get(
          `https://api.frankfurter.app/latest?amount=${this.defaultcall.amount}&symbols=${this.selectedCurrencyDollar}&base=${this.selectedCurrencyEuro}`
        )
        .then((response) => {
          this.defaultcall.rates = response.data.rates;
          console.log('Tassi di cambio ricevuti:', this.defaultcall.rates);
        })
        .catch((error) => {
          console.error('Errore durante la richiesta dei tassi di cambio:', error);
        });
    },

    fetchExchangeRateReverse() {
      const reverseAmount = parseFloat(this.defaultcall.rates[this.selectedCurrencyDollar]);
      if (isNaN(reverseAmount) || reverseAmount < 0) {
        console.warn("L'importo deve essere un numero positivo.");
        return;
      }

      // Ottieni il tasso di cambio inverso per la selezione corrente
      axios
        .get(
          `https://api.frankfurter.app/latest?amount=${reverseAmount}&symbols=${this.selectedCurrencyEuro}&base=${this.selectedCurrencyDollar}`
        )
        .then((response) => {
          this.defaultcall.amount = response.data.rates[this.selectedCurrencyEuro];
          console.log('Tasso di cambio inverso ricevuto:', response.data.rates);
        })
        .catch((error) => {
          console.error('Errore durante la richiesta dei tassi di cambio inverso:', error);
        });
    },
  },
  computed: {


    // Formatta solo l'importo in Euro
    formattedAmount() {
      return this.defaultcall.amount.toLocaleString('it-IT', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).replace('.', ',');
    },

    // Formatta solo il tasso di cambio in USD
    formattedRate() {
      return (this.defaultcall.rates[this.selectedCurrencyDollar] || 0)
        .toLocaleString('it-IT', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
        .replace('.', ',');
    },
  },
};
</script>

<style scoped>

</style>
