/* =========================================
   Geovisor de movilidad en el cantón Morona - App
   ========================================= */

const API_BASE = '/api/proxy';

const CAPAS = [
  {
    id: 'areas_protegidas', nombre: 'Areas Protegidas', grupo: 'Uso del Suelo',
    tipo: 'polygon', color: '#2e7d32', fillColor: '#4caf50', fillOpacity: 0.2, weight: 2,
    campos: { 'categoria': 'Categoria', 'cot_ord': 'COT Orden', 'area': 'Area (ha)' }
  },
  {
    id: 'macas_barrios_2016', nombre: 'Barrios de Macas', grupo: 'Uso del Suelo',
    tipo: 'polygon', color: '#7b1fa2', fillColor: '#ce93d8', fillOpacity: 0.2, weight: 1.5,
    campos: { 'des_barrio': 'Barrio', 'des_limit': 'Limite', 'des_parr': 'Parroquia' }
  },
  {
    id: 'morona_canton_2025', nombre: 'Canton Morona', grupo: 'Limites Administrativos',
    tipo: 'polygon', color: '#000000', fillColor: '#000000', fillOpacity: 0, weight: 3,
    campos: { 'dpa_descan': 'Canton', 'area_km': 'Area (km2)', 'area_ha': 'Area (ha)' }
  },
  {
    id: 'morona_parroquias_2025', nombre: 'Parroquias Morona', grupo: 'Limites Administrativos',
    tipo: 'polygon', color: '#1565c0', fillColor: '#90caf9', fillOpacity: 0.12, weight: 2,
    campos: { 'dpa_despar': 'Parroquia', 'area_km': 'Area (km2)', 'area_ha': 'Area (ha)' }
  },
  {
    id: 'morona_poblados_2025', nombre: 'Poblados', grupo: 'Poblacion',
    tipo: 'point', color: '#1a1a1a', fillColor: '#f44336', fillOpacity: 0.9, radius: 7, weight: 2,
    campos: { 'nombre': 'Nombre', 'parroquia': 'Parroquia' }
  },
  {
    id: 'morona_pob_sectores_2025', nombre: 'Sectores Poblacionales', grupo: 'Poblacion',
    tipo: 'point', color: '#1a1a1a', fillColor: '#ff9800', fillOpacity: 0.9, radius: 6, weight: 1,
    campos: { 'dpa_desloc': 'Sector' }
  },
  {
    id: 'parada_buses', nombre: 'Paradas de Buses', grupo: 'Transporte',
    tipo: 'point', color: '#2563eb', fillColor: '#ffeb3b', fillOpacity: 0.95, radius: 6, weight: 2,
    campos: {
      'nombre': 'Nombre', 'parroquia': 'Parroquia', 'sector': 'Sector',
      'tipo': 'Tipo', 'estado': 'Estado', 'peligro': 'Peligro'
    }
  },
  {
    id: 'pit_urbanos_2025', nombre: 'PIT Urbanos', grupo: 'Uso del Suelo',
    tipo: 'polygon', color: '#4e342e', fillColor: '#8d6e63', fillOpacity: 0.2, weight: 2,
    campos: {
      'poligono': 'Poligono', 'desc_categ': 'Categoria', 'tratamient': 'Tratamiento',
      'clase_suel': 'Clase Suelo', 'subclasif': 'Subclasificacion'
    }
  },
  {
    id: 'reportes_ciudadanos', nombre: 'Reportes Ciudadanos', grupo: 'Seguridad Ciudadana',
    tipo: 'point', color: '#dc2626', fillColor: '#ff1744', fillOpacity: 0.9, radius: 8, weight: 2,
    campos: {
      'nombre': 'Nombre', 'telefono': 'Telefono', 'categoria': 'Categoria',
      'descripcion': 'Descripcion', 'direccion': 'Direccion',
      'barrio_parroquia': 'Barrio/Parroquia', 'estado': 'Estado',
      'created_at': 'Fecha'
    }
  },
  {
    id: 'transp_publico_2024', nombre: 'Rutas Transporte Publico', grupo: 'Transporte',
    tipo: 'line', color: '#00695c', fillColor: '#00695c', weight: 3,
    campos: {
      'parroquias': 'Parroquias', 'tipo': 'Tipo', 'linea_cod': 'Codigo Linea',
      'ruta': 'Ruta', 'partida': 'Partida', 'llegada': 'Llegada', 'sentido': 'Sentido'
    }
  },
  {
    id: 'via_primaria_e45', nombre: 'Via Primaria (E45)', grupo: 'Red Vial',
    tipo: 'line', color: '#d32f2f', fillColor: '#d32f2f', weight: 3,
    campos: {
      'nombre': 'Nombre', 'long_km': 'Longitud (km)', 'capa_rodad': 'Capa Rodadura', 'parroquia': 'Parroquia'
    }
  },
  {
    id: 'via_secundaria_e46', nombre: 'Via Secundaria (E46)', grupo: 'Red Vial',
    tipo: 'line', color: '#f57c00', fillColor: '#f57c00', weight: 2.5,
    campos: {
      'name': 'Nombre', 'long_km': 'Longitud (km)', 'capa_rodad': 'Capa Rodadura',
      'estado_via': 'Estado', 'parroquia': 'Parroquia'
    }
  },
  {
    id: 'via_terciaria_rural', nombre: 'Vias Terciarias Rurales', grupo: 'Red Vial',
    tipo: 'line', color: '#689f38', fillColor: '#689f38', weight: 2,
    campos: {
      'nombre': 'Nombre', 'parroquia': 'Parroquia', 'est_genera': 'Estado General',
      'capa_rodad': 'Capa Rodadura', 'long_km': 'Longitud (km)'
    }
  },
  {
    id: 'vulnerabilidad_vial', nombre: 'Vulnerabilidad Vial', grupo: 'Seguridad Ciudadana',
    tipo: 'point', color: '#facc15', fillColor: '#e91e63', fillOpacity: 0.9, radius: 7, weight: 2,
    campos: {
      'nombre': 'Nombre', 'parroquia': 'Parroquia', 'sector': 'Sector',
      'tipo': 'Tipo', 'estado': 'Estado', 'peligro': 'Peligro', 'descrip': 'Descripcion'
    }
  }
];

/* ---- Agrupar por categoria ---- */
const GRUPOS = {};
CAPAS.forEach(c => {
  if (!GRUPOS[c.grupo]) GRUPOS[c.grupo] = [];
  GRUPOS[c.grupo].push(c);
});

/* ---- Mapa ---- */
const map = L.map('map', { center: [-3.2, -78.1], zoom: 9, zoomControl: false, preferCanvas: true });
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ position: 'bottomright', imperial: false, maxWidth: 200 }).addTo(map);

/* ---- Basemaps ---- */
const basemaps = {
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors', maxZoom: 19
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenTopoMap contributors', maxZoom: 17
  }),
  sat: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri, Maxar, Earthstar Geographics', maxZoom: 18
  })
};
basemaps.osm.addTo(map);

/* ---- Controles ---- */
let capas = {};
let contadores = {};

/* ---- Eventos del mapa ---- */
map.on('mousemove', e => {
  document.getElementById('coord-display').textContent =
    `Lat: ${e.latlng.lat.toFixed(5)}  Lng: ${e.latlng.lng.toFixed(5)}`;
});

map.on('zoomend', () => {
  const s = map.getSize();
  const sw = map.containerPointToLatLng([0, s.y]);
  const ne = map.containerPointToLatLng([s.x, 0]);
  const dist = ne.lat - sw.lat;
  let val = dist * 111000;
  let unit = 'm';
  if (val >= 1000) { val /= 1000; unit = 'km'; }
  document.getElementById('scale-display').textContent = `Escala: ~${val.toFixed(1)} ${unit}`;
});

/* ---- Panel toggle ---- */
document.getElementById('panel-toggle').addEventListener('click', function () {
  document.getElementById('panel').classList.toggle('collapsed');
  setTimeout(() => map.invalidateSize(), 350);
});

/* ---- Basemap switcher ---- */
document.querySelectorAll('.basemap-opt').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.basemap-opt').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    Object.values(basemaps).forEach(bm => map.removeLayer(bm));
    basemaps[this.dataset.basemap].addTo(map);
  });
});

/* ---- Legend symbols ---- */
const HOUSE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <circle cx="15" cy="15" r="14" fill="#1a1a1a" stroke="#fff" stroke-width="1.5"/>
  <path d="M15 8L7 14.5V22a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-7.5L15 8z" fill="#fff" stroke="#fff" stroke-width="0.5" stroke-linejoin="round"/>
</svg>`;

const SECTOR_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <circle cx="15" cy="15" r="14" fill="#1a1a1a" stroke="#fff" stroke-width="1.5"/>
  <path d="M15 7L6 15h3v7h12v-7h3L15 7z" fill="#ff9800" stroke="#fff" stroke-width="0.6" stroke-linejoin="round"/>
  <path d="M12 15v7h6v-7" fill="none" stroke="#fff" stroke-width="0.8"/>
  <line x1="15" y1="7" x2="15" y2="15" stroke="#fff" stroke-width="0.6"/>
</svg>`;

const REPORT_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <circle cx="15" cy="15" r="14" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>
  <line x1="15" y1="9" x2="15" y2="17" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="15" cy="21" r="1.5" fill="#fff"/>
</svg>`;

const VULNERABILITY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <path d="M15 2L1 27h28L15 2z" fill="#facc15" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M15 7L4 25h22L15 7z" fill="none" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/>
  <line x1="15" y1="13" x2="15" y2="19" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
  <circle cx="15" cy="22" r="1.2" fill="#1a1a1a"/>
</svg>`;

const BUS_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
  <circle cx="15" cy="15" r="14" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>
  <text x="15" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#fff">PB</text>
</svg>`;

function symbolHTML(c) {
  if (c.id === 'morona_poblados_2025') {
    return HOUSE_ICON_SVG;
  }
  if (c.id === 'morona_pob_sectores_2025') {
    return SECTOR_ICON_SVG;
  }
  if (c.id === 'reportes_ciudadanos') {
    return REPORT_ICON_SVG;
  }
  if (c.id === 'vulnerabilidad_vial') {
    return VULNERABILITY_ICON_SVG;
  }
  if (c.id === 'parada_buses') {
    return BUS_ICON_SVG;
  }
  if (c.tipo === 'polygon') {
    return `<svg width="22" height="16" viewBox="0 0 22 16">
      <rect x="1" y="1" width="20" height="14" rx="2"
        fill="${c.fillColor}" stroke="${c.color}" stroke-width="${Math.min(c.weight, 3)}" opacity="${c.fillOpacity + 0.3}"/></svg>`;
  }
  if (c.tipo === 'line') {
    const sw = Math.min(Math.max(c.weight, 2), 4);
    return `<svg width="22" height="8" viewBox="0 0 22 8">
      <line x1="1" y1="4" x2="21" y2="4"
        stroke="${c.color}" stroke-width="${sw}" stroke-linecap="round" opacity="0.9"/></svg>`;
  }
  const r = Math.min(Math.max(c.radius || 6, 4), 8);
  const sz = r * 2 + 6;
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}">
    <circle cx="${sz/2}" cy="${sz/2}" r="${r}"
      fill="${c.fillColor}" stroke="${c.color}" stroke-width="${Math.min(c.weight, 3)}" fill-opacity="${c.fillOpacity}"/></svg>`;
}

/* ---- Build sidebar ---- */
const GROUP_META = {
  'Uso del Suelo':            { color: '#2e7d32', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>' },
  'Limites Administrativos':  { color: '#b71c1c', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>' },
  'Poblacion':                { color: '#e65100', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  'Transporte':               { color: '#00695c', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="9" rx="2"/><rect x="4" y="12" width="16" height="6" rx="1"/><circle cx="7.5" cy="21" r="1.5"/><circle cx="16.5" cy="21" r="1.5"/></svg>' },
  'Red Vial':                 { color: '#d32f2f', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/><circle cx="12" cy="12" r="10"/></svg>' },
  'Seguridad Ciudadana':      { color: '#880e4f', icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }
};

function buildUI() {
  const container = document.getElementById('panel-layers');
  let html = '';

  for (const [grupo, capasGrupo] of Object.entries(GRUPOS)) {
    const gm = GROUP_META[grupo] || { color: '#64748b', icon: '' };
    html += `<div class="layer-group">`;
    html += `<div class="group-header" onclick="this.classList.toggle('collapsed'); resizeGroup(this)" style="border-left-color:${gm.color}">
      <svg class="group-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M6 9l6 6 6-6"/>
      </svg>
      <span class="group-icon" style="color:${gm.color}">${gm.icon}</span>
      <span class="group-name">${grupo}</span>
      <span class="group-count" id="gc_${grupo.replace(/\s/g,'_')}">${capasGrupo.length}</span>
    </div>`;
    html += `<div class="group-layers">`;
    capasGrupo.forEach(c => {
      html += `
        <div class="layer-item" data-layer="${c.id}">
          <input type="checkbox" id="cb_${c.id}" checked>
          <div class="layer-symbol">${symbolHTML(c)}</div>
          <div class="layer-info">
            <span class="layer-name" onclick="zoomToLayer('${c.id}')">${c.nombre}</span>
            <span class="layer-count-badge" id="lc_${c.id}"></span>
          </div>
        </div>`;
    });
    html += `</div></div>`;
  }

  container.innerHTML = html;

  container.querySelectorAll('.group-layers').forEach(gl => {
    gl.style.maxHeight = gl.scrollHeight + 'px';
  });

  CAPAS.forEach(c => {
    document.getElementById(`cb_${c.id}`).addEventListener('change', function () {
      if (capas[c.id]) {
        this.checked ? capas[c.id].addTo(map) : map.removeLayer(capas[c.id]);
      }
    });
  });
}

function resizeGroup(header) {
  const layers = header.nextElementSibling;
  if (header.classList.contains('collapsed')) {
    layers.style.maxHeight = '0';
  } else {
    layers.style.maxHeight = layers.scrollHeight + 'px';
  }
}

/* ---- Popups ---- */
function construirPopup(tabla, props, camposConfig, colorCapa) {
  const color = colorCapa || '#1e3a5f';
  let rows = '';
  let count = 0;

  for (const [campo, label] of Object.entries(camposConfig)) {
    let val = props[campo];
    if (val === null || val === undefined || val === '') continue;
    if (typeof val === 'string') val = val.trim();
    if (val === '') continue;

    if (typeof val === 'number') {
      val = Number.isInteger(val)
        ? val.toLocaleString('es-EC')
        : val.toLocaleString('es-EC', { maximumFractionDigits: 2 });
    }

    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
      try {
        const d = new Date(val);
        val = d.toLocaleDateString('es-EC', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      } catch (_) {}
    }

    rows += `<tr><td>${label}</td><td>${val}</td></tr>`;
    count++;
  }

  if (count === 0) {
    return `<div class="popup-content">
      <div class="popup-header" style="background:${color}"><span class="popup-dot"></span>${tabla}</div>
      <div class="popup-body"><div class="popup-empty">Sin atributos disponibles</div></div>
    </div>`;
  }

  return `<div class="popup-content">
    <div class="popup-header" style="background:${color}"><span class="popup-dot"></span>${tabla}</div>
    <div class="popup-body"><table>${rows}</table></div>
  </div>`;
}

/* ---- Cargar capa desde Supabase ---- */
async function cargarCapa(config) {
  const r = await fetch(`${API_BASE}?table=${config.id}&select=*&limit=5000`);
  if (!r.ok) throw new Error(`${config.id}: ${r.status} ${r.statusText}`);
  const datos = await r.json();
  if (!Array.isArray(datos) || datos.length === 0) return null;

  const features = [];
  datos.forEach(reg => {
    let geom = reg.geom || reg.geometry || reg.geojson;
    if (typeof geom === 'string') { try { geom = JSON.parse(geom); } catch (_) {} }
    if (geom && geom.type) {
      features.push({ type: 'Feature', properties: reg, geometry: geom });
    }
  });
  if (features.length === 0) return null;

  const fc = { type: 'FeatureCollection', features };
  const tooltipCampo = config.id === 'morona_poblados_2025' ? 'nombre'
    : config.id === 'morona_pob_sectores_2025' ? 'dpa_desloc' : null;

  const opts = {
    onEachFeature: (f, layer) => {
      layer.bindPopup(
        construirPopup(config.nombre, f.properties, config.campos, config.color),
        { maxWidth: 320, maxHeight: 350, className: 'custom-popup' }
      );
      if (tooltipCampo && f.properties[tooltipCampo]) {
        layer.bindTooltip(f.properties[tooltipCampo], {
          permanent: true,
          direction: 'top',
          offset: [0, -16],
          className: 'layer-tooltip'
        });
      }
    }
  };

  if (config.tipo === 'polygon') {
    opts.style = () => ({
      color: config.color, weight: config.weight,
      fillColor: config.fillColor, fillOpacity: config.fillOpacity
    });
  } else if (config.tipo === 'line') {
    opts.style = () => ({
      color: config.color, weight: config.weight, opacity: 0.85
    });
  } else if (config.id === 'morona_poblados_2025') {
    const houseIcon = L.divIcon({
      html: HOUSE_ICON_SVG,
      className: 'bus-stop-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
    opts.pointToLayer = (f, ll) => L.marker(ll, { icon: houseIcon });
  } else if (config.id === 'morona_pob_sectores_2025') {
    const sectorIcon = L.divIcon({
      html: SECTOR_ICON_SVG,
      className: 'bus-stop-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
    opts.pointToLayer = (f, ll) => L.marker(ll, { icon: sectorIcon });
  } else if (config.id === 'reportes_ciudadanos') {
    const reportIcon = L.divIcon({
      html: REPORT_ICON_SVG,
      className: 'bus-stop-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
    opts.pointToLayer = (f, ll) => L.marker(ll, { icon: reportIcon });
  } else if (config.id === 'vulnerabilidad_vial') {
    const vulnIcon = L.divIcon({
      html: VULNERABILITY_ICON_SVG,
      className: 'bus-stop-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
    opts.pointToLayer = (f, ll) => L.marker(ll, { icon: vulnIcon });
  } else if (config.id === 'parada_buses') {
    const busIcon = L.divIcon({
      html: BUS_ICON_SVG,
      className: 'bus-stop-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
    opts.pointToLayer = (f, ll) => L.marker(ll, { icon: busIcon });
  } else if (config.tipo === 'point') {
    opts.pointToLayer = (f, ll) => L.circleMarker(ll, {
      radius: config.radius, fillColor: config.fillColor,
      color: config.color, weight: config.weight, fillOpacity: config.fillOpacity
    });
  }

  return L.geoJSON(fc, opts);
}

/* ---- Zoom a capa ---- */
function zoomToLayer(id) {
  if (capas[id] && capas[id].getLayers().length > 0) {
    const bounds = capas[id].getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
  }
}

/* ---- Cargar todas las capas ---- */
async function cargarTodas() {
  buildUI();
  const total = CAPAS.length;
  let cargadas = 0;

  for (let i = 0; i < total; i++) {
    const c = CAPAS[i];
    document.getElementById('loading-detail').textContent = `${i + 1}/${total}: ${c.nombre}...`;
    try {
      const capa = await cargarCapa(c);
      if (capa) {
        capa.addTo(map);
        capas[c.id] = capa;
        contadores[c.id] = capa.getLayers().length;
        const lc = document.getElementById(`lc_${c.id}`);
        if (lc) lc.textContent = `${contadores[c.id]}`;
        cargadas++;
      }
    } catch (e) {
      console.error(e);
    }
  }

  document.getElementById('loading-overlay').classList.add('hidden');
  document.getElementById('layer-status').textContent = `${cargadas}/${total} capas`;
}

/* ---- Iniciar ---- */
cargarTodas();

/* =========================================
   MODULO DE REPORTES CIUDADANOS
   ========================================= */

let reporteActivo = false;
let markerTemporal = null;
let latSeleccionada = null;
let lonSeleccionada = null;

const btnReportar   = document.getElementById('btn-reportar');
const modal         = document.getElementById('reporte-modal');
const modalClose    = document.getElementById('modal-close');
const form          = document.getElementById('reporte-form');
const btnCancel     = document.getElementById('btn-cancelar');
const btnEnviar     = document.getElementById('btn-enviar');
const exitoPanel    = document.getElementById('reporte-exito');
const coordSel      = document.getElementById('coord-seleccionada');
const reportBanner  = document.getElementById('report-banner');
const bannerCancel  = document.getElementById('banner-cancel');

function abrirFormulario() {
  modal.classList.remove('hidden');
  coordSel.textContent = `${latSeleccionada}, ${lonSeleccionada}`;
  coordSel.classList.add('selected');
}

function cerrarModal() {
  modal.classList.add('hidden');
  desactivarReporte();
  limpiarMarcador();
}

function resetFormulario() {
  form.reset();
  form.classList.remove('hidden');
  exitoPanel.classList.add('hidden');
  latSeleccionada = null;
  lonSeleccionada = null;
  coordSel.textContent = 'Sin seleccionar';
  coordSel.classList.remove('selected');
  btnEnviar.disabled = false;
  btnEnviar.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
    Enviar Reporte`;
}

function setCapasNoInteractivas(noInteractivas) {
  const paneles = map.getContainer().querySelectorAll(
    '.leaflet-overlay-pane, .leaflet-marker-pane, .leaflet-shadow-pane'
  );
  paneles.forEach(p => {
    p.style.pointerEvents = noInteractivas ? 'none' : '';
  });
}

function desactivarReporte() {
  reporteActivo = false;
  document.getElementById('map').classList.remove('map-reporting');
  map.getContainer().style.cursor = '';
  reportBanner.classList.add('hidden');
  setCapasNoInteractivas(false);
  map.off('click', onMapClickReporte);
}

function limpiarMarcador() {
  if (markerTemporal) {
    map.removeLayer(markerTemporal);
    markerTemporal = null;
  }
}

function activarSeleccion() {
  reporteActivo = true;
  resetFormulario();
  limpiarMarcador();
  document.getElementById('map').classList.add('map-reporting');
  map.getContainer().style.cursor = 'crosshair';
  reportBanner.classList.remove('hidden');
  setCapasNoInteractivas(true);
  map.on('click', onMapClickReporte);
}

function onMapClickReporte(e) {
  latSeleccionada = parseFloat(e.latlng.lat.toFixed(6));
  lonSeleccionada = parseFloat(e.latlng.lng.toFixed(6));

  limpiarMarcador();

  markerTemporal = L.circleMarker([latSeleccionada, lonSeleccionada], {
    radius: 10,
    fillColor: '#ef4444',
    color: '#fff',
    weight: 3,
    fillOpacity: 0.9
  }).addTo(map);

  desactivarReporte();
  abrirFormulario();
}

btnReportar.addEventListener('click', () => {
  activarSeleccion();
});

bannerCancel.addEventListener('click', () => {
  desactivarReporte();
});

modalClose.addEventListener('click', cerrarModal);
btnCancel.addEventListener('click', cerrarModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!latSeleccionada || !lonSeleccionada) {
    alert('Selecciona una ubicacion en el mapa primero.');
    return;
  }

  const nombre      = document.getElementById('rep-nombre').value.trim();
  const telefono    = document.getElementById('rep-telefono').value.trim();
  const categoria   = document.getElementById('rep-categoria').value;
  const descripcion = document.getElementById('rep-descripcion').value.trim();
  const direccion   = document.getElementById('rep-direccion').value.trim();
  const barrio      = document.getElementById('rep-barrio').value.trim();

  if (!nombre || !categoria || !descripcion) {
    alert('Completa los campos obligatorios: Nombre, Categoria y Descripcion.');
    return;
  }

  btnEnviar.disabled = true;
  btnEnviar.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"/>
    </svg>
    Enviando...`;

  const body = {
    nombre,
    telefono: telefono || null,
    categoria,
    descripcion,
    direccion: direccion || null,
    barrio_parroquia: barrio || null,
    lat: latSeleccionada,
    lon: lonSeleccionada
  };

  try {
    const r = await fetch(`${API_BASE}?table=reportes_ciudadanos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error(err);
    }

    form.classList.add('hidden');
    exitoPanel.classList.remove('hidden');

    limpiarMarcador();
    recargarCapaReportes();

    setTimeout(() => cerrarModal(), 3000);

  } catch (err) {
    console.error('Error al enviar reporte:', err);
    alert('Error al enviar el reporte. Intenta de nuevo.');
    btnEnviar.disabled = false;
    btnEnviar.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
      Enviar Reporte`;
  }
});

async function recargarCapaReportes() {
  const config = CAPAS.find(c => c.id === 'reportes_ciudadanos');
  if (!config) return;

  if (capas['reportes_ciudadanos']) {
    map.removeLayer(capas['reportes_ciudadanos']);
  }

  try {
    const capa = await cargarCapa(config);
    if (capa) {
      capa.addTo(map);
      capas['reportes_ciudadanos'] = capa;
      contadores['reportes_ciudadanos'] = capa.getLayers().length;
      const lc = document.getElementById('lc_reportes_ciudadanos');
      if (lc) lc.textContent = `${contadores['reportes_ciudadanos']}`;
    }
  } catch (e) {
    console.error('Error al recargar reportes:', e);
  }
}

/* =========================================
   EXPORTAR MAPA A PDF
   ========================================= */

document.getElementById('btn-pdf').addEventListener('click', generatePDF);

async function generatePDF() {
  const btn = document.getElementById('btn-pdf');
  btn.disabled = true;
  btn.textContent = 'Generando...';

  try {
    await new Promise(r => setTimeout(r, 300));

    const mapEl = document.getElementById('map');
    const canvas = await html2canvas(mapEl, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      backgroundColor: null
    });

    const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const pageW = 297;
    const pageH = 210;
    const margin = 12;
    const headerH = 22;
    const footerH = 14;

    /* ---- Fondo y borde ---- */
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageW, pageH, 'F');
    pdf.setDrawColor(30, 58, 95);
    pdf.setLineWidth(0.8);
    pdf.rect(4, 4, pageW - 8, pageH - 8);

    /* ---- Header ---- */
    pdf.setFillColor(30, 58, 95);
    pdf.rect(4, 4, pageW - 8, headerH, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Geovisor de movilidad en el cantón Morona', margin, 17);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Cantón Morona, Morona Santiago — Supabase / PostGIS', margin, 23);

    const now = new Date();
    const fecha = now.toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' });
    pdf.setFontSize(8);
    pdf.text(`Fecha: ${fecha}`, pageW - margin - 30, 17);

    const center = map.getCenter();
    pdf.text(`Centro: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`, pageW - margin - 30, 22);

    /* ---- Mapa ---- */
    const mapTop = headerH + 8;
    const legendW = 58;
    const mapAreaW = pageW - margin * 2 - legendW - 4;
    const mapAreaH = pageH - headerH - footerH - 14;
    const imgRatio = canvas.width / canvas.height;
    let imgW = mapAreaW;
    let imgH = imgW / imgRatio;
    if (imgH > mapAreaH) {
      imgH = mapAreaH;
      imgW = imgH * imgRatio;
    }
    const imgX = margin;
    const imgY = mapTop;

    pdf.setDrawColor(180, 180, 180);
    pdf.setLineWidth(0.3);
    pdf.rect(imgX, imgY, imgW, imgH);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgW, imgH);

    /* ---- Leyenda ---- */
    const legX = imgX + imgW + 6;
    const legY = imgY;
    const legW = legendW;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(30, 58, 95);
    pdf.setLineWidth(0.4);

    const activas = CAPAS.filter(c => {
      const cb = document.getElementById(`cb_${c.id}`);
      return cb && cb.checked && capas[c.id];
    });

    let legContentH = 16;
    activas.forEach(() => { legContentH += 10; });
    const legH = Math.min(legContentH, mapAreaH);

    pdf.rect(legX, legY, legW, legH, 'FD');

    pdf.setFillColor(30, 58, 95);
    pdf.rect(legX, legY, legW, 9, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('LEYENDA', legX + legW / 2, legY + 6, { align: 'center' });

    let ly = legY + 14;
    activas.forEach(c => {
      if (ly > legY + legH - 4) return;

      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.15);
      pdf.line(legX + 2, ly - 3, legX + legW - 2, ly - 3);

      if (c.tipo === 'polygon') {
        const fc = hexToRgb(c.fillColor);
        const sc = hexToRgb(c.color);
        pdf.setFillColor(fc.r, fc.g, fc.b);
        pdf.setDrawColor(sc.r, sc.g, sc.b);
        pdf.setLineWidth(0.3);
        pdf.rect(legX + 3, ly - 3.5, 5, 3.5, 'FD');
      } else if (c.tipo === 'line') {
        const lc = hexToRgb(c.color);
        pdf.setDrawColor(lc.r, lc.g, lc.b);
        pdf.setLineWidth(c.weight > 2 ? 0.8 : 0.5);
        pdf.line(legX + 3, ly - 1.8, legX + 8, ly - 1.8);
      } else {
        const fc = hexToRgb(c.fillColor);
        const sc = hexToRgb(c.color);
        pdf.setFillColor(fc.r, fc.g, fc.b);
        pdf.setDrawColor(sc.r, sc.g, sc.b);
        pdf.setLineWidth(0.3);
        pdf.circle(legX + 5.5, ly - 1.8, 2, 'FD');
      }

      pdf.setTextColor(30, 41, 59);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      const label = c.nombre.length > 22 ? c.nombre.substring(0, 20) + '…' : c.nombre;
      pdf.text(label, legX + 11, ly - 0.8);

      ly += 10;
    });

    /* ---- Footer ---- */
    const footY = pageH - footerH - 2;
    pdf.setDrawColor(30, 58, 95);
    pdf.setLineWidth(0.4);
    pdf.line(margin, footY, pageW - margin, footY);

    /* Escala gráfica — calculada del estado real del mapa */
    const latRad = center.lat * Math.PI / 180;
    const metersPerPx = 156543.03392 * Math.cos(latRad) / Math.pow(2, map.getZoom());
    const containerW = mapEl.offsetWidth;
    const barLenMm = 40;
    const barRealM = metersPerPx * (containerW / imgW) * barLenMm;

    let barLabel;
    let barUnit;
    if (barRealM >= 1000) {
      barLabel = Math.round(barRealM / 1000);
      barUnit = 'km';
    } else {
      barLabel = Math.round(barRealM / 100);
      barUnit = '000 m';
    }
    const barReal = barUnit === 'km' ? barLabel * 1000 : barLabel * 100;

    const scaleDenom = Math.round(metersPerPx * (containerW / imgW) * 1000);
    const scaleText = `1 : ${scaleDenom.toLocaleString('es')}`;

    pdf.setFontSize(7);
    pdf.setTextColor(80, 80, 80);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Escala:', margin, footY + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(scaleText, margin + 14, footY + 5);

    const sx = margin;
    const sy = footY + 8;
    const segs = 4;
    const segW = barLenMm / segs;
    const segReal = barReal / segs;

    for (let i = 0; i < segs; i++) {
      pdf.setFillColor(i % 2 === 0 ? 30 : 255, i % 2 === 0 ? 58 : 255, i % 2 === 0 ? 95 : 255);
      pdf.rect(sx + i * segW, sy, segW, 2, 'F');
    }
    pdf.setDrawColor(30, 58, 95);
    pdf.setLineWidth(0.2);
    pdf.rect(sx, sy, barLenMm, 2);

    pdf.setFontSize(5.5);
    pdf.setTextColor(30, 41, 59);
    for (let i = 0; i <= segs; i++) {
      const val = segReal * i;
      const txt = val >= 1000 ? (val / 1000).toFixed(barReal >= 5000 ? 0 : 1) + ' km' : Math.round(val) + ' m';
      pdf.text(txt, sx + i * segW, sy + 5, { align: i === 0 ? 'left' : i === segs ? 'right' : 'center' });
    }

    /* Rosa de los vientos / Norte */
    const nx = pageW - margin - 14;
    const ny = footY - 1;
    drawNorthArrow(pdf, nx, ny, 10);

    /* Fuentes / Créditos */
    pdf.setFontSize(5.5);
    pdf.setTextColor(140, 140, 140);
    pdf.setFont('helvetica', 'italic');
    const basemapName = document.querySelector('.basemap-opt.active')?.textContent?.trim() || 'Mapa';
    pdf.text(`Mapa base: ${basemapName} | Datos: Supabase/PostGIS | Generado: ${fecha}`, margin, footY + 12);

    pdf.save('geovisor_movilidad_morona.pdf');

  } catch (err) {
    console.error('Error al generar PDF:', err);
    alert('Error al generar el PDF. Intenta de nuevo.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
      PDF`;
  }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16)
  };
}

function drawNorthArrow(pdf, cx, cy, size) {
  const s = size;
  pdf.setFillColor(30, 58, 95);
  pdf.setDrawColor(30, 58, 95);

  pdf.triangle(cx, cy - s, cx - s * 0.35, cy + s * 0.1, cx + s * 0.35, cy + s * 0.1, 'F');

  pdf.setFillColor(255, 255, 255);
  pdf.triangle(cx, cy - s * 0.1, cx - s * 0.35, cy + s * 0.1, cx + s * 0.35, cy + s * 0.1, 'F');

  pdf.setDrawColor(30, 58, 95);
  pdf.setLineWidth(0.3);
  pdf.line(cx, cy - s, cx - s * 0.35, cy + s * 0.1);
  pdf.line(cx, cy - s, cx + s * 0.35, cy + s * 0.1);
  pdf.line(cx - s * 0.35, cy + s * 0.1, cx + s * 0.35, cy + s * 0.1);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(30, 58, 95);
  pdf.text('N', cx, cy - s - 2, { align: 'center' });
}
