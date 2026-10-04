// ============================================================
// 5. PROCEDURAL REPRESENTATION
// A procedure = steps done in order, like a recipe.
// This is how the system THINKS about one city.
// ============================================================

function thinkAbout(cityName, level) {
  var city = CITY_FRAMES[cityName];
  var steps = [];      // what we did, so we can show it
  var rulesUsed = [];  // which rules were true

  // STEP 1: Read the facts
  steps.push("Read the facts: signal " + city.signal + ", " + city.rain + " rain, level is " + level + ".");

  // STEP 2: Check the official rules. If one is true, we are sure. Stop here.
  var officialRule = checkOfficialRules(city, level);
  if (officialRule != "") {
    rulesUsed.push(officialRule);
    steps.push("Official rule " + officialRule + " is true. That means 100% walang pasok. Stop.");
    var answer = "auto";
    if (officialRule == "R6") answer = "announced";
    return { answer: answer, points: 100, steps: steps, rulesUsed: rulesUsed };
  }
  steps.push("No official rule is true, so we have to guess using points.");

  // STEP 3: Weather points (P1 to P5, biggest one only)
  var points = 0;
  var weather = checkWeatherRules(city, level);
  if (weather.id != "") {
    points = points + weather.points;
    rulesUsed.push(weather.id);
    steps.push("Weather rule " + weather.id + ": +" + weather.points + " points.");
  } else {
    steps.push("No weather rule for this level: +0 points.");
  }

  // STEP 4: Other rain things (P6, P7, P8)
  if (city.flooding) { points = points + 25; rulesUsed.push("P6"); steps.push("Flooding reported (P6): +25 points."); }
  if (habagat)       { points = points + 10; rulesUsed.push("P7"); steps.push("Strong habagat (P7): +10 points."); }
  if (rainContinues) { points = points + 10; rulesUsed.push("P8"); steps.push("Rain will continue (P8): +10 points."); }

  // STEP 5: Look at the neighbors in the network (P9)
  // We only count neighbors that are 100% sure (official rule), not guesses.
  var neighbors = getNeighbors(cityName);
  var totalKm = 0;
  var noClassKm = 0;
  var noClassNames = [];
  for (var i = 0; i < neighbors.length; i++) {
    totalKm = totalKm + neighbors[i].km;
    var neighborCity = CITY_FRAMES[neighbors[i].name];
    if (checkOfficialRules(neighborCity, level) != "") {
      noClassKm = noClassKm + neighbors[i].km;
      noClassNames.push(neighbors[i].name);
    }
  }
  var neighborPoints = Math.round(30 * noClassKm / totalKm);
  if (neighborPoints > 0) {
    points = points + neighborPoints;
    rulesUsed.push("P9");
    steps.push("Neighbors with no classes: " + noClassNames.join(", ") + ". They cover " + noClassKm.toFixed(1) + " of " + totalKm.toFixed(1) + " km of the border (P9): +" + neighborPoints + " points.");
  } else {
    steps.push("No neighbor has walang pasok yet: +0 points.");
  }

  // STEP 6: Never say more than 95%, because only the mayor can make it official
  if (points > 95) points = 95;

  // STEP 7: Decide the answer
  var result = decide(points);
  rulesUsed.push(result.id);
  steps.push("Total is " + points + "%. Rule " + result.id + " gives the answer.");

  return { answer: result.answer, points: points, steps: steps, rulesUsed: rulesUsed };
}
