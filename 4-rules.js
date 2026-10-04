// ============================================================
// 4. RULE-BASED REPRESENTATION (IF ... THEN ...)
// R rules = official rules from DepEd, the President (EO 66) and CHED.
//           If one is true, the answer is 100% sure. Walang pasok!
// P rules = our group's guessing rules. They add points.
// D rules = turn the points into an answer.
// ============================================================

var RULE_LIST = [
  { id: "R1", rule: "IF Signal No. 3, 4 or 5 THEN walang pasok, all levels", from: "DepEd Order 22 s. 2024, EO 66 s. 2012, CHED" },
  { id: "R2", rule: "IF Signal No. 2 AND Kinder or Grade 1-10 THEN walang pasok", from: "DepEd Order 22 s. 2024" },
  { id: "R3", rule: "IF Signal No. 1 AND Kinder THEN walang pasok", from: "DepEd Order 22 s. 2024" },
  { id: "R4", rule: "IF Orange or Red rain AND Kinder to Grade 12 THEN walang pasok", from: "DepEd Order 22 s. 2024" },
  { id: "R5", rule: "IF flood warning AND Kinder to Grade 12 THEN walang pasok", from: "DepEd Order 22 s. 2024" },
  { id: "R6", rule: "IF the mayor already announced THEN walang pasok", from: "DepEd Order 22 s. 2024, EO 66 s. 2012" },
  { id: "P1", rule: "IF Yellow rain THEN +35 points", from: "Our group (Yellow is the mayor's choice)" },
  { id: "P2", rule: "IF Signal No. 1 AND not Kinder THEN +30 points", from: "Our group" },
  { id: "P3", rule: "IF Signal No. 2 AND Senior High THEN +50 points", from: "Our group (EO 66 includes high school)" },
  { id: "P4", rule: "IF Signal No. 2 AND College THEN +40 points", from: "Our group" },
  { id: "P5", rule: "IF Orange/Red rain or flood warning AND College THEN +50 points", from: "Our group (CHED lets the LGU decide)" },
  { id: "P6", rule: "IF flooding is reported THEN +25 points", from: "Our group" },
  { id: "P7", rule: "IF habagat is strong THEN +10 points", from: "Our group" },
  { id: "P8", rule: "IF rain will continue THEN +10 points", from: "Our group" },
  { id: "P9", rule: "IF neighbor cities have no classes THEN up to +30 points", from: "Our group (uses the network)" },
  { id: "D1", rule: "IF points are 70 or more THEN likely walang pasok", from: "Our group" },
  { id: "D2", rule: "IF points are 40 to 69 THEN maybe, wait for the mayor", from: "Our group" },
  { id: "D3", rule: "IF points are below 40 THEN likely may pasok", from: "Our group" }
];

// Check the OFFICIAL rules. Gives back the rule name, or "" if none is true.
function checkOfficialRules(city, level) {
  if (city.announced) return "R6";
  if (hasStrongSignal(city)) return "R1";
  if (city.signal == 2 && (level == "Kinder" || level == "Grade 1-10")) return "R2";
  if (city.signal == 1 && level == "Kinder") return "R3";
  if (hasHeavyRain(city) && isBasicEd(level)) return "R4";
  if (city.floodWarning && isBasicEd(level)) return "R5";
  return "";
}

// Check the WEATHER guessing rules P1 to P5.
// Only the BIGGEST one counts, so we don't count the same storm twice.
function checkWeatherRules(city, level) {
  var best = { id: "", points: 0 };
  if (city.rain == "yellow" && 35 > best.points) best = { id: "P1", points: 35 };
  if (city.signal == 1 && level != "Kinder" && 30 > best.points) best = { id: "P2", points: 30 };
  if (city.signal == 2 && level == "Senior High" && 50 > best.points) best = { id: "P3", points: 50 };
  if (city.signal == 2 && level == "College" && 40 > best.points) best = { id: "P4", points: 40 };
  if ((hasHeavyRain(city) || city.floodWarning) && level == "College" && 50 > best.points) best = { id: "P5", points: 50 };
  return best;
}

// Turn points into an answer (D1, D2, D3)
function decide(points) {
  if (points >= 70) return { id: "D1", answer: "likely" };
  if (points >= 40) return { id: "D2", answer: "maybe" };
  return { id: "D3", answer: "pasok" };
}
