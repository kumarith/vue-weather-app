<template>
   <div class="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Vue Weather App</h1>
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <input
        v-model="city"
        @keyup.enter="fetchWeather"
        placeholder="Enter city name"
        class="w-full p-2 border rounded-md mb-4"
      />
      <button
        @click="fetchWeather"
        class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Get Weather
      </button>
      <div v-if="weather" class="mt-4 text-center">
        <h2 class="text-2xl font-semibold">{{ weather.location.name }}, {{ weather.location.country }}</h2>
        <p class="text-xl">{{ weather.current.condition.text }}</p>
        <p class="text-4xl font-bold">{{ Math.round(weather.current.temp_c) }}°C</p>
      </div>
    </div>
  </div>
</template>

<script >
import axios from 'axios';
export default {
  data() {
    return {
      city: '',
      weather: null,
    };
  },



  methods: {
    async fetchWeather() {
      if (!this.city) return;
      const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
     

      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.city}`;
     
      try {
        const response = await axios.get(url);
        console.log('response...', response)
        this.weather = response.data;
        console.log("data..", data)
      } catch (error) {
        console.error(error);
        
      }
    },
  },
};

</script>

<style lang="scss" scoped>

</style>