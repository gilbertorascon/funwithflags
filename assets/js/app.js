window.addEventListener('load', () => {

    const search = document.getElementById('search');
    const filter = document.getElementById('region');

    let searchItem;

    const noResults = () => {
        document.getElementById('country_results').innerHTML = '';
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = 'No Results Found';
        document.getElementById('country_results').append(errorMessage);
    }

    const displayCountries = async (callBack) => {
        document.getElementById('country_results').innerHTML = '';
        const countries = await callBack();

        for (let country of countries) {

            const countryCard = document.createElement('div');
            countryCard.setAttribute('display', true);
            countryCard.setAttribute('region', country.region);
            countryCard.classList.add('country_wrapper', 'col-sm-6', 'col-md-4', 'col-xl-3', 'text-center');

            const countryItem = document.createElement('div');
            countryItem.classList.add('country_card', 'p-3', 'bg-white', 'border', 'shadow', 'text-center', 'rounded');

            const closeButton = document.createElement('img');
            closeButton.src = './assets/images/x-square-fill.svg';
            closeButton.classList.add('close_button');

            const countryHeading = document.createElement('p');
            countryHeading.classList.add('fw-bold');
            countryHeading.innerHTML = country.name.common;

            const countryInfo = document.createElement('div');
            countryInfo.classList.add('country_info', 'bg-white');

            const countryName = document.createElement('p');
            countryName.classList.add('my-1');
            countryName.innerHTML = `Common Name: ${country.name.common}`;

            const countryOfficialName = document.createElement('p');
            countryOfficialName.classList.add('my-1');
            countryOfficialName.innerHTML = `Official Name: ${country.name.official}`;

            const countryFlag = document.createElement('img');
            countryFlag.classList.add('flag_image', 'img-fluid', 'rounded', 'border');
            countryFlag.src = country.flags.png;
            countryFlag.alt = `The flag of ${country.name.common}.`;

            const countryCapital = document.createElement('p');
            countryCapital.classList.add('my-1');
            countryCapital.innerHTML = `Capital: ${country.capital}`;

            const countryLanguages = document.createElement('p');
            countryCapital.classList.add('my-1');

            const languagesArray = [];

            const languagesObj = country.languages;

            for (const key in languagesObj) {
                if (languagesObj.hasOwnProperty(key)) {
                    //console.log(`${key}: ${languagesObj[key]}`);
                    languagesArray.push(languagesObj[key]);
                }
            }

            countryLanguages.innerHTML = `Languages: ${languagesArray.join(', ')}`;

            const mapButton = document.createElement('a');
            mapButton.href = country.maps.googleMaps
            mapButton.target = '_blank';
            mapButton.classList.add('btn', 'btn-dark');
            mapButton.innerHTML = 'View Map';

            countryInfo.append(countryName, countryOfficialName, countryCapital, countryLanguages, mapButton)
            countryItem.append(closeButton, countryHeading, countryFlag, countryInfo);
            countryCard.append(countryItem);


            document.getElementById('country_results').append(countryCard);
        }
    }

    const countryCall = async () => {

        try {
            const url = 'https://restcountries.com/v3.1/all?fields=name,flags,region,languages,capital,maps';
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            return data;

        } catch (error) {
            console.log(error);
            return noResults();
        }
    }

    displayCountries(countryCall);

    const searchCountry = async () => {

        try {
            const url = `https://restcountries.com/v3.1/name/${searchItem}`;
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
            return data;

        } catch (error) {
            console.log(error);
            return noResults();
        }
    }

    search.addEventListener('input', (e) => {

        searchItem = e.target.value;

        if (searchItem === '') {
            filter.disabled = false;
            displayCountries(countryCall);
        } else {
            filter.value = 'All';
            filter.disabled = true;

            searchCountry();
            displayCountries(searchCountry);
        }

    });

    filter.addEventListener('change', (e) => {
        const region = e.target.value;
        console.log(region);
        const allCountries = document.querySelectorAll('.country_wrapper');
        for (let country of allCountries) {
            country.setAttribute('display', false);
            if (region === 'All') {
                for (let country of allCountries) {
                    country.setAttribute('display', true);
                }
            } else {
                if (region === country.getAttribute('region')) {
                    country.setAttribute('display', true);
                }
            }
        }

    });

    document.getElementById('country_results').addEventListener('click', (e) => {
        const card = e.target.closest('.country_card');
        const flag = e.target.closest('.flag_image');
        const closeIcon = e.target.closest('.close_button');
        if (card && (flag || closeIcon)) {
            card.classList.toggle('show_info');
        }

    });

    const topButton = document.getElementById("to_top");

    const scrollFunction = () => {
        if (document.body.scrollTop > document.getElementById('hero').offsetHeight || document.documentElement.scrollTop > document.getElementById('hero').offsetHeight) {
            topButton.style.display = "block";
        } else {
            topButton.style.display = "none";
        }
    };

    window.addEventListener('scroll', () => {
        scrollFunction();
    });
})