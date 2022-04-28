(function Init() {
  let page = "game";
  let canvas = document.getElementById("canvas01");
  let context = canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
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
  function drawPath(path, color, x, y, scale, alpha, health) {
    context.save();
    context.translate(x, y);
    context.rotate(alpha);
    context.scale(scale, scale);
    context.lineWitdth = 6;
    context.strokeStyle = "white";
    context.fillStyle = color;
    context.fill(path);

    context.font = "2px Arial";
    context.fillStyle = "white";
    context.fillText(health, 0, 0);
    //Matrix
    let Matrix = context.getTransform();
    context.restore();
    return Matrix;
  }
  function drawHealthBar(health, x, scale) {
    context.save();
    context.translate(x, 10);
    context.scale(scale, scale);
    context.lineWitdth = 6;
    context.beginPath();
    context.rect(-25 / 2, 0, health / 4, 1);
    context.fillStyle = "green";
    context.fill();
    context.beginPath();
    context.rect(health / 4 - 25 / 2, 0, (100 - health) / 4, 1);
    context.fillStyle = "red";
    context.fill();
    context.restore();
  }
  function createSpaceShip(x, y, color, insideArray) {
    let myFingers = [];
    let alpha = (Math.sign(canvas.width / 2 - x) * Math.PI) / 2;
    let oldAngle = undefined;
    let deltaAngle = undefined;
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
    let health = 100;
    function draw() {
      if (FingerPos.x != undefined) {
        deltaPos.x = FingerPos.x - x;
        deltaPos.y = FingerPos.y - y;
        if (Math.abs(deltaPos.x) > 2) deltaPos.x = Math.sign(deltaPos.x) * 2;
        if (Math.abs(deltaPos.y) > 2) deltaPos.y = Math.sign(deltaPos.y) * 2;
        x += deltaPos.x;
        y += deltaPos.y;
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
          health -= 10;
          if (health <= 0) isDestroyed = true;
        }
      }
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

      if (context.isPointInPath(isInsideRect, touch.clientX, touch.clientY)) {
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
          laser.push(createLaser(x, y, alpha - Math.PI / 2, color));
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
    function reset() {
      if (myFingers.length > 2) {
        myFingers.splice(2);
        shoot = false;
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
    laser.moveTo(-3, -1);
    laser.lineTo(3, -1);
    laser.lineTo(3, 1);
    laser.lineTo(-3, 1);
    laser.lineTo(-3, 1);
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
    let speed = 4;
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
  function createCracks() {}
  function drawWall(wpath, x, y, scale, health) {
    context.save();
    context.translate(x, y);
    context.rotate(Math.PI / 2);
    context.scale(scale, scale);
    context.lineWitdth = 6;
    context.strokeStyle = "white";
    context.fillStyle = "grey";
    context.fill(wpath);

    context.font = "2px Arial";
    context.fillStyle = "white";
    context.fillText(health, -2, 1);
    //Matrix
    let Matrix = context.getTransform();
    context.restore();
    return Matrix;
  }
  function createWall(x, y) {
    const wallPath = createWallsPath();
    let health = 300;
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
          health -= 10;
          if (health <= 1) isDestroyed = true;
        }
      }
    }
    return { draw };
  }

  //////////////////////////////////////////////////////////////////////////////////
  /////////// Objects /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  let objects = [];
  let laser = [];
  let walls = [];
  walls.push(createWall((canvas.width * 1) / 3, canvas.height / 4));
  walls.push(createWall((canvas.width * 2) / 3, canvas.height / 4));
  walls.push(createWall((canvas.width * 1) / 3, (canvas.height * 3) / 4));
  walls.push(createWall((canvas.width * 2) / 3, (canvas.height * 3) / 4));

  objects.push(
    createSpaceShip(canvas.width / 8, canvas.height / 2, "red", [
      0,
      0,
      context.canvas.width / 2,
      context.canvas.height,
    ])
  );

  objects.push(
    createSpaceShip((canvas.width * 7) / 8, canvas.height / 2, "blue", [
      context.canvas.width / 2,
      0,
      context.canvas.width / 2,
      context.canvas.height,
    ])
  );

  //////////////////////////////////////////////////////////////////////////////////
  /////////// Touch Events /////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (page === "endGame") window.location.reload(true);
    for (let touch of event.touches) {
      for (let o of objects) {
        o.isInside(touch);
      }
    }
  });
  canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    for (let touch of event.touches) {
      for (let o of objects) {
        o.moveTo(touch);
      }
    }
  });
  canvas.addEventListener("touchend", (event) => {
    event.preventDefault();

    for (let o of objects) {
      o.reset();
    }
  });

  function draw() {
    if (page === "game") {
      if (objects.length == 1) page = "endGame";
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let o of objects) {
        if (objects[0] !== undefined)
          if (o.draw()) delete objects[objects.indexOf(o)];
        objects = objects.filter(function (element) {
          return element !== undefined;
        });
      }
      for (let l of laser) {
        if (laser[0] !== undefined)
          if (!l.draw()) delete laser[laser.indexOf(l)];
        laser = laser.filter(function (element) {
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

      context.font = "2px Arial";
      context.fillStyle = "black";
      let text = "The Winner is";
      context.fillText(text, -context.measureText(text).width / 2, -2);
      text = objects[0].color;
      context.fillStyle = objects[0].color;
      context.fillText(text, -context.measureText(text).width / 2, 2);
      context.fillStyle = "orange";
      text = "(Click to Repeat)";
      context.fillText(text, -context.measureText(text).width / 2, 8);
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
