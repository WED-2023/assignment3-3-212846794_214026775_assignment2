<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white p-8 rounded shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>

      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block font-medium">Username</label>
          <input v-model="form.username" type="text" class="input" :class="{ 'border-red-500': errors.username }" required />
          <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>
        </div>

        <div class="mb-4">
          <label class="block font-medium">First Name</label>
          <input v-model="form.firstName" type="text" class="input" :class="{ 'border-red-500': errors.firstName }" required />
          <span v-if="errors.firstName" class="text-red-500 text-sm">{{ errors.firstName }}</span>
        </div>

        <div class="mb-4">
          <label class="block font-medium">Last Name</label>
          <input v-model="form.lastName" type="text" class="input" :class="{ 'border-red-500': errors.lastName }" required />
          <span v-if="errors.lastName" class="text-red-500 text-sm">{{ errors.lastName }}</span>
        </div>

        <div class="mb-4">
          <label class="block font-medium">Country</label>
          <div class="relative">
            <input
              v-model="countrySearch"
              type="text"
              class="input"
              :class="{ 'border-red-500': errors.country }"
              placeholder="Search for a country..."
              @focus="showCountryDropdown = true"
              @input="filterCountries"
              required
            />
            <div v-if="showCountryDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div
                v-for="country in filteredCountries"
                :key="country"
                @click="selectCountry(country)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {{ country }}
              </div>
              <div v-if="filteredCountries.length === 0" class="px-4 py-2 text-gray-500">
                No countries found
              </div>
            </div>
          </div>
          <div v-if="form.country" class="mt-2 text-sm text-gray-600">
            Selected: {{ form.country }}
          </div>
          <span v-if="errors.country" class="text-red-500 text-sm">{{ errors.country }}</span>
        </div>

        <div class="mb-4">
          <label class="block font-medium">Email</label>
          <input v-model="form.email" type="email" class="input" :class="{ 'border-red-500': errors.email }" required />
          <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
        </div>

        <div class="mb-4 relative">
          <label class="block font-medium">Password</label>
          <input :type="showPassword ? 'text' : 'password'" v-model="form.password" class="input" :class="{ 'border-red-500': errors.password }" required />
          <span @click="showPassword = !showPassword" class="absolute right-2 top-8 text-sm cursor-pointer">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>

        <div class="mb-4 relative">
          <label class="block font-medium">Confirm Password</label>
          <input :type="showPassword ? 'text' : 'password'" v-model="form.confirmPassword" class="input" :class="{ 'border-red-500': errors.confirmPassword }" required />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
        </div>

        <div v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</div>

        <button type="submit" class="w-full bg-[#46a080] hover:bg-[#358168] text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { auth } from "@/services/api";
import router from "@/router";

export default {
  name: "RegisterPage",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {
        username: "",
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      countries: [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
        "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
        "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
        "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
        "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo",
        "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
        "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
        "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
        "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
        "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
        "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
        "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
        "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
        "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
        "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
      ],
      filteredCountries: [],
      countrySearch: "",
      showCountryDropdown: false,
      showPassword: false,
      error: ""
    };
  },
  async mounted() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
      this.countries = data.map(c => c.name.common).sort();
      }
    } catch (e) {
      console.error("Failed to load countries from API:", e);
      // We'll use the fallback list of countries that's already in data()
    }
    
    this.filteredCountries = [...this.countries];

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.showCountryDropdown = false;
      }
    });
  },
  methods: {
    filterCountries() {
      if (!this.countrySearch) {
        this.filteredCountries = [...this.countries];
        return;
      }
      const search = this.countrySearch.toLowerCase();
      this.filteredCountries = this.countries.filter(country => 
        country.toLowerCase().includes(search)
      );
    },
    selectCountry(country) {
      this.form.country = country;
      this.countrySearch = country;
      this.showCountryDropdown = false;
    },
    validateForm() {
      this.errors = {
        username: "",
        firstName: "",
        lastName: "",
        country: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
      let isValid = true;

      // Username validation
      if (!this.form.username) {
        this.errors.username = "Username is required";
        isValid = false;
      } else if (!/^[A-Za-z]{3,8}$/.test(this.form.username)) {
        this.errors.username = "Username must be 3–8 letters only";
        isValid = false;
      }

      // First Name validation
      if (!this.form.firstName) {
        this.errors.firstName = "First name is required";
        isValid = false;
      }

      // Last Name validation
      if (!this.form.lastName) {
        this.errors.lastName = "Last name is required";
        isValid = false;
      }

      // Country validation
      if (!this.form.country) {
        this.errors.country = "Country is required";
        isValid = false;
      }

      // Email validation
      if (!this.form.email) {
        this.errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = "Please enter a valid email address";
        isValid = false;
      }

      // Password validation
      if (!this.form.password) {
        this.errors.password = "Password is required";
        isValid = false;
      } else if (
        this.form.password.length < 5 ||
        this.form.password.length > 10 ||
        !/\d/.test(this.form.password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(this.form.password)
      ) {
        this.errors.password = "Password must be 5–10 characters, include a number and a special character";
        isValid = false;
      }

      // Confirm Password validation
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }

      return isValid;
    },
    async submitForm() {
      this.error = "";
      
      if (!this.validateForm()) {
        return;
      }

      try {
        // Transform the data to match backend expectations
        const registerData = {
          username: this.form.username,
          password: this.form.password,
          confirmPassword: this.form.confirmPassword,
          firstname: this.form.firstName,
          lastname: this.form.lastName,
          country: this.form.country,
          email: this.form.email
        };

        console.log('Sending registration data:', registerData);
        const response = await auth.register(registerData);
        console.log('Registration response:', response);
        router.push("/login");
      } catch (e) {
        console.error("Registration failed:", e);
        if (e.response) {
          console.error("Error response:", e.response.data);
          this.error = e.response.data.message || "Registration failed";
        } else {
          this.error = "Registration failed. Please try again.";
        }
      }
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
