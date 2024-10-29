document.addEventListener('DOMContentLoaded', async () => {
    const countryList = document.getElementById('countries-list');
    const searchInput = document.getElementById('search-input');
    const dropdown = document.getElementById('custom-dropdown');
    const dropdownSelected = document.getElementById('dropdown-selected');
    const dropdownOptions = document.getElementById('dropdown-options');
    const dropdownOptionElements = document.querySelectorAll('.dropdown-option');

    let countries = [];

    // Fetch data from REST Countries API
    async function fetchCountries() {
        const response = await fetch('https://restcountries.com/v3.1/all');
        countries = await response.json();
        renderCountries(countries); // Initial render after data is fetched
    }

    // Function to render countries list
    function renderCountries(countryData) {
        countryList.innerHTML = '';
        countryData.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');
            countryCard.innerHTML = `
        <img src="${country.flags.png}" alt="${country.name.common} flag">

        <div class="country-info">
                <h2>${country.name.common}</h2>
        <p><span class="country-key">Population:</span> <span class="country-data">${country.population.toLocaleString()}</span></p>
        <p><span class="country-key">Region:</span> <span class="country-data">${country.region}</span></p>
        <p><span class="country-key">Capital:</span> <span class="country-data">${country.capital ? country.capital[0] : 'N/A'}</span></p>
        </div>

      `;
            countryCard.addEventListener('click', () => {
                // Redirect to country detail page
                window.location.href = `country.html?alpha3Code=${country.cca3}`;
            });
            countryList.appendChild(countryCard);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        renderCountries(filteredCountries);
    });

    // Toggle dropdown open/close
    dropdownSelected.addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });

    // Handle dropdown option selection
    dropdownOptionElements.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedRegion = e.target.getAttribute('data-value');
            dropdownSelected.innerText = e.target.innerText;
            dropdown.classList.remove('open');

            const filteredCountries = selectedRegion
                ? countries.filter(country => country.region === selectedRegion)
                : countries;
            renderCountries(filteredCountries);
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    // Fetch and render countries on load
    fetchCountries();

    const docRoot = document.documentElement;
    const themeSwitch = document.querySelector('.thme-switch');

    // Function to load theme from localStorage
    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            docRoot.classList.add('theme-dark');
        } else {
            docRoot.classList.remove('theme-dark');
        }
    }

    // Event listener for theme toggle
    themeSwitch.addEventListener('click', () => {
        docRoot.classList.toggle('theme-dark');
        const theme = docRoot.classList.contains('theme-dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme); // Save the current theme
    });

    // Load the saved theme on page load
    loadTheme();

});
