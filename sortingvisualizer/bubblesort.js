const array = [];
let animationDelay = 150; 
let audioCtx = null;
let isSorting = false;
init();
function init() {
    const nInput = document.getElementById("input-n");
    const n = parseInt(nInput.value);
    if (isNaN(n) || n <= 0) {
        document.getElementById("error-message").textContent = "Invalid input. Please enter a positive number.";
                document.getElementById("error-message").style.display = "block";
                return;
            }
            document.getElementById("error-message").style.display = "none";  // Clear the error message
    initializeArray(n);
    nInput.value = ''; // Clear the input field
}

function initializeArray(n) {
    array.length = 0; // Clear the existing array
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const playButton = document.querySelector('.playing');
   
    playButton.disabled = true; // Disable the button
    if (isSorting) {
      return;
    }
    isSorting = true; // Set flag to indicate sorting animation is starting
    playButton.disabled = true;
    const swaps = bubbleSort([...array]);
   
    animate(swaps).then(() => {
      isSorting = false;
      playButton.disabled = false; // Enable the button after sorting is done
    });
  }

function animate(swaps){
    if(swaps.length==0){
        showBars();
        return;
    }
    const [i,j]=swaps.shift(0);
    [array[i],array[j]]=[array[j],array[i]];
    showBars([i,j]);
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);

    setTimeout(function(){
        animate(swaps);
    },animationDelay);
}

function bubbleSort(array){
    const swaps=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            if(array[i-1]>array[i]){
                swaps.push([i-1,i]);
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return swaps;
}

function showBars(indices){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");
        if(indices && indices.includes(i)){
            bar.style.backgroundColor="red";
        }
        container.appendChild(bar);
    }   
}

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}


function updateSpeed() {
    const speedSlider = document.getElementById('speed-slider');
    animationDelay = 150 - speedSlider.value * 10; // Update the animation delay based on the slider value
  }