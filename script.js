window.addEventListener('load', function(){
    let filmData;
    mainElement =  document.querySelector('main');
    let navLinks = document.querySelectorAll('#mainnav ul li a');
    let dataSet = 'films';
    let url = `https://ghibliapi.herokuapp.com/films`

    //getting the tab info
    navLinks.forEach(function (element){
        element.addEventListener('click', function(event){
            event.preventDefault();
            let thisLink = event.target.getAttribute('href').substring(1);
            dataSet = thisLink;
            url = `https://ghibliapi.herokuapp.com/` + dataSet;
            getInfo(url);
        });
    });

    //send request and receive data from endpoint using Fetch API
    async function getInfo(url){
        const dataPromise = await fetch(url);
        const data = await dataPromise.json();

        if (dataSet === 'films'){
            mainElement.innerHTML = '';
            document.getElementById('sortorder').style.display = '';
            setSort(data);
            addCards(data);
            filmData = data;
            document.getElementById('sortorder').removeAttribute('disabled');
        } else {
            mainElement.innerHTML = '';
            addCards(data);
            peopleData = data;
            document.getElementById('sortorder').style.display = 'none';
        }
    }

    getInfo(url);

    //sorting for 'Films' tab
    document.getElementById('sortorder').addEventListener('change', () => {
        document.querySelector('main').innerHTML = '';
        setSort(filmData);
        addCards(filmData);
    });

    //sorting function
    function setSort(array){
        let sorted = document.getElementById('sortorder').value;
        switch (sorted) {
            case 'title': {
                array.sort((someElement,someNextElem) => {
                    return ((someElement.title > someNextElem.title) ? 1 : -1);
                }); 
                break;
            }
            case 'release_date': {
                array.sort((someElement,someNextElem) => {
                    return ((someElement.release_date > someNextElem.release_date) ? 1 : -1);
                });
                break;
            }
            case 'rt_score': {
                array.sort((someElement,someNextElem) => {
                    return ((parseInt(someElement.rt_score) < parseInt(someNextElem.rt_score)) ? 1 : -1);
                }); 
                break;
            }
        }
    }

    //adding cards to <main>
    function addCards(array){
        array.forEach((element) => {
            createCard(element);
        });
    }

    //function to create cards of 5 types for different tabs
    async function createCard(data){
        const card = document.createElement('article');
        switch (dataSet) {
            case 'films': card.innerHTML = filmCardContent(data);break;
            case 'people': card.innerHTML = await peopleCardContent(data);break;
            case 'locations': card.innerHTML = await locationCardContent(data);break;
            case 'species': card.innerHTML = await speciesCardContent(data);break;
            case 'vehicles': card.innerHTML = await vehiclesCardContent(data);break;
        }
        mainElement.appendChild(card);
    }

    //film card creation
    function filmCardContent(data){
        let html = `<h2>${data.title}</h2>`;
        html += `<p><strong>Director: </strong>${data.director}</p>`;
        html += `<p><strong>Year: </strong>${data.release_date}</p>`;
        html += `<p><strong>Description: </strong>${data.description}</p>`;
        html += `<p><strong>RT Score: </strong>${data.rt_score}</p>`;
        return html;
    }

    //getting array of data for some key
    async function individItem(url, item){
        const itemPromise = await fetch(url);
        const data = await itemPromise.json();
        return data[item];
    }

    //people card creation
    async function peopleCardContent(data){
        const thefilms = data.films;
        let filmTitles = [];
        for (eachFilm of thefilms){
            const filmTitle = await individItem(eachFilm, 'title');
            filmTitles.push(filmTitle);
        }
        const species = await individItem(data.species, 'name');
        let html = `<h2>${data.name}</h2>`;
        html += `<p><strong>Details: </strong> gender ${data.gender}, age ${data.age}, eye color ${data.eye_color}, hair color ${data.hair_color}</p>`;
        html += `<p><strong>Species: </strong>${species}</p>`;
        html += `<p><strong>Films: </strong>${filmTitles}</p>`;
        return html;
    }

    //location card creation
    async function locationCardContent(data){
        const regex = 'https?:\/\/';
        const residents = data.residents;
        let theResidents = [];
        for (eachResident of residents){
            if (eachResident.match(regex)){
                const resName = await individItem(eachResident, 'name');
                theResidents.push(resName);
            } else {
                theResidents[0] = 'no data';
            }
        }

        const thefilms = data.films;
        let filmTitles = [];
        for (eachFilm of thefilms){
            const filmTitle = await individItem(eachFilm, 'title');
            filmTitles.push(filmTitle);
        }

        let climate = data.climate;
        if (climate == 'TODO'){
            climate = 'No data';
        }

        let terrain = data.terrain;
        if (terrain == 'TODO'){
            terrain = 'No data';
        }
        
        let html = `<h2>${data.name}</h2>`;
        html += `<p><strong>Details: </strong> climate ${climate}, terrain ${terrain}, surface water ${data.surface_water}%</p>`;
        html += `<p><strong>Residents: </strong>${theResidents.join(', ')}</p>`;
        html += `<p><strong>Films: </strong>${filmTitles.join(', ')}</p>`;
        return html;
    }

    //species card creation
    async function speciesCardContent(data){
        const thefilms = data.films;
        let filmTitles = [];
        for (eachFilm of thefilms){
            const filmTitle = await individItem(eachFilm, 'title');
            filmTitles.push(filmTitle);
        }
        
        let html = `<h2>${data.name}</h2>`;
        html += `<p><strong>Classification: </strong>${data.classification}</p>`;
        html += `<p><strong>Details: </strong> eye color ${data.eye_colors}, hair color ${data.hair_colors}</p>`;
        html += `<p><strong>Films: </strong>${filmTitles.join(', ')}</p>`;
        return html;
    }

    //vehicles card creation
    async function vehiclesCardContent(data){
        const thefilms = data.films;
        let filmTitles = [];
        for (eachFilm of thefilms){
            const filmTitle = await individItem(eachFilm, 'title');
            filmTitles.push(filmTitle);
        }
        
        const pilots = await individItem(data.pilot, 'name');
        let html = `<h2>${data.name}</h2>`;
        html += `<p><strong>Vehicle class: </strong>${data.vehicle_class}</p>`;
        html += `<p><strong>Description: </strong>${data.description}</p>`;
        html += `<p><strong>Pilot: </strong>${pilots}</p>`;
        html += `<p><strong>Films: </strong>${filmTitles.join(', ')}</p>`;
        return html;
    }

});