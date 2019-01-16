var darktheme = false;
var pcom = "";
var commandoverlay = document.getElementById('commandoverlay');

var inventory = {mercury:6, venus:1, earth:0, mars:1, jupiter:0, saturn:0, uranus:0, neptune:0};
var plots = [[], [], [], [], []];

menu('garden');
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([38, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

function toggleTheme() {
  html = document.getElementsByTagName('html')[0];
  if (darktheme) { //turn light
    html.style.setProperty("--text-color", "black");
    html.style.setProperty("--background-color", "white");
    html.style.setProperty("--border-color", "lightgray");
    html.style.setProperty("--highlight-color", "yellow");
    document.getElementById('darktheme').textContent = "dark";
    darktheme = false;
  } else { // turn dark
    html.style.setProperty("--text-color", "white");
    html.style.setProperty("--background-color", "black");
    html.style.setProperty("--border-color", "#4f4f4f");
    html.style.setProperty("--highlight-color", "#673ab7");
    document.getElementById('darktheme').textContent = "light";
    darktheme = true;
  }
  pcom = "";
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight-10 || element.scrollWidth > element.clientWidth;
}

function menu(menu) {
  pcom = "";
  commandoverlay.textContent = "";
  document.getElementById('prompt').textContent = pcom + ">";

  document.getElementById(menu).style.display = "block";
  if (menu=='garden') {
    document.getElementById('brewshop').style.display = "none";
    document.getElementById('gardenbutton').style.background = "var(--highlight-color)";
    document.getElementById('brewshopbutton').style.background = "none";
  } else {
    document.getElementById('garden').style.display = "none";
    document.getElementById('gardenbutton').style.background = "none";
    document.getElementById('brewshopbutton').style.background = "var(--highlight-color)";
  }
  window.screen = menu;
}

var s = document.getElementById('command');
var commandHistory = [];
function rememberCommand(string) {
  if (string != commandHistory[commandHistory.length-1]) {
    if (commandHistory.length <= 50) {
      commandHistory.push(string);
    } else {
      commandHistory.shift();
      commandHistory.push(string);
    }
  }
}
var histpos = -1;
function returnHistory() {
  if (commandHistory.length > 0) {
    if (histpos < 0 || commandHistory == []) {
      histpos = -1;
      s.value = "";
    } else {
      if (histpos > commandHistory.length-1) {
        histpos--;
        s.value = commandHistory[commandHistory.length-1 - histpos];
      }
      s.value = commandHistory[commandHistory.length-1 - histpos];
    }
  }
}

function checkKey(e, textarea) {
  key = (e.keyCode ? e.keyCode : e.which);
  if (key >= 48 && key <= 90 || key >= 96 && key <= 105) {
    commandoverlay.textContent = "";
  }

  if (key == 13) { //hit enter key
    //remove "type help" thing
    s.value = s.value.trim();
    if (s != "" && document.getElementById('helpline')) {
      document.getElementById('helpline').parentNode.removeChild(document.getElementById('helpline'));
    }

    if (s.value != "") {
      s.value = s.value.trim();
      rememberCommand(s.value);
      histpos = -1;
      respond(s.value);
      s.value = "";
    }
  } else if (key == 38) { // up
    histpos++;
    returnHistory();
  } else if (key == 40) { // down
    histpos--;
    returnHistory();
  } else if (key == 27) { // escape
    histpos = -1;
    pcom = "";
    document.getElementById('prompt').textContent = pcom + ">";
    commandoverlay.textContent = "";
    s.value = "";
  }
}

function createResponse(string) {
  output = document.createElement('div');
  output.style.width = "400px";
  output.style.height = "15px";
  output.style.paddingBottom = "10px";
  output.textContent = string;
  if (window.screen == 'garden') {
    document.getElementById('garden').appendChild(output);
    output.className = "o_garden";
  }
  else if (window.screen == 'brewshop') {
    document.getElementById('potions').appendChild(output);
    output.className = "o_brewshop";
  }
}
function createError(){ createResponse("what you say"); }
function createInventoryResponse(obj) {
  inventoryresponse = "";
  for (i = 0; i < Object.keys(obj).length; i++) {
    if (obj[Object.keys(obj)[i]] > 0) {
      inventoryresponse += "(" + obj[Object.keys(obj)[i]] + ") " + Object.keys(obj)[i];
      if (i != Object.keys(obj).length - 1) {
        inventoryresponse += ". ";
      }
    }
  }
  createResponse("you've got: "+ inventoryresponse);
  console.log(inventoryresponse);
}

function plant(num, plant) {
  emptyplots = [];
  successnum = 0;

  for (i=0; i < plots.length; i++) {
    if (plots[i].length==0) {
      emptyplots.push(i);
    }
  }

  if (num <= inventory[plant]) {
    for (i = 0; i < plots.length; i++) {
      if (plots[i].length == 0) {
        emptyplots.push(i);
      }
    }
    console.log("emptyplots: " + emptyplots);
    for (i = 0; i < num; i++) {
      if (i < emptyplots.length) {
        plots[emptyplots[i]].push(plant);
        successnum++;
        inventory[plant]--;
      }
      console.log(i);
      console.log(plots[emptyplots[i]]);
    }
    console.log(plots);
    if (successnum==num) { console.log(num + " " + plant + " planted."); }
    else { console.log("out of plots. "+successnum+" "+plant+" planted.") }

  } else if (num > inventory[plant]) {
    createResponse("you don't have enough of that.")
  } else {
    createResponse("what are you planting?")
    pcom = "plant";
    commandoverlay.textContent = "[number] [plant]";
  }
}

function getPlots() {
  //var plots = [[], [], [], [], []];
  getplots = "";

  for (i = 0; i < plots.length; i++) {
    if (plots[i].length == 0) {
      getplots += "[] ";
    } else {
      getplots += "[" + plots[i][0] + ": " + plots[i][1] + "%] ";
    }
  }
  console.log(getplots);
  createResponse(getplots);
}
