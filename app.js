const app = document.querySelector("#app");
const appShell = document.querySelector("#app-shell");
const faviconLink = document.querySelector("#app-favicon");
const themeColorMeta = document.querySelector("#theme-color-meta");
const LAST_SEARCH_STORAGE_KEY = "jinan_weather_last_city";
const DEFAULT_CITY = "서울";

const elements = {
  cityName: document.querySelector("#city-name"),
  cityPrimary: document.querySelector("#city-primary"),
  citySecondary: document.querySelector("#city-secondary"),
  locationBadge: document.querySelector("#location-badge"),
  dateText: document.querySelector("#date-text"),
  compareSummaryYesterdayToday: document.querySelector("#compare-summary-yesterday-today"),
  compareSummaryTodayTomorrow: document.querySelector("#compare-summary-today-tomorrow"),
  tempDeltaYesterdayToday: document.querySelector("#temp-delta-yesterday-today"),
  tempDeltaTodayTomorrow: document.querySelector("#temp-delta-today-tomorrow"),
  rainDeltaTodayTomorrow: document.querySelector("#rain-delta-today-tomorrow"),
  yesterdayCondition: document.querySelector("#yesterday-condition"),
  yesterdayTemp: document.querySelector("#yesterday-temp"),
  yesterdayIcon: document.querySelector("#yesterday-icon"),
  yesterdayRange: document.querySelector("#yesterday-range"),
  yesterdayFeelsLike: document.querySelector("#yesterday-feels-like"),
  yesterdayPrecipitation: document.querySelector("#yesterday-precipitation"),
  yesterdayHumidity: document.querySelector("#yesterday-humidity"),
  yesterdayWindSpeed: document.querySelector("#yesterday-wind-speed"),
  yesterdayUvIndex: document.querySelector("#yesterday-uv-index"),
  yesterdayVisibility: document.querySelector("#yesterday-visibility"),
  conditionText: document.querySelector("#condition-text"),
  currentTemp: document.querySelector("#current-temp"),
  currentIcon: document.querySelector("#current-icon"),
  tempRange: document.querySelector("#temp-range"),
  tomorrowCondition: document.querySelector("#tomorrow-condition"),
  tomorrowTemp: document.querySelector("#tomorrow-temp"),
  tomorrowIcon: document.querySelector("#tomorrow-icon"),
  tomorrowRange: document.querySelector("#tomorrow-range"),
  feelsLike: document.querySelector("#feels-like"),
  tomorrowFeelsLike: document.querySelector("#tomorrow-feels-like"),
  feelsCompareText: document.querySelector("#feels-compare-text"),
  precipitation: document.querySelector("#precipitation"),
  tomorrowPrecipitation: document.querySelector("#tomorrow-precipitation"),
  rainCompareText: document.querySelector("#rain-compare-text"),
  humidity: document.querySelector("#humidity"),
  tomorrowHumidity: document.querySelector("#tomorrow-humidity"),
  humidityText: document.querySelector("#humidity-text"),
  yesterdayPm10: document.querySelector("#yesterday-pm10"),
  pm10: document.querySelector("#pm10"),
  tomorrowPm10: document.querySelector("#tomorrow-pm10"),
  pm10Text: document.querySelector("#pm10-text"),
  windSpeed: document.querySelector("#wind-speed"),
  tomorrowWindSpeed: document.querySelector("#tomorrow-wind-speed"),
  windText: document.querySelector("#wind-text"),
  uvIndex: document.querySelector("#uv-index"),
  tomorrowUvIndex: document.querySelector("#tomorrow-uv-index"),
  uvText: document.querySelector("#uv-text"),
  visibility: document.querySelector("#visibility"),
  tomorrowVisibility: document.querySelector("#tomorrow-visibility"),
  visibilityText: document.querySelector("#visibility-text"),
  hourlyList: document.querySelector("#hourly-list"),
  dailyList: document.querySelector("#daily-list"),
  tabCaption: document.querySelector("#tab-caption"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  tabPanels: Array.from(document.querySelectorAll(".tab-panel")),
  searchToggle: document.querySelector("#search-toggle"),
  toast: document.querySelector("#toast"),
  searchForm: document.querySelector("#search-form"),
  cityInput: document.querySelector("#city-input"),
  geoButton: document.querySelector("#geo-button"),
  hourlyTemplate: document.querySelector("#hourly-item-template"),
  dailyTemplate: document.querySelector("#daily-item-template"),
};

let toastTimer = null;

const CITY_QUERY_ALIASES = {
  서울: ["서울특별시", "서울", "Seoul"],
  seoul: ["서울", "서울특별시", "Seoul"],
  부산: ["부산광역시", "Busan"],
  busan: ["부산", "부산광역시", "Busan"],
  대구: ["대구광역시", "Daegu"],
  daegu: ["대구", "대구광역시", "Daegu"],
  인천: ["인천광역시", "Incheon"],
  incheon: ["인천", "인천광역시", "Incheon"],
  광주: ["광주광역시", "Gwangju"],
  gwangju: ["광주", "광주광역시", "Gwangju"],
  대전: ["대전광역시", "Daejeon"],
  daejeon: ["대전", "대전광역시", "Daejeon"],
  울산: ["울산광역시", "Ulsan"],
  ulsan: ["울산", "울산광역시", "Ulsan"],
  세종: ["세종특별자치시", "Sejong"],
  sejong: ["세종", "세종특별자치시", "Sejong"],
  제주: ["제주특별자치도", "Jeju"],
  제주도: ["제주특별자치도", "Jeju"],
  jeju: ["제주", "제주특별자치도", "Jeju"],
  경기: ["경기도", "Gyeonggi-do"],
  강원: ["강원특별자치도", "Gangwon-do"],
  충북: ["충청북도", "Chungcheongbuk-do"],
  충남: ["충청남도", "Chungcheongnam-do"],
  전북: ["전북특별자치도", "Jeollabuk-do"],
  전남: ["전라남도", "Jeollanam-do"],
  경북: ["경상북도", "Gyeongsangbuk-do"],
  경남: ["경상남도", "Gyeongsangnam-do"],
};

const KNOWN_KOREAN_LOCATIONS = {
  서울: { name: "서울", admin1: "서울특별시", country: "대한민국", latitude: 37.5665, longitude: 126.978 },
  seoul: { name: "서울", admin1: "서울특별시", country: "대한민국", latitude: 37.5665, longitude: 126.978 },
  부산: { name: "부산", admin1: "부산광역시", country: "대한민국", latitude: 35.1796, longitude: 129.0756 },
  busan: { name: "부산", admin1: "부산광역시", country: "대한민국", latitude: 35.1796, longitude: 129.0756 },
  대구: { name: "대구", admin1: "대구광역시", country: "대한민국", latitude: 35.8714, longitude: 128.6014 },
  daegu: { name: "대구", admin1: "대구광역시", country: "대한민국", latitude: 35.8714, longitude: 128.6014 },
  인천: { name: "인천", admin1: "인천광역시", country: "대한민국", latitude: 37.4563, longitude: 126.7052 },
  incheon: { name: "인천", admin1: "인천광역시", country: "대한민국", latitude: 37.4563, longitude: 126.7052 },
  광주: { name: "광주", admin1: "광주광역시", country: "대한민국", latitude: 35.1595, longitude: 126.8526 },
  gwangju: { name: "광주", admin1: "광주광역시", country: "대한민국", latitude: 35.1595, longitude: 126.8526 },
  대전: { name: "대전", admin1: "대전광역시", country: "대한민국", latitude: 36.3504, longitude: 127.3845 },
  daejeon: { name: "대전", admin1: "대전광역시", country: "대한민국", latitude: 36.3504, longitude: 127.3845 },
  울산: { name: "울산", admin1: "울산광역시", country: "대한민국", latitude: 35.5384, longitude: 129.3114 },
  ulsan: { name: "울산", admin1: "울산광역시", country: "대한민국", latitude: 35.5384, longitude: 129.3114 },
  세종: { name: "세종", admin1: "세종특별자치시", country: "대한민국", latitude: 36.48, longitude: 127.289 },
  sejong: { name: "세종", admin1: "세종특별자치시", country: "대한민국", latitude: 36.48, longitude: 127.289 },
  제주: { name: "제주", admin1: "제주특별자치도", country: "대한민국", latitude: 33.4996, longitude: 126.5312 },
  jeju: { name: "제주", admin1: "제주특별자치도", country: "대한민국", latitude: 33.4996, longitude: 126.5312 },
  강남: { name: "강남구", admin2: "강남구", admin1: "서울특별시", country: "대한민국", latitude: 37.5172, longitude: 127.0473 },
  강남구: { name: "강남구", admin2: "강남구", admin1: "서울특별시", country: "대한민국", latitude: 37.5172, longitude: 127.0473 },
  서초: { name: "서초구", admin2: "서초구", admin1: "서울특별시", country: "대한민국", latitude: 37.4837, longitude: 127.0324 },
  서초구: { name: "서초구", admin2: "서초구", admin1: "서울특별시", country: "대한민국", latitude: 37.4837, longitude: 127.0324 },
  송파: { name: "송파구", admin2: "송파구", admin1: "서울특별시", country: "대한민국", latitude: 37.5145, longitude: 127.1059 },
  송파구: { name: "송파구", admin2: "송파구", admin1: "서울특별시", country: "대한민국", latitude: 37.5145, longitude: 127.1059 },
  마포: { name: "마포구", admin2: "마포구", admin1: "서울특별시", country: "대한민국", latitude: 37.5663, longitude: 126.9019 },
  마포구: { name: "마포구", admin2: "마포구", admin1: "서울특별시", country: "대한민국", latitude: 37.5663, longitude: 126.9019 },
  용산: { name: "용산구", admin2: "용산구", admin1: "서울특별시", country: "대한민국", latitude: 37.5323, longitude: 126.99 },
  용산구: { name: "용산구", admin2: "용산구", admin1: "서울특별시", country: "대한민국", latitude: 37.5323, longitude: 126.99 },
  강동: { name: "강동구", admin2: "강동구", admin1: "서울특별시", country: "대한민국", latitude: 37.5301, longitude: 127.1238 },
  강동구: { name: "강동구", admin2: "강동구", admin1: "서울특별시", country: "대한민국", latitude: 37.5301, longitude: 127.1238 },
  강북: { name: "강북구", admin2: "강북구", admin1: "서울특별시", country: "대한민국", latitude: 37.6396, longitude: 127.0257 },
  강북구: { name: "강북구", admin2: "강북구", admin1: "서울특별시", country: "대한민국", latitude: 37.6396, longitude: 127.0257 },
  강서: { name: "강서구", admin2: "강서구", admin1: "서울특별시", country: "대한민국", latitude: 37.55, longitude: 126.8495 },
  강서구: { name: "강서구", admin2: "강서구", admin1: "서울특별시", country: "대한민국", latitude: 37.55, longitude: 126.8495 },
  관악: { name: "관악구", admin2: "관악구", admin1: "서울특별시", country: "대한민국", latitude: 37.4784, longitude: 126.9516 },
  관악구: { name: "관악구", admin2: "관악구", admin1: "서울특별시", country: "대한민국", latitude: 37.4784, longitude: 126.9516 },
  광진: { name: "광진구", admin2: "광진구", admin1: "서울특별시", country: "대한민국", latitude: 37.5384, longitude: 127.0823 },
  광진구: { name: "광진구", admin2: "광진구", admin1: "서울특별시", country: "대한민국", latitude: 37.5384, longitude: 127.0823 },
  구로: { name: "구로구", admin2: "구로구", admin1: "서울특별시", country: "대한민국", latitude: 37.4954, longitude: 126.8874 },
  구로구: { name: "구로구", admin2: "구로구", admin1: "서울특별시", country: "대한민국", latitude: 37.4954, longitude: 126.8874 },
  금천: { name: "금천구", admin2: "금천구", admin1: "서울특별시", country: "대한민국", latitude: 37.4569, longitude: 126.8957 },
  금천구: { name: "금천구", admin2: "금천구", admin1: "서울특별시", country: "대한민국", latitude: 37.4569, longitude: 126.8957 },
  노원: { name: "노원구", admin2: "노원구", admin1: "서울특별시", country: "대한민국", latitude: 37.6542, longitude: 127.0568 },
  노원구: { name: "노원구", admin2: "노원구", admin1: "서울특별시", country: "대한민국", latitude: 37.6542, longitude: 127.0568 },
  도봉: { name: "도봉구", admin2: "도봉구", admin1: "서울특별시", country: "대한민국", latitude: 37.6688, longitude: 127.0471 },
  도봉구: { name: "도봉구", admin2: "도봉구", admin1: "서울특별시", country: "대한민국", latitude: 37.6688, longitude: 127.0471 },
  동대문: { name: "동대문구", admin2: "동대문구", admin1: "서울특별시", country: "대한민국", latitude: 37.5744, longitude: 127.0396 },
  동대문구: { name: "동대문구", admin2: "동대문구", admin1: "서울특별시", country: "대한민국", latitude: 37.5744, longitude: 127.0396 },
  동작: { name: "동작구", admin2: "동작구", admin1: "서울특별시", country: "대한민국", latitude: 37.5124, longitude: 126.9393 },
  동작구: { name: "동작구", admin2: "동작구", admin1: "서울특별시", country: "대한민국", latitude: 37.5124, longitude: 126.9393 },
  서대문: { name: "서대문구", admin2: "서대문구", admin1: "서울특별시", country: "대한민국", latitude: 37.5791, longitude: 126.9368 },
  서대문구: { name: "서대문구", admin2: "서대문구", admin1: "서울특별시", country: "대한민국", latitude: 37.5791, longitude: 126.9368 },
  성동: { name: "성동구", admin2: "성동구", admin1: "서울특별시", country: "대한민국", latitude: 37.5633, longitude: 127.0369 },
  성동구: { name: "성동구", admin2: "성동구", admin1: "서울특별시", country: "대한민국", latitude: 37.5633, longitude: 127.0369 },
  성북: { name: "성북구", admin2: "성북구", admin1: "서울특별시", country: "대한민국", latitude: 37.5894, longitude: 127.0167 },
  성북구: { name: "성북구", admin2: "성북구", admin1: "서울특별시", country: "대한민국", latitude: 37.5894, longitude: 127.0167 },
  양천: { name: "양천구", admin2: "양천구", admin1: "서울특별시", country: "대한민국", latitude: 37.5169, longitude: 126.8664 },
  양천구: { name: "양천구", admin2: "양천구", admin1: "서울특별시", country: "대한민국", latitude: 37.5169, longitude: 126.8664 },
  영등포: { name: "영등포구", admin2: "영등포구", admin1: "서울특별시", country: "대한민국", latitude: 37.5264, longitude: 126.8962 },
  영등포구: { name: "영등포구", admin2: "영등포구", admin1: "서울특별시", country: "대한민국", latitude: 37.5264, longitude: 126.8962 },
  은평: { name: "은평구", admin2: "은평구", admin1: "서울특별시", country: "대한민국", latitude: 37.6027, longitude: 126.9291 },
  은평구: { name: "은평구", admin2: "은평구", admin1: "서울특별시", country: "대한민국", latitude: 37.6027, longitude: 126.9291 },
  종로: { name: "종로구", admin2: "종로구", admin1: "서울특별시", country: "대한민국", latitude: 37.5735, longitude: 126.9788 },
  종로구: { name: "종로구", admin2: "종로구", admin1: "서울특별시", country: "대한민국", latitude: 37.5735, longitude: 126.9788 },
  중구: { name: "중구", admin2: "중구", admin1: "서울특별시", country: "대한민국", latitude: 37.5641, longitude: 126.9979 },
  중랑: { name: "중랑구", admin2: "중랑구", admin1: "서울특별시", country: "대한민국", latitude: 37.6063, longitude: 127.0927 },
  중랑구: { name: "중랑구", admin2: "중랑구", admin1: "서울특별시", country: "대한민국", latitude: 37.6063, longitude: 127.0927 },
};

const weatherCodeMap = {
  0: { label: "맑음", icon: "☀️", theme: "sunny" },
  1: { label: "대체로 맑음", icon: "🌤️", theme: "sunny" },
  2: { label: "구름 조금", icon: "⛅️", theme: "cloudy" },
  3: { label: "흐림", icon: "☁️", theme: "cloudy" },
  45: { label: "안개", icon: "🌫️", theme: "fog" },
  48: { label: "짙은 안개", icon: "🌫️", theme: "fog" },
  51: { label: "이슬비", icon: "🌦️", theme: "rain" },
  53: { label: "약한 비", icon: "🌦️", theme: "rain" },
  55: { label: "비", icon: "🌧️", theme: "rain" },
  61: { label: "가벼운 비", icon: "🌦️", theme: "rain" },
  63: { label: "비", icon: "🌧️", theme: "rain" },
  65: { label: "강한 비", icon: "⛈️", theme: "rain" },
  66: { label: "어는 비", icon: "🌧️", theme: "rain" },
  67: { label: "강한 어는 비", icon: "⛈️", theme: "rain" },
  71: { label: "약한 눈", icon: "🌨️", theme: "snow" },
  73: { label: "눈", icon: "🌨️", theme: "snow" },
  75: { label: "강한 눈", icon: "❄️", theme: "snow" },
  77: { label: "진눈깨비", icon: "🌨️", theme: "snow" },
  80: { label: "소나기", icon: "🌦️", theme: "rain" },
  81: { label: "강한 소나기", icon: "🌧️", theme: "rain" },
  82: { label: "폭우", icon: "⛈️", theme: "rain" },
  85: { label: "약한 눈 소나기", icon: "🌨️", theme: "snow" },
  86: { label: "눈 소나기", icon: "❄️", theme: "snow" },
  95: { label: "뇌우", icon: "⛈️", theme: "rain" },
  96: { label: "우박을 동반한 뇌우", icon: "⛈️", theme: "rain" },
  99: { label: "강한 뇌우", icon: "⛈️", theme: "rain" },
};

initialize();

function initialize() {
  registerServiceWorker();
  bindEvents();
  loadInitialWeather();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

async function loadInitialWeather() {
  if (!navigator.geolocation || !window.isSecureContext) {
    await loadWeatherByCity(DEFAULT_CITY);
    return;
  }

  setLoadingState("현재 위치를 확인하는 중...");

  try {
    const { coords } = await requestCurrentPosition();
    hideStatusMessage();
    await loadWeatherByCoords(coords.latitude, coords.longitude, "현재 위치", true);
  } catch (error) {
    console.error(error);
    await loadWeatherByCity(DEFAULT_CITY);
  }
}

function bindEvents() {
  elements.searchToggle.addEventListener("click", () => {
    const willOpen = elements.searchForm.hidden;
    elements.searchForm.hidden = !willOpen;
    elements.searchToggle.setAttribute("aria-expanded", String(willOpen));
    elements.searchToggle.setAttribute("aria-label", willOpen ? "도시 검색 닫기" : "도시 검색 열기");

    if (willOpen) {
      window.setTimeout(() => {
        elements.cityInput.focus();
      }, 0);
    }
  });

  elements.searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = elements.cityInput.value.trim();
    if (!city) return;
    hideStatusMessage();
    await loadWeatherByCity(city);
    elements.searchForm.hidden = true;
    elements.searchToggle.setAttribute("aria-expanded", "false");
    elements.searchToggle.setAttribute("aria-label", "도시 검색 열기");
  });

  elements.geoButton.addEventListener("click", async () => {
    if (!navigator.geolocation) {
      showStatusMessage("이 브라우저에서는 위치 기능을 사용할 수 없어요. 도시 검색으로 확인해 주세요.");
      return;
    }

    hideStatusMessage();

    if (!window.isSecureContext) {
      showStatusMessage("지금 페이지는 위치 권한을 안정적으로 쓸 수 없는 환경이에요. GitHub Pages 주소나 https 주소로 열어서 다시 시도해 주세요.");
      return;
    }

    try {
      const { coords } = await requestCurrentPosition();
      hideStatusMessage();
      await loadWeatherByCoords(coords.latitude, coords.longitude, "현재 위치", true);
    } catch (error) {
      showStatusMessage(getGeolocationErrorMessage(error));
    }
  });

  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });
}

async function loadWeatherByCity(city) {
  setLoadingState(`${city} 날씨를 불러오는 중...`);

  try {
    const cityData = await geocodeCity(city);
    if (!cityData) {
      throw new Error("도시를 찾을 수 없습니다.");
    }

    const label = buildLocationLabel(cityData);

    await loadWeatherByCoords(cityData.latitude, cityData.longitude, label, false);
    saveLastCityQuery(city);
    elements.cityInput.value = "";
  } catch (error) {
    console.error(error);
    setLoadingState("도시를 찾지 못했어요.");
    showStatusMessage("도시를 찾지 못했어요. 다른 도시 이름으로 다시 검색해 주세요.");
  }
}

async function loadWeatherByCoords(latitude, longitude, label, isCurrentLocation = false) {
  try {
    const [forecast, airQuality] = await Promise.all([
      fetchForecast(latitude, longitude),
      fetchAirQuality(latitude, longitude),
    ]);
    const resolvedLabel = isCurrentLocation ? await resolveLocationLabel(latitude, longitude, label) : label;
    renderWeather(forecast, airQuality, resolvedLabel, isCurrentLocation);
  } catch (error) {
    console.error(error);
    setLoadingState("날씨 정보를 불러오지 못했어요.");
    showStatusMessage("날씨 데이터를 가져오는 데 실패했어요. 잠시 후 다시 시도해 주세요.");
  }
}

function requestCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

function setLoadingState(message) {
  setLocationHeading("Jinan Weather");
  elements.locationBadge.hidden = true;
  elements.dateText.textContent = message;
  elements.compareSummaryYesterdayToday.textContent = "어제와 오늘을 비교하는 중";
  elements.compareSummaryTodayTomorrow.textContent = "오늘과 내일을 비교하는 중";
  elements.tempDeltaYesterdayToday.textContent = "--°";
  elements.tempDeltaTodayTomorrow.textContent = "--°";
  elements.rainDeltaTodayTomorrow.textContent = "--%";
  elements.yesterdayCondition.textContent = "잠시만 기다려 주세요";
  elements.yesterdayTemp.textContent = "--°";
  elements.yesterdayIcon.textContent = "☁️";
  elements.yesterdayRange.textContent = "최고 --° / 최저 --°";
  elements.tomorrowCondition.textContent = "잠시만 기다려 주세요";
  elements.tomorrowTemp.textContent = "--°";
  elements.tomorrowIcon.textContent = "☁️";
  elements.tomorrowRange.textContent = "최고 --° / 최저 --°";
  elements.yesterdayFeelsLike.textContent = "--°";
  elements.tomorrowFeelsLike.textContent = "--°";
  elements.yesterdayPrecipitation.textContent = "--%";
  elements.tomorrowPrecipitation.textContent = "--%";
  elements.yesterdayHumidity.textContent = "--%";
  elements.tomorrowHumidity.textContent = "--%";
  elements.yesterdayWindSpeed.textContent = "-- km/h";
  elements.tomorrowWindSpeed.textContent = "-- km/h";
  elements.yesterdayUvIndex.textContent = "--";
  elements.tomorrowUvIndex.textContent = "--";
  elements.yesterdayVisibility.textContent = "-- km";
  elements.tomorrowVisibility.textContent = "-- km";
  elements.conditionText.textContent = "잠시만 기다려 주세요";
  elements.currentTemp.textContent = "--°";
  elements.currentIcon.textContent = "☁️";
  elements.tempRange.textContent = "최고 --° / 최저 --°";
  elements.feelsLike.textContent = "--°";
  elements.feelsCompareText.textContent = "어제와 비슷해요";
  elements.precipitation.textContent = "--%";
  elements.rainCompareText.textContent = "어제와 비슷해요";
  elements.humidity.textContent = "--%";
  elements.humidityText.textContent = "쾌적함을 계산 중";
  elements.yesterdayPm10.textContent = "--";
  elements.pm10.textContent = "--";
  elements.tomorrowPm10.textContent = "--";
  elements.pm10Text.textContent = "대기질을 계산 중";
  elements.windSpeed.textContent = "-- km/h";
  elements.windText.textContent = "바람 상태를 계산 중";
  elements.uvIndex.textContent = "--";
  elements.uvText.textContent = "지수 정보를 계산 중";
  elements.visibility.textContent = "-- km";
  elements.visibilityText.textContent = "대기 상태를 계산 중";
  elements.tabCaption.textContent = "다음 24시간";
  elements.hourlyList.innerHTML = "";
  elements.dailyList.innerHTML = "";
}

async function geocodeCity(city) {
  const knownLocation = getKnownKoreanLocation(city);
  if (knownLocation) {
    return knownLocation;
  }

  const queries = buildGeocodeQueries(city);
  const seen = new Set();
  const candidates = [];

  for (const query of queries) {
    const results = await fetchGeocodeCandidates(query, "KR");
    addUniqueCandidates(results, seen, candidates);
  }

  if (!candidates.length) {
    for (const query of queries) {
      const results = await fetchGeocodeCandidates(query);
      addUniqueCandidates(results, seen, candidates);
    }
  }

  if (!candidates.length) {
    return null;
  }

  return chooseBestGeocodeResult(city, candidates);
}

function addUniqueCandidates(results, seen, candidates) {
  results.forEach((result) => {
    const key = `${result.id ?? ""}-${result.latitude}-${result.longitude}-${result.name}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    candidates.push(result);
  });
}

async function resolveLocationLabel(latitude, longitude, fallbackLabel) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/reverse");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return fallbackLabel;
    }

    const data = await response.json();
    const result = data.results?.[0];
    if (!result) {
      return fallbackLabel;
    }

    return buildLocationLabel(result);
  } catch {
    return fallbackLabel;
  }
}

async function fetchForecast(latitude, longitude) {
  const preferredForecast = await fetchForecastResponse(latitude, longitude, true);
  if (hasUsableForecastData(preferredForecast)) {
    return preferredForecast;
  }

  const fallbackForecast = await fetchForecastResponse(latitude, longitude, false);
  if (hasUsableForecastData(fallbackForecast)) {
    return fallbackForecast;
  }

  throw new Error("Forecast response missing usable values.");
}

async function fetchForecastResponse(latitude, longitude, useKmaModel) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  if (useKmaModel) {
    url.searchParams.set("models", "kma_seamless");
  }
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "weather_code",
      "relative_humidity_2m",
      "wind_speed_10m",
      "is_day",
      "precipitation_probability",
    ].join(",")
  );
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "weather_code",
      "precipitation_probability",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "visibility",
      "uv_index",
    ].join(",")
  );
  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_probability_max",
      "uv_index_max",
      "wind_speed_10m_max",
    ].join(",")
  );
  url.searchParams.set("past_days", "1");
  url.searchParams.set("forecast_days", "10");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("wind_speed_unit", "kmh");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Forecast request failed.");
  }

  return response.json();
}

function hasUsableForecastData(data) {
  const requiredValues = [
    data?.current?.temperature_2m,
    data?.daily?.temperature_2m_max?.[0],
    data?.daily?.temperature_2m_min?.[0],
    data?.daily?.temperature_2m_max?.[1],
    data?.daily?.temperature_2m_min?.[1],
    data?.daily?.temperature_2m_max?.[2],
    data?.daily?.temperature_2m_min?.[2],
  ];

  return requiredValues.every((value) => toFiniteNumber(value) !== null);
}

async function fetchAirQuality(latitude, longitude) {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("current", "pm10");
  url.searchParams.set("hourly", "pm10");
  url.searchParams.set("past_days", "1");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Air quality request failed.");
  }

  return response.json();
}

function renderWeather(data, airQuality, locationLabel, isCurrentLocation = false) {
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;
  const yesterdayIndex = 0;
  const todayIndex = 1;
  const tomorrowIndex = 2;
  const currentWeather = getWeatherInfo(current.weather_code, current.is_day);
  const currentHourIndex = findCurrentHourIndex(hourly.time, current.time);
  const yesterdayHourIndex = Math.max(0, currentHourIndex - 24);
  const tomorrowHourIndex = Math.min(hourly.time.length - 1, currentHourIndex + 24);
  const next24Hours = hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[currentHourIndex + index],
    precipitation: hourly.precipitation_probability[currentHourIndex + index],
    weatherCode: hourly.weather_code[currentHourIndex + index],
  }));

  const visibilityKm = roundValue(divideBy(hourly.visibility[currentHourIndex], 1000));
  const yesterdayVisibilityKm = roundValue(divideBy(hourly.visibility[yesterdayHourIndex], 1000));
  const tomorrowVisibilityKm = roundValue(divideBy(hourly.visibility[tomorrowHourIndex], 1000));
  const uvIndex = roundValue(firstDefinedNumber(hourly.uv_index[currentHourIndex], daily.uv_index_max[todayIndex]));
  const yesterdayUvIndex = roundValue(firstDefinedNumber(hourly.uv_index[yesterdayHourIndex], daily.uv_index_max[yesterdayIndex]));
  const tomorrowUvIndex = roundValue(firstDefinedNumber(hourly.uv_index[tomorrowHourIndex], daily.uv_index_max[tomorrowIndex]));
  const yesterdayWeather = getWeatherInfo(daily.weather_code[yesterdayIndex], true);
  const tomorrowWeather = getWeatherInfo(daily.weather_code[tomorrowIndex], true);
  const yesterdayFeelsLike = roundValue(
    firstDefinedNumber(
      hourly.apparent_temperature[yesterdayHourIndex],
      averageValues(daily.apparent_temperature_max[yesterdayIndex], daily.apparent_temperature_min[yesterdayIndex])
    )
  );
  const todayFeelsLike = roundValue(current.apparent_temperature);
  const tomorrowFeelsLike = roundValue(
    firstDefinedNumber(
      hourly.apparent_temperature[tomorrowHourIndex],
      averageValues(daily.apparent_temperature_max[tomorrowIndex], daily.apparent_temperature_min[tomorrowIndex])
    )
  );
  const yesterdayPrecipitation = roundValue(
    firstDefinedNumber(daily.precipitation_probability_max[yesterdayIndex], hourly.precipitation_probability[yesterdayHourIndex])
  );
  const todayPrecipitation = roundValue(
    firstDefinedNumber(current.precipitation_probability, daily.precipitation_probability_max[todayIndex], next24Hours[0]?.precipitation)
  );
  const tomorrowPrecipitation = roundValue(
    firstDefinedNumber(daily.precipitation_probability_max[tomorrowIndex], hourly.precipitation_probability[tomorrowHourIndex])
  );
  const yesterdayHumidity = roundValue(hourly.relative_humidity_2m[yesterdayHourIndex]);
  const todayHumidity = roundValue(current.relative_humidity_2m);
  const tomorrowHumidity = roundValue(hourly.relative_humidity_2m[tomorrowHourIndex]);
  const yesterdayWind = roundValue(firstDefinedNumber(daily.wind_speed_10m_max[yesterdayIndex], hourly.wind_speed_10m[yesterdayHourIndex]));
  const todayWind = roundValue(current.wind_speed_10m);
  const tomorrowWind = roundValue(firstDefinedNumber(daily.wind_speed_10m_max[tomorrowIndex], hourly.wind_speed_10m[tomorrowHourIndex]));
  const currentPm10Index = findCurrentHourIndex(airQuality.hourly.time, airQuality.current.time);
  const yesterdayPm10Index = Math.max(0, currentPm10Index - 24);
  const tomorrowPm10Index = Math.min(airQuality.hourly.time.length - 1, currentPm10Index + 24);
  const todayPm10 = roundValue(firstDefinedNumber(airQuality.current.pm10, airQuality.hourly.pm10[currentPm10Index]));
  const yesterdayPm10 = roundValue(airQuality.hourly.pm10[yesterdayPm10Index]);
  const tomorrowPm10 = roundValue(airQuality.hourly.pm10[tomorrowPm10Index]);
  const yesterdayAvgTemp = roundValue(averageValues(daily.temperature_2m_max[yesterdayIndex], daily.temperature_2m_min[yesterdayIndex]));
  const todayTemp = roundValue(current.temperature_2m);
  const tomorrowAvgTemp = roundValue(averageValues(daily.temperature_2m_max[tomorrowIndex], daily.temperature_2m_min[tomorrowIndex]));

  setLocationHeading(locationLabel);
  elements.locationBadge.hidden = !isCurrentLocation;
  elements.dateText.textContent = formatFullDate(current.time, data.timezone);
  elements.compareSummaryYesterdayToday.textContent = buildYesterdayTodaySummary(
    todayTemp,
    yesterdayAvgTemp,
    todayPrecipitation,
    yesterdayPrecipitation
  );
  elements.compareSummaryTodayTomorrow.textContent = buildTodayTomorrowSummary(
    todayTemp,
    tomorrowAvgTemp,
    todayPrecipitation,
    tomorrowPrecipitation
  );
  elements.tempDeltaYesterdayToday.textContent = formatDeltaFromValues(todayTemp, yesterdayAvgTemp);
  elements.tempDeltaTodayTomorrow.textContent = formatDeltaFromValues(tomorrowAvgTemp, todayTemp);
  elements.rainDeltaTodayTomorrow.textContent = formatPercentDeltaFromValues(tomorrowPrecipitation, todayPrecipitation);
  elements.yesterdayCondition.textContent = yesterdayWeather.label;
  elements.yesterdayTemp.textContent = formatTemperature(yesterdayAvgTemp);
  elements.yesterdayIcon.textContent = yesterdayWeather.icon;
  elements.yesterdayRange.textContent = formatTemperatureRange(daily.temperature_2m_max[yesterdayIndex], daily.temperature_2m_min[yesterdayIndex]);
  elements.yesterdayFeelsLike.textContent = formatTemperature(yesterdayFeelsLike);
  elements.yesterdayPrecipitation.textContent = formatRainProbability(yesterdayPrecipitation);
  elements.yesterdayHumidity.textContent = formatPercentageValue(yesterdayHumidity);
  elements.yesterdayWindSpeed.textContent = formatSpeedValue(yesterdayWind);
  elements.yesterdayUvIndex.textContent = formatPlainNumber(yesterdayUvIndex);
  elements.yesterdayVisibility.textContent = formatDistanceValue(yesterdayVisibilityKm);
  elements.conditionText.textContent = currentWeather.label;
  elements.currentTemp.textContent = formatTemperature(todayTemp);
  elements.currentIcon.textContent = currentWeather.icon;
  elements.tempRange.textContent = formatTemperatureRange(daily.temperature_2m_max[todayIndex], daily.temperature_2m_min[todayIndex]);
  elements.tomorrowCondition.textContent = tomorrowWeather.label;
  elements.tomorrowTemp.textContent = formatTemperature(tomorrowAvgTemp);
  elements.tomorrowIcon.textContent = tomorrowWeather.icon;
  elements.tomorrowRange.textContent = formatTemperatureRange(daily.temperature_2m_max[tomorrowIndex], daily.temperature_2m_min[tomorrowIndex]);
  elements.feelsLike.textContent = formatTemperature(todayFeelsLike);
  elements.tomorrowFeelsLike.textContent = formatTemperature(tomorrowFeelsLike);
  elements.feelsCompareText.textContent = describeFeelsLikeComparison(todayFeelsLike, yesterdayFeelsLike);
  elements.precipitation.textContent = formatRainProbability(todayPrecipitation);
  elements.tomorrowPrecipitation.textContent = formatRainProbability(tomorrowPrecipitation);
  elements.rainCompareText.textContent = describeRainComparison(todayPrecipitation, yesterdayPrecipitation);
  elements.humidity.textContent = formatPercentageValue(todayHumidity);
  elements.tomorrowHumidity.textContent = formatPercentageValue(tomorrowHumidity);
  elements.humidityText.textContent = describeHumidityComparison(todayHumidity, yesterdayHumidity);
  elements.yesterdayPm10.textContent = formatPm10(yesterdayPm10);
  elements.pm10.textContent = formatPm10(todayPm10);
  elements.tomorrowPm10.textContent = formatPm10(tomorrowPm10);
  elements.pm10Text.textContent = describePm10Comparison(todayPm10, yesterdayPm10);
  elements.windSpeed.textContent = formatSpeedValue(todayWind);
  elements.tomorrowWindSpeed.textContent = formatSpeedValue(tomorrowWind);
  elements.windText.textContent = describeWindComparison(todayWind, yesterdayWind);
  elements.uvIndex.textContent = formatPlainNumber(uvIndex);
  elements.tomorrowUvIndex.textContent = formatPlainNumber(tomorrowUvIndex);
  elements.uvText.textContent = describeUvComparison(uvIndex, yesterdayUvIndex);
  elements.visibility.textContent = formatDistanceValue(visibilityKm);
  elements.tomorrowVisibility.textContent = formatDistanceValue(tomorrowVisibilityKm);
  elements.visibilityText.textContent = describeVisibilityComparison(visibilityKm, yesterdayVisibilityKm);
  elements.tabCaption.textContent = `${next24Hours.length}시간 미리보기`;
  hideStatusMessage();

  setTheme(currentWeather.theme, current.is_day, todayPm10);
  renderHourly(next24Hours);
  renderDaily(daily);
}

function renderHourly(hourlyData) {
  elements.hourlyList.innerHTML = "";

  hourlyData.forEach((hour, index) => {
    const item = elements.hourlyTemplate.content.firstElementChild.cloneNode(true);
    const weather = getWeatherInfo(hour.weatherCode, isLikelyDaytime(hour.time));

    item.querySelector(".hourly-time").textContent = index === 0 ? "지금" : formatHour(hour.time);
    item.querySelector(".hourly-icon").textContent = weather.icon;
    item.querySelector(".hourly-temp").textContent = formatTemperature(roundValue(hour.temperature));
    item.querySelector(".hourly-rain").textContent = formatHourlyRain(roundValue(hour.precipitation));

    elements.hourlyList.appendChild(item);
  });
}

function renderDaily(daily) {
  elements.dailyList.innerHTML = "";

  const minValues = daily.temperature_2m_min.slice(1).map((value) => toFiniteNumber(value)).filter((value) => value !== null);
  const maxValues = daily.temperature_2m_max.slice(1).map((value) => toFiniteNumber(value)).filter((value) => value !== null);
  const minTemp = minValues.length ? Math.min(...minValues) : 0;
  const maxTemp = maxValues.length ? Math.max(...maxValues) : 0;
  const range = Math.max(1, maxTemp - minTemp);

  daily.time.slice(1).forEach((time, offset) => {
    const index = offset + 1;
    const item = elements.dailyTemplate.content.firstElementChild.cloneNode(true);
    const weather = getWeatherInfo(daily.weather_code[index], true);
    const low = toFiniteNumber(daily.temperature_2m_min[index]);
    const high = toFiniteNumber(daily.temperature_2m_max[index]);
    const left = low === null ? 0 : ((low - minTemp) / range) * 100;
    const width = low === null || high === null ? 8 : ((high - low) / range) * 100;

    item.querySelector(".daily-day").textContent = index === 1 ? "오늘" : formatWeekday(time);
    item.querySelector(".daily-icon").textContent = weather.icon;
    item.querySelector(".daily-text").textContent = weather.label;
    item.querySelector(".daily-low").textContent = formatTemperature(roundValue(low));
    item.querySelector(".daily-high").textContent = formatTemperature(roundValue(high));
    item.querySelector(".bar-range").style.left = `${left}%`;
    item.querySelector(".bar-range").style.width = `${Math.max(width, 8)}%`;

    elements.dailyList.appendChild(item);
  });
}

function setActiveTab(tabName) {
  elements.tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.tabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== tabName;
  });

  elements.tabCaption.textContent = tabName === "hourly" ? "다음 24시간" : "오늘 포함 10일";
}

function getWeatherInfo(code, isDay = true) {
  const weather = weatherCodeMap[code] ?? { label: "보통", icon: "☁️", theme: "cloudy" };
  if (!isDay && weather.theme === "sunny") {
    return { label: "맑은 밤", icon: "🌙", theme: "sunny" };
  }
  if (!isDay && weather.theme === "cloudy" && code <= 3) {
    return { label: "구름 낀 밤", icon: "☁️", theme: "cloudy" };
  }
  return weather;
}

function setTheme(theme, isDay, pm10 = 0) {
  const themeName = resolveThemeName(theme, isDay, pm10);
  app.dataset.theme = themeName;
  if (appShell) {
    appShell.dataset.theme = themeName;
  }
  updateBrowserThemeAssets(themeName);
}

function resolveThemeName(theme, isDay, pm10) {
  const baseTheme = Number(pm10) > 80 ? "dusty" : normalizeThemeName(theme);
  return `${baseTheme}-${isDay ? "day" : "night"}`;
}

function normalizeThemeName(theme) {
  if (["sunny", "cloudy", "rain", "snow", "fog", "dusty"].includes(theme)) {
    return theme;
  }

  return "cloudy";
}

function updateBrowserThemeAssets(themeName) {
  const isNight = String(themeName).endsWith("-night");

  if (faviconLink) {
    faviconLink.href = isNight ? "icons/favicon-night.png" : "icons/favicon-day.png";
    faviconLink.type = "image/png";
  }

  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isNight ? "#102a63" : "#4f91ff");
  }
}

function findCurrentHourIndex(times, currentTime) {
  const index = times.findIndex((time) => time === currentTime);
  return index >= 0 ? index : 0;
}

function formatFullDate(value, timezone) {
  return new Intl.DateTimeFormat("ko-KR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(value));
}

function formatHour(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
  }).format(new Date(value));
}

function formatWeekday(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  }).format(new Date(value));
}

function isLikelyDaytime(value) {
  const hour = new Date(value).getHours();
  return hour >= 7 && hour < 19;
}

function toFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function roundValue(value) {
  const numeric = toFiniteNumber(value);
  return numeric === null ? null : Math.round(numeric);
}

function firstDefinedNumber(...values) {
  for (const value of values) {
    const numeric = toFiniteNumber(value);
    if (numeric !== null) {
      return numeric;
    }
  }

  return null;
}

function averageValues(first, second) {
  const a = toFiniteNumber(first);
  const b = toFiniteNumber(second);
  if (a === null || b === null) {
    return null;
  }

  return (a + b) / 2;
}

function divideBy(value, divisor) {
  const numeric = toFiniteNumber(value);
  return numeric === null ? null : numeric / divisor;
}

function formatDelta(delta) {
  const rounded = Math.round(delta);
  return `${rounded > 0 ? "+" : ""}${rounded}°`;
}

function formatDeltaFromValues(currentValue, previousValue) {
  if (currentValue === null || previousValue === null) {
    return "--°";
  }

  return formatDelta(currentValue - previousValue);
}

function formatPercentDelta(delta) {
  const rounded = Math.round(delta);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function formatPercentDeltaFromValues(currentValue, previousValue) {
  if (currentValue === null || previousValue === null) {
    return "--%";
  }

  return formatPercentDelta(currentValue - previousValue);
}

function formatTemperature(value) {
  return value === null ? "--°" : `${value}°`;
}

function formatTemperatureRange(maxValue, minValue) {
  const max = roundValue(maxValue);
  const min = roundValue(minValue);
  return `최고 ${formatTemperature(max)} / 최저 ${formatTemperature(min)}`;
}

function formatRainProbability(value) {
  return value === null ? "비 --%" : `비 ${value}%`;
}

function formatPercentageValue(value) {
  return value === null ? "--%" : `${value}%`;
}

function formatSpeedValue(value) {
  return value === null ? "-- km/h" : `${value} km/h`;
}

function formatDistanceValue(value) {
  return value === null ? "-- km" : `${value} km`;
}

function formatPlainNumber(value) {
  return value === null ? "--" : String(value);
}

function describeFeelsLikeComparison(today, yesterday) {
  if (today === null || yesterday === null) return "체감은 아직 정리 중이에요";
  const delta = Math.round(today - yesterday);
  const amount = Math.abs(delta);
  if (amount <= 1) return "체감은 어제와 비슷해요";
  if (delta > 0) return `어제보다 ${amount}° 더 포근해요`;
  return `어제보다 ${amount}° 더 서늘해요`;
}

function describeHumidityComparison(today, yesterday) {
  if (today === null || yesterday === null) return "습도는 아직 정리 중이에요";
  const delta = today - yesterday;
  if (Math.abs(delta) <= 4) return "습도가 어제와 비슷해요";
  return delta > 0 ? `어제보다 ${Math.round(delta)}% 더 습해요` : `어제보다 ${Math.round(Math.abs(delta))}% 더 건조해요`;
}

function describeWindComparison(today, yesterday) {
  if (today === null || yesterday === null) return "바람 상태를 정리 중이에요";
  const delta = today - yesterday;
  const amount = Math.round(Math.abs(delta));
  if (amount <= 3) return "바람 세기는 어제와 비슷해요";
  if (delta > 0) return `어제보다 바람이 ${amount}km/h 더 강해요`;
  return `어제보다 바람이 ${amount}km/h 더 잔잔해요`;
}

function describeUv(index) {
  if (index === null) return "확인 중";
  if (index <= 2) return "낮은 수준";
  if (index <= 5) return "보통 수준";
  if (index <= 7) return "높은 수준";
  if (index <= 10) return "매우 높음";
  return "야외 활동 주의";
}

function describeUvComparison(today, yesterday) {
  if (today === null || yesterday === null) return "자외선 지수를 정리 중이에요";
  const delta = today - yesterday;
  if (today >= 8) return `${describeUv(today)}, 한낮엔 모자나 선글라스를 챙기면 좋아요`;
  if (Math.abs(delta) <= 1) return `${describeUv(today)}, 어제와 비슷해요`;
  return delta > 0 ? `${describeUv(today)}, 어제보다 더 강해요` : `${describeUv(today)}, 어제보다 더 약해요`;
}

function describeVisibility(km) {
  if (km === null) return "가시거리 확인 중이에요";
  if (km >= 16) return "시야가 아주 깨끗해요";
  if (km >= 10) return "대체로 선명해요";
  if (km >= 5) return "약간 흐릿해요";
  return "시야가 제한적이에요";
}

function describeVisibilityComparison(today, yesterday) {
  if (today === null || yesterday === null) return "가시거리를 정리 중이에요";
  const delta = today - yesterday;
  if (today <= 5) return `${describeVisibility(today)}, 이동할 때 조금 더 주의해 주세요`;
  if (Math.abs(delta) <= 1) return `${describeVisibility(today)}, 어제와 비슷해요`;
  return delta > 0 ? `${describeVisibility(today)}, 어제보다 더 선명해요` : `${describeVisibility(today)}, 어제보다 조금 더 흐려요`;
}

function buildYesterdayTodaySummary(todayTemp, yesterdayTemp, todayRain, yesterdayRain) {
  if (todayTemp === null || yesterdayTemp === null || todayRain === null || yesterdayRain === null) {
    return "어제와 오늘 날씨를 정리 중이에요";
  }
  const tempDelta = todayTemp - yesterdayTemp;
  const rainDelta = todayRain - yesterdayRain;
  if (tempDelta >= 2 && todayRain <= 30) return `어제보다 ${Math.round(tempDelta)}° 더 따뜻해서 가볍게 나서기 좋아요`;
  if (tempDelta <= -2 && todayRain >= 40) return `어제보다 ${Math.round(Math.abs(tempDelta))}° 더 서늘하고 비 올 확률도 있어요`;
  if (todayRain >= 60) return `비 올 확률이 ${todayRain}%라 우산을 챙기면 좋아요`;
  if (todayRain >= 30 && rainDelta >= 10) return `어제보다 비 가능성이 높아서 외출 전에 하늘을 한 번 더 보면 좋아요`;
  if (rainDelta <= -10) return "어제보다 비 걱정이 덜해서 조금 더 가볍게 움직여도 괜찮아요";
  return "어제와 비슷한 하루예요";
}

function buildTodayTomorrowSummary(todayTemp, tomorrowTemp, todayRain, tomorrowRain) {
  if (todayTemp === null || tomorrowTemp === null || todayRain === null || tomorrowRain === null) {
    return "오늘과 내일 날씨를 정리 중이에요";
  }
  const tempDelta = tomorrowTemp - todayTemp;
  const rainDelta = tomorrowRain - todayRain;
  if (tempDelta >= 2 && tomorrowRain <= 30) return `내일은 오늘보다 ${Math.round(tempDelta)}° 더 따뜻해서 한결 가볍게 나서기 좋아요`;
  if (tempDelta <= -2 && tomorrowRain >= 40) {
    return `내일은 오늘보다 ${Math.round(Math.abs(tempDelta))}° 더 서늘하고 비 가능성도 더 높아요`;
  }
  if (tomorrowRain >= 60) return `내일은 비 올 확률이 ${tomorrowRain}%라 우산을 챙기면 좋아요`;
  if (rainDelta >= 10) return `내일은 오늘보다 비 가능성이 높아서 외출 전에 하늘을 한 번 더 보면 좋아요`;
  if (rainDelta <= -10) return "내일은 오늘보다 비 걱정이 덜해서 조금 더 가볍게 움직여도 괜찮아요";
  return "내일은 오늘과 비슷한 흐름이에요";
}

function getPm10Grade(value) {
  if (value === null) return "확인 중";
  if (value <= 30) return "좋음";
  if (value <= 80) return "보통";
  if (value <= 150) return "나쁨";
  return "매우 나쁨";
}

function formatPm10(value) {
  if (value === null) return "--";
  return `${Math.round(value)}㎍/㎥`;
}

function describePm10Comparison(today, yesterday) {
  if (today === null || yesterday === null) return "미세먼지 정보를 정리 중이에요";
  const delta = Math.round(today - yesterday);
  const amount = Math.abs(delta);
  const grade = getPm10Grade(today);

  if (grade === "좋음") {
    if (amount <= 10) return "좋음 수준이라 가볍게 나서기 좋아요";
    return delta < 0 ? `좋음 수준이고 어제보다 ${amount}㎍/㎥ 낮아 한결 편안해요` : `좋음 수준이라 큰 불편은 없어요`;
  }

  if (grade === "보통") {
    if (amount <= 10) return "보통 수준이고 어제와 비슷해요";
    return delta < 0 ? `보통 수준이고 어제보다 ${amount}㎍/㎥ 낮아졌어요` : `보통 수준이지만 어제보다 ${amount}㎍/㎥ 높아요`;
  }

  if (grade === "나쁨") {
    return amount <= 10
      ? "나쁨 수준이라 오래 머무는 야외 활동은 줄이면 좋아요"
      : `나쁨 수준이고 어제보다 ${amount}㎍/㎥ ${delta > 0 ? "높아" : "낮아"}요`;
  }

  return "매우 나쁨 수준이라 마스크를 챙기고 실외 활동은 줄여 주세요";
}

function describeRainComparison(today, yesterday) {
  if (today === null || yesterday === null) return "강수 확률을 정리 중이에요";
  if (today <= 20) {
    return yesterday >= 40
      ? `비 올 확률이 ${today}%라 어제보다 한결 가벼워요`
      : `비 올 확률이 ${today}%라 비 걱정은 적어요`;
  }

  if (today <= 50) {
    return yesterday >= 60
      ? `비 올 확률이 ${today}%라 어제보단 덜하지만 우산이 있으면 좋아요`
      : `비 올 확률이 ${today}%라 가벼운 우산이 있으면 좋아요`;
  }

  return yesterday <= 30
    ? `비 올 확률이 ${today}%라 어제보다 비를 더 대비하면 좋아요`
    : `비 올 확률이 ${today}%라 우산을 챙기면 좋아요`;
}

function formatHourlyRain(probability) {
  if (probability === null) return "비 --%";
  if (probability <= 20) return `비 ${probability}%`;
  if (probability <= 50) return `우산 ${probability}%`;
  return `비 대비 ${probability}%`;
}

function setLocationHeading(label) {
  const parts = String(label)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  elements.cityPrimary.textContent = simplifyPrimaryLocationName(parts[0] ?? "Jinan Weather");

  if (parts.length > 1) {
    elements.citySecondary.hidden = false;
    elements.citySecondary.textContent = parts.slice(1).join(", ");
    return;
  }

  elements.citySecondary.hidden = true;
  elements.citySecondary.textContent = "";
}

function buildLocationLabel(location) {
  if (location.country_code === "KR" || location.country === "대한민국") {
    return buildKoreanLocationLabel(location);
  }

  const primary = simplifyPrimaryLocationName(location.name);
  const secondary = [location.admin1, location.country]
    .filter(Boolean)
    .filter((part, index, array) => array.indexOf(part) === index)
    .filter((part) => part !== location.name && part !== primary);

  return [primary, ...secondary].filter(Boolean).join(", ");
}

function buildGeocodeQueries(city) {
  const trimmed = city.trim();
  const normalized = trimmed.replace(/\s+/g, "");
  const baseName = normalizeSearchText(trimmed);
  const queries = [trimmed];
  const suffixVariants = ["특별시", "광역시", "특별자치시", "특별자치도", "시", "군", "구", "도"];
  const aliases = CITY_QUERY_ALIASES[trimmed] ?? CITY_QUERY_ALIASES[normalized] ?? [];

  if (baseName && baseName !== trimmed && baseName !== normalized) {
    queries.push(baseName);
  }

  if (baseName && baseName !== normalized) {
    queries.push(normalized);
  }

  aliases.forEach((alias) => queries.push(alias));

  suffixVariants.forEach((suffix) => {
    if (!normalized.endsWith(suffix) && baseName) {
      queries.push(`${baseName}${suffix}`);
    }
  });

  return Array.from(new Set(queries.filter(Boolean)));
}

async function fetchGeocodeCandidates(query, countryCode) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");
  if (countryCode) {
    url.searchParams.set("countryCode", countryCode);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Geocoding request failed.");
  }

  const data = await response.json();
  return data.results ?? [];
}

function chooseBestGeocodeResult(input, candidates) {
  const normalizedInput = normalizeSearchText(input);
  const preferredNames = new Set(
    [input, ...(CITY_QUERY_ALIASES[input] ?? []), ...(CITY_QUERY_ALIASES[normalizedInput] ?? [])]
      .map((value) => normalizeSearchText(value))
      .filter(Boolean)
  );
  const exactMatches = candidates.filter((candidate) => candidateMatchesInput(candidate, normalizedInput, "exact"));
  const prefixMatches = candidates.filter((candidate) => candidateMatchesInput(candidate, normalizedInput, "prefix"));
  const relevantCandidates = exactMatches.length ? exactMatches : prefixMatches.length ? prefixMatches : candidates;

  const scored = relevantCandidates.map((candidate) => {
    const candidateParts = getCandidateSearchParts(candidate);
    const normalizedName = candidateParts[0] ?? "";
    const normalizedAdmin = candidateParts[1] ?? "";
    const normalizedCountry = normalizeSearchText(candidate.country);
    const featureCode = String(candidate.feature_code ?? "");
    const population = Number(candidate.population ?? 0);
    let score = 0;

    if (preferredNames.has(normalizedName)) score += 250;
    if (normalizedName === normalizedInput) score += 120;
    if (normalizedName.startsWith(normalizedInput)) score += 80;
    if (normalizedName.includes(normalizedInput)) score += 50;
    if (candidateParts.some((part) => part === normalizedInput)) score += 90;
    if (candidateParts.some((part) => part.startsWith(normalizedInput))) score += 50;
    if (normalizedAdmin === normalizedInput) score += 40;
    if (normalizedAdmin.includes(normalizedInput)) score += 20;
    if (normalizedCountry === "대한민국") score += 10;
    if (featureCode === "PPLC") score += 80;
    else if (featureCode === "PPLA") score += 60;
    else if (featureCode.startsWith("PPL")) score += 40;
    else score -= 80;
    score += Math.min(Math.round(population / 50000), 40);

    return { candidate, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].candidate;
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/특별자치시|특별자치도|특별시|광역시|자치시|자치도|시|군|구|도/g, "");
}

function getCandidateSearchParts(candidate) {
  return [candidate.name, candidate.admin4, candidate.admin3, candidate.admin2, candidate.admin1]
    .map((part) => normalizeSearchText(part))
    .filter(Boolean);
}

function candidateMatchesInput(candidate, normalizedInput, mode = "exact") {
  if (!normalizedInput) return false;

  return getCandidateSearchParts(candidate).some((part) => {
    if (mode === "exact") {
      return part === normalizedInput;
    }

    return part.startsWith(normalizedInput) || normalizedInput.startsWith(part);
  });
}

function simplifyPrimaryLocationName(value) {
  const text = String(value ?? "").trim();
  return text.replace(/특별자치시|특별자치도|특별시|광역시$/g, "");
}

function getKnownKoreanLocation(input) {
  const normalized = normalizeSearchText(input);
  return KNOWN_KOREAN_LOCATIONS[normalized] ?? null;
}

function buildKoreanLocationLabel(location) {
  const rawParts = [location.name, location.admin4, location.admin3, location.admin2, location.admin1]
    .filter(Boolean)
    .map((part) => String(part).trim())
    .filter((part, index, array) => array.indexOf(part) === index);

  const district = rawParts.find((part) => /구$|군$/.test(part));
  const cityCandidate = rawParts.find((part) => /특별시$|광역시$|특별자치시$|시$/.test(part) && !/구$|군$/.test(part));
  const provinceCandidate = rawParts.find((part) => /도$|특별자치도$/.test(part));
  const country = location.country || "대한민국";

  if (district && cityCandidate) {
    return `${district}, ${simplifyPrimaryLocationName(cityCandidate)}, ${country}`;
  }

  if (district && provinceCandidate) {
    return `${district}, ${simplifyPrimaryLocationName(provinceCandidate)}, ${country}`;
  }

  if (cityCandidate) {
    return `${simplifyPrimaryLocationName(cityCandidate)}, ${country}`;
  }

  return `${simplifyPrimaryLocationName(location.name)}, ${country}`;
}

function getInitialCityQuery() {
  return localStorage.getItem(LAST_SEARCH_STORAGE_KEY) || DEFAULT_CITY;
}

function saveLastCityQuery(city) {
  const trimmed = String(city ?? "").trim();
  if (!trimmed) return;
  localStorage.setItem(LAST_SEARCH_STORAGE_KEY, trimmed);
}

function showStatusMessage(message) {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  elements.toast.hidden = false;
  elements.toast.textContent = message;
  toastTimer = window.setTimeout(() => {
    hideStatusMessage();
  }, 3200);
}

function hideStatusMessage() {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }

  elements.toast.hidden = true;
  elements.toast.textContent = "";
}

function getGeolocationErrorMessage(error) {
  if (!error) {
    return "위치 정보를 가져오지 못했어요. 도시 검색으로 확인해 주세요.";
  }

  if (error.code === error.PERMISSION_DENIED) {
    return "위치 권한이 허용되지 않았어요. 브라우저 설정에서 위치 권한을 허용하거나 도시 검색을 사용해 주세요.";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "현재 위치 정보를 찾지 못했어요. 잠시 후 다시 시도하거나 도시 검색을 사용해 주세요.";
  }

  if (error.code === error.TIMEOUT) {
    return "위치 확인 시간이 조금 오래 걸렸어요. 다시 시도하거나 도시 검색을 사용해 주세요.";
  }

  return "위치 정보를 가져오지 못했어요. 도시 검색으로 확인해 주세요.";
}
