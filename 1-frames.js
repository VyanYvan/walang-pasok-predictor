// ============================================================
// 1. FRAME REPRESENTATION
// bale currently this is all just placeholders ready to hold data once user inputs data
// ============================================================

var CITY_FRAMES = {
  "Caloocan": { isA: "City", partOf: "NCR 3rd District", psgcCode: "1380100000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Las Piñas": { isA: "City", partOf: "NCR 4th District", psgcCode: "1380200000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Makati": { isA: "City", partOf: "NCR 4th District", psgcCode: "1380300000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Malabon": { isA: "City", partOf: "NCR 3rd District", psgcCode: "1380400000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Mandaluyong": { isA: "City", partOf: "NCR 2nd District", psgcCode: "1380500000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Manila": { isA: "City", partOf: "NCR 1st District", psgcCode: "1380600000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Marikina": { isA: "City", partOf: "NCR 2nd District", psgcCode: "1380700000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Muntinlupa": { isA: "City", partOf: "NCR 4th District", psgcCode: "1380800000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Navotas": { isA: "City", partOf: "NCR 3rd District", psgcCode: "1380900000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Parañaque": { isA: "City", partOf: "NCR 4th District", psgcCode: "1381000000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Pasay": { isA: "City", partOf: "NCR 4th District", psgcCode: "1381100000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Pasig": { isA: "City", partOf: "NCR 2nd District", psgcCode: "1381200000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Pateros": { isA: "Municipality", partOf: "NCR 4th District", psgcCode: "1381701000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Quezon City": { isA: "City", partOf: "NCR 2nd District", psgcCode: "1381300000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "San Juan": { isA: "City", partOf: "NCR 2nd District", psgcCode: "1381400000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Taguig": { isA: "City", partOf: "NCR 4th District", psgcCode: "1381500000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
  "Valenzuela": { isA: "City", partOf: "NCR 3rd District", psgcCode: "1381600000", signal: 0, rain: "none", floodWarning: false, flooding: false, announced: false },
};

// Warnings are frames too. This card says what each warning means.
var WARNING_FRAMES = {
  "Signal No. 1":   { isA: "Wind signal",      rainPerHour: "-",            autoNoClass: "Kinder" },
  "Signal No. 2":   { isA: "Wind signal",      rainPerHour: "-",            autoNoClass: "Kinder to Grade 10" },
  "Signal No. 3-5": { isA: "Wind signal",      rainPerHour: "-",            autoNoClass: "All levels, even college" },
  "Yellow rain":    { isA: "Rainfall warning", rainPerHour: "7.5 to 15 mm", autoNoClass: "None, the mayor decides" },
  "Orange rain":    { isA: "Rainfall warning", rainPerHour: "15 to 30 mm",  autoNoClass: "Kinder to Grade 12" },
  "Red rain":       { isA: "Rainfall warning", rainPerHour: "more than 30 mm", autoNoClass: "Kinder to Grade 12" }
};

// helper func to reset everything back to no data
function resetAllCities() {
  for (var name in CITY_FRAMES) {
    var city = CITY_FRAMES[name];
    city.signal = 0;
    city.rain = "none";
    city.floodWarning = false;
    city.flooding = false;
    city.announced = false;
  }
}
