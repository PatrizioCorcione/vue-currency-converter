<!-- AppMain.vue -->
<template>
  <div class="container-cust p-3">
    <h1 class="text-center">CURRENCY BOOLVERTER</h1>
    <AppSelect/>
  </div>
</template>

<script>
import AppSelect from './subComponents/AppSelect.vue';

export default {
  components: {
    AppSelect,
  },
};
</script>

<style scoped>
.container-cust{
  margin: 0 auto;
  width: 80%;
  border: 3px solid royalblue;
  border-radius: 5px;
}
h1{
  color: rgb(48, 92, 225);
  font-weight: bold;
}
</style>
