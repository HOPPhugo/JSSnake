let GameSpace = document.getElementById("GameSpace");
const ctx = GameSpace.getContext("2d");
let fpsTexte = document.getElementById("fps");
let PlayerX = 0;
let PlayerY = 0;
let PlayerSpeed = 25;
let direction = "Right";
let PlayerLenght = 76;
let snakeBody = [{x: PlayerX, y: PlayerY}]; // Historique des positions
let AppleX;
let AppleY;
let Apple = true;
let lastPixelColor = null;
let hue = 0;
let SizeTexte = document.getElementById("Sizet");
let XTexte = document.getElementById("Xt");
let YTexte = document.getElementById("Yt");
let UP = document.getElementById("Up");
let DOWN = document.getElementById("Down");
let LEFT = document.getElementById("Left");
let RIGHT = document.getElementById("Right");
let Upbtn = getComputedStyle(UP).backgroundColor;

let hueSpeed = 3;
const keys = {
  W: false,
  S: false,
  A: false,
  D: false,
  w: false,
  s: false,
  a: false,
  d: false,
  Tab: false,
  Enter: false,
};
function Launch (){
  setInterval(Move, 50);
    AppleX = Math.round(Math.random() * 1350);
    AppleY = Math.round(Math.random() * 450);
}
const getColorIndicesForCoord = (x, y, width) => {
  const red = (y * width + x) * 4;
  return [red, red + 1, red + 2, red + 3];
};
function isDivisibleBy25(number) {
  return number % 25 === 0;
}
function update () {
let Upbtn = getComputedStyle(UP).backgroundColor;
let Downbtn = getComputedStyle(DOWN).backgroundColor;
let Leftbtn = getComputedStyle(LEFT).backgroundColor;
let Rightbtn = getComputedStyle(RIGHT).backgroundColor;
  hue = (hue + hueSpeed) % 360;
  if (keys.W || keys.w || Upbtn == "rgb(255, 255, 255)") direction ="Up";
  if (keys.S || keys.s || Downbtn == "rgb(255, 255, 255)") direction = "Down";
  if (keys.A || keys.a || Leftbtn == "rgb(255, 255, 255)") direction = "Left";
  if (keys.D || keys.d || Rightbtn == "rgb(255, 255, 255)") direction = "Right";
  XTexte.innerHTML = `X : ${PlayerX}`;
  YTexte.innerHTML = `Y : ${PlayerY}`;
  SizeTexte.innerHTML = `Size : ${PlayerLenght}`;
  requestAnimationFrame(update);
  
}
function fpsCounter () {
  let prevTime = Date.now(),
  frames = 0;

  requestAnimationFrame(function loop() {
    
    const time = Date.now();
    frames++;
    if (time > prevTime + 1000) {
      let fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
      prevTime = time;
      frames = 0;

      fpsTexte.innerHTML = `FPS : ${fps}`;
    }

    requestAnimationFrame(loop);
  });
}
function Move(){
  ctx.clearRect(0, 0, GameSpace.width, GameSpace.height);
  
  // Déplacer le joueur selon la direction
  switch (direction){
    case "Up" : PlayerY -= PlayerSpeed; break;
    case "Down" : PlayerY += PlayerSpeed; break;
    case "Right" : PlayerX += PlayerSpeed; break;
    case "Left" : PlayerX -= PlayerSpeed; break;
  }
  
  PlayerX = Math.max(0, Math.min(GameSpace.width - 25, PlayerX));
  PlayerY = Math.max(0, Math.min(GameSpace.height - 25, PlayerY));
  // Ajouter la nouvelle position en avant du serpent
  snakeBody.unshift({x: PlayerX, y: PlayerY});
  
  // Enlever la dernière position si le serpent dépasse sa longueur
  if (snakeBody.length > PlayerLenght) {
    snakeBody.pop();
  }
  if (PlayerLenght >= 100) {
    alert("Vous avez gané !!!");
    PlayerLenght = 1;
    snakeBody.length = 1;
  }
  if (Apple){
    ctx.fillStyle = "yellow";
    ctx.fillRect(AppleX, AppleY, 25, 25);
  }
  // Afficher tous les segments
  for (let i = 0; i < snakeBody.length; i++) {
    ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
    ctx.fillRect(snakeBody[i].x, snakeBody[i].y, 25, 25);
  }
  
  const currentPixel = getPixelColorAt(AppleX, AppleY);
  if (lastPixelColor !== null) {
    const pixelChanged =
      currentPixel.r !== lastPixelColor.r ||
      currentPixel.g !== lastPixelColor.g ||
      currentPixel.b !== lastPixelColor.b ||
      currentPixel.a !== lastPixelColor.a;

    if (pixelChanged && Apple) {
      Apple = false;
      AppleX = Math.round(Math.random() * 1350);
      AppleY = Math.round(Math.random() * 450);
      PlayerLenght++;
      Apple = true;
    }
  }

  lastPixelColor = currentPixel;
}
document.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    event.preventDefault();
    keys[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});
function getPixelColorAt(x, y) {
  const imageData = ctx.getImageData(0, 0, GameSpace.width, GameSpace.height);
  const [redIndex, greenIndex, blueIndex, alphaIndex] = getColorIndicesForCoord(
    x,
    y,
    GameSpace.width
  );

  return {
    r: imageData.data[redIndex],
    g: imageData.data[greenIndex],
    b: imageData.data[blueIndex],
    a: imageData.data[alphaIndex],
  };
}

Launch();
fpsCounter();
requestAnimationFrame(update);