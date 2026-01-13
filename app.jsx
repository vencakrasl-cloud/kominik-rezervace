const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Lucide Icons jako inline komponenty
const Calendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const MapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const Clock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const Users = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const X = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const AlertCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// Google Calendar API konfigurace
const GOOGLE_CLIENT_ID = '906589944502-45phnl4plesvc97b227nprn4rbckfkhg.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

const KominikReservation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    lat: null,
    lon: null,
    chimneysCount: 1,
    fireplaceCleaning: false,
    selectedDate: null,
    selectedTime: null,
    notes: '',
    gdprConsent: false,
    rememberMe: false
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State pro autocomplete adresy
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Databáze všech měst a vesnic v Ústeckém a Libereckém kraji
  const CITIES_DATABASE = {
    // Děčín a okolí (do 25 km)
    'Děčín': { lat: 50.7821, lon: 14.2148, district: 'Děčín' },
    'Stará Oleška': { lat: 50.7458, lon: 14.3383, district: 'Děčín' },
    'Huntířov': { lat: 50.7556, lon: 14.1833, district: 'Děčín' },
    'Těchlovice': { lat: 50.7892, lon: 14.3172, district: 'Děčín' },
    'Bynovec': { lat: 50.7364, lon: 14.2908, district: 'Děčín' },
    'Maxičky': { lat: 50.7639, lon: 14.2678, district: 'Děčín' },
    'Boletice nad Labem': { lat: 50.7369, lon: 14.1653, district: 'Děčín' },
    'Vilsnice': { lat: 50.8044, lon: 14.2736, district: 'Děčín' },
    'Arnoltice': { lat: 50.7819, lon: 14.3061, district: 'Děčín' },
    'Velké Žernoseky': { lat: 50.7217, lon: 14.0419, district: 'Děčín' },
    'Malé Žernoseky': { lat: 50.7319, lon: 14.0608, district: 'Děčín' },
    'Bělá': { lat: 50.7750, lon: 14.0922, district: 'Děčín' },
    'Žalhostice': { lat: 50.7581, lon: 14.1056, district: 'Děčín' },
    'Nebočady': { lat: 50.7436, lon: 14.0958, district: 'Děčín' },
    'Libouchec': { lat: 50.7881, lon: 14.0553, district: 'Děčín' },
    'Chvalín': { lat: 50.7639, lon: 14.3639, district: 'Děčín' },
    'Veselé': { lat: 50.7328, lon: 14.3147, district: 'Děčín' },
    'Rájec': { lat: 50.8228, lon: 14.2958, district: 'Děčín' },
    'Mlýny': { lat: 50.8153, lon: 14.3328, district: 'Děčín' },
    'Dolní Podluží': { lat: 50.8781, lon: 14.2586, district: 'Děčín' },
    'Horní Podluží': { lat: 50.8917, lon: 14.2803, district: 'Děčín' },
    'Růžová': { lat: 50.8556, lon: 14.3103, district: 'Děčín' },
    'Jetřichovice': { lat: 50.8742, lon: 14.3506, district: 'Děčín' },
    'Vysoká Lípa': { lat: 50.8856, lon: 14.3944, district: 'Děčín' },
    'Srbská Kamenice': { lat: 50.8544, lon: 14.4558, district: 'Děčín' },
    'Janov': { lat: 50.8231, lon: 14.3781, district: 'Děčín' },
    'Labská Stráň': { lat: 50.7928, lon: 14.2111, district: 'Děčín' },
    'Prostřední Žleb': { lat: 50.8097, lon: 14.2397, district: 'Děčín' },
    'Sněžník': { lat: 50.8403, lon: 14.1739, district: 'Děčín' },
    'Ludvíkovice': { lat: 50.8442, lon: 14.1736, district: 'Děčín' },
    'Jílové': { lat: 50.7686, lon: 14.1042, district: 'Děčín' },
    'Folknáře': { lat: 50.7611, lon: 14.0781, district: 'Děčín' },
    'Červený Hrádek': { lat: 50.7439, lon: 14.0572, district: 'Děčín' },
    'Povrly': { lat: 50.6811, lon: 14.2078, district: 'Děčín' },
    'Malšovice': { lat: 50.6778, lon: 14.1861, district: 'Děčín' },
    'Sebuzín': { lat: 50.6892, lon: 14.1581, district: 'Děčín' },
    'Želenice': { lat: 50.6986, lon: 14.1378, district: 'Děčín' },
    'Úštěk': { lat: 50.5878, lon: 14.3444, district: 'Litoměřice' },
    'Staré Křečany': { lat: 50.9939, lon: 14.5067, district: 'Děčín' },
    'Benešov nad Ploučnicí': { lat: 50.7403, lon: 14.3167, district: 'Děčín' },
    'Horní Kamenice': { lat: 50.9167, lon: 14.4144, district: 'Děčín' },
    'Dolní Kamenice': { lat: 50.8917, lon: 14.3917, district: 'Děčín' },
    'Verneřice': { lat: 50.6764, lon: 14.3256, district: 'Děčín' },
    'Třebívlice': { lat: 50.6464, lon: 14.2678, district: 'Litoměřice' },
    'Býňov': { lat: 50.7103, lon: 14.3850, district: 'Děčín' },
    'Radejčín': { lat: 50.6969, lon: 14.4056, district: 'Děčín' },
    'Janská': { lat: 50.7167, lon: 14.3694, district: 'Děčín' },
    'Chlum': { lat: 50.7308, lon: 14.4111, district: 'Děčín' },
    'Kamenice': { lat: 50.7550, lon: 14.4278, district: 'Děčín' },
    'Brzánky': { lat: 50.7686, lon: 14.1267, district: 'Děčín' },
    'Valtířov': { lat: 50.7928, lon: 14.1644, district: 'Děčín' },
    'Tisá': { lat: 50.7994, lon: 14.0453, district: 'Děčín' },
    
    // Větší města v okolí
    'Rumburk': { lat: 50.9514, lon: 14.5567, district: 'Děčín' },
    'Varnsdorf': { lat: 50.9111, lon: 14.6178, district: 'Děčín' },
    'Šluknov': { lat: 51.0050, lon: 14.4526, district: 'Děčín' },
    'Krásná Lípa': { lat: 50.9178, lon: 14.5170, district: 'Děčín' },
    'Chřibská': { lat: 50.8625, lon: 14.4822, district: 'Děčín' },
    'Mikulášovice': { lat: 50.9650, lon: 14.3589, district: 'Děčín' },
    'Jiříkov': { lat: 50.9975, lon: 14.5686, district: 'Děčín' },
    'Hřensko': { lat: 50.8758, lon: 14.2478, district: 'Děčín' },
    'Mezná': { lat: 50.8839, lon: 14.2819, district: 'Děčín' },
    'Velký Šenov': { lat: 50.9794, lon: 14.4286, district: 'Děčín' },
    'Lipová': { lat: 50.9872, lon: 14.6581, district: 'Děčín' },
    
    // Liberecký kraj
    'Liberec': { lat: 50.7663, lon: 15.0543, district: 'Liberec' },
    'Jablonec nad Nisou': { lat: 50.7244, lon: 15.1711, district: 'Jablonec nad Nisou' },
    'Česká Lípa': { lat: 50.6859, lon: 14.5378, district: 'Česká Lípa' },
    'Turnov': { lat: 50.5844, lon: 15.1533, district: 'Semily' },
    'Mimoň': { lat: 50.6631, lon: 14.7194, district: 'Česká Lípa' },
    'Nový Bor': { lat: 50.7753, lon: 14.5344, district: 'Česká Lípa' }
  };

  // Načtení uložených dat při startu
  useEffect(() => {
    const savedData = localStorage.getItem('kominikFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          rememberMe: true
        }));
      } catch (e) {
        console.error('Chyba při načítání uložených dat:', e);
      }
    }
  }, []);

  // Načtení existujících rezervací z localStorage NEBO Google Calendar
  useEffect(() => {
    // Načtení Google API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', initGoogleClient);
    };
    document.body.appendChild(script);
    
    // Načti uložené rezervace z localStorage jako fallback
    const savedBookings = localStorage.getItem('kominikBookings');
    
    if (savedBookings) {
      try {
        const parsed = JSON.parse(savedBookings);
        setBookings(parsed);
      } catch (e) {
        console.error('Chyba při načítání rezervací:', e);
        loadMockBookings();
      }
    } else {
      loadMockBookings();
    }
  }, []);
  
  // Inicializace Google Calendar API
  const initGoogleClient = () => {
    window.gapi.client.init({
      clientId: GOOGLE_CLIENT_ID,
      scope: SCOPES,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(() => {
      setGapiLoaded(true);
      // Zkontroluj, jestli už je uživatel přihlášený
      const authInstance = window.gapi.auth2.getAuthInstance();
      setIsGoogleAuthorized(authInstance.isSignedIn.get());
      
      // Pokud je přihlášený, načti rezervace z kalendáře
      if (authInstance.isSignedIn.get()) {
        loadCalendarEvents();
      }
    }).catch(error => {
      console.error('Google Calendar API init failed:', error);
      setGapiLoaded(false);
    });
  };
  
  // Načtení rezervací z Google Calendar
  const loadCalendarEvents = () => {
    if (!window.gapi || !window.gapi.client || !window.gapi.client.calendar) {
      console.error('Google Calendar API not loaded');
      return;
    }
    
    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 60); // 60 dní dopředu
    
    window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    }).then(response => {
      const events = response.result.items || [];
      
      // Převeď Google Calendar události na formát aplikace
      const bookingsFromCalendar = events.map(event => {
        const start = new Date(event.start.dateTime || event.start.date);
        const end = new Date(event.end.dateTime || event.end.date);
        const duration = Math.round((end - start) / 60000); // minuty
        
        // Pokus se získat GPS z popisu
        let lat = 50.7821, lon = 14.2148; // Default Děčín
        if (event.description) {
          const latMatch = event.description.match(/lat:\s*([\d.]+)/);
          const lonMatch = event.description.match(/lon:\s*([\d.]+)/);
          if (latMatch && lonMatch) {
            lat = parseFloat(latMatch[1]);
            lon = parseFloat(lonMatch[1]);
          }
        }
        
        return {
          date: start.toISOString().split('T')[0],
          time: start.toTimeString().slice(0, 5),
          address: event.location || 'Neznámá adresa',
          lat: lat,
          lon: lon,
          duration: duration,
          customerName: event.summary || 'Rezervace',
          googleEventId: event.id
        };
      });
      
      setBookings(bookingsFromCalendar);
      // Ulož i do localStorage jako backup
      localStorage.setItem('kominikBookings', JSON.stringify(bookingsFromCalendar));
    }).catch(error => {
      console.error('Error loading calendar events:', error);
    });
  };
  
  // Mock data pro testování (pokud není Google Calendar)
  const loadMockBookings = () => {
    const mockBookings = [
      { date: '2026-01-15', time: '09:30', address: 'Česká Lípa', lat: 50.6859, lon: 14.5378, duration: 60 },
      { date: '2026-01-15', time: '14:00', address: 'Mimoň', lat: 50.6631, lon: 14.7194, duration: 60 },
      { date: '2026-01-20', time: '10:00', address: 'Liberec', lat: 50.7663, lon: 15.0543, duration: 45 },
    ];
    setBookings(mockBookings);
    localStorage.setItem('kominikBookings', JSON.stringify(mockBookings));
  };
  
  // Google přihlášení
  const handleGoogleSignIn = () => {
    if (!gapiLoaded) {
      alert('Google API se ještě nenačetlo. Zkuste to znovu za chvíli.');
      return;
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => {
      setIsGoogleAuthorized(true);
      loadCalendarEvents();
    }).catch(error => {
      console.error('Google sign in failed:', error);
      alert('Přihlášení selhalo. Zkuste to znovu.');
    });
  };

  // Výpočet délky časového slotu
  const getSlotDuration = (count, includeFireplace = false) => {
    let duration = 45 + (count - 1) * 15;
    if (includeFireplace) {
      duration += 45;
    }
    return duration;
  };

  // Geocoding funkce
  const geocodeAddress = (address, city) => {
    // Pokud máme GPS z API, použij je
    if (formData.lat && formData.lon) {
      return { lat: formData.lat, lon: formData.lon };
    }
    // Fallback na lokální databázi
    return CITIES_DATABASE[city] || { lat: 50.7821, lon: 14.2148 };
  };

  // Odstranění diakritiky z textu (Děčín → Decin)
  const removeDiacritics = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Vyhledávání adres pomocí Nominatim přes CORS proxy
  const searchAddresses = async (query) => {
    try {
      setDebugInfo(`🔍 Hledám: ${query}`);
      
      // CORS proxy pro obejití CORS omezení
      const corsProxy = 'https://corsproxy.io/?';
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=cz&limit=8&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(corsProxy + encodeURIComponent(nominatimUrl), {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        setDebugInfo(`❌ CORS proxy error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      setDebugInfo(`✅ Našlo: ${data.length} výsledků`);
      
      const results = data.map(item => {
        const parts = item.display_name.split(',').map(p => p.trim());
        const city = parts.length > 1 ? parts[1] : parts[0];
        const street = parts.length > 1 ? parts[0] : '';
        
        return {
          display: item.display_name,
          street: street,
          city: city,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          fullAddress: item.display_name
        };
      });
      
      return results;
    } catch (error) {
      setDebugInfo(`💥 Chyba: ${error.message}`);
      return [];
    }
  };

  // Backup metoda (pro pozdější použití)
  const searchWithNominatim = async (query) => {
    return [];
  };

  // Autocomplete handler
  const handleAddressInput = async (value) => {
    setAddressInput(value);
    
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setDebugInfo('');
      return;
    }
    
    setIsSearching(true);
    
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    window.searchTimeout = setTimeout(async () => {
      const results = await searchAddresses(value);
      
      if (results.length > 0) {
        setSuggestions(results);
        setShowSuggestions(true);
        setDebugInfo(`✅ Zobrazuji ${results.length} výsledků`);
      } else {
        const searchTerm = removeDiacritics(value.toLowerCase());
        const matches = [];
        
        Object.keys(CITIES_DATABASE).forEach(city => {
          const cityNormalized = removeDiacritics(city.toLowerCase());
          if (cityNormalized.includes(searchTerm)) {
            matches.push({
              display: city,
              city: city,
              street: '',
              fullAddress: city,
              lat: CITIES_DATABASE[city].lat,
              lon: CITIES_DATABASE[city].lon
            });
          }
        });
        
        setSuggestions(matches.slice(0, 8));
        setShowSuggestions(matches.length > 0);
        setDebugInfo(`📚 Lokální databáze: ${matches.length} výsledků`);
      }
      
      setIsSearching(false);
    }, 300);
  };

  // Výběr návrhu
  const selectSuggestion = (suggestion) => {
    setAddressInput(suggestion.fullAddress);
    setFormData({
      ...formData,
      address: suggestion.street || suggestion.fullAddress,
      city: suggestion.city,
      lat: suggestion.lat,
      lon: suggestion.lon
    });
    setShowSuggestions(false);
  };

  // Výpočet vzdálenosti
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Výpočet cestovního času v minutách
  // Parametry: vzdálenost v km, průměrná rychlost (výchozí 50 km/h pro okresky)
  const calculateTravelTime = (distanceKm, avgSpeedKmh = 50) => {
    // Reálná vzdálenost po silnicích je cca 1.4x větší než vzdušná čára (hory, zatáčky)
    const realDistance = distanceKm * 1.4;
    const travelTimeHours = realDistance / avgSpeedKmh;
    const travelTimeMinutes = Math.ceil(travelTimeHours * 60);
    
    // Přidání buffer času (5 min pro parkování, orientaci atd.)
    const bufferTime = 5;
    
    return travelTimeMinutes + bufferTime;
  };

  // Výpočet úhlu (směru) od Děčína
  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360; // 0-360 stupňů
  };

  // Kontrola jestli je místo "po cestě" mezi dvěma body
  const isOnRoute = (startLat, startLon, endLat, endLon, checkLat, checkLon, maxDeviationKm = 5) => {
    // Vzdálenost od start k end
    const routeDistance = calculateDistance(startLat, startLon, endLat, endLon);
    
    // Vzdálenost start → check + check → end
    const viaDistance = calculateDistance(startLat, startLon, checkLat, checkLon) +
                       calculateDistance(checkLat, checkLon, endLat, endLon);
    
    // Pokud je objížďka menší než maxDeviationKm, je to "po cestě"
    const detour = viaDistance - routeDistance;
    return detour <= maxDeviationKm;
  };

  // Kontrola stejného směru (tolerance ±45°)
  const isSameDirection = (decinLat, decinLon, point1Lat, point1Lon, point2Lat, point2Lon, tolerance = 45) => {
    const bearing1 = calculateBearing(decinLat, decinLon, point1Lat, point1Lon);
    const bearing2 = calculateBearing(decinLat, decinLon, point2Lat, point2Lon);
    
    // Rozdíl úhlů (ošetření přechodu přes 0°/360°)
    let diff = Math.abs(bearing1 - bearing2);
    if (diff > 180) diff = 360 - diff;
    
    return diff <= tolerance;
  };

  // Kontrola, jestli se slot překrývá s existující zakázkou (včetně cesty)
  const isSlotConflicting = (dateStr, timeStr, userCoords) => {
    const decinCoords = { lat: 50.7821, lon: 14.2148 }; // Děčín
    
    // Najdi všechny zakázky tentýž den
    const dayBookings = bookings.filter(b => b.date === dateStr);
    
    if (dayBookings.length === 0) return { conflict: false, optimal: false };
    
    // Převeď čas slotu na minuty od půlnoci
    const [hours, minutes] = timeStr.split(':').map(Number);
    const slotStartMinutes = hours * 60 + minutes;
    const slotDuration = getSlotDuration(formData.chimneysCount, formData.fireplaceCleaning);
    const slotEndMinutes = slotStartMinutes + slotDuration;
    
    // Seřaď zakázky podle času
    const sortedBookings = [...dayBookings].sort((a, b) => {
      const [aH, aM] = a.time.split(':').map(Number);
      const [bH, bM] = b.time.split(':').map(Number);
      return (aH * 60 + aM) - (bH * 60 + bM);
    });
    
    // === NOVÉ: Kontrola opačného směru (pokud dojezd > 15 min) ===
    for (let i = 0; i < sortedBookings.length; i++) {
      const booking = sortedBookings[i];
      const distance = calculateDistance(userCoords.lat, userCoords.lon, booking.lat, booking.lon);
      const travelTime = calculateTravelTime(distance);
      
      // Pokud dojezd > 15 minut, zkontroluj směr
      if (travelTime > 15) {
        const sameDir = isSameDirection(
          decinCoords.lat, decinCoords.lon,
          userCoords.lat, userCoords.lon,
          booking.lat, booking.lon,
          90 // Tolerance 90° (čtvrtina kompasu) - opravdu opačný směr
        );
        
        if (!sameDir) {
          return {
            conflict: true,
            reason: 'opposite_direction',
            message: `Opačný směr od existující zakázky (${travelTime} min dojezd)`,
            distance: distance.toFixed(1),
            travelTime: travelTime
          };
        }
      }
    }
    
    // Kontrola každé existující zakázky
    for (let i = 0; i < sortedBookings.length; i++) {
      const booking = sortedBookings[i];
      const [bHours, bMinutes] = booking.time.split(':').map(Number);
      const bookingStartMinutes = bHours * 60 + bMinutes;
      const bookingEndMinutes = bookingStartMinutes + booking.duration;
      
      // Vzdálenost mezi novou a existující zakázkou
      const distance = calculateDistance(
        userCoords.lat, userCoords.lon,
        booking.lat, booking.lon
      );
      
      const travelTime = calculateTravelTime(distance);
      
      // === NOVÁ LOGIKA: 4hodinové okno pro vzdálené zakázky (20+ km) ===
      
      if (distance >= 20) {
        // Najdi časový rozdíl
        const timeDifference = Math.abs(slotStartMinutes - bookingStartMinutes);
        
        if (timeDifference < 240) { // Méně než 4 hodiny
          // Musíme zkontrolovat, jestli jsou všechny mezilehlé zakázky "po cestě"
          
          // Zjisti, která zakázka je dřív
          const earlierTime = Math.min(slotStartMinutes, bookingStartMinutes);
          const laterTime = Math.max(slotStartMinutes, bookingStartMinutes);
          
          // Najdi všechny zakázky mezi nimi
          const middleBookings = sortedBookings.filter(b => {
            const [h, m] = b.time.split(':').map(Number);
            const bTime = h * 60 + m;
            return bTime > earlierTime && bTime < laterTime;
          });
          
          // Určení start a end bodu pro kontrolu trasy
          let routeStart, routeEnd;
          if (slotStartMinutes < bookingStartMinutes) {
            // Nový slot je před existující zakázkou
            routeStart = userCoords;
            routeEnd = { lat: booking.lat, lon: booking.lon };
          } else {
            // Nový slot je po existující zakázce
            routeStart = { lat: booking.lat, lon: booking.lon };
            routeEnd = userCoords;
          }
          
          // Zkontroluj, jestli jsou všechny mezilehlé zakázky "po cestě"
          const allOnRoute = middleBookings.every(mb => 
            isOnRoute(routeStart.lat, routeStart.lon, routeEnd.lat, routeEnd.lon, mb.lat, mb.lon, 5)
          );
          
          if (!allOnRoute) {
            return {
              conflict: true,
              reason: 'far_different_direction',
              distance: distance.toFixed(1),
              message: 'Zakázky vzdálené 20+ km vyžadují 4h okno NEBO všechny mezilehlé zakázky po cestě'
            };
          }
          
          // Zkontroluj, jestli se z poslední mezilehlé zakázky stihne dojet
          if (middleBookings.length > 0) {
            const lastMiddle = middleBookings[middleBookings.length - 1];
            const [lmH, lmM] = lastMiddle.time.split(':').map(Number);
            const lastMiddleEnd = lmH * 60 + lmM + lastMiddle.duration;
            
            const distToFinal = slotStartMinutes < bookingStartMinutes
              ? calculateDistance(lastMiddle.lat, lastMiddle.lon, booking.lat, booking.lon)
              : calculateDistance(lastMiddle.lat, lastMiddle.lon, userCoords.lat, userCoords.lon);
            
            const travelToFinal = calculateTravelTime(distToFinal);
            
            if (lastMiddleEnd + travelToFinal > Math.max(slotStartMinutes, bookingStartMinutes)) {
              return {
                conflict: true,
                reason: 'cannot_reach_from_middle',
                message: 'Nestihne se dojet z poslední mezilehlé zakázky'
              };
            }
          }
        }
      }
      
      // === PŮVODNÍ LOGIKA: Kontrola přesunu PŘED novou zakázkou ===
      const arrivalTime = bookingEndMinutes + travelTime;
      if (arrivalTime > slotStartMinutes && bookingStartMinutes < slotStartMinutes) {
        return {
          conflict: true,
          reason: 'travel_before',
          previousBooking: booking,
          travelTime: travelTime,
          arrivalTime: Math.floor(arrivalTime / 60) + ':' + String(arrivalTime % 60).padStart(2, '0'),
          distance: distance.toFixed(1)
        };
      }
      
      // Kontrola přesunu PO nové zakázce (na další zakázku)
      const departureTime = slotEndMinutes;
      const arrivalAtNext = departureTime + travelTime;
      if (arrivalAtNext > bookingStartMinutes && bookingStartMinutes > slotStartMinutes) {
        return {
          conflict: true,
          reason: 'travel_after',
          nextBooking: booking,
          travelTime: travelTime,
          neededDepartureTime: Math.floor((bookingStartMinutes - travelTime) / 60) + ':' + 
                               String((bookingStartMinutes - travelTime) % 60).padStart(2, '0'),
          distance: distance.toFixed(1)
        };
      }
      
      // Přímý časový konflikt
      if ((slotStartMinutes >= bookingStartMinutes && slotStartMinutes < bookingEndMinutes) ||
          (slotEndMinutes > bookingStartMinutes && slotEndMinutes <= bookingEndMinutes) ||
          (slotStartMinutes <= bookingStartMinutes && slotEndMinutes >= bookingEndMinutes)) {
        return {
          conflict: true,
          reason: 'time_overlap',
          booking: booking
        };
      }
    }
    
    // === OPTIMALIZACE: Je to stejný směr jako jiné zakázky? ===
    const sameDirectionBookings = sortedBookings.filter(b => 
      isSameDirection(decinCoords.lat, decinCoords.lon, 
                     userCoords.lat, userCoords.lon,
                     b.lat, b.lon, 45)
    );
    
    const isOptimal = sameDirectionBookings.length > 0;
    
    return { conflict: false, optimal: isOptimal };
  };


  // Generování dostupných termínů s kontrolou cestovního času
  const generateAvailableSlots = () => {
    const userCoords = geocodeAddress(formData.address, formData.city);
    const decinCoords = { lat: 50.7821, lon: 14.2148 }; // Děčín - základna
    const slots = [];
    const blockedSlots = [];
    const today = new Date();
    
    // Kontrola maximální vzdálenosti od Děčína
    const distanceFromDecin = calculateDistance(
      userCoords.lat, userCoords.lon,
      decinCoords.lat, decinCoords.lon
    );
    
    const MAX_DISTANCE = 35; // km vzdušnou čarou - maximální dosah
    const NEAR_DECIN = 10; // km - "blízko Děčína" pro ranní/večerní časy
    
    if (distanceFromDecin > MAX_DISTANCE) {
      // Pokud je místo příliš daleko, nenavrhuj žádné termíny
      setAvailableSlots([]);
      return;
    }
    
    // Určení dostupných časů podle vzdálenosti
    let timeSlots;
    if (distanceFromDecin <= NEAR_DECIN) {
      // Blízko Děčína - RANNÍ a VEČERNÍ časy (8:00 a 15:00+) - optimální pro začátek/konec dne
      timeSlots = [
        '08:00', '08:30', // RANNÍ - jen blízko Děčína
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', 
        '15:00', '15:30', '16:00', '16:30', '17:00' // VEČERNÍ - jen blízko Děčína
      ];
    } else {
      // Dál od Děčína - JEN DENNÍ časy (9:30-15:30)
      // BEZ ranních 8:00 (čas na dojezd z Děčína)
      // Konec 15:30 (čas na návrat do Děčína)
      timeSlots = [
        '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
      ];
    }
    
    for (let i = 2; i < 60; i++) { // Změna: začíná od i=2 (za 2 dny)
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      
      const nearbyBookings = bookings.filter(b => {
        if (b.date !== dateStr) return false;
        const distance = calculateDistance(userCoords.lat, userCoords.lon, b.lat, b.lon);
        return distance < 10;
      });
      
      timeSlots.forEach(time => {
        // Kontrola cestovního času a konfliktů
        const conflictCheck = isSlotConflicting(dateStr, time, userCoords);
        
        if (!conflictCheck.conflict) {
          slots.push({
            date: dateStr,
            time: time,
            optimal: conflictCheck.optimal || nearbyBookings.length > 0, // Optimální = stejný směr NEBO blízko
            nearbyCount: nearbyBookings.length,
            blocked: false
          });
        } else {
          // Přidej blokovaný slot s důvodem
          const blockMessage = conflictCheck.message || 'Nedostatečný čas pro přejezd';
          blockedSlots.push({
            date: dateStr,
            time: time,
            blocked: true,
            blockReason: blockMessage
          });
        }
      });
    }
    
    slots.sort((a, b) => {
      if (a.optimal && !b.optimal) return -1;
      if (!a.optimal && b.optimal) return 1;
      return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
    });
    
    // Kombinuj volné a blokované sloty (pro zobrazení v kalendáři)
    setAvailableSlots([...slots, ...blockedSlots]);
  };

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email && formData.phone && formData.gdprConsent) {
      if (formData.rememberMe) {
        localStorage.setItem('kominikFormData', JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }));
      } else {
        localStorage.removeItem('kominikFormData');
      }
      setStep(2);
    } else if (step === 2 && formData.address && formData.city) {
      generateAvailableSlots();
      setStep(3);
    } else if (step === 3 && formData.selectedDate && formData.selectedTime) {
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Vytvoř novou rezervaci
    const newBooking = {
      date: formData.selectedDate,
      time: formData.selectedTime,
      address: formData.city,
      lat: formData.lat || geocodeAddress(formData.address, formData.city).lat,
      lon: formData.lon || geocodeAddress(formData.address, formData.city).lon,
      duration: getSlotDuration(formData.chimneysCount, formData.fireplaceCleaning),
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      notes: formData.notes
    };
    
    // Pokud je Google Calendar připojený, přidej událost
    if (isGoogleAuthorized && window.gapi && window.gapi.client && window.gapi.client.calendar) {
      try {
        const startDateTime = new Date(`${newBooking.date}T${newBooking.time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + newBooking.duration * 60000);
        
        const event = {
          summary: `${newBooking.customerName} - ${newBooking.address}`,
          location: `${formData.address}, ${formData.city}`,
          description: `Zákazník: ${newBooking.customerName}
Email: ${newBooking.customerEmail}
Telefon: ${newBooking.customerPhone}
Počet komínů: ${formData.chimneysCount}
${formData.fireplaceCleaning ? 'Čištění krbu: Ano' : ''}
Poznámka: ${formData.notes || '-'}

GPS: lat: ${newBooking.lat}, lon: ${newBooking.lon}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'Europe/Prague'
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'Europe/Prague'
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 60 },
              { method: 'popup', minutes: 1440 } // 1 den před
            ]
          }
        };
        
        const response = await window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event
        });
        
        newBooking.googleEventId = response.result.id;
        
        // Přidej do seznamu rezervací
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        
        // Ulož do localStorage jako backup
        localStorage.setItem('kominikBookings', JSON.stringify(updatedBookings));
        
        setSubmitting(false);
        setShowConfirmation(true);
        
      } catch (error) {
        console.error('Chyba při vytváření události v Google Calendar:', error);
        alert('Nepodařilo se uložit do Google Calendar. Rezervace byla uložena lokálně.');
        
        // Fallback - ulož jen lokálně
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('kominikBookings', JSON.stringify(updatedBookings));
        
        setSubmitting(false);
        setShowConfirmation(true);
      }
    } else {
      // Google Calendar není připojený - ulož jen lokálně
      const updatedBookings = [...bookings, newBooking];
      setBookings(updatedBookings);
      localStorage.setItem('kominikBookings', JSON.stringify(updatedBookings));
      
      setTimeout(() => {
        setSubmitting(false);
        setShowConfirmation(true);
      }, 1500);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasSlots = availableSlots.some(slot => slot.date === dateStr);
      const hasOptimalSlots = availableSlots.some(slot => slot.date === dateStr && slot.optimal);
      days.push({ day: i, dateStr, hasSlots, hasOptimalSlots });
    }
    
    return days;
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Rezervace potvrzena!</h2>
          <p className="text-gray-600 mb-6">
            Děkujeme, {formData.name}! Vaše rezervace byla úspěšně vytvořena.
          </p>
          <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2"><strong>Termín:</strong> {formatDate(formData.selectedDate)}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Čas:</strong> {formData.selectedTime}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Adresa:</strong> {formData.address}, {formData.city}</p>
            <p className="text-sm text-gray-600"><strong>Počet komínů:</strong> {formData.chimneysCount}</p>
          </div>
          <button
            onClick={() => {
              setShowConfirmation(false);
              setStep(1);
              setFormData({
                name: '', email: '', phone: '', address: '', city: '',
                chimneysCount: 1, fireplaceCleaning: false, selectedDate: null, selectedTime: null, notes: '',
                gdprConsent: false, rememberMe: false
              });
            }}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Nová rezervace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rezervace čištění komína</h1>
          <p className="text-gray-600">Vyberte si vhodný termín online</p>
          
          {/* Google Calendar připojení */}
          {gapiLoaded && !isGoogleAuthorized && (
            <div className="mt-4">
              <button
                onClick={handleGoogleSignIn}
                className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Připojit Google Calendar
              </button>
              <p className="text-xs text-gray-500 mt-2">Pro synchronizaci rezervací napříč všemi zařízeními</p>
            </div>
          )}
          
          {isGoogleAuthorized && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="text-sm font-semibold">Google Calendar připojen</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Kontakt</span>
            <span>Adresa</span>
            <span>Termín</span>
            <span>Potvrzení</span>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Kontaktní údaje</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jméno a příjmení *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Jan Novák"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="jan.novak@email.cz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+420 123 456 789"
                />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={(e) => setFormData({...formData, gdprConsent: e.target.checked})}
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="gdprConsent" className="ml-3 text-sm text-gray-700">
                    Souhlasím se zpracováním osobních údajů pro účely objednávky služby čištění komínů. *
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                    className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-700">
                    Zapamatovat si moje údaje pro příští návštěvu
                  </label>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.email || !formData.phone || !formData.gdprConsent}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
              >
                Pokračovat
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Adresa a podrobnosti</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresa *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => handleAddressInput(e.target.value)}
                    onFocus={() => addressInput.length >= 3 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                    placeholder="Např: Huntirov, Děčín, Dlouhá 123..."
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ✨ Automatické vyhledávání všech adres v ČR
                </p>
                
                {/* Debug info - viditelné na mobilu */}
                {debugInfo && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    {debugInfo}
                  </div>
                )}
                
                {/* Autocomplete dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onMouseDown={() => selectSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-orange-50 transition flex items-start gap-2 border-b border-gray-100 last:border-b-0"
                      >
                        <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-800 block truncate">{suggestion.display}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Žádné výsledky */}
                {!isSearching && showSuggestions && suggestions.length === 0 && addressInput.length >= 3 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
                    Žádné výsledky pro "{addressInput}"
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Počet komínů *</label>
                <select
                  value={formData.chimneysCount}
                  onChange={(e) => setFormData({...formData, chimneysCount: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'komín' : i < 4 ? 'komíny' : 'komínů'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-start mt-4">
                <input
                  type="checkbox"
                  id="fireplaceCleaning"
                  checked={formData.fireplaceCleaning}
                  onChange={(e) => setFormData({...formData, fireplaceCleaning: e.target.checked})}
                  className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="fireplaceCleaning" className="ml-3 text-sm text-gray-700">
                  <span className="font-semibold">Přidat čištění krbu/kamen</span>
                  <span className="block text-gray-500 mt-1">+45 minut navíc</span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <Clock className="inline w-4 h-4 mr-2" />
                  Odhadovaná doba: <strong>{getSlotDuration(formData.chimneysCount, formData.fireplaceCleaning)} minut</strong>
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Zpět
                </button>
                <button
                  onClick={handleNext}
                  disabled={addressInput.length < 3}
                  className="flex-1 bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Pokračovat
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vyberte termín</h2>
            
            {availableSlots.filter(s => s.optimal).length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  <Check className="inline w-4 h-4 mr-2" />
                  Máme pro vás optimální termíny!
                </p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    const prev = new Date(currentMonth);
                    prev.setMonth(prev.getMonth() - 1);
                    setCurrentMonth(prev);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft />
                </button>
                <h3 className="text-lg font-semibold">
                  {currentMonth.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => {
                    const next = new Date(currentMonth);
                    next.setMonth(next.getMonth() + 1);
                    setCurrentMonth(next);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                
                {getDaysInMonth(currentMonth).map((day, idx) => (
                  <div key={idx}>
                    {day ? (
                      <button
                        onClick={() => day.hasSlots && setFormData({...formData, selectedDate: day.dateStr, selectedTime: null})}
                        disabled={!day.hasSlots}
                        className={`w-full aspect-square rounded-lg text-sm font-medium transition ${
                          formData.selectedDate === day.dateStr
                            ? 'bg-orange-600 text-white'
                            : day.hasOptimalSlots
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : day.hasSlots
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            : 'bg-white text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {day.day}
                      </button>
                    ) : (
                      <div className="w-full aspect-square" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {formData.selectedDate && (
              <div>
                <h3 className="font-semibold mb-3">Dostupné časy:</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableSlots
                    .filter(slot => slot.date === formData.selectedDate)
                    .map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => !slot.blocked && setFormData({...formData, selectedTime: slot.time})}
                        disabled={slot.blocked}
                        className={`py-3 rounded-lg font-medium transition ${
                          formData.selectedTime === slot.time
                            ? 'bg-orange-600 text-white'
                            : slot.blocked
                            ? 'bg-red-50 text-red-400 cursor-not-allowed border border-red-200'
                            : slot.optimal
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {slot.time}
                        {slot.blocked && <span className="block text-xs mt-1">Nedostatečný čas pro přejezd</span>}
                        {!slot.blocked && slot.optimal && <span className="block text-xs">✓ Optimální</span>}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Zpět
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.selectedDate || !formData.selectedTime}
                className="flex-1 bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Pokračovat
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shrnutí rezervace</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Jméno</p>
                <p className="font-semibold">{formData.name}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Kontakt</p>
                <p className="font-semibold">{formData.email}</p>
                <p className="font-semibold">{formData.phone}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Adresa</p>
                <p className="font-semibold">{formData.address}, {formData.city}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Termín</p>
                <p className="font-semibold text-lg">{formatDate(formData.selectedDate)} v {formData.selectedTime}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Počet komínů</p>
                <p className="font-semibold">{formData.chimneysCount}</p>
                {formData.fireplaceCleaning && (
                  <p className="text-sm text-orange-600 mt-1">+ čištění krbu/kamen</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Poznámka (volitelné)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Nějaké speciální požadavky..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Zpět
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Odesílání...' : 'Potvrdit rezervaci'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Render aplikace
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(KominikReservation));

