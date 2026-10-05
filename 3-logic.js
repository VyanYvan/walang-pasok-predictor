// ============================================================
// 3. LOGICAL REPRESENTATION
// puro true or false statements basically
// gathers the facts and describes them with T or F or dichotomous identifier
// ============================================================

// Is this level Kinder to Grade 12? (basic education)
function isBasicEd(level) {
  return level == "Kinder" || level == "Grade 1-10" || level == "Senior High";
}

// Does the city have a strong signal (3, 4 or 5)?
function hasStrongSignal(city) {
  return city.signal >= 3;
}

// Does the city have an Orange or Red rain warning?
function hasHeavyRain(city) {
  return city.rain == "orange" || city.rain == "red";
}

// Turn a city into a short lowercase name for writing facts, like "las_pinas"
function shortName(name) {
  return name.toLowerCase().replace("ñ", "n").replace(/ /g, "_");
}

// Write down all the FACTS we know about one city, logic style.
// Example output:  signal(manila, 2).
function writeFacts(cityName, level) {
  var city = CITY_FRAMES[cityName];
  var n = shortName(cityName);
  var facts = [];
  facts.push("level(" + shortName(level) + ").");
  facts.push("signal(" + n + ", " + city.signal + ").");
  facts.push("rainfall(" + n + ", " + city.rain + ").");
  if (city.floodWarning) facts.push("flood_warning(" + n + ").");
  if (city.flooding) facts.push("flooding_reported(" + n + ").");
  if (city.announced) facts.push("announced(" + n + ").");
  if (habagat) facts.push("habagat(ncr).");
  if (rainContinues) facts.push("rain_continues(ncr).");
  var neighbors = getNeighbors(cityName);
  for (var i = 0; i < neighbors.length; i++) {
    facts.push("adjacent(" + n + ", " + shortName(neighbors[i].name) + ").");
  }
  return facts;
}

// The logical statements our system believes, written like math.
// ("←" means "is true if", "∧" means AND, "∨" means OR)
var LOGIC_STATEMENTS = [
  "suspended(C, L) ← announced(C).",
  "suspended(C, L) ← signal(C, S) ∧ S ≥ 3.",
  "suspended(C, L) ← signal(C, 2) ∧ (L = kinder ∨ L = grade_1-10).",
  "suspended(C, kinder) ← signal(C, 1).",
  "suspended(C, L) ← rainfall(C, orange ∨ red) ∧ basic_ed(L).",
  "suspended(C, L) ← flood_warning(C) ∧ basic_ed(L).",
  "basic_ed(kinder).  basic_ed(grade_1-10).  basic_ed(senior_high).",
  "pressured(C, L) ← adjacent(C, N) ∧ suspended(N, L)."
];
