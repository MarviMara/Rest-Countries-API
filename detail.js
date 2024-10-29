document.addEventListener('DOMContentLoaded', async () => {
    const countryDetails = document.getElementById('country-details');
    const backButton = document.getElementById('back-btn');

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Helper function to get query parameters from the URL
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return params.get('alpha3Code');
    }

    // Fetch country details by alpha3Code
    async function fetchCountryByCode(alpha3Code) {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${alpha3Code}`);
        const data = await response.json();
        return data[0]; // The API returns an array with one country object
    }

    // Render country details
    async function renderCountryDetails(alpha3Code) {
        const country = await fetchCountryByCode(alpha3Code);

        countryDetails.innerHTML = `
        <div class='detail-page-country-image'>
            <img src="${country.flags.png}" alt="${country.name.common} flag">
        </div>

        <div class='country-dynamic-data'>
            <h2 class='country-headline'>${country.name.common}</h2>

            <div class='country-infomrmation'>
                <div>
                    <p><span class="country-key">Native Name:</span> <span class="country-data">${Object.values(country.name.nativeName || {})[0]?.common || 'N/A'}</span></p>
                    <p><span class="country-key">Population:</span> <span class="country-data">${country.population.toLocaleString()}</span></p>
                    <p><span class="country-key">Region:</span> <span class="country-data">${country.region}</span></p>
                    <p><span class="country-key">Sub Region:</span> <span class="country-data">${country.subregion}</span></p>
                    <p><span class="country-key">Capital:</span> <span class="country-data">${country.capital ? country.capital[0] : 'N/A'}</span></p>
                </div>
                <div>
                    <p><span class="country-key">Top Level Domain:</span> <span class="country-data">${country.tld ? country.tld.join(', ') : 'N/A'}</span></p>
                    <p><span class="country-key">Currencies:</span> <span class="country-data">${Object.values(country.currencies || {}).map(c => c.name).join(', ')}</span></p>
                    <p><span class="country-key">Languages:</span> <span class="country-data">${Object.values(country.languages || {}).join(', ')}</span></p>
                </div>
            </div>

            <div class ='border-container'>
                <h3>Border Countries:</h3>
                <div id="border-countries"></div>
            </div>
        </div>

    `;

        // Render border countries if they exist
        const borderCountries = document.getElementById('border-countries');
        if (country.borders && country.borders.length > 0) {
            country.borders.forEach(async (borderCode) => {
                const borderCountry = await fetchCountryByCode(borderCode);
                const borderBtn = document.createElement('button');
                borderBtn.textContent = borderCountry.name.common;
                borderBtn.addEventListener('click', () => {
                    renderCountryDetails(borderCode); // Re-render the details of the clicked border country
                });
                borderCountries.appendChild(borderBtn);
            });
        } else {
            borderCountries.textContent = 'No border countries';
        }
    }

    // Get the alpha3Code from URL and load the country details
    const alpha3Code = getQueryParams();
    if (alpha3Code) {
        renderCountryDetails(alpha3Code);
    }

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
