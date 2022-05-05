(function Init() {
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Globale Varibals /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////

  let page = "menu";
  // function to detect if is iOS to prevent the lags thrue audio
  function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  let canvas = document.getElementById("canvas01");
  let context = canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  const laserDamge = 1;
  const spaceShipHealth = 10;
  const wallHealth = 30;
  // To load all Paramters on the first load
  let firsttimeloading = true;
  // Scaling Paramater
  let globalScale = 12;

  const blueColor = "#379A9A";
  const redColor = "#A91F1F";
  //Sounds
  let shootSound = new Audio("MusicAndSounds/Shot.wav");
  let hitSound = new Audio("MusicAndSounds/Hit.wav");
  let hitWallSound = new Audio("MusicAndSounds/hitWall.wav");
  let gameSound = new Audio("MusicAndSounds/GameMusic.mp3");
  let destroyedSound = new Audio("MusicAndSounds/ShipDestroyed.wav");

  //////////////////////////////////////////////////////////////////////////////////
  /////////// Space Ships /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  function createSpaceShipPath() {
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
  function createSpaceShipDecoration() {
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
    context.beginPath();
    context.fillStyle = "yellow";
    context.moveTo(-1, 7);
    context.bezierCurveTo(-0.5, 5.5, 0.5, 5.5, 1, 7);
    context.lineTo(0, 10);
    context.lineTo(-1, 7);
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
    context.beginPath();
    context.fillStyle = "yellow";
    context.moveTo(9.4, 2.5);
    context.bezierCurveTo(9.5, 3, 9.5, 3, 9.6, 2.5);
    context.lineTo(9.5, 4);
    context.lineTo(9.4, 2.5);
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
    context.beginPath();
    context.fillStyle = "yellow";
    context.moveTo(-9.4, 2.5);
    context.bezierCurveTo(-9.5, 3, -9.5, 3, -9.6, 2.5);
    context.lineTo(-9.5, 4);
    context.lineTo(-9.4, 2.5);
    context.fill();
    context.closePath();
    // Padel
    context.beginPath();
    context.lineWidth = 0.2;
    context.strokeStyle = "black";
    context.moveTo(0, 2);
    context.lineTo(0, 4);
    context.stroke();
    context.closePath();
    // Gun
    context.beginPath();
    context.lineWidth = 0.4;
    context.strokeStyle = "grey";
    context.moveTo(0, -6);
    context.lineTo(0, -7);
    context.stroke();
    context.closePath();
    // Style Line
    context.beginPath();
    context.lineWidth = 0.2;
    context.strokeStyle = "#00000030";
    context.moveTo(-2, -2);
    context.lineTo(-2, 2);
    context.moveTo(2, -2);
    context.lineTo(2, 2);
    context.moveTo(-2, -3);
    context.lineTo(2, -3);
    context.moveTo(-9, -1);
    context.lineTo(-9, 1);
    context.moveTo(9, -1);
    context.lineTo(9, 1);
    context.stroke();
    context.closePath();
  }
  function drawSpaceShip(path, color, x, y, scale, alpha) {
    context.save();
    context.translate(x, y);
    context.rotate(alpha);
    context.scale(scale, scale);
    context.lineWitdth = scale / 2;
    context.strokeStyle = "white";
    context.fillStyle = color;
    context.fill(path);
    context.beginPath();
    context.rect(-1, -5, 2, 1);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();

    //Engine and Flames
    createSpaceShipDecoration();
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
  function drawBorder(x, y, color, scale) {
    context.beginPath();
    context.strokeStyle = color + "aa";
    context.lineWidth = scale;
    context.strokeRect(
      x + scale / 2,
      y + scale / 2,
      canvas.width / 2 - scale,
      canvas.height - scale
    );
    context.closePath();
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
    const path = createSpaceShipPath();
    let isDestroyed = false;
    let health = spaceShipHealth;

    function draw() {
      // Change the Possion Change with a max Speed of 4
      if (FingerPos.x != undefined) {
        deltaPos.x = FingerPos.x - x;
        deltaPos.y = FingerPos.y - y;
        if (Math.abs(deltaPos.x) > 4) deltaPos.x = Math.sign(deltaPos.x) * 4;
        if (Math.abs(deltaPos.y) > 4) deltaPos.y = Math.sign(deltaPos.y) * 4;
        x += deltaPos.x;
        y += deltaPos.y;
      }

      // Shoots Laser when the Variable isShooting=ture and the last shot was befor 500ms
      if (isShooting && Math.abs(timestampFormLastShoot - Date.now()) > 500) {
        laser.push(createLaser(x, y, alpha - Math.PI / 2, color));
        shootSound.load();
        if (!iOS()) shootSound.play();
        timestampFormLastShoot = Date.now();
      }

      Matrix = drawSpaceShip(path, color, x, y, globalScale, alpha, health);
      drawHealthBar(health, healthBarX, globalScale);
      // Draw  Border on game mode
      if (page === "game")
        drawBorder(insideArray[0], insideArray[1], color, globalScale);
      isHitByLaser();
      return isDestroyed;
    }
    // check if selfe is hit by a laser
    function isHitByLaser() {
      let localMatrix = DOMMatrix.fromMatrix(Matrix);
      localMatrix.invertSelf();
      for (let l of laser) {
        if (l.didItHit(path, Matrix, color)) {
          health -= laserDamge;
          hitSound.load();
          if (!iOS()) hitSound.play();
          if (health <= 0) {
            isDestroyed = true;
            destroyedSound.load();
            destroyedSound.play();
          }
        }
      }
    }
    // Shout ob die 2 finger beim Touch start in der Richtigen Hälfte ist
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
    // Function to check if figer are inside and add elements to Objec parameter
    function isInside(touch) {
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
    // Update Changes of the SpaceShip
    function moveTo(touch) {
      if (TouchIsInsideSpaceShip(touch)) {
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
    }
    // Update Fingers Specific x and y
    function updateMyFingers(touch) {
      for (let i = 0; i < myFingers.length; i++) {
        if (myFingers[i].identifier === touch.identifier) {
          myFingers[i].x = touch.clientX;
          myFingers[i].y = touch.clientY;
        }
      }
    }
    // Reset ether just back to the first 2 Fingers or the hole object
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
    // Move Laser function
    function move() {
      let deltaY = Math.sin(angle) * speed;
      let deltaX = Math.cos(angle) * speed;
      x += deltaX;
      y += deltaY;
    }
    // Check if the Laser Hit the outer Object
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
      // When hit teleport outside not visable Part for delition
      if (laserHit) {
        x = -canvas.width;
        y = -canvas.height;
      }

      return laserHit;
    }
    // Check if the Laser is in the visable part of the Canvas
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
      Matrix = drawWall(wallPath, x, y, globalScale, health);
      isHitByLaser();
      return isDestroyed;
    }
    // Check if it hit by laser
    function isHitByLaser() {
      for (let l of laser) {
        if (l.didItHit(wallPath, Matrix)) {
          health -= laserDamge;
          hitWallSound.load();
          if (!iOS()) hitWallSound.play();
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
        -context.measureText(text).width / 2 - 3 + x,
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
      context.fillText(text, -context.measureText(text).width / 2 + x, y);
      context.rect(
        -context.measureText(text).width / 2 - 3 + x,
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
  /////////// Tutorial Object /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  function createTutorialObjectPath() {
    const tutorialObject = new Path2D();
    tutorialObject.arc(0, 0, 4, 0, 2 * Math.PI);
    tutorialObject.closePath();
    return tutorialObject;
  }
  function drawTutorialObject(path, x, y, scale) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.fillStyle = "red";
    context.fill(path);

    //Matrix
    let Matrix = context.getTransform();
    context.restore();
    return Matrix;
  }
  function createTutorialObject(x, y) {
    const ObjectPath = createTutorialObjectPath();
    let Matrix;

    function draw() {
      Matrix = drawTutorialObject(ObjectPath, x, y, globalScale);
      isHitByLaser();
    }
    // Check if it hit by laser
    function isHitByLaser() {
      for (let l of laser) {
        if (l.didItHit(ObjectPath, Matrix)) {
          window.location.reload(true);
        }
      }
    }
    return { draw };
  }
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Objects /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  let SpaceShips = [];
  let laser = [];
  let walls = [];
  let buttons = [];
  let tutorialObjects = [];
  buttons.push(createButton(-5, "green", "(Click for Tutorial)", "tutorial"));
  buttons.push(createButton(10, "orange", "  (Click for Battle)  ", "game"));
  tutorialObjects.push(
    createTutorialObject(canvas.width * 0.9, canvas.height * 0.9)
  );
  walls.push(createWall((canvas.width * 1) / 3, canvas.height / 4));
  walls.push(createWall((canvas.width * 2) / 3, canvas.height / 4));
  walls.push(createWall((canvas.width * 1) / 3, (canvas.height * 3) / 4));
  walls.push(createWall((canvas.width * 2) / 3, (canvas.height * 3) / 4));

  SpaceShips.push(
    createSpaceShip(canvas.width / 8, canvas.height / 2, redColor, [
      0,
      0,
      context.canvas.width / 2,
      context.canvas.height,
    ])
  );

  SpaceShips.push(
    createSpaceShip((canvas.width * 7) / 8, canvas.height / 2, blueColor, [
      context.canvas.width / 2,
      0,
      context.canvas.width / 2,
      context.canvas.height,
    ])
  );
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Pages /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////

  // Make TextBoxes to automaticly wrap text
  function addTextBox(x, y, maxWidth, lineHeight, color, text) {
    context.font = lineHeight + "px OldSchoolAdventures";

    let words = text.split(" ");
    context.fillStyle = color;
    let line = "";
    for (let w = 0; w < words.length; w++) {
      if (
        context.measureText(line).width +
          context.measureText(words[w] + " ").width <
        maxWidth
      ) {
        line += words[w] + " ";
      } else {
        context.fillText(line, x, y);
        y += context.measureText("M").width * 1.5;
        line = words[w] + " ";
      }
      if (w === words.length - 1) {
        context.fillText(line, x, y);
      }
    }
  }
  // Creates the tutorial page
  function tutorialPage() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.beginPath();
    context.font = 2 * globalScale + "px OldSchoolAdventures";
    context.fillStyle = "yellow";
    context.fillText("Toch Me!", canvas.width / 8, canvas.height / 8);
    context.closePath();
    context.translate(canvas.width / 2, 0);
    context.beginPath();
    context.fillStyle = "white";
    context.rect(-canvas.width * 0.02, 0, canvas.width * 1.02, canvas.height);
    context.fill();
    context.closePath();
    context.beginPath();

    addTextBox(
      0,
      canvas.height * 0.05,
      canvas.width / 2,
      canvas.width / 64,
      "black",
      "<- This is your Healthbar, which shows your current health." +
        " Every Player starts with " +
        spaceShipHealth +
        " health, represented by " +
        spaceShipHealth +
        " harts."
    );

    addTextBox(
      0,
      canvas.height / 4,
      canvas.width / 2,
      canvas.width / 64,
      "black",
      "<- These are walls, where you or your enemies can hide. The wall can take " +
        wallHealth +
        " shots by YOU or YOUR ENEMY before getting destroyed."
    );

    addTextBox(
      0,
      canvas.height / 2,
      canvas.width / 2,
      canvas.width / 64,
      "black",
      "<- This is a SpaceShip. SpaceShips move to the Point between your first 2 placed Fingers, in your own half.  The SpaceShip self has a max Speed. You can change the angle of the SpaceShip with the rotation of your both first 2 Fingers. You can shoot Laser by touching your half with a 3rd Finger."
    );
    addTextBox(
      0,
      canvas.height * 0.9,
      canvas.width * 0.3,
      canvas.width / 64,
      "red",
      "Shoot the RED circle to return to the Menu"
    );
    context.restore();

    for (let l of laser) {
      if (laser[0] !== undefined) if (!l.draw()) delete laser[laser.indexOf(l)];
      laser = laser.filter(function (element) {
        return element !== undefined;
      });
    }

    for (let o of tutorialObjects) {
      o.draw();
    }
    SpaceShips[0].draw();
    walls[0].draw();
    walls[2].draw();
  }
  // Creates the menu page
  function menuPage() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(globalScale, globalScale);
    context.lineWitdth = 6;
    context.beginPath();
    context.fillStyle = "white";
    context.rect(-20, -20, 40, 40);
    context.fill();
    context.closePath();

    context.beginPath();
    context.font = "3px OldSchoolAdventures";

    let text = "SpaceFighters";
    var gradient = context.createLinearGradient(
      0,
      0,
      context.measureText(text).width,
      0
    );
    gradient.addColorStop(0, redColor);
    gradient.addColorStop(0.2, blueColor);
    context.fillStyle = gradient;
    context.fillText(text, -context.measureText(text).width / 2, -15);
    context.closePath();

    for (let b of buttons) {
      b.draw();
    }
    context.restore();
  }
  // Creates the game page
  function gamePage() {
    gameSound.loop = true;
    gameSound.play();

    if (SpaceShips.length == 1) page = "endGame";
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Loops thru Laser an check if they exist in the Visable Canvas Area and draws them
    //If dont they get filtered out of the Array
    for (let l of laser) {
      if (laser[0] !== undefined) if (!l.draw()) delete laser[laser.indexOf(l)];
      laser = laser.filter(function (element) {
        return element !== undefined;
      });
    }
    // Loops thru SpaceShips an check if they exist and draws them if they do.
    //If dont they get filtered out of the Array

    for (let s of SpaceShips) {
      if (SpaceShips[0] !== undefined)
        if (s.draw()) delete SpaceShips[SpaceShips.indexOf(s)];
      SpaceShips = SpaceShips.filter(function (element) {
        return element !== undefined;
      });
    }
    // Loops thru Walls an check if they exist and draws them if they do
    //If dont they get filtered out of the Array
    for (let w of walls) {
      if (walls[0] !== undefined) if (w.draw()) delete walls[walls.indexOf(w)];
      walls = walls.filter(function (element) {
        return element !== undefined;
      });
    }
  }
  // Creates the End Game PoP up page
  function endGamePage() {
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.scale(globalScale, globalScale);
    context.lineWitdth = globalScale / 2;
    context.beginPath();
    context.fillStyle = "white";
    context.rect(-20, -20, 40, 40);

    context.fill();

    context.font = "2px OldSchoolAdventures";
    context.fillStyle = "black";
    let text = "The Winner is";
    context.fillText(text, -context.measureText(text).width / 2, -2);
    text = SpaceShips[0].color;
    if (SpaceShips[0].color === blueColor) text = "BLUE";
    else text = "RED";
    context.fillStyle = SpaceShips[0].color;
    context.fillText(text, -context.measureText(text).width / 2, 2);
    context.fillStyle = "orange";
    text = "(Click to return";
    context.fillText(text, -context.measureText(text).width / 2, 8);
    text = " to the Menu)";
    context.fillText(text, -context.measureText(text).width / 2, globalScale);
    context.restore();
    context.closePath();
  }
  //////////////////////////////////////////////////////////////////////////////////
  /////////// Touch Events /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  // Save the touches to identifi later the touchEnd Fingers
  let touchesIdentifier = [];

  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();

    // Pre-Load Sounds for Browser, after the first Touch
    if (firsttimeloading) {
      shootSound.play();
      shootSound.pause();
      shootSound.currentTime = 0;

      hitSound.play();
      hitSound.pause();
      hitSound.currentTime = 0;

      hitWallSound.play();
      hitWallSound.pause();
      hitWallSound.currentTime = 0;

      destroyedSound.play();
      destroyedSound.pause();
      destroyedSound.currentTime = 0;

      gameSound.play();
      gameSound.pause();
      gameSound.currentTime = 0;
      gameSound.volume = 0.5;
      firsttimeloading = false;
    }
    // Displays the Menu Button
    if (page === "menu") {
      for (let b of buttons) {
        b.isInside(event.touches[0].clientX, event.touches[0].clientY);
      }
    }
    if (page === "endGame") window.location.reload(true);
    // Call SpaceShips Objects and give theme the touches to work with them
    if (page === "game" || page === "tutorial") {
      for (let touch of event.touches) {
        touchesIdentifier.push(touch.identifier);
        for (let s of SpaceShips) {
          s.isInside(touch);
        }
      }
    }
  });
  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    // Give the SpaceShips the Changes of the touches
    if (page === "game" || page === "tutorial") {
      for (let touch of event.touches) {
        for (let s of SpaceShips) {
          s.moveTo(touch);
        }
      }
    }
  });
  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();
    // Check for the touches, that ended and safe them in differences
    if (page === "game" || page === "tutorial") {
      let temp = [];
      for (let touch of event.touches) temp.push(touch.identifier);
      let difference = touchesIdentifier.filter((x) => !temp.includes(x));
      for (let d of difference) {
        for (let s of SpaceShips) {
          s.reset(d);
        }
      }
    }
  });

  //////////////////////////////////////////////////////////////////////////////////
  /////////// Draw Function /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  function draw() {
    switch (page) {
      case "tutorial":
        tutorialPage();
        break;
      case "menu":
        menuPage();
        break;
      case "game":
        gamePage();
        break;
      case "endGame":
        endGamePage();
        break;
    }
  }

  function animate() {
    draw();
    window.requestAnimationFrame(animate);
  }
  animate();
})();
