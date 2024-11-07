<template>
  <div>
    <p class="m-0">Rapporto tra {{ selectedCurrencyFrom }} e {{ selectedCurrencyTo }} nell'ultimo mese :</p>
    <apexchart
      width="100%"
      height="300px"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    selectedCurrencyFrom: String,
    selectedCurrencyTo: String,
    amount: Number,
  },
  data() {
  return {
    options: {
      chart: {
        id: "vuechart-example",
      },
      xaxis: {
        type: "datetime",
        categories: [],
        labels: {
          style: {
            colors: '#FFFFFF', // Colore bianco per le etichette dell'asse X
            fontSize: '12px',   // Dimensione del font
            fontWeight: 'normal', // Peso del font
          },
          formatter: (value) => {
            const date = new Date(value);
            return new Intl.DateTimeFormat("it-IT", {
              day: "2-digit",
              month: "long",
            }).format(date);
          },
        },
        tickAmount: 15,
      },
      yaxis: {
        tickAmount: 10,
        labels: {
          style: {
            colors: '#FFFFFF', // Colore bianco per le etichette dell'asse Y
            fontSize: '12px',
            fontWeight: 'normal',
          },
        },
      },
      tooltip: {
        x: {
          formatter: (value) => {
            const date = new Date(value);
            return new Intl.DateTimeFormat("it-IT", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(date);
          },
        },
        style: {
          fontSize: '12px', // Dimensione del font del tooltip
          fontFamily: 'Arial, sans-serif', // Tipo di font
          color: '#FFFFFF', // Colore del testo del tooltip
        },
      },
      grid: {
        borderColor: '#e7e7e7', // Colore delle linee della griglia
      },
    },
    series: [
      {
        name: "Exchange Rate",
        data: [],
      },
    ],
  };
},

  mounted() {
    // Chiamata iniziale al metodo per caricare i dati del grafico
    this.fetchGraphData();
  },
  watch: {
    selectedCurrencyFrom: "fetchGraphData",
    selectedCurrencyTo: "fetchGraphData",
    amount: "fetchGraphData",
  },
  methods: {
    fetchGraphData() {
      axios
        .get(
          `https://api.frankfurter.app/2024-01-01..2024-01-31?symbols=${this.selectedCurrencyTo}&base=${this.selectedCurrencyFrom}`
        )
        .then((response) => {
          const rates = response.data.rates;
          const dates = Object.keys(rates);
          const values = dates.map((date) => rates[date][this.selectedCurrencyTo]);

          // Aggiorna i dati per il grafico
          this.series[0].data = dates.map((date, index) => ({
            x: new Date(date).getTime(),
            y: values[index],
          }));

          this.options.xaxis.categories = dates;
        })
        .catch((error) => {
          console.error("Errore durante la richiesta dei dati del grafico:", error);
        });
    },
  },
};
</script>

<style scoped>
</style>
