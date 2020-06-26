// ====> Selectors <====
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexValues = document.querySelectorAll(".color h2");

// Initial colors when generated - This prevents us from losing our original value when messing with the brightness
let initialColors;

// ====> Functions <====
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  // Assign initialColors to an empty array that will store the original hex code values for each color
  initialColors = [];
  colorDivs.forEach((div, i) => {
    const hexText = div.children[0];
    const randomHex = generateHex();
    hexText.innerText = randomHex;

    // Add color to initialColors array
    initialColors.push(chroma(randomHex).hex());

    // Add color to background
    div.style.backgroundColor = randomHex;

    // Check text contrast
    checkTextContrast(randomHex, hexText);

    // Initial Color Sliders
    const color = chroma(randomHex);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    colorizeSliders(color, hue, brightness, saturation);
  });
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  // Saturation
  const noSaturation = color.set("hsl.s", 0);
  const fullSaturation = color.set("hsl.s", 1);
  const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation]);
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(
    0
  )}, ${scaleSaturation(1)})`;

  // Brightness
  const midBrightness = color.set("hsl.l", 0.5);
  const scaleBrightness = chroma.scale(["black", midBrightness, "white"]);
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(
    0
  )}, ${scaleBrightness(0.5)},${scaleBrightness(1)})`;

  // Hue
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
}

function hslControls(e) {
  // Get the index of the colorDiv by the controls that we are tweaking
  const index =
    e.target.getAttribute("data-hue") ||
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation");

  const sliders = e.target.parentElement.querySelectorAll(
    'input[type="range"]'
  );

  const backgroundColorHexValue = initialColors[index];
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];
  const color = chroma(backgroundColorHexValue)
    .set("hsl.s", saturation.value)
    .set("hsl.h", hue.value)
    .set("hsl.l", brightness.value);

  colorDivs[index].style.backgroundColor = color;
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const hexText = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  // Set text to updated hex code value
  hexText.innerText = color.hex();
  // Check text & icon contrast
  checkTextContrast(color, hexText);
  icons.forEach((icon) => {
    checkTextContrast(color, icon);
  });
}

// ====> Event Listeners <====
generateBtn.addEventListener("click", function () {
  randomColors();
});

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});

colorDivs.forEach((slider, index) => {
  slider.addEventListener("change", () => {
    updateTextUI(index);
  });
});
