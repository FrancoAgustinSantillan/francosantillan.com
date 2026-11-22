// Datos de la página /roci (búsqueda de roomie en CDMX).
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
};

export type Estacion = Punto & { nombre: string; lineas: (2 | 7)[] };

// Centro de la colonia Lomas de Sotelo (Miguel Hidalgo, CDMX), según OpenStreetMap.
export const zona = {
  nombre: 'Lomas de Sotelo',
  centro: { lat: 19.44974, lon: -99.2151 },
  // Límites aproximados de la colonia (sur, norte, oeste, este)
  bbox: [19.44567, 19.45344, -99.21827, -99.21121] as const,
};

// Dirección del trabajo de Roci: completar cuando la tengamos.
export const trabajo: (Punto & { direccion: string }) | null = null;

export const lineas = {
  2: { nombre: 'Línea 2', color: '#0072bc' },
  7: { nombre: 'Línea 7', color: '#f28c00' },
} as const;

// Estaciones del Metro (STC) en un radio de ~4 km. Coordenadas de OpenStreetMap.
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
