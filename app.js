const timeInput = document.getElementById("time");
const fontInput = document.getElementById("font");
const sizeInput = document.getElementById("size");
const bgColorInput = document.getElementById("bgColor");
const fontColorInput = document.getElementById("fontColor");
const startBtn = document.getElementById("startBtn");
const downloadBtn = document.getElementById("downloadBtn");
const timer = document.getElementById("timer");

function updateTimerStyle() {
  timer.style.fontFamily = fontInput.value || "Arial";
  timer.style.fontSize = `${sizeInput.value || 24}px`;
  timer.style.backgroundColor = bgColorInput.value;
  timer.style.color = fontColorInput.value;
}

function startTimer() {
  updateTimerStyle();
  const startTime = parseInt(timeInput.value, 10);
  const isCountingUp = startTime === 0;
  let currentTime = startTime;

  timer.textContent = formatTime(currentTime);
  const intervalId = setInterval(() => {
    if (isCountingUp) {
      currentTime++;
    } else {
      currentTime--;
    }

    timer.textContent = formatTime(currentTime);
    if (currentTime === 0 && !isCountingUp) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

startBtn.addEventListener("click", () => {
  startTimer();
  startCapture();
  downloadBtn.setAttribute("disabled", true);
});

downloadBtn.addEventListener("click", endCapture);

let capturer;
let canvas;

function setupCanvas() {
  canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 200;
  document.body.appendChild(canvas);
}

function startCapture() {
  setupCanvas();
  capturer = new CCapture({
    format: "webm",
    framerate: 30,
    name: "timer-video",
    timeLimit: parseInt(timeInput.value, 10),
    verbose: true,
  });
  capturer.start();
}

function drawTimer() {
  const ctx = canvas.getContext("2d");
  ctx.font = `${sizeInput.value || 24}px ${fontInput.value || "Arial"}`;
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fontColorInput.value;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(timer.textContent, canvas.width / 2, canvas.height / 2);
}

function endCapture() {
  capturer.stop();
  capturer.save();
  downloadBtn.removeAttribute("disabled");
  document.body.removeChild(canvas);
}

startBtn.addEventListener("click", () => {
  startTimer();
  startCapture();
  downloadBtn.setAttribute("disabled", true);
});

downloadBtn.addEventListener("click", endCapture);
