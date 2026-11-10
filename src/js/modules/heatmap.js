// Real Bengaluru Google Map with single active ward pin
export function initHeatmap() {
  const container = document.getElementById('bengaluru-leaflet-map');
  const pn1 = document.getElementById('pn1');
  const pn2 = document.getElementById('pn2');
  const pn3 = document.getElementById('pn3');
  const pn4 = document.getElementById('pn4');
  const chips = document.querySelectorAll('.ward-chip');

  if (!container) return;

  const WARDS = [
    { id: 174, name: 'HSR Layout (Ward 174)', label: 'HSR Layout', lat: 12.9121, lng: 77.6446, rate: 92, active: 14, resolved: 342 },
    { id: 186, name: 'Koramangala (Ward 186)', label: 'Koramangala', lat: 12.9352, lng: 77.6245, rate: 89, active: 16, resolved: 310 },
    { id: 178, name: 'Indiranagar (Ward 178)', label: 'Indiranagar', lat: 12.9784, lng: 77.6408, rate: 88, active: 19, resolved: 296 },
    { id: 110, name: 'Whitefield (Ward 110)', label: 'Whitefield', lat: 12.9698, lng: 77.7500, rate: 65, active: 38, resolved: 185 },
    { id: 198, name: 'JP Nagar (Ward 198)', label: 'JP Nagar', lat: 12.9063, lng: 77.5857, rate: 87, active: 18, resolved: 280 },
    { id: 168, name: 'Jayanagar (Ward 168)', label: 'Jayanagar', lat: 12.9308, lng: 77.5838, rate: 91, active: 12, resolved: 330 },
    { id: 64,  name: 'Malleshwaram (Ward 64)', label: 'Malleshwaram', lat: 13.0031, lng: 77.5643, rate: 83, active: 21, resolved: 245 },
    { id: 70,  name: 'Hebbal (Ward 70)', label: 'Hebbal', lat: 13.0358, lng: 77.5970, rate: 76, active: 32, resolved: 210 },
    { id: 150, name: 'Bellandur (Ward 150)', label: 'Bellandur', lat: 12.9260, lng: 77.6762, rate: 48, active: 63, resolved: 118 },
    { id: 5,   name: 'Yelahanka (Ward 5)', label: 'Yelahanka', lat: 13.1007, lng: 77.5963, rate: 72, active: 29, resolved: 195 },
    { id: 196, name: 'Byrasandra (Ward 196)', label: 'Byrasandra', lat: 12.9248, lng: 77.5921, rate: 79, active: 27, resolved: 251 },
    { id: 84,  name: 'Marathahalli (Ward 84)', label: 'Marathahalli', lat: 12.9591, lng: 77.6974, rate: 67, active: 34, resolved: 198 },
    { id: 157, name: 'Vijayanagar (Ward 157)', label: 'Vijayanagar', lat: 12.9719, lng: 77.5306, rate: 78, active: 25, resolved: 220 },
    { id: 175, name: 'Basavanagudi (Ward 175)', label: 'Basavanagudi', lat: 12.9432, lng: 77.5753, rate: 86, active: 15, resolved: 290 },
    { id: 149, name: 'BTM Layout (Ward 149)', label: 'BTM Layout', lat: 12.9166, lng: 77.6101, rate: 84, active: 17, resolved: 275 },
    { id: 111, name: 'MG Road / Shantala (Ward 111)', label: 'MG Road', lat: 12.9716, lng: 77.6006, rate: 90, active: 11, resolved: 315 }
  ];

  function selectWardUI(data) {
    if (!data) return;
    if (pn1) pn1.textContent = data.name;
    if (pn2) pn2.textContent = `${data.rate}%`;
    if (pn3) {
      pn3.style.width = `${data.rate}%`;
      pn3.style.background = data.rate > 80 ? '#2fbf6b' : (data.rate >= 60 ? '#f0b429' : '#e5594f');
    }
    if (pn4) pn4.textContent = `${data.active} active issues · ${data.resolved} verified fixes`;

    chips.forEach(chip => {
      if (chip.getAttribute('data-wid') === String(data.id)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function initGoogleMap() {
    if (typeof L === 'undefined') {
      setTimeout(initGoogleMap, 150);
      return;
    }

    const defaultWard = WARDS.find(w => w.id === 174) || WARDS[0];

    const map = L.map(container, {
      center: [defaultWard.lat, defaultWard.lng],
      zoom: 13,
      minZoom: 10,
      maxZoom: 17,
      scrollWheelZoom: false
    });

    // Real Google Maps Street Layer (No API key needed, zero watermark)
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    }).addTo(map);

    // Single sleek Spottix location pin
    const pinIcon = L.divIcon({
      html: `<div class="active-spottix-pin">
        <svg viewBox="0 0 30 38" width="30" height="38">
          <path d="M15 0C6.7 0 0 6.5 0 14.6 0 25 15 38 15 38s15-13 15-23.4C30 6.5 23.3 0 15 0z" fill="#2fbf6b" stroke="#ffffff" stroke-width="2.5"/>
          <circle cx="15" cy="14.5" r="5.5" fill="#ffffff"/>
        </svg>
      </div>`,
      className: 'spottix-pin-wrapper',
      iconSize: [30, 38],
      iconAnchor: [15, 38],
      popupAnchor: [0, -38]
    });

    const activeMarker = L.marker([defaultWard.lat, defaultWard.lng], { icon: pinIcon }).addTo(map);
    activeMarker.bindPopup(`<b>${defaultWard.name}</b><span>${defaultWard.rate}% resolution · ${defaultWard.active} active · ${defaultWard.resolved} resolved</span>`);

    function selectWard(ward, pan = true) {
      if (!ward) return;
      activeMarker.setLatLng([ward.lat, ward.lng]);
      activeMarker.setPopupContent(`<b>${ward.name}</b><span>${ward.rate}% resolution · ${ward.active} active · ${ward.resolved} resolved</span>`);
      if (pan) {
        map.flyTo([ward.lat, ward.lng], 13, { duration: 0.8 });
      }
      activeMarker.openPopup();
      selectWardUI(ward);
    }

    // Click anywhere on map to select the closest ward
    map.on('click', (e) => {
      let closest = WARDS[0];
      let minDist = Infinity;
      WARDS.forEach(w => {
        const d = Math.hypot(w.lat - e.latlng.lat, w.lng - e.latlng.lng);
        if (d < minDist) {
          minDist = d;
          closest = w;
        }
      });
      selectWard(closest, true);
    });

    // Popular chips click handler
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const wid = parseInt(chip.getAttribute('data-wid'), 10);
        const ward = WARDS.find(w => w.id === wid);
        if (ward) {
          selectWard(ward, true);
        }
      });
    });

    // Initialize UI for default ward (HSR Layout)
    selectWardUI(defaultWard);
  }

  initGoogleMap();
}
