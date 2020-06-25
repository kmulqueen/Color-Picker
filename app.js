// Selectors
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexValues = document.querySelectorAll(".color h2");

// Functions
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  colorDivs.forEach((div, i) => {
    const hexText = div.children[0];
    const randomHex = generateHex();
    hexText.innerText = randomHex;

    // Add color to background
    div.style.backgroundColor = randomHex;

    // Check text contrast
    checkTextContrast(randomHex, hexText);
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

// Event Listeners
generateBtn.addEventListener("click", function () {
  randomColors();
});
