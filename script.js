/// Home Page
// Call's Quote API
async function loadHome() {

  // Fetching API
  const response = await fetch("https://zenquotes.io/api/quotes/");
  const data = await response.json();

  // Declaring Quote & Author
  const quote = data[0].q;
  const author = data[0].a;

  // Setting Ellements
  document.getElementById('q-text').innerHTML = quote;
  document.getElementById('q-author').innerHTML = author;
}

/// Stock page
// Look Up Stock
async function lookUpStock(stockTicker = document.getElementById('myinput').value) {
    console.log(stockTicker);

    const today = new Date();

    const days = document.getElementById('select').value;
    console.log(days);

    // Get yesterday
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1);

    // Go 30 days before endDate
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    console.log('Today:', today, 'Start Date:', formattedStart, 'End Date:', formattedEnd);

    const api_url = `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/1/day/${formattedStart}/${formattedEnd}?adjusted=true&sort=asc&limit=120&apiKey=30d8Oubf85BgqgpptoC5h_J9lsdnOemJ`;

    const response = await fetch(api_url);
    const data = await response.json();
    getGraphData(data.results);
}

// Get Graph Data
function getGraphData(rawGraphData) {
    console.log(rawGraphData);
    let labels = [];
    let data = [];

    for (let i=0; i < rawGraphData.length; i++){
        date = new Date(rawGraphData[i].t);
        console.log(date);
        labels[i] = date.toISOString().split('T')[0];
        data[i] = rawGraphData[i].c;
    }
    graph(labels, data) 
}

let mychart;
// Graph Data
function graph(data_label, actual_data){
    console.log('Calling Graph .... s')

    document.getElementById('chart').style.display = 'block';

    const ctx = document.getElementById('mychart');

    if (mychart instanceof Chart) {
        console.log('Hello');
        mychart .destroy(); // Clean up the old chart
      }
  
    mychart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data_label,
        datasets: [{
          label: '$ Stock Price',
          data: actual_data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
}

// Load Stocks
async function loadStocks() {
    const response = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
    const jsonData = await response.json();

    const tableBody = document.getElementById("tableid"); // removed '#'

    for (let i = 0; i < 5; i++) {
        const ticker = jsonData[i].ticker;
        const comment_count = jsonData[i].no_of_comments;
        const sentiment = jsonData[i].sentiment;

        const row = document.createElement("tr");

        // Ticker with anchor tag
        const tickerCell = document.createElement("td");
        const anchor = document.createElement("a");
        anchor.href = `https://finance.yahoo.com/quote/${ticker}`;
        anchor.target = "_blank";
        anchor.textContent = ticker;
        tickerCell.appendChild(anchor);

        // Comments
        const commentCell = document.createElement("td");
        commentCell.textContent = comment_count;

        // Sentiment
        const sentimentCell = document.createElement("td");
        if(sentiment === 'Bearish'){
          const image = document.createElement('img');
          image.src = "https://media.gettyimages.com/id/1987607220/photo/bear-market-and-falling-chart.jpg?s=2048x2048&w=gi&k=20&c=H94jXchK-p5oe7UrdPEbgliab7kOrquwvRCMLfJz2QY="
          sentimentCell.append(image);
        }
        else{
          const image = document.createElement('img');
          image.src = 'https://media.gettyimages.com/id/1993983970/photo/bull-market-3d-rendered.jpg?s=2048x2048&w=gi&k=20&c=1oH-p6GaLlu8K1u4RkktRrQh86TJGe4-XQkpnp7sDis=' 
          sentimentCell.append(image);
        }

        // Add cells to row
        row.appendChild(tickerCell);
        row.appendChild(commentCell);
        row.appendChild(sentimentCell);

        // Add row to table body
        tableBody.appendChild(row);
    }
}

/// Dogs Page
// Dog Photos
if (location.pathname.endsWith("dogs.html")){
  simpleslider.getSlider(); 
}

async function loadDogs(){
  for (let i = 0; i < 10; i++){
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();

    document.getElementById(`img${i}`).src = data.message;
  }
}

// Create Dog Buttons
async function loadDogsBtns(){
  const MAX = 29;
  const MIN = 1;
  const dogButtons = document.getElementById("dog-buttons");

  for (let i = 0; i < 10; i++){

    // Getting Random Page (1-29)
    const page = Math.floor(Math.random() * (MAX - MIN)) + MIN;

    // Get Random Dog Page and Converting it to Json
    const res = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${page}`);
    const data = await res.json();

    // Getting Breed list
    const breeds = data.data;
  
    // Generating a random number from the list.
    const index = Math.floor(Math.random() * (breeds.length) - 0) + 0;

    // Getting random Dog Breed
    const breed = breeds[index];

    console.log(breed)

    // Create button
    const btn = document.createElement('button');

    // Fill Buttons
    btn.innerHTML = breed.attributes.name;
    btn.id = breed.id;
    btn.setAttribute("class", "dog-btn");

    // Add Button to Div
    dogButtons.appendChild(btn)
  }
}

// Handling Dog Buttons
if (location.pathname.endsWith("dogs.html")){
  document.getElementById("dog-buttons").addEventListener("click", async function(e) {
    if (e.target && e.target.classList.contains("dog-btn")) {
      const breedId = e.target.id;
  
      document.getElementById('breed-details').style.display = 'block';

      const res = await fetch(`https://dogapi.dog/api/v2/breeds/${breedId}`);
      const data = await res.json();
  
      document.getElementById('breed-name').innerHTML = "Breed: " + data.data.attributes.name;
      document.getElementById('breed-desc').innerHTML = "Description: " + data.data.attributes.description;
      document.getElementById('breed-min-life').innerHTML = "Min life: " + data.data.attributes.life.min;
      document.getElementById('breed-max-life').innerHTML = "Max life: " + data.data.attributes.life.max;
    }
  });
}

/// General Functions
// Audio Features
if (annyang) {
  const commands = {
    'hello': () => {
      alert('Hello world!');
    },

    'navigate to *page': (page) => {
      console.log('User said page:', page);
      if (['home', 'dogs', 'stocks'].includes(page.toLowerCase())) {
        window.location.href = `./${page.toLowerCase()}.html`;
      }
    },

    'change color to *color': (color) => {
      console.log('User said color:', color);
      document.body.style.backgroundColor = color;
    },

    'look up *stockticker': (stockticker) => {
      console.log('User said stock ticker:', stockticker);
      if (window.location.pathname.endsWith("stocks.html")) {
        document.getElementById('myinput').value = stockticker.toUpperCase();
        lookUpStock();
      }
    },

    'load dog breed *dogbreed': (dogbreed) => {
      console.log('User said dog breed:', dogbreed);
      if (window.location.pathname.endsWith("dogs.html")) {
        const buttons = document.querySelectorAll(".dog-btn");
        const targetBreed = dogbreed.toLowerCase().trim();

        buttons.forEach((btn) => {
          if (btn.innerText.toLowerCase().includes(targetBreed)) {
            btn.click();
          }
        });
      }
    }
  };

  annyang.addCommands(commands);
  annyang.start();
}



// Call correct functions on load.
window.onload = function () {
  if(location.pathname.endsWith("home.html")){
      loadHome();
  } else if(location.pathname.endsWith("stocks.html")){
      loadStocks();
  } else if(location.pathname.endsWith("dogs.html")){
      loadDogsBtns();
      loadDogs();
  }
}

