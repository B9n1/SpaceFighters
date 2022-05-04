(function Init() {
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Globale Varibals /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  let page = "menu";
  let canvas = document.getElementById("canvas01");
  let context = canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  const laserDamge = 1;
  const spaceShipHealth = 10;
  const wallHealth = 30;
  let firsttimeloading = true;
  //Sounds
  let shootSound = new Audio(
    "MusicAndSounds/mixkit-short-laser-gun-shot-1670.wav"
  );
  let gameSound = new Audio(
    "2021-08-30_-_Boss_Time_-_www.FesliyanStudios.com.mp3"
  );

  //////////////////////////////////////////////////////////////////////////////////
  /////////// Space Ships /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  function createPath() {
    let spaceShip = new Path2D();
    spaceShip.moveTo(-10, -2);
    spaceShip.lineTo(-9, -2);
    spaceShip.lineTo(-9, -1);
    spaceShip.lineTo(-2, -2);
    spaceShip.lineTo(-2, -4);
    spaceShip.lineTo(-1, -6);
    spaceShip.lineTo(1, -6);
    spaceShip.lineTo(2, -4);
    spaceShip.lineTo(2, -2);
    spaceShip.lineTo(9, -1);
    spaceShip.lineTo(9, -2);
    spaceShip.lineTo(10, -2);
    spaceShip.lineTo(10, 2);
    spaceShip.lineTo(9, 2);
    spaceShip.lineTo(9, 1);
    spaceShip.lineTo(2, 2);
    spaceShip.lineTo(2, 4);
    spaceShip.lineTo(-2, 4);
    spaceShip.lineTo(-2, 2);
    spaceShip.lineTo(-9, 1);
    spaceShip.lineTo(-9, 2);
    spaceShip.lineTo(-10, 2);
    spaceShip.closePath();
    return spaceShip;
  }
  function createEngineAndFlames() {
    context.beginPath();
    // Engine
    context.rect(-1, 4, 2, 1);
    context.fillStyle = "grey";
    context.fill();
    context.closePath();
    // Center Flame
    context.beginPath();
    context.fillStyle = "red";
    context.moveTo(-2, 6);
    context.bezierCurveTo(-1.5, 4.5, 1.5, 4.5, 2, 6);
    context.lineTo(0, 11);
    context.lineTo(-2, 6);
    context.fill();
    context.closePath();
    // right Flame
    context.beginPath();
    context.fillStyle = "red";
    context.moveTo(9, 2.5);
    context.bezierCurveTo(9 + 1 / 3, 2, 9 + 2 / 3, 2, 10, 2.5);
    context.lineTo(9.5, 5);
    context.lineTo(9, 2.5);
    context.fill();
    context.closePath();
    //  left Flame
    context.beginPath();
    context.fillStyle = "red";
    context.moveTo(-9, 2.5);
    context.bezierCurveTo(-9 - 1 / 3, 2, -9 - 2 / 3, 2, -10, 2.5);
    context.lineTo(-9.5, 5);
    context.lineTo(-9, 2.5);
    context.fill();
    context.closePath();
  }
  function drawPath(path, color, x, y, scale, alpha, health) {
    context.save();
    context.translate(x, y);
    context.rotate(alpha);
    context.scale(scale, scale);
    context.lineWitdth = 6;
    context.strokeStyle = "white";
    context.fillStyle = color;
    context.fill(path);
    context.beginPath();
    context.rect(-1, -5, 2, 1);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();

    //Engine and Flames
    createEngineAndFlames();
    //Matrix
    let Matrix = context.getTransform();
    context.restore();
    return Matrix;
  }
  function drawHealthBar(health, x, scale) {
    context.save();
    context.translate(x, 40);
    context.scale(scale / 2, scale / 2);
    context.translate((-5 * spaceShipHealth) / 2, 0);
    for (let i = 0; i < spaceShipHealth; i++) {
      context.translate(5, 0);
      context.beginPath();
      context.moveTo(0, 2);
      context.lineTo(-2, -1);
      context.bezierCurveTo(-1 - 2 / 3, -2 - 2 / 3, -1 / 3, -2 - 2 / 3, 0, -1);
      context.bezierCurveTo(1 / 3, -2 - 2 / 3, 1 + 2 / 3, -2 - 2 / 3, 2, -1);
      context.lineTo(0, 2);
      context.closePath();
      if (i < health) context.fillStyle = "red";
      else context.fillStyle = "transparent";
      context.fill();
    }

    context.restore();
  }
  function createSpaceShip(x, y, color, insideArray) {
    let myFingers = [];
    let isShooting = false;
    let alpha = (Math.sign(canvas.width / 2 - x) * Math.PI) / 2;
    let oldAngle = undefined;
    let deltaAngle = undefined;
    let timestampFormLastShoot = 0;
    let FingerPos = {
      x: undefined,
      y: undefined,
    };
    let deltaPos = {
      x: undefined,
      y: undefined,
    };
    let healthBarX =
      canvas.width / 2 - (canvas.width / 4) * Math.sign(canvas.width / 2 - x);
    let Matrix;
    const path = createPath();
    let isDestroyed = false;
    let health = spaceShipHealth;

    function draw() {
      if (FingerPos.x != undefined) {
        deltaPos.x = FingerPos.x - x;
        deltaPos.y = FingerPos.y - y;
        if (Math.abs(deltaPos.x) > 4) deltaPos.x = Math.sign(deltaPos.x) * 4;
        if (Math.abs(deltaPos.y) > 4) deltaPos.y = Math.sign(deltaPos.y) * 4;
        x += deltaPos.x;
        y += deltaPos.y;
      }

      if (isShooting && Math.abs(timestampFormLastShoot - Date.now()) > 500) {
        laser.push(createLaser(x, y, alpha - Math.PI / 2, color));
        shootSound.load();
        shootSound.play();
        timestampFormLastShoot = Date.now();
      }

      Matrix = drawPath(path, color, x, y, 12, alpha, health);
      drawHealthBar(health, healthBarX, 12);
      isHitByLaser();
      return isDestroyed;
    }
    function isHitByLaser() {
      let localMatrix = DOMMatrix.fromMatrix(Matrix);
      localMatrix.invertSelf();
      for (let l of laser) {
        if (l.didItHit(path, Matrix, color)) {
          health -= laserDamge;
          if (health <= 0) isDestroyed = true;
        }
      }
    }
    function TouchIsInsideSpaceShip(touch) {
      let isInsideRect = new Path2D();
      isInsideRect.rect(
        insideArray[0],
        insideArray[1],
        insideArray[2],
        insideArray[3]
      );
      context.closePath();
      //Merken die Possition des Fingers merk
      return context.isPointInPath(isInsideRect, touch.clientX, touch.clientY);
    }
    function isInside(touch) {
      let isInsideRect = new Path2D();
      isInsideRect.rect(
        insideArray[0],
        insideArray[1],
        insideArray[2],
        insideArray[3]
      );
      context.closePath();
      //Merken die Possition des Fingers merk

      if (TouchIsInsideSpaceShip(touch)) {
        let allIdentifer = [];
        if (myFingers.length > 0)
          for (let i of myFingers) allIdentifer.push(i.identifier);

        if (!allIdentifer.includes(touch.identifier) && myFingers.length < 3)
          myFingers.push({
            x: touch.clientX,
            y: touch.clientY,
            identifier: touch.identifier,
          });
        if (myFingers.length > 2) {
          isShooting = true;
        }
        oldX = touch.clientX;
        oldY = touch.clientY;
      }
    }
    function moveTo(touch) {
      updateMyFingers(touch);

      if (myFingers.length > 1) {
        FingerPos = {
          x: (myFingers[0].x + myFingers[1].x) / 2,
          y: (myFingers[0].y + myFingers[1].y) / 2,
        };
        let newAngle =
          Math.atan2(
            myFingers[0].y - myFingers[1].y,
            myFingers[0].x - myFingers[1].x
          ) + Math.PI;
        if (oldAngle) {
          deltaAngle = newAngle - oldAngle;
          alpha += deltaAngle;
        }
        oldAngle = newAngle;
      }
    }
    function updateMyFingers(touch) {
      for (let i = 0; i < myFingers.length; i++) {
        if (myFingers[i].identifier === touch.identifier) {
          myFingers[i].x = touch.clientX;
          myFingers[i].y = touch.clientY;
        }
      }
    }
    function reset(deletedFingerIdentifier) {
      for (let f of myFingers) {
        if (f.identifier === deletedFingerIdentifier) {
          if (myFingers.length > 2) {
            myFingers.splice(2);
            isShooting = false;
          } else {
            myFingers.length = 0;
            oldAngle = undefined;
            deltaAngle = undefined;
            FingerPos = {
              x: undefined,
              y: undefined,
            };
            deltaPos = {
              x: undefined,
              y: undefined,
            };
          }
        }
      }
    }
    return {
      draw,
      reset,
      isInside,
      moveTo,
      myFingers,
      color,
    };
  }
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Laser /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  function creatLaserPath() {
    let laser = new Path2D();
    laser.moveTo(-3, -0.5);
    laser.lineTo(3, -0.5);
    laser.lineTo(3, 0.5);
    laser.lineTo(-3, 0.5);
    laser.lineTo(-3, 0.5);
    laser.closePath();
    return laser;
  }
  function drawLaser(lpath, color, x, y, scale, alpha) {
    context.save();
    context.translate(x, y);
    context.rotate(alpha);
    context.scale(scale, scale);
    context.lineWitdth = 6;
    context.strokeStyle = "white";
    context.fillStyle = color;
    context.fill(lpath);
    //Matrix
    let Matrix = context.getTransform();
    context.restore();
    return Matrix;
  }
  function createLaser(x, y, angle, color) {
    const laserPath = creatLaserPath();
    let speed = 12;
    function draw() {
      Matrix = drawLaser(laserPath, color, x, y, 6, angle);
      move();
      return isInsideCanvas();
    }
    function move() {
      let deltaY = Math.sin(angle) * speed;
      let deltaX = Math.cos(angle) * speed;
      x += deltaX;
      y += deltaY;
    }
    function didItHit(objectPath, objectMatrix, objectColor) {
      if (color === objectColor) return false;
      let localMatrix = DOMMatrix.fromMatrix(objectMatrix);
      localMatrix.invertSelf();
      let myDOMPoint = localMatrix.transformPoint(new DOMPoint(x, y));
      let laserHit = context.isPointInPath(
        objectPath,
        myDOMPoint.x,
        myDOMPoint.y
      );
      if (laserHit) {
        x = -canvas.width;
        y = -canvas.height;
      }

      return laserHit;
    }
    function isInsideCanvas() {
      if (canvas.width < x || canvas.height < y || x < 0 || y < 0) return false;
      else return true;
    }

    return { draw, didItHit };
  }
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Wall /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  function createWallsPath() {
    const wall = new Path2D();
    wall.moveTo(-8, -1);
    wall.lineTo(8, -1);
    wall.lineTo(8, 1);
    wall.lineTo(-8, 1);
    wall.lineTo(-8, 1);
    wall.closePath();
    return wall;
  }
  function createWallCracks() {
    let crack = new Path2D();
    crack.moveTo(0, 0);
    crack.lineTo(1, 0);
    crack.lineTo(2, 2);
    crack.lineTo(0.5, 4);
    crack.lineTo(1, 5);
    crack.lineTo(0, 4);
    crack.lineTo(1, 2);
    crack.lineTo(0, 0);
    crack.closePath();
    return crack;
  }

  function drawWall(wpath, x, y, scale, health) {
    context.save();
    context.translate(x, y);
    context.rotate(Math.PI / 2);
    context.scale(scale, scale);
    context.fillStyle = "grey";
    context.fill(wpath);

    //Matrix
    let Matrix = context.getTransform();
    context.restore();
    context.save();
    context.translate(x, y);
    context.rotate(Math.PI / 2);
    context.scale(scale / 5, scale / 5);
    context.translate(-5 * 8, 0);

    for (let i = 0; i < wallHealth; i++) {
      context.rotate(Math.PI);
      if (i % 2 == 0) context.translate(-5, 0);
      if (wallHealth - health > i) context.fillStyle = "#3d3d3d";
      else context.fillStyle = "transparent";
      context.fill(createWallCracks());
    }

    context.restore();
    return Matrix;
  }
  function createWall(x, y) {
    const wallPath = createWallsPath();
    let health = wallHealth;
    let Matrix;
    let isDestroyed = false;

    function draw() {
      Matrix = drawWall(wallPath, x, y, 12, health);
      isHitByLaser();
      return isDestroyed;
    }
    function isHitByLaser() {
      for (let l of laser) {
        if (l.didItHit(wallPath, Matrix)) {
          health -= laserDamge;
          if (health <= 0) isDestroyed = true;
        }
      }
    }
    return { draw };
  }
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Buttons /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////

  function createButton(y, color, text, value, x = 0) {
    let Matrix;
    let button = new Path2D();

    function draw() {
      button.rect(
        -context.measureText(text).width / 2 - 3,
        -context.measureText("M").width + y - 3,
        context.measureText(text).width + 6,
        context.measureText("M").width + 6
      );
      button.closePath();

      context.beginPath();
      context.fillStyle = "transparent";
      context.font = "2px OldSchoolAdventures";
      context.fillStyle = color;
      text = text;
      context.fillText(text, -context.measureText(text).width / 2, y);
      context.rect(
        -context.measureText(text).width / 2 - 3,
        -context.measureText("M").width + y - 3,
        context.measureText(text).width + 6,
        context.measureText("M").width + 6
      );
      context.strokeStyle = color;
      context.stroke();
      Matrix = context.getTransform();
      context.closePath();
    }
    function isInside(x, y) {
      let localMatrix = DOMMatrix.fromMatrix(Matrix);
      localMatrix.invertSelf();
      let myDOMPoint = localMatrix.transformPoint(new DOMPoint(x, y));

      if (context.isPointInPath(button, myDOMPoint.x, myDOMPoint.y))
        page = value;
    }
    return { draw, isInside };
  }
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Objects /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  let objects = [];
  let laser = [];
  let walls = [];
  let buttons = [];
  let tutorialButtons = [];
  buttons.push(createButton(-5, "green", "(Click for Tutorial)", "tutorial"));
  buttons.push(createButton(10, "orange", "(Click to BATTLE)", "game"));
  tutorialButtons.push(
    createButton(
      (canvas.height * 3) / 4 / 12,
      "orange",
      "(Return to Menu)",
      "endGame"
    )
  );

  walls.push(createWall((canvas.width * 1) / 3, canvas.height / 4));
  walls.push(createWall((canvas.width * 2) / 3, canvas.height / 4));
  walls.push(createWall((canvas.width * 1) / 3, (canvas.height * 3) / 4));
  walls.push(createWall((canvas.width * 2) / 3, (canvas.height * 3) / 4));

  objects.push(
    createSpaceShip(canvas.width / 8, canvas.height / 2, "#A91F1F", [
      0,
      0,
      context.canvas.width / 2,
      context.canvas.height,
    ])
  );

  objects.push(
    createSpaceShip((canvas.width * 7) / 8, canvas.height / 2, "#379A9A", [
      context.canvas.width / 2,
      0,
      context.canvas.width / 2,
      context.canvas.height,
    ])
  );

  //////////////////////////////////////////////////////////////////////////////////
  /////////// Touch Events /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  let touchesIdentifier = [];

  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    // Load Sounds for Safari

    if (firsttimeloading) {
      shootSound.play();
      shootSound.pause();
      shootSound.currentTime = 0;

      gameSound.play();
      gameSound.pause();
      gameSound.currentTime = 0;
      gameSound.volume = 0.5;
      firsttimeloading = false;
    }

    if (page === "menu") {
      for (let b of buttons) {
        b.isInside(event.touches[0].clientX, event.touches[0].clientY);
      }
    }
    if (page === "endGame") window.location.reload(true);
    if (page === "game" || page === "tutorial") {
      for (let touch of event.touches) {
        touchesIdentifier.push(touch.identifier);
        for (let o of objects) {
          o.isInside(touch);
        }
      }
    }
  });
  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();

    if (page === "game" || page === "tutorial") {
      for (let touch of event.touches) {
        for (let o of objects) {
          o.moveTo(touch);
        }
      }
    }
  });
  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();

    if (page === "game" || page === "tutorial") {
      let temp = [];
      for (let touch of event.touches) temp.push(touch.identifier);
      let difference = touchesIdentifier.filter((x) => !temp.includes(x));
      for (let d of difference) {
        for (let o of objects) {
          o.reset(d);
        }
      }
    }
  });

  function draw() {
    if (page === "tutorial") {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.translate(canvas.width / 2, 0);

      context.beginPath();
      context.fillStyle = "white";
      context.rect(0, 0, canvas.width / 2, canvas.height);

      context.fill();
      context.font = canvas.width / 64 + "px OldSchoolAdventures";
      context.fillStyle = "black";
      let text = "<- Your Healthbar, which show your current health";
      context.fillText(text, 0, canvas.height / 20, canvas.width / 2);
      text = "<- These are walls, where you or your enemies can hied";
      context.fillText(text, 0, (canvas.height * 1) / 4, canvas.width / 2);
      text =
        "        The walls can take " +
        wallHealth +
        " shots by YOU or YOUR ENEMY befor they get destroyed.";
      context.fillText(
        text,
        0,
        (canvas.height * 1) / 4 + context.measureText("M").width,
        canvas.width / 2
      );
      text =
        "<- These are SpaceShips, they move to the Point between the your first two Fingers with a certen Speed. You can change the angle of the SpaceShip with the";
      context.fillText(text, 0, canvas.height / 2, canvas.width / 2);

      context.scale(12, 12);
      for (let b of tutorialButtons) {
        b.draw();
      }

      context.closePath();
      context.restore();
      for (let l of laser) {
        if (laser[0] !== undefined)
          if (!l.draw()) delete laser[laser.indexOf(l)];
        laser = laser.filter(function (element) {
          return element !== undefined;
        });
      }
      objects[0].draw();
      walls[0].draw();
      walls[2].draw();
    }
    if (page === "menu") {
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.scale(12, 12);
      context.lineWitdth = 6;
      context.beginPath();
      context.fillStyle = "white";
      context.rect(-20, -20, 40, 40);
      context.fill();
      context.closePath();

      context.beginPath();
      context.font = "4px OldSchoolAdventures";
      context.fillStyle = "Red";
      let text = "Welcome";
      context.fillText(text, -context.measureText(text).width / 2, -15);
      context.closePath();

      for (let b of buttons) {
        b.draw();
      }
      context.restore();
    }
    if (page === "game") {
      gameSound.loop = true;
      gameSound.play();

      if (objects.length == 1) page = "endGame";
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let l of laser) {
        if (laser[0] !== undefined)
          if (!l.draw()) delete laser[laser.indexOf(l)];
        laser = laser.filter(function (element) {
          return element !== undefined;
        });
      }
      for (let o of objects) {
        if (objects[0] !== undefined)
          if (o.draw()) delete objects[objects.indexOf(o)];
        objects = objects.filter(function (element) {
          return element !== undefined;
        });
      }

      for (let w of walls) {
        if (walls[0] !== undefined)
          if (w.draw()) delete walls[walls.indexOf(w)];
        walls = walls.filter(function (element) {
          return element !== undefined;
        });
      }
    }
    if (page === "endGame") {
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.scale(12, 12);
      context.lineWitdth = 6;
      context.beginPath();
      context.fillStyle = "white";
      context.rect(-20, -20, 40, 40);

      context.fill();

      context.font = "2px OldSchoolAdventures";
      context.fillStyle = "black";
      let text = "The Winner is";
      context.fillText(text, -context.measureText(text).width / 2, -2);
      text = objects[0].color;
      if (objects[0].color === "#379A9A") text = "BLUE";
      else text = "RED";
      context.fillStyle = objects[0].color;
      context.fillText(text, -context.measureText(text).width / 2, 2);
      context.fillStyle = "orange";
      text = "(Click to return";
      context.fillText(text, -context.measureText(text).width / 2, 8);
      text = " to the Menu)";
      context.fillText(text, -context.measureText(text).width / 2, 12);
      context.restore();
      context.closePath();
    }
  }

  function animate() {
    draw();
    window.requestAnimationFrame(animate);
  }
  animate();
})();
