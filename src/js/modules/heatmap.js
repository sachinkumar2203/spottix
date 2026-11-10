// Real Bengaluru Street & Ward Interactive Map
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

  // Check if Leaflet (L) is available
  function initLeafletMap() {
    if (typeof L === 'undefined') {
      setTimeout(initLeafletMap, 150);
      return;
    }

    const map = L.map(container, {
      center: [12.955, 77.63],
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      scrollWheelZoom: false
    });

    // Real Google Maps Street Layer
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    }).addTo(map);

    const markerMap = {};

    WARDS.forEach(ward => {
      const color = ward.rate > 80 ? '#2fbf6b' : (ward.rate >= 60 ? '#f0b429' : '#e5594f');
      const html = `<div class="ward-marker" id="marker-${ward.id}" style="background:${color}">
        ${ward.label} <span>${ward.rate}%</span>
      </div>`;

      const icon = L.divIcon({
        html: html,
        className: 'custom-ward-icon',
        iconSize: null,
        iconAnchor: [45, 16]
      });

      const marker = L.marker([ward.lat, ward.lng], { icon: icon }).addTo(map);
      marker.bindPopup(`<b>${ward.name}</b><span>${ward.rate}% resolution · ${ward.active} active · ${ward.resolved} resolved</span>`);

      marker.on('click', () => {
        document.querySelectorAll('.ward-marker.selected').forEach(el => el.classList.remove('selected'));
        const el = document.getElementById(`marker-${ward.id}`);
        if (el) el.classList.add('selected');
        selectWardUI(ward);
      });

      markerMap[ward.id] = marker;
    });

    // Chips click handler
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const wid = parseInt(chip.getAttribute('data-wid'), 10);
        const ward = WARDS.find(w => w.id === wid);
        if (ward && markerMap[wid]) {
          map.flyTo([ward.lat, ward.lng], 13, { duration: 0.8 });
          markerMap[wid].openPopup();
          document.querySelectorAll('.ward-marker.selected').forEach(el => el.classList.remove('selected'));
          const el = document.getElementById(`marker-${wid}`);
          if (el) el.classList.add('selected');
          selectWardUI(ward);
        }
      });
    });

    // Select HSR Layout by default
    const hsr = WARDS.find(w => w.id === 174);
    if (hsr) {
      selectWardUI(hsr);
      setTimeout(() => {
        const el = document.getElementById('marker-174');
        if (el) el.classList.add('selected');
      }, 300);
    }
  }

  initLeafletMap();
}
