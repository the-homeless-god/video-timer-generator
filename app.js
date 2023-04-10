const script = document.createElement("script");
script.src = "https://rawgit.com/spite/ccapture.js/master/build/CCapture.all.min.js";

script.addEventListener("load", function () {
  const timeInput = document.getElementById("time");
  const startTimeInput = document.getElementById("startTime");
  const fontInput = document.getElementById("font");
  const sizeInput = document.getElementById("size");
  const bgColorInput = document.getElementById("bgColor");
  const fontColorInput = document.getElementById("fontColor");
  const startBtn = document.getElementById("startBtn");
  const timer = document.getElementById("timer");

  function updateTimerStyle() {
    timer.style.fontFamily = fontInput.value || "Arial";
    timer.style.fontSize = `${sizeInput.value || 24}px`;
    timer.style.backgroundColor = bgColorInput.value;
    timer.style.color = fontColorInput.value || "#FFFFFF";
  }

  function generateFileName(startTime, endTime) {
    const startSeconds = formatTime(startTime, "seconds");
    const endSeconds = formatTime(endTime, "seconds");
    return `timer-video-from${startSeconds}-to${endSeconds}.webm`;
  }
  

  function startTimer() {
    updateTimerStyle();
    const maxTime = parseInt(timeInput.value, 10);
    let currentTime = parseInt(startTimeInput.value, 10);

    timer.textContent = formatTime(currentTime);
    const intervalId = setInterval(() => {
      currentTime++;

      timer.textContent = formatTime(currentTime);
      if (currentTime >= maxTime) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  startBtn.addEventListener("click", startTimer);

  const downloadBtn = document.getElementById("downloadBtn");
  let capturer;
  let canvas;

  function setupCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 200;
    document.body.appendChild(canvas);
  }

  function startCapture() {
    capturer = new CCapture({
      format: "webm",
      framerate: 30,
      name: generateFileName(parseInt(startTimeInput.value, 10), parseInt(timeInput.value, 10)),
      timeLimit: parseInt(timeInput.value, 10),
      verbose: true,
      display: true,
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
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.removeAttribute("disabled");
    document.body.removeChild(canvas);
  }

  startBtn.addEventListener("click", () => {
    startTimer();
    startCapture();
    const downloadBtn = document.getElementById("downloadBtn");
    downloadBtn.setAttribute("disabled", true);
  });

  downloadBtn.addEventListener("click", endCapture);

  function captureFrame() {
    drawTimer();
    capturer?.capture(canvas);
  }

  setupCanvas();
  setInterval(captureFrame, 1000 / 30);
});

document.head.appendChild(script);
