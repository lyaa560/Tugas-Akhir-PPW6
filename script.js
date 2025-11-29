// ====================== DUMMY WEATHER DATA ======================
const dummyWeather = {
  "Bandar Lampung": {
    current: { temp: 29, humidity: 70, wind: 12, icon: "🌤", desc: "Cerah Berawan" },
    forecast: [
      { day: "Sen", temp: 30 },
      { day: "Sel", temp: 31 },
      { day: "Rab", temp: 29 },
      { day: "Kam", temp: 28 },
      { day: "Jum", temp: 27 }
    ]
  },
  "Palembang": {
    current: { temp: 32, humidity: 75, wind: 15, icon: "☀️", desc: "Cerah" },
    forecast: [
      { day: "Sen", temp: 33 },
      { day: "Sel", temp: 34 },
      { day: "Rab", temp: 32 },
      { day: "Kam", temp: 31 },
      { day: "Jum", temp: 30 }
    ]
  },
  "Jambi": {
    current: { temp: 28, humidity: 80, wind: 10, icon: "🌧", desc: "Hujan Ringan" },
    forecast: [
      { day: "Sen", temp: 29 },
      { day: "Sel", temp: 28 },
      { day: "Rab", temp: 30 },
      { day: "Kam", temp: 29 },
      { day: "Jum", temp: 27 }
    ]
  },
  "Padang": {
    current: { temp: 27, humidity: 82, wind: 11, icon: "🌦", desc: "Gerimis" },
    forecast: [
      { day: "Sen", temp: 28 },
      { day: "Sel", temp: 27 },
      { day: "Rab", temp: 26 },
      { day: "Kam", temp: 27 },
      { day: "Jum", temp: 29 }
    ]
  },
  "Medan": {
    current: { temp: 30, humidity: 78, wind: 13, icon: "⛅", desc: "Berawan" },
    forecast: [
      { day: "Sen", temp: 31 },
      { day: "Sel", temp: 30 },
      { day: "Rab", temp: 29 },
      { day: "Kam", temp: 32 },
      { day: "Jum", temp: 33 }
    ]
  },
  "Pekanbaru": {
    current: { temp: 31, humidity: 65, wind: 14, icon: "🔥", desc: "Panas Terik" },
    forecast: [
      { day: "Sen", temp: 32 },
      { day: "Sel", temp: 33 },
      { day: "Rab", temp: 34 },
      { day: "Kam", temp: 32 },
      { day: "Jum", temp: 31 }
    ]
  }
};

// ====================== STATE ======================
let isCelsius = true;
let selectedCity = "Bandar Lampung";
let searchMode = false; // Mode pencarian
const cityList = Object.keys(dummyWeather);

// ====================== DOM ELEMENTS ======================
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearInput = document.getElementById("clearInput");
const autocompleteList = document.getElementById("autocompleteList");
const cityContainer = document.getElementById("cityContainer");
const weatherCard = document.getElementById("weatherCard");
const forecastContainer = document.getElementById("forecastContainer");
const unitToggle = document.getElementById("unitToggle");
const themeToggle = document.getElementById("themeToggle");
const refreshBtn = document.getElementById("refreshBtn");
const loading = document.getElementById("loading");

// ====================== HELPER FUNCTIONS ======================
function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9/5) + 32);
}

function getTemp(celsius) {
  return isCelsius ? `${celsius}°C` : `${celsiusToFahrenheit(celsius)}°F`;
}

function showLoading() {
  loading.classList.remove("d-none");
}

function hideLoading() {
  loading.classList.add("d-none");
}

// ====================== RENDER DASHBOARD ======================
function renderDashboard(citiesToShow = cityList) {
  cityContainer.innerHTML = "";
  
  citiesToShow.forEach(city => {
    const data = dummyWeather[city];
    const card = document.createElement("div");
    card.className = "col-md-6 col-lg-4";
    card.innerHTML = `
      <div class="city-card" onclick="selectCity('${city}')">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5>${city}</h5>
          <div class="icon">${data.current.icon}</div>
        </div>
        <div class="temp">${getTemp(data.current.temp)}</div>
        <div class="desc">${data.current.desc}</div>
        <div class="info">
          <i class="bi bi-droplet"></i> ${data.current.humidity}% • 
          <i class="bi bi-wind"></i> ${data.current.wind} km/h
        </div>
      </div>
    `;
    cityContainer.appendChild(card);
  });
}

// ====================== SELECT CITY (DETAIL VIEW) ======================
function selectCity(city) {
  selectedCity = city;
  showLoading();
  
  setTimeout(() => {
    const data = dummyWeather[city];
    
    // Show weather card
    weatherCard.classList.remove("d-none");
    
    // Update main weather card
    document.getElementById("selectedCity").textContent = city;
    document.getElementById("selectedTemp").textContent = getTemp(data.current.temp);
    document.getElementById("selectedDesc").textContent = data.current.desc;
    document.getElementById("selectedHumidity").innerHTML = `<i class="bi bi-droplet"></i> Kelembaban: ${data.current.humidity}%`;
    document.getElementById("selectedWind").innerHTML = `<i class="bi bi-wind"></i> Angin: ${data.current.wind} km/h`;
    document.getElementById("selectedIcon").textContent = data.current.icon;
    
    // Update forecast
    forecastContainer.innerHTML = "";
    data.forecast.forEach(f => {
      const forecastCard = document.createElement("div");
      forecastCard.className = "forecast-card";
      forecastCard.innerHTML = `
        <div class="day">${f.day}</div>
        <div class="temp">${getTemp(f.temp)}</div>
      `;
      forecastContainer.appendChild(forecastCard);
    });
    
    hideLoading();
    
    // Scroll to detail
    weatherCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 500);
}

// ====================== SEARCH AUTOCOMPLETE ======================
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  autocompleteList.innerHTML = "";
  
  if (!query) {
    autocompleteList.classList.remove("show");
    return;
  }
  
  const matches = cityList.filter(city => 
    city.toLowerCase().includes(query)
  );
  
  if (matches.length > 0) {
    autocompleteList.classList.add("show");
    matches.forEach(city => {
      const item = document.createElement("li");
      item.className = "list-group-item";
      item.textContent = city;
      item.onclick = () => {
        searchInput.value = city;
        autocompleteList.classList.remove("show");
        searchCity(city);
      };
      autocompleteList.appendChild(item);
    });
  } else {
    autocompleteList.classList.remove("show");
  }
});

// ====================== SEARCH CITY ======================
function searchCity(city) {
  if (cityList.includes(city)) {
    searchMode = true;
    // Tampilkan hanya kota yang dicari di dashboard
    renderDashboard([city]);
    // Tampilkan detail kota
    selectCity(city);
  } else {
    alert("Kota tidak ditemukan!");
  }
}

// Search button
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  searchCity(city);
});

// Clear input - kembali ke mode dashboard
clearInput.addEventListener("click", () => {
  searchInput.value = "";
  autocompleteList.classList.remove("show");
  searchMode = false;
  // Tampilkan kembali semua kota
  renderDashboard();
  searchInput.focus();
});

// Enter key support
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Close autocomplete when clicking outside
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
    autocompleteList.classList.remove("show");
  }
});

// ====================== UNIT TOGGLE (°C / °F) ======================
unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggle.textContent = isCelsius ? "°C" : "°F";
  
  // Re-render based on mode
  if (searchMode) {
    renderDashboard([selectedCity]);
  } else {
    renderDashboard();
  }
  
  if (!weatherCard.classList.contains("d-none")) {
    selectCity(selectedCity);
  }
});

// ====================== THEME TOGGLE ======================
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = themeToggle.querySelector("i");
  
  if (document.body.classList.contains("dark")) {
    icon.classList.remove("bi-moon");
    icon.classList.add("bi-sun");
  } else {
    icon.classList.remove("bi-sun");
    icon.classList.add("bi-moon");
  }
});

// ====================== REFRESH BUTTON ======================
refreshBtn.addEventListener("click", () => {
  showLoading();
  
  // Animate refresh icon
  const icon = refreshBtn.querySelector("i");
  icon.style.transform = "rotate(360deg)";
  icon.style.transition = "transform 0.5s";
  
  setTimeout(() => {
    icon.style.transform = "rotate(0deg)";
    
    // Refresh based on mode
    if (searchMode) {
      renderDashboard([selectedCity]);
    } else {
      renderDashboard();
    }
    
    if (!weatherCard.classList.contains("d-none")) {
      selectCity(selectedCity);
    } else {
      hideLoading();
    }
  }, 500);
});

// ====================== INITIAL LOAD ======================
document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
  selectCity("Bandar Lampung");
});