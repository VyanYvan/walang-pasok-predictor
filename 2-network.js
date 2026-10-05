// ============================================================
// 2. NETWORK REPRESENTATION
// representation lang natin dito is cities as nodes + their border sharing values
// the numbers are just the length of border they share, holy google
// ============================================================

var BORDERS = [
  ["Caloocan", "Malabon", 7.2],
  ["Caloocan", "Manila", 1.7],
  ["Caloocan", "Navotas", 1.5],
  ["Caloocan", "Quezon City", 13.5],
  ["Caloocan", "Valenzuela", 11.3],
  ["Las Piñas", "Muntinlupa", 7.5],
  ["Las Piñas", "Parañaque", 8.9],
  ["Makati", "Mandaluyong", 3.4],
  ["Makati", "Manila", 2.9],
  ["Makati", "Pasay", 5.6],
  ["Makati", "Pasig", 1.8],
  ["Makati", "Pateros", 2.3],
  ["Makati", "Taguig", 7.0],
  ["Malabon", "Navotas", 8.5],
  ["Malabon", "Valenzuela", 6.6],
  ["Mandaluyong", "Manila", 1.6],
  ["Mandaluyong", "Pasig", 2.9],
  ["Mandaluyong", "Quezon City", 1.6],
  ["Mandaluyong", "San Juan", 4.3],
  ["Manila", "Navotas", 0.8],
  ["Manila", "Pasay", 1.7],
  ["Manila", "Quezon City", 4.7],
  ["Manila", "San Juan", 1.2],
  ["Marikina", "Pasig", 3.1],
  ["Marikina", "Quezon City", 8.0],
  ["Muntinlupa", "Parañaque", 5.5],
  ["Muntinlupa", "Taguig", 1.4],
  ["Parañaque", "Pasay", 8.9],
  ["Parañaque", "Taguig", 5.3],
  ["Pasay", "Taguig", 3.2],
  ["Pasig", "Quezon City", 5.3],
  ["Pasig", "Taguig", 1.5],
  ["Pateros", "Taguig", 2.1],
  ["Quezon City", "San Juan", 5.9],
  ["Quezon City", "Valenzuela", 1.5],
];

// Give me a city, I give you a list of its neighbors and the border length.
function getNeighbors(cityName) {
  var neighbors = [];
  for (var i = 0; i < BORDERS.length; i++) {
    var cityA = BORDERS[i][0];
    var cityB = BORDERS[i][1];
    var km = BORDERS[i][2];
    if (cityA == cityName) {
      neighbors.push({ name: cityB, km: km });
    }
    if (cityB == cityName) {
      neighbors.push({ name: cityA, km: km });
    }
  }
  return neighbors;
}
