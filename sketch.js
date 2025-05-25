let simple, complex, moreComplex, negative, outline, organic, organic2;
let bgColor = '#F7ECE2';

let gridSize;
let cellSize;
let angles = [];
let targetAngles = [];
let lastUpdateTime = 0;

let gridSizeSlider, speedSlider, updateIntervalSlider, bgColorSelector;
let patternSelector, pauseButton, img;

let updateInterval = 1000;
let lerpSpeed = 0.1;
let isPaused = false;

function preload() {
  simple = loadImage('data/simple.png');
  complex = loadImage('data/complex.png');
  moreComplex = loadImage('data/moreComplex.png');
  negative = loadImage('data/negative.png');
  outline = loadImage('data/outline.png');
  organic = loadImage('data/organic.png');
  organic2 = loadImage('data/organic2.png');
}

function setup() {
  createCanvas(900, 900);
  angleMode(DEGREES);

  let uiContainer = createDiv().style('position', 'absolute')
    .style('top', '20px')
    .style('left', '940px')
    .style('width', '300px')
    .style('padding', '20px')
    .style('background-color', '#ffffffee')
    .style('box-shadow', '0 0 15px rgba(0,0,0,0.1)')
    .style('font-family', 'Arial, sans-serif')
    .style('border-radius', '12px');

  createElement('h3', 'Pattern Selector').parent(uiContainer);
  createP('Choose the tile pattern:').style('margin', '5px 0').parent(uiContainer);
  patternSelector = createSelect().style('width', '100%').style('font-size', '16px').style('padding', '8px');
  patternSelector.option('Simple');
  patternSelector.option('Complex');
  patternSelector.option('More Complex');
  patternSelector.option('Negative');
  patternSelector.option('Outline');
  patternSelector.option('Organic');
  patternSelector.option('Organic2');
  patternSelector.changed(() => updatePattern());
  patternSelector.parent(uiContainer);

  createElement('h3', 'Grid Size').parent(uiContainer);
  createP('Number of rows/columns in the grid:').style('margin', '5px 0').parent(uiContainer);
  gridSizeSlider = createSlider(2, 20, 8, 1).style('width', '100%').style('height', '20px');
  gridSizeSlider.parent(uiContainer);

  createElement('h3', 'Animation Speed').parent(uiContainer);
  createP('Smoothness of transition (lower = slower):').style('margin', '5px 0').parent(uiContainer);
  speedSlider = createSlider(0.01, 1, 0.1, 0.01).style('width', '100%').style('height', '20px');
  speedSlider.parent(uiContainer);

  createElement('h3', 'Update Interval').parent(uiContainer);
  createP('Milliseconds between tile rotations:').style('margin', '5px 0').parent(uiContainer);
  updateIntervalSlider = createSlider(100, 3000, 1000, 100).style('width', '100%').style('height', '20px');
  updateIntervalSlider.parent(uiContainer);

  createElement('h3', 'Background Color').parent(uiContainer);
  createP('Choose background color:').style('margin', '5px 0').parent(uiContainer);
  bgColorSelector = createSelect().style('width', '100%').style('font-size', '16px').style('padding', '8px');
  bgColorSelector.option('Yellow');
  bgColorSelector.option('Blue');
  bgColorSelector.option('Dark Teal');
  bgColorSelector.option('Bright Cyan');
  bgColorSelector.changed(() => {
    const val = bgColorSelector.value();
    if (val === 'Yellow') bgColor = '#F7ECE2';
    else if (val === 'Blue') bgColor = '#D0EBFF';
    else if (val === 'Dark Teal') bgColor = '#112C31';
    else if (val === 'Bright Cyan') bgColor = '#0BB7DF';
  });
  bgColorSelector.parent(uiContainer);

  createElement('h3', 'Actions').parent(uiContainer);
  pauseButton = createButton('⏸ Pause Animation')
    .style('width', '100%').style('padding', '10px').style('font-size', '16px')
    .mousePressed(togglePause);
  pauseButton.parent(uiContainer);

  let randomizeButton = createButton('🔀 Randomize Now')
    .style('width', '100%').style('padding', '10px').style('font-size', '16px')
    .mousePressed(randomizeNow);
  randomizeButton.parent(uiContainer);

  let downloadButton = createButton('⬇️ Download Image')
    .style('width', '100%').style('padding', '10px').style('font-size', '16px')
    .mousePressed(() => saveCanvas('tile_pattern', 'png'));
  downloadButton.parent(uiContainer);

  img = simple;
  gridSize = gridSizeSlider.value();
  initGrid(gridSize);
}

function draw() {
  background(bgColor);

  let newGridSize = gridSizeSlider.value();
  lerpSpeed = speedSlider.value();
  updateInterval = updateIntervalSlider.value();

  if (newGridSize !== gridSize) {
    gridSize = newGridSize;
    initGrid(gridSize);
  }

  cellSize = width / gridSize;

  if (!isPaused && millis() - lastUpdateTime > updateInterval) {
    updateTargetAngles();
    lastUpdateTime = millis();
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = i * cellSize + cellSize / 2;
      let y = j * cellSize + cellSize / 2;
      let d = dist(mouseX, mouseY, x, y);
      if (d < cellSize) {
        let angleToMouse = atan2(mouseY - y, mouseX - x);
        targetAngles[i][j] = degrees(angleToMouse);
      }

      angles[i][j] = lerpAngle(angles[i][j], targetAngles[i][j], lerpSpeed);

      push();
      translate(x, y);
      rotate(angles[i][j]);
      imageMode(CENTER);
      image(img, 0, 0, cellSize + 1, cellSize + 1);
      pop();
    }
  }
}

function initGrid(n) {
  angles = [];
  targetAngles = [];
  for (let i = 0; i < n; i++) {
    angles[i] = [];
    targetAngles[i] = [];
    for (let j = 0; j < n; j++) {
      angles[i][j] = random([0, 90, 180, 270]);
      targetAngles[i][j] = angles[i][j];
    }
  }
}

function updateTargetAngles() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      targetAngles[i][j] = random([0, 90, 180, 270]);
    }
  }
}

function lerpAngle(a, b, t) {
  let diff = (b - a + 360) % 360;
  if (diff > 180) diff -= 360;
  return (a + diff * t + 360) % 360;
}

function togglePause() {
  isPaused = !isPaused;
  pauseButton.html(isPaused ? '▶️ Resume Animation' : '⏸ Pause Animation');
}

function updatePattern() {
  const selected = patternSelector.value();
  if (selected === 'Simple') img = simple;
  else if (selected === 'Complex') img = complex;
  else if (selected === 'More Complex') img = moreComplex;
  else if (selected === 'Negative') img = negative;
  else if (selected === 'Outline') img = outline;
  else if (selected === 'Organic') img = organic;
  else if (selected === 'Organic2') img = organic2;
}

// 🆕 Randomize all — pattern, grid, bg, angles
function randomizeNow() {
  // Random pattern
  const patterns = ['Simple', 'Complex', 'More Complex', 'Negative', 'Outline', 'Organic', 'Organic2'];
  const randomPattern = random(patterns);
  patternSelector.value(randomPattern);
  updatePattern();

  // Random grid size
  const randomGrid = int(random(2, 21));
  gridSizeSlider.value(randomGrid);

  // Random background
  const bgOptions = ['Yellow', 'Blue', 'Dark Teal', 'Bright Cyan'];
  const randomBG = random(bgOptions);
  bgColorSelector.value(randomBG);
  bgColor = (randomBG === 'Yellow') ? '#F7ECE2' :
            (randomBG === 'Blue') ? '#D0EBFF' :
            (randomBG === 'Dark Teal') ? '#112C31' : '#0BB7DF';

  // Update grid and angles
  updateTargetAngles();
  lastUpdateTime = millis();
}
