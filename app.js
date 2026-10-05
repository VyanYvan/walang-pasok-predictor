// ============================================================
// mainly just interactivity here plus some var handling
// ============================================================

// user inputs/interaction
var selectedLevel = "Grade 1-10";
var selectedCity = "Manila";
var habagat = false;
var rainContinues = false;
var showNetwork = false;
var currentTab = "frames";

// prediction answer colors
var ANSWERS = {
  auto:      { color: "#c9302c", text: "Walang pasok (official rule)" },
  announced: { color: "#7b52d3", text: "Walang pasok (announced)" },
  likely:    { color: "#e57b1f", text: "Likely walang pasok" },
  maybe:     { color: "#d6b21e", text: "Maybe, wait for the mayor" },
  pasok:     { color: "#3f9b56", text: "Likely may pasok" }
};

// ---------- Drawing the map ----------
function drawMap() {
  var svg = "";

  // grey provinces in the back
  for (var i = 0; i < PROVINCE_SHAPES.length; i++) {
    svg += '<path class="province" d="' + PROVINCE_SHAPES[i].shape + '"/>';
  }
  for (var i = 0; i < PROVINCE_SHAPES.length; i++) {
    var p = PROVINCE_SHAPES[i];
    if (p.name != "") svg += '<text class="province-name" x="' + p.labelX + '" y="' + p.labelY + '">' + p.name + '</text>';
  }

  // goes through each of the 17 cities with their color
  for (var name in CITY_SHAPES) {
    var result = thinkAbout(name, selectedLevel);
    var color = ANSWERS[result.answer].color;
    var picked = "";
    if (name == selectedCity) picked = " picked";
    svg += '<path class="city' + picked + '" fill="' + color + '" d="' + CITY_SHAPES[name].shape + '" onclick="pickCity(\'' + name + '\')"><title>' + name + '</title></path>';
  }

  // the network lines (only if the button is on)
  if (showNetwork) {
    for (var i = 0; i < BORDERS.length; i++) {
      var a = CITY_SHAPES[BORDERS[i][0]];
      var b = CITY_SHAPES[BORDERS[i][1]];
      var thickness = Math.max(1, BORDERS[i][2] / 4);
      svg += '<line class="net-line" x1="' + a.labelX + '" y1="' + (a.labelY - 10) + '" x2="' + b.labelX + '" y2="' + (b.labelY - 10) + '" stroke-width="' + thickness + '"/>';
    }
    for (var name in CITY_SHAPES) {
      svg += '<circle class="net-dot" r="4" cx="' + CITY_SHAPES[name].labelX + '" cy="' + (CITY_SHAPES[name].labelY - 10) + '"/>';
    }
  }

  // city names that shows on top
  for (var name in CITY_SHAPES) {
    var c = CITY_SHAPES[name];
    svg += '<text class="city-name" x="' + c.labelX + '" y="' + (c.labelY + 4) + '">' + name.toUpperCase() + '</text>';
    if (c.extraLabelX) {
      svg += '<text class="city-name" x="' + c.extraLabelX + '" y="' + (c.extraLabelY + 4) + '">' + name.toUpperCase() + '</text>';
    }
  }

  var map = document.getElementById("map");
  map.setAttribute("viewBox", "0 0 " + MAP_WIDTH + " " + MAP_HEIGHT);
  map.innerHTML = svg;
}

// legend, what else
function drawLegend() {
  var html = "<b>" + selectedLevel + "</b>";
  for (var key in ANSWERS) {
    html += '<div><span class="color-box" style="background:' + ANSWERS[key].color + '"></span>' + ANSWERS[key].text + '</div>';
  }
  document.getElementById("legend").innerHTML = html;
}

// ---------- Showing the result for the picked city ----------
function showResult() {
  var result = thinkAbout(selectedCity, selectedLevel);
  var look = ANSWERS[result.answer];

  document.getElementById("resultTitle").innerText = "Result for " + selectedCity;
  document.getElementById("percent").innerText = result.points + "%";
  document.getElementById("percent").style.color = look.color;
  document.getElementById("answer").innerText = look.text;

  var list = "";
  for (var i = 0; i < result.steps.length; i++) {
    list += "<li>" + result.steps[i] + "</li>";
  }
  document.getElementById("steps").innerHTML = list;
}

// Put the picked city's weather into the city box
function fillCityBox() {
  var city = CITY_FRAMES[selectedCity];
  document.getElementById("cityTitle").innerText = "3. " + selectedCity + " (" + city.partOf + ")";
  document.getElementById("citySignal").value = city.signal;
  document.getElementById("cityRain").value = city.rain;
  document.getElementById("cityFloodWarning").checked = city.floodWarning;
  document.getElementById("cityFlooding").checked = city.flooding;
  document.getElementById("cityAnnounced").checked = city.announced;
}

// this opens whichever tab user clicks on, bunch of if statements
function openTab(name) {
  currentTab = name;
  var html = "";
  var result = thinkAbout(selectedCity, selectedLevel);

  if (name == "frames") {
    var city = CITY_FRAMES[selectedCity];
    html += "<table><tr><th>Slot</th><th>Value</th></tr>";
    html += "<tr><td>Frame</td><td>" + selectedCity + "</td></tr>";
    for (var slot in city) {
      html += "<tr><td>" + slot + "</td><td>" + city[slot] + "</td></tr>";
    }
    html += "<tr><td>answer</td><td>" + ANSWERS[result.answer].text + " (" + result.points + "%)</td></tr></table>";
    html += "<p><b>Warning frames</b></p><table><tr><th>Frame</th><th>isA</th><th>Rain per hour</th><th>No class automatically</th></tr>";
    for (var w in WARNING_FRAMES) {
      var f = WARNING_FRAMES[w];
      html += "<tr><td>" + w + "</td><td>" + f.isA + "</td><td>" + f.rainPerHour + "</td><td>" + f.autoNoClass + "</td></tr>";
    }
    html += "</table>";
  }

  if (name == "network") {
    html += "<p>Each city is a dot. A line means two cities touch. Click <b>Show network</b> on the map to see it.</p>";
    html += "<table><tr><th>Neighbor of " + selectedCity + "</th><th>Border (km)</th><th>Their answer</th></tr>";
    var neighbors = getNeighbors(selectedCity);
    for (var i = 0; i < neighbors.length; i++) {
      var theirs = thinkAbout(neighbors[i].name, selectedLevel);
      html += "<tr><td>" + neighbors[i].name + "</td><td>" + neighbors[i].km + "</td><td>" + ANSWERS[theirs.answer].text + "</td></tr>";
    }
    html += "</table>";
  }

  if (name == "logic") {
    html += "<p><b>Facts we know now:</b></p><pre>" + writeFacts(selectedCity, selectedLevel).join("\n") + "</pre>";
    html += "<p><b>Logical statements:</b></p><pre>" + LOGIC_STATEMENTS.join("\n") + "</pre>";
  }

  if (name == "rules") {
    html += "<p>Orange rows are the rules that were true for " + selectedCity + ".</p>";
    html += "<table><tr><th>ID</th><th>Rule</th><th>From</th></tr>";
    for (var i = 0; i < RULE_LIST.length; i++) {
      var r = RULE_LIST[i];
      var used = "";
      if (result.rulesUsed.indexOf(r.id) != -1) used = ' class="used"';
      html += "<tr" + used + "><td><b>" + r.id + "</b></td><td>" + r.rule + "</td><td>" + r.from + "</td></tr>";
    }
    html += "</table>";
  }

  if (name == "procedure") {
    html += "<p>The steps the system followed for " + selectedCity + ":</p><ol>";
    for (var i = 0; i < result.steps.length; i++) {
      html += "<li>" + result.steps[i] + "</li>";
    }
    html += "</ol>";
  }

  document.getElementById("tabBox").innerHTML = html;
  var buttons = document.querySelectorAll(".tabs button");
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].getAttribute("onclick").indexOf(name) != -1) buttons[i].className = "open";
    else buttons[i].className = "";
  }
}

// ---------- Update everything ----------
// pretty much is called every update of the selection or data
function updateAll() {
  drawMap();
  drawLegend();
  fillCityBox();
  showResult();
  openTab(currentTab);
}

// ---------- What happens when you click things ----------
function pickCity(name) {
  selectedCity = name;
  updateAll();
}

function changeLevel() {
  selectedLevel = document.getElementById("levelPick").value;
  updateAll();
}

function changeExtras() {
  habagat = document.getElementById("habagatBox").checked;
  rainContinues = document.getElementById("continuesBox").checked;
  updateAll();
}

function applyToAll() {
  var signal = Number(document.getElementById("allSignal").value);
  var rain = document.getElementById("allRain").value;
  for (var name in CITY_FRAMES) {
    CITY_FRAMES[name].signal = signal;
    CITY_FRAMES[name].rain = rain;
  }
  updateAll();
}

function changeCity() {
  var city = CITY_FRAMES[selectedCity];
  city.signal = Number(document.getElementById("citySignal").value);
  city.rain = document.getElementById("cityRain").value;
  city.floodWarning = document.getElementById("cityFloodWarning").checked;
  city.flooding = document.getElementById("cityFlooding").checked;
  city.announced = document.getElementById("cityAnnounced").checked;
  updateAll();
}

function toggleNetwork() {
  showNetwork = !showNetwork;
  if (showNetwork) document.getElementById("networkBtn").innerText = "Hide network";
  else document.getElementById("networkBtn").innerText = "Show network";
  drawMap();
}

// SAMPLE DATA PARA SA DEMO para instant na
function sample(which) {
  resetAllCities();
  habagat = false;
  rainContinues = false;
  var signal = 0;
  var rain = "none";

  if (which == "habagat") {
    rain = "orange";
    habagat = true;
    rainContinues = true;
  }
  if (which == "signal1") {
    signal = 1;
    rainContinues = true;
  }
  if (which == "yellow") {
    rain = "yellow";
  }

  for (var name in CITY_FRAMES) {
    CITY_FRAMES[name].signal = signal;
    CITY_FRAMES[name].rain = rain;
  }
  if (which == "habagat") CITY_FRAMES["Marikina"].flooding = true;
  if (which == "yellow") {
    CITY_FRAMES["Manila"].announced = true;
    CITY_FRAMES["Quezon City"].announced = true;
    selectedCity = "San Juan";
  }

  document.getElementById("allSignal").value = signal;
  document.getElementById("allRain").value = rain;
  document.getElementById("habagatBox").checked = habagat;
  document.getElementById("continuesBox").checked = rainContinues;
  updateAll();
}

// ---------- Start ----------
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
document.getElementById("forDay").innerText = "For " + tomorrow.toDateString();
document.getElementById("asOf").innerText = "As of " + new Date().toLocaleString();
updateAll();
