const array = [];
let isSorting = false;
let animationDelay = 150;
let audioCtx = null;

function init() {
  const nInput = document.getElementById("input-n");
  const n = parseInt(nInput.value);
  if (isNaN(n) || n <= 0) {
    document.getElementById("error-message").textContent =
      "Invalid input. Please enter a positive number.";
    document.getElementById("error-message").style.display = "block";
    return;
  }
  document.getElementById("error-message").style.display = "none"; // Clear the error message
  initializeArray(n);
  nInput.value = ""; // Clear the input field
}

function initializeArray(n) {
  array.length = 0; // Clear the existing array
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function play() {
  const playButton = document.querySelector(".playing");

  playButton.disabled = true; // Disable the button
  if (isSorting) {
    return;
  }
  isSorting = true; // Set flag to indicate sorting animation is starting
  playButton.disabled = true;
  const swaps = [];

  mergeSort([...array], 0, array.length - 1, swaps).then(() => {
    animate(swaps).then(() => {
      isSorting = false;
      playButton.disabled = false; // Enable the button after sorting is done
    });
  });
}

async function mergeSort(array, left, right, swaps) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    await Promise.all([
      mergeSort(array, left, mid, swaps),
      mergeSort(array, mid + 1, right, swaps),
    ]);
    await merge(array, left, mid, right, swaps);
  }
}

async function merge(array, left, mid, right, swaps) {
  const leftArray = array.slice(left, mid + 1);
  const rightArray = array.slice(mid + 1, right + 1);

  let i = 0; // Index for the left array
  let j = 0; // Index for the right array
  let k = left; // Index for the merged array

  while (i < leftArray.length && j < rightArray.length) {
    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }
    swaps.push([k, array[k]]);
    k++;
  }

  while (i < leftArray.length) {
    array[k] = leftArray[i];
    swaps.push([k, array[k]]);
    i++;
    k++;
  }

  while (j < rightArray.length) {
    array[k] = rightArray[j];
    swaps.push([k, array[k]]);
    j++;
    k++;
  }
}

async function animate(swaps) {
  for (let i = 0; i < swaps.length; i++) {
    const [index, value] = swaps[i];
    await delay(animationDelay);
    array[index] = value;
    showBars([index]);
    playNote(200 + array[index] * 500);
  }

  showBars();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function swap(array, i, j) {
  [array[i], array[j]] = [array[j], array[i]];
}

function showBars(indices) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");
    if (indices && indices.includes(i)) {
      bar.style.backgroundColor = "red";
    }
    container.appendChild(bar);
  }
}

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx =
      new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function updateSpeed() {
  const speedSlider = document.getElementById("speed-slider");
  animationDelay = 150 - speedSlider.value * 10; // Update the animation delay based on the slider value
}
