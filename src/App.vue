<template>
  <div :class="backgroundClass"
    class="flex items-center justify-center min-h-screen p-4 transition-colors duration-500">
    <div class="flex flex-col items-center w-full">

      <h1 :class="headingColor" class="text-4xl font-extrabold mb-6 text-center transition-colors duration-500">
        {{ weatherEmoji }} SkyWatch
      </h1>

      <div class="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">

        <div class="relative w-full mb-4">
          <input v-model="city" @input="onInput" @keydown.down.prevent="highlightNext"
            @keydown.up.prevent="highlightPrev" @keyup.enter="selectOrFetch" placeholder="Enter city name"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            role="combobox" :aria-expanded="showSuggestions ? 'true' : 'false'" aria-haspopup="listbox"
            aria-autocomplete="list" aria-owns="suggestions-list" />

          <ul v-if="filteredCities.length && showSuggestions"
            class="absolute top-full left-0 w-full border rounded-md shadow-lg z-10 bg-white max-h-48 overflow-auto"
            role="listbox" aria-label="City suggestions">
            <li v-for="(c, index) in filteredCities" :key="index" @click="selectSuggestion(c)"
              :class="['p-2 cursor-pointer', index === highlightedIndex ? 'bg-blue-200' : 'hover:bg-blue-100']"
              role="option" :aria-selected="city === c ? 'true' : 'false'">
              {{ c }}
            </li>
          </ul>
        </div>


        <p v-if="errorMessage" class="text-red-500 mb-2 text-sm" role="alert">
          {{ errorMessage }}
        </p>


        <button @click="fetchWeather"
          class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
          Get Weather
        </button>

        <!-- Weather display -->
        <div v-if="weather" class="mt-6 text-center" role="region" aria-live="polite">
          <h2 class="text-2xl font-semibold mb-2">
            {{ weather.location.name }}, {{ weather.location.country }}
          </h2>

          <div class="flex items-center justify-center mb-2 space-x-2">
            <img :src="weather.current.condition.icon" :alt="weather.current.condition.text" class="w-12 h-12" />
            <p class="text-xl font-medium">{{ weather.current.condition.text }}</p>
          </div>

          <p class="text-5xl font-bold text-blue-700">
            {{ Math.round(weather.current.temp_c) }}°C |
            {{ Math.round(weather.current.temp_f) }}°F
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import localCities from './data/cities.json'; // fallback local city list

export default {
  data() {
    return {
      city: '',
      filteredCities: [],
      weather: null,
      showSuggestions: false,
      errorMessage: '',
      weatherEmoji: '☀️',
      headingColor: 'text-yellow-500',
      backgroundClass: 'bg-gradient-to-b from-blue-200 via-blue-100 to-white',
      highlightedIndex: -1,
      debounceTimer: null,
      cityCache: {} // cache for API results
    };
  },
  methods: {
    onInput() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.fetchCities();
      }, 700); // 700ms debounce to avoid 429
    },

    async fetchCities() {
      const prefix = this.city.trim().toLowerCase();
      if (!prefix) {
        this.filteredCities = [];
        return;
      }

      // Use cached results if available
      if (this.cityCache[prefix]) {
        this.filteredCities = this.cityCache[prefix];
        this.showSuggestions = true;
        return;
      }

      try {
        // API call to GeoDB Cities
        const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
          params: { namePrefix: prefix, limit: 5 },
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          }
        });

        const cities = response.data.data.map(city => city.city);

        if (cities.length === 0) {
          // fallback to local cities if API returns nothing
          const fallback = localCities.filter(c => c.toLowerCase().startsWith(prefix)).slice(0, 5);
          this.filteredCities = fallback;
        } else {
          this.filteredCities = cities;
          this.cityCache[prefix] = cities; // cache results
        }

        this.showSuggestions = true;

      } catch (err) {
        console.error('Error fetching cities:', err);
        // fallback to local cities on API error
        this.filteredCities = localCities.filter(c => c.toLowerCase().startsWith(prefix)).slice(0, 5);
        this.showSuggestions = true;
      }
    },

    highlightNext() {
      if (!this.filteredCities.length) return;
      this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredCities.length;
    },

    highlightPrev() {
      if (!this.filteredCities.length) return;
      this.highlightedIndex = (this.highlightedIndex - 1 + this.filteredCities.length) % this.filteredCities.length;
    },

    selectOrFetch() {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredCities.length) {
        this.selectSuggestion(this.filteredCities[this.highlightedIndex]);
      }
      this.fetchWeather();
      this.highlightedIndex = -1;
    },

    selectSuggestion(cityName) {
      this.city = cityName;
      this.showSuggestions = false;
      this.filteredCities = [];
      this.highlightedIndex = -1;
    },

    async fetchWeather() {
      if (!this.city.trim() && this.filteredCities.length) {
        this.city = this.filteredCities[0];
      }

      if (!this.city.trim()) {
        this.errorMessage = "Please enter a city name";
        this.weather = null;
        return;
      }

      this.errorMessage = '';
      this.showSuggestions = false;

      const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.city}`;

      try {
        const response = await axios.get(url);
        this.weather = response.data;
        this.city = '';
        this.updateWeatherVisuals();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errorMessage = "City not found. Please check the spelling.";
        } else {
          this.errorMessage = "Could not fetch weather data. Please try again.";
        }
      }
    },

    updateWeatherVisuals() {
      if (!this.weather) return;
      const condition = this.weather.current.condition.text.toLowerCase();

      if (condition.includes('rain')) {
        this.weatherEmoji = '🌧';
        this.headingColor = 'text-blue-600';
        this.backgroundClass = 'bg-gradient-to-b from-blue-300 via-blue-200 to-blue-100';
      } else if (condition.includes('cloud')) {
        this.weatherEmoji = '⛅';
        this.headingColor = 'text-gray-700';
        this.backgroundClass = 'bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100';
      } else if (condition.includes('sun') || condition.includes('clear')) {
        this.weatherEmoji = '☀️';
        this.headingColor = 'text-yellow-500';
        this.backgroundClass = 'bg-gradient-to-b from-yellow-200 via-yellow-100 to-white';
      } else {
        this.weatherEmoji = '🌤';
        this.headingColor = 'text-teal-500';
        this.backgroundClass = 'bg-gradient-to-b from-blue-200 via-blue-100 to-white';
      }
    }
  }
};
</script>
