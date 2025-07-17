<template>
  <div class="flex items-center justify-center min-h-screen bg-blue-100 p-4">
    <div class="flex flex-col items-center w-full">
      <h1 class="text-3xl font-bold text-red-500 mb-4 text-center">Vue Weather App</h1>
      
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        
        <div class="relative w-full mb-4">
          <input
            v-model="city"
            @input="onInput"
            @keyup.enter="fetchWeather"
            placeholder="Enter city name"
            class="w-full p-2 border rounded-md"
          />
          <ul
            v-if="filteredCountries.length && showSuggestions"
            class="absolute top-full left-0 w-full border rounded-md shadow z-10 bg-white max-h-48 overflow-auto"
          >
            <li
              v-for="(country, index) in filteredCountries"
              :key="index"
              @click="selectSuggestion(country)"
              class="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {{ country }}
            </li>
          </ul>
        </div>

        <button
          @click="fetchWeather"
          class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Get Weather
        </button>

        <div v-if="weather" class="mt-4 text-center">
          <h2 class="text-2xl font-semibold">
            {{ weather.location.name }}, {{ weather.location.country }}
          </h2>
          <p class="text-xl">{{ weather.current.condition.text }}</p>
          <p class="text-4xl font-bold">{{ Math.round(weather.current.temp_c) }}°C</p>
        </div>
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
       countries: [
        'Afghanistan', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium',
        'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 'Finland', 'France',
        'Germany', 'Greece', 'India', 'Indonesia', 'Italy', 'Japan', 'Kenya',
        'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Pakistan', 'Poland',
        'Portugal', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea',
        'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'United Arab Emirates',
        'United Kingdom', 'United States', 'Vietnam'
      ],
      showSuggestions: false,
    };
  },

  computed: {
    filteredCountries() {
      if (!this.city) return [];
      const searchTerm = this.city.toLowerCase();
      return this.countries.filter(country =>
        country.toLowerCase().includes(searchTerm)
      );
    },
  },


  methods: {

    onInput() {
      this.showSuggestions = true;
    },

    selectSuggestion(country) {
      this.city = country;
      this.showSuggestions = false;
    },


    async fetchWeather() {
      // Check if the city is empty before making the API call
      if (!this.city) return;
      this.showSuggestions = false; // Hide suggestions after selection
      const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.city}`;
     
      try {
        const response = await axios.get(url);
        console.log('response...', response)
        this.weather = response.data;
        console.log("data..", response.data)
      } catch (error) {
        console.error(error);
        
      }
    },
  },
};

</script>

<style lang="scss" scoped>

</style>