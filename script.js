const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsContainer = document.getElementById("results");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

async function getTravelData() {
  const response = await fetch("travel_recommendation_api.json");
  const data = await response.json();
  return data;
}

function createDestinationCard(destination) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <img src="${destination.imageUrl}" alt="${destination.name}">
    <div class="card-content">
      <h3>${destination.name}</h3>
      <p>${destination.description}</p>
    </div>
  `;

  return card;
}

function displayRecommendations(recommendations) {
  resultsContainer.innerHTML = "";

  if (recommendations.length === 0) {
    resultsContainer.innerHTML = `
      <p>No se encontraron recomendaciones. Intenta con: playa, templo, Japón, Italia o Brasil.</p>
    `;
    return;
  }

  recommendations.forEach(destination => {
    resultsContainer.appendChild(createDestinationCard(destination));
  });
}

async function searchRecommendations() {
  const query = searchInput.value.toLowerCase().trim();

  if (!query) {
    resultsContainer.innerHTML = "<p>Escribe una palabra clave para buscar recomendaciones.</p>";
    return;
  }

  const data = await getTravelData();
  let recommendations = [];

  const beachKeywords = ["beach", "beaches", "playa", "playas"];
  const templeKeywords = ["temple", "temples", "templo", "templos"];

  if (beachKeywords.some(keyword => query.includes(keyword))) {
    recommendations = data.beaches;
  } else if (templeKeywords.some(keyword => query.includes(keyword))) {
    recommendations = data.temples;
  } else {
    data.countries.forEach(country => {
      const countryName = country.name.toLowerCase();
      const cityMatches = country.cities.filter(city => city.name.toLowerCase().includes(query));

      if (query.includes(countryName) || countryName.includes(query)) {
        recommendations = recommendations.concat(country.cities);
      }

      if (cityMatches.length > 0) {
        recommendations = recommendations.concat(cityMatches);
      }
    });
  }

  displayRecommendations(recommendations);
}

function clearResults() {
  if (searchInput) searchInput.value = "";
  if (resultsContainer) resultsContainer.innerHTML = "";
}

if (searchBtn) {
  searchBtn.addEventListener("click", searchRecommendations);
}

if (clearBtn) {
  clearBtn.addEventListener("click", clearResults);
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      searchRecommendations();
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    formMessage.textContent = "Gracias por contactarnos. Tu mensaje fue enviado correctamente.";
    contactForm.reset();
  });
}
