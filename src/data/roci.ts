// Datos de la página /roci (búsqueda de cuarto con roomies en CDMX y Naucalpan).
// Para sumar un depto, agregá un objeto a `deptos`. Las coordenadas (lat, lon) se pueden
// sacar de Google Maps: clic derecho sobre el lugar → copiar las coordenadas.

export type Punto = { lat: number; lon: number };

export type Depto = Punto & {
  titulo: string; // ej. "Cuarto en depto compartido, 2 roomies"
  direccion: string;
  precio?: string; // ej. "$7,500 MXN/mes"
  link?: string; // anuncio original
  notas?: string;
  estado?: 'por ver' | 'contactado' | 'visitado' | 'descartado' | 'favorito';
  // Requisitos de Roci: true = cumple, false = no cumple, sin poner = no se sabe.
  amueblada?: boolean;
  servicios?: boolean; // luz, agua e internet incluidos
  soloMujeres?: boolean;
  banoPropio?: boolean;
  fuente?: string; // dónde salió (ej. "CompartoDepto", "Facebook")
  encontrado?: string; // fecha en que se encontró, AAAA-MM-DD
};

export type Linea = 2 | 6 | 7;
export type Estacion = Punto & { nombre: string; lineas: Linea[] };

export type Zona = {
  nombre: string;
  donde: string;
  centro: Punto;
  bbox: readonly [number, number, number, number]; // sur, norte, oeste, este (aproximado)
  nota?: string;
};

// Zonas donde busca Roci. Centro y límites según OpenStreetMap.
export const zonas: Zona[] = [
  {
    nombre: 'Lomas de Sotelo',
    donde: 'Miguel Hidalgo, CDMX',
    centro: { lat: 19.44974, lon: -99.2151 },
    bbox: [19.44567, 19.45344, -99.21827, -99.21121],
  },
  {
    nombre: 'Granada',
    donde: 'Miguel Hidalgo, CDMX (incluye Ampliación Granada)',
    centro: { lat: 19.44026, lon: -99.19263 },
    bbox: [19.43741, 19.44606, -99.20586, -99.18258],
  },
  {
    nombre: 'Ciudad Satélite',
    donde: 'Naucalpan, Estado de México',
    centro: { lat: 19.51297, lon: -99.23596 },
    bbox: [19.49717, 19.52249, -99.2518, -99.21757],
    nota: 'No tiene Metro cerca: se llega a El Rosario o a Cuatro Caminos en camión o combi.',
  },
  {
    nombre: 'Lomas Verdes',
    donde: 'Naucalpan, Estado de México',
    centro: { lat: 19.51587, lon: -99.26605 },
    // OSM no tiene el límite de la colonia: es un área aproximada alrededor del centro.
    bbox: [19.5039, 19.5279, -99.2786, -99.2536],
    nota: 'Sin Metro cerca: se mueve en camión o auto.',
  },
];

// Qué busca Roci (respuestas del 21/11/2026).
export const busqueda = {
  tipo: 'Habitación en un depto ya compartido (no depto entero)',
  presupuesto: '$7,000 a $7,500 MXN/mes como máximo',
  indispensable: ['Amueblada', 'Servicios incluidos (luz, agua e internet)', 'Roomies únicamente mujeres'],
  preferible: ['Baño propio (no excluyente)'],
  indiferente: ['Mascotas', 'Estacionamiento (no lo necesita)'],
  zonas: 'Lomas de Sotelo, Granada, Satélite, Lomas Verdes u otra zona de Naucalpan que le quede cómoda para el trabajo',
  desde: 'Lo antes posible',
  plazo: 'Mínimo 3 meses, con posibilidad de extender',
};

// Trabajo de Roci. A propósito NO va la dirección exacta (la página y el repo son públicos):
// el punto es aproximado, alcanza para calcular distancias.
export const trabajo: (Punto & { direccion: string }) | null = {
  direccion: 'Naucalpan Centro, Estado de México',
  lat: 19.467,
  lon: -99.24,
};

export const lineas = {
  2: { nombre: 'Línea 2', color: '#0072bc' },
  6: { nombre: 'Línea 6', color: '#d6001c' },
  7: { nombre: 'Línea 7', color: '#f28c00' },
} as const;

// Estaciones del Metro (STC) cercanas a las zonas. Coordenadas de OpenStreetMap.
export const estaciones: Estacion[] = [
  { nombre: 'Cuatro Caminos', lineas: [2], lat: 19.460046, lon: -99.215798 },
  { nombre: 'Panteones', lineas: [2], lat: 19.458689, lon: -99.20304 },
  { nombre: 'Tacuba', lineas: [2, 7], lat: 19.458901, lon: -99.187132 },
  { nombre: 'Cuitláhuac', lineas: [2], lat: 19.457228, lon: -99.181468 },
  { nombre: 'Popotla', lineas: [2], lat: 19.45286, lon: -99.175462 },
  { nombre: 'San Joaquín', lineas: [7], lat: 19.444974, lon: -99.191795 },
  { nombre: 'Polanco', lineas: [7], lat: 19.43353, lon: -99.190915 },
  { nombre: 'Auditorio', lineas: [7], lat: 19.424985, lon: -99.192257 },
  { nombre: 'Refinería', lineas: [7], lat: 19.469603, lon: -99.190463 },
  { nombre: 'Camarones', lineas: [7], lat: 19.479104, lon: -99.190026 },
  { nombre: 'Aquiles Serdán', lineas: [7], lat: 19.49068, lon: -99.195315 },
  { nombre: 'Tezozómoc', lineas: [6], lat: 19.494938, lon: -99.19603 },
  { nombre: 'El Rosario', lineas: [6, 7], lat: 19.504675, lon: -99.199932 },
];

export const deptos: Depto[] = [
  // {
  //   titulo: 'Cuarto en depto compartido',
  //   direccion: 'Calle ..., Lomas de Sotelo, Miguel Hidalgo, CDMX',
  //   lat: 19.45, lon: -99.215,
  //   precio: '$7,500 MXN/mes',
  //   link: 'https://...',
  //   notas: 'Incluye servicios. 2 roomies.',
  //   estado: 'por ver',
  // },
];

// ---- Cálculos ----

export function distancia(a: Punto, b: Punto) {
  const R = 6371e3;
  const rad = (x: number) => (x * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)); // metros, en línea recta
}

// Caminando: la calle nunca es línea recta, así que se suma ~30 %, a 4.8 km/h (80 m/min).
export const minutosCaminando = (metros: number) => Math.round((metros * 1.3) / 80);

export const formatoDistancia = (m: number) =>
  m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;

// Más de esto ya no tiene sentido ir caminando.
export const LIMITE_A_PIE = 2500;

export const dentroDe = (p: Punto, z: Zona) =>
  p.lat >= z.bbox[0] && p.lat <= z.bbox[1] && p.lon >= z.bbox[2] && p.lon <= z.bbox[3];

// La zona donde cae un punto, o la más cercana (y a cuánto está de su centro).
export function zonaDe(p: Punto) {
  const dentro = zonas.find((z) => dentroDe(p, z));
  if (dentro) return { zona: dentro, dentro: true };
  const cerca = [...zonas].sort((a, b) => distancia(p, a.centro) - distancia(p, b.centro))[0];
  return { zona: cerca, dentro: false };
}

export function estacionesCercanas(p: Punto, n = 3) {
  return estaciones
    .map((e) => ({ ...e, metros: distancia(p, e) }))
    .sort((a, b) => a.metros - b.metros)
    .slice(0, n);
}

export const linkCaminando = (desde: Punto, hasta: Punto) =>
  `https://www.google.com/maps/dir/?api=1&origin=${desde.lat},${desde.lon}&destination=${hasta.lat},${hasta.lon}&travelmode=walking`;

export const linkTransporte = (desde: Punto, hasta: Punto) =>
  `https://www.google.com/maps/dir/?api=1&origin=${desde.lat},${desde.lon}&destination=${hasta.lat},${hasta.lon}&travelmode=transit`;
