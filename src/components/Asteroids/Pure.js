import React from "react";
import _ from "lodash";

class Asteroids extends React.Component {
  constructor(props) {
    super(props);
    this.paused = false;
    this.shooting = false;
    this.FPS = _.get(props, "gameVariables.fps", 60);
    this.FRICTION = _.get(props, "gameVariables.friction", 0.7);
    this.GAME_LIVES = _.get(props, "gameVariables.game_lives", 3);
    this.LASER_DIST = _.get(props, "gameVariables.laser.distance", 0.6);
    this.LASER_EXPLODE_DUR = _.get(
      props,
      "gameVariables.laser.explosion_duration",
      0.1
    );
    this.LASER_MAX = _.get(props, "gameVariables.laser.max", 10);
    this.LASER_SPD = _.get(props, "gameVariables.laser.speed", 500);
    this.ROID_JAG = _.get(
      props,
      "gameVariables.asteroids.points.jaggedness",
      0.4
    );
    this.ROID_PTS_LGE = _.get(
      props,
      "gameVariables.asteroids.points.large",
      20
    );
    this.ROID_PTS_MED = _.get(
      props,
      "gameVariables.asteroids.points.medium",
      50
    );
    this.ROID_PTS_SML = _.get(
      props,
      "gameVariables.asteroids.points.small",
      100
    );
    this.ROID_NUM = _.get(props, "gameVariables.asteroids.num", 3);
    this.ROID_SIZE = _.get(props, "gameVariables.asteroids.size", 100);
    this.ROID_SPD = _.get(props, "gameVariables.asteroids.speed", 50);
    this.ROID_VERT = _.get(props, "gameVariables.asteroids.vert", 10);
    this.SAVE_KEY_SCORE = _.get(props, "gameVariables.save_key", "highscore");
    this.SHIP_BLINK_DUR = _.get(
      props,
      "gameVariables.ship.blink_duration",
      0.1
    );
    this.SHIP_EXPLODE_DUR = _.get(
      props,
      "gameVariables.ship.explosion_duration",
      0.3
    );
    this.SHIP_INV_DUR = _.get(
      props,
      "gameVariables.ship.invencibility_duration",
      3
    );
    this.SHIP_SIZE = _.get(props, "gameVariables.ship.size", 30);
    this.SHIP_THRUST = _.get(props, "gameVariables.ship.thrust", 5);
    this.SHIP_TURN_SPD = _.get(props, "gameVariables.ship.turning_speed", 360);
    this.SHOW_BOUNDING = _.get(
      props,
      "gameVariables.ship.show_bounding",
      false
    );
    this.SHOW_CENTRE_DOT = _.get(
      props,
      "gameVariables.ship.show_centre",
      false
    );
    this.TEXT_FADE_TIME = _.get(props, "gameVariables.text.fade_time", 2.5);
    this.TEXT_SIZE = _.get(props, "gameVariables.text.size", 40);
    this.canvas = React.createRef();
    this.ship = null;
    this.roids = [];
    this.interval = null;
    this.level = 0;
    this.text = "";
    this.textAlpha = 0;
    this.score = 0;
    this.lives = this.GAME_LIVES;
    this.roidsTotal = 0;
    this.roidsLeft = 0;
  }

  shootLaser = () => {
    if (this.ship.canShoot && this.ship.lasers.length < this.LASER_MAX) {
      this.ship.lasers.push({
        x: this.ship.x + (4 / 3) * this.ship.r * Math.cos(this.ship.a),
        y: this.ship.y - (4 / 3) * this.ship.r * Math.sin(this.ship.a),
        xv: (this.LASER_SPD * Math.cos(this.ship.a)) / this.FPS,
        yv: (-this.LASER_SPD * Math.sin(this.ship.a)) / this.FPS,
        dist: 0,
        explodeTime: 0,
      });
    }
    this.ship.canShoot = false;
  };

  fitCanvas = () => {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  componentDidMount() {
    this.fitCanvas();
    this.newGame();
    this.setListeners(true);
    this.interval = setInterval(this.update, 1000 / this.FPS);
  }

  drawShip = (x, y, a, colour = "white") => {
    const ctx = this.canvas.getContext("2d");
    ctx.strokeStyle = colour;
    ctx.lineWidth = this.SHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo(
      x + (4 / 3) * this.ship.r * Math.cos(a),
      y - (4 / 3) * this.ship.r * Math.sin(a)
    );
    ctx.lineTo(
      x - this.ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)),
      y + this.ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
    );
    ctx.lineTo(
      x - this.ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
      y + this.ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
  };

  update = () => {
    const ctx = this.canvas.getContext("2d");
    const blinkOn = this.ship.blinkNum % 2 === 0;
    const exploding = this.ship.explodeTime > 0;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    let a, r, x, y, offs, vert;
    for (let i = 0; i < this.roids.length; i++) {
      ctx.strokeStyle = "slategrey";
      ctx.lineWidth = this.SHIP_SIZE / 20;
      a = this.roids[i].a;
      r = this.roids[i].r;
      x = this.roids[i].x;
      y = this.roids[i].y;
      offs = this.roids[i].offs;
      vert = this.roids[i].vert;
      ctx.beginPath();
      ctx.moveTo(x + r * offs[0] * Math.cos(a), y + r * offs[0] * Math.sin(a));
      for (let j = 1; j < vert; j++) {
        ctx.lineTo(
          x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
          y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
        );
      }
      ctx.closePath();
      ctx.stroke();
      if (this.SHOW_BOUNDING) {
        ctx.strokeStyle = "lime";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.stroke();
      }
    }
    if (this.ship.thrusting && !this.ship.dead) {
      this.ship.thrust.x +=
        (this.SHIP_THRUST * Math.cos(this.ship.a)) / this.FPS;
      this.ship.thrust.y -=
        (this.SHIP_THRUST * Math.sin(this.ship.a)) / this.FPS;
      if (!exploding && blinkOn) {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = this.SHIP_SIZE / 10;
        ctx.beginPath();
        ctx.moveTo(
          this.ship.x -
          this.ship.r *
          ((2 / 3) * Math.cos(this.ship.a) + 0.5 * Math.sin(this.ship.a)),
          this.ship.y +
          this.ship.r *
          ((2 / 3) * Math.sin(this.ship.a) - 0.5 * Math.cos(this.ship.a))
        );
        ctx.lineTo(
          this.ship.x - ((this.ship.r * 5) / 3) * Math.cos(this.ship.a),
          this.ship.y + ((this.ship.r * 5) / 3) * Math.sin(this.ship.a)
        );
        ctx.lineTo(
          this.ship.x -
          this.ship.r *
          ((2 / 3) * Math.cos(this.ship.a) - 0.5 * Math.sin(this.ship.a)),
          this.ship.y +
          this.ship.r *
          ((2 / 3) * Math.sin(this.ship.a) + 0.5 * Math.cos(this.ship.a))
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      this.ship.thrust.x -= (this.FRICTION * this.ship.thrust.x) / this.FPS;
      this.ship.thrust.y -= (this.FRICTION * this.ship.thrust.y) / this.FPS;
    }
    if (!exploding) {
      if (blinkOn && !this.ship.dead) {
        this.drawShip(this.ship.x, this.ship.y, this.ship.a);
      }
      if (this.ship.blinkNum > 0) {
        this.ship.blinkTime--;
        if (this.ship.blinkTime === 0) {
          this.ship.blinkTime = Math.ceil(this.SHIP_BLINK_DUR * this.FPS);
          this.ship.blinkNum--;
        }
      }
    } else {
      ctx.fillStyle = "darkred";
      ctx.beginPath();
      ctx.arc(
        this.ship.x,
        this.ship.y,
        this.ship.r * 1.7,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(
        this.ship.x,
        this.ship.y,
        this.ship.r * 1.4,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(
        this.ship.x,
        this.ship.y,
        this.ship.r * 1.1,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(
        this.ship.x,
        this.ship.y,
        this.ship.r * 0.8,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        this.ship.x,
        this.ship.y,
        this.ship.r * 0.5,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    }
    if (this.SHOW_BOUNDING) {
      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.arc(this.ship.x, this.ship.y, this.ship.r, 0, Math.PI * 2, false);
      ctx.stroke();
    }
    if (this.SHOW_CENTRE_DOT) {
      ctx.fillStyle = "red";
      ctx.fillRect(this.ship.x - 1, this.ship.y - 1, 2, 2);
    }
    for (let i = 0; i < this.ship.lasers.length; i++) {
      if (this.ship.lasers[i].explodeTime === 0) {
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(
          this.ship.lasers[i].x,
          this.ship.lasers[i].y,
          this.SHIP_SIZE / 15,
          0,
          Math.PI * 2,
          false
        );
        ctx.fill();
      } else {
        ctx.fillStyle = "orangered";
        ctx.beginPath();
        ctx.arc(
          this.ship.lasers[i].x,
          this.ship.lasers[i].y,
          this.ship.r * 0.75,
          0,
          Math.PI * 2,
          false
        );
        ctx.fill();
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(
          this.ship.lasers[i].x,
          this.ship.lasers[i].y,
          this.ship.r * 0.5,
          0,
          Math.PI * 2,
          false
        );
        ctx.fill();
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.arc(
          this.ship.lasers[i].x,
          this.ship.lasers[i].y,
          this.ship.r * 0.25,
          0,
          Math.PI * 2,
          false
        );
        ctx.fill();
      }
    }
    if (this.textAlpha >= 0) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255, 255, 255, " + this.textAlpha + ")";
      ctx.font = "small-caps " + this.TEXT_SIZE + "px dejavu sans mono";
      ctx.fillText(this.text, this.canvas.width / 2, this.canvas.height * 0.75);
      this.textAlpha = this.textAlpha - 1.0 / this.TEXT_FADE_TIME / this.FPS;
    } else if (this.ship.dead) {
      this.newGame();
    }
    let lifeColour;
    for (let i = 0; i < this.lives; i++) {
      lifeColour = exploding && i === this.lives - 1 ? "red" : "white";
      this.drawShip(
        this.SHIP_SIZE + i * this.SHIP_SIZE * 1.2,
        this.SHIP_SIZE,
        0.5 * Math.PI,
        lifeColour
      );
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = this.TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(
      this.score,
      this.canvas.width - this.SHIP_SIZE / 2,
      this.SHIP_SIZE
    );
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = this.TEXT_SIZE * 0.75 + "px dejavu sans mono";
    ctx.fillText(
      "BEST " + this.scoreHigh,
      this.canvas.width / 2,
      this.SHIP_SIZE
    );
    let ax, ay, ar, lx, ly;
    for (let i = this.roids.length - 1; i >= 0; i--) {
      ax = this.roids[i].x;
      ay = this.roids[i].y;
      ar = this.roids[i].r;
      for (let j = this.ship.lasers.length - 1; j >= 0; j--) {
        lx = this.ship.lasers[j].x;
        ly = this.ship.lasers[j].y;
        if (
          this.ship.lasers[j].explodeTime === 0 &&
          this.distBetweenPoints(ax, ay, lx, ly) < ar
        ) {
          this.destroyAsteroid(i);
          this.ship.lasers[j].explodeTime = Math.ceil(
            this.LASER_EXPLODE_DUR * this.FPS
          );
          break;
        }
      }
    }
    if (!exploding) {
      if (this.ship.blinkNum === 0 && !this.ship.dead) {
        for (var i = 0; i < this.roids.length; i++) {
          if (
            this.distBetweenPoints(
              this.ship.x,
              this.ship.y,
              this.roids[i].x,
              this.roids[i].y
            ) <
            this.ship.r + this.roids[i].r
          ) {
            this.explodeShip();
            this.destroyAsteroid(i);
            break;
          }
        }
      }
      this.ship.a += this.ship.rot;
      this.ship.x += this.ship.thrust.x;
      this.ship.y += this.ship.thrust.y;
    } else {
      this.ship.explodeTime--;
      if (this.ship.explodeTime === 0) {
        this.lives = this.lives - 1;
        if (this.lives === 0) {
          this.gameOver();
        } else {
          this.ship = this.newShip();
        }
      }
    }
    if (this.ship.x < 0 - this.ship.r) {
      this.ship.x = this.canvas.width + this.ship.r;
    } else if (this.ship.x > this.canvas.width + this.ship.r) {
      this.ship.x = 0 - this.ship.r;
    }
    if (this.ship.y < 0 - this.ship.r) {
      this.ship.y = this.canvas.height + this.ship.r;
    } else if (this.ship.y > this.canvas.height + this.ship.r) {
      this.ship.y = 0 - this.ship.r;
    }
    for (let i = this.ship.lasers.length - 1; i >= 0; i--) {
      if (this.ship.lasers[i].dist > this.LASER_DIST * this.canvas.width) {
        this.ship.lasers.splice(i, 1);
        continue;
      }
      if (this.ship.lasers[i].explodeTime > 0) {
        this.ship.lasers[i].explodeTime--;
        if (this.ship.lasers[i].explodeTime === 0) {
          this.ship.lasers.splice(i, 1);
          continue;
        }
      } else {
        this.ship.lasers[i].x += this.ship.lasers[i].xv;
        this.ship.lasers[i].y += this.ship.lasers[i].yv;
        this.ship.lasers[i].dist += Math.sqrt(
          Math.pow(this.ship.lasers[i].xv, 2) +
          Math.pow(this.ship.lasers[i].yv, 2)
        );
      }
      if (this.ship.lasers[i].x < 0) {
        this.ship.lasers[i].x = this.canvas.width;
      } else if (this.ship.lasers[i].x > this.canvas.width) {
        this.ship.lasers[i].x = 0;
      }
      if (this.ship.lasers[i].y < 0) {
        this.ship.lasers[i].y = this.canvas.height;
      } else if (this.ship.lasers[i].y > this.canvas.height) {
        this.ship.lasers[i].y = 0;
      }
    }
    for (let i = 0; i < this.roids.length; i++) {
      this.roids[i].x += this.roids[i].xv;
      this.roids[i].y += this.roids[i].yv;
      if (this.roids[i].x < 0 - this.roids[i].r) {
        this.roids[i].x = this.canvas.width + this.roids[i].r;
      } else if (this.roids[i].x > this.canvas.width + this.roids[i].r) {
        this.roids[i].x = 0 - this.roids[i].r;
      }
      if (this.roids[i].y < 0 - this.roids[i].r) {
        this.roids[i].y = this.canvas.height + this.roids[i].r;
      } else if (this.roids[i].y > this.canvas.height + this.roids[i].r) {
        this.roids[i].y = 0 - this.roids[i].r;
      }
    }
  };

  componentWillUnmount() {
    this.setListeners(false);
    clearInterval(this.interval);
  }

  gameOver = () => {
    this.ship.dead = true;
    this.text = "Game Over";
    this.textAlpha = 1.0;
  };

  pauseGame = () => {
    this.paused = true;
    clearInterval(this.interval);
  };

  continueGame = () => {
    this.paused = false;
    this.interval = setInterval(this.update, 1000 / this.FPS);
  };

  keyDown = (ev) => {
    if (!this.ship.dead) {
      switch (ev.keyCode) {
        case 27:
          if (this.paused) {
            this.continueGame();
          } else {
            this.pauseGame();
          }
          break;
        case 32:
          this.shooting = true;
          this.shootLaser();
          break;
        case 65:
        case 37:
          this.ship.rot = ((this.SHIP_TURN_SPD / 180) * Math.PI) / this.FPS;
          break;
        case 87:
        case 38:
          this.ship.thrusting = true;
          break;
        case 68:
        case 39:
          this.ship.rot = ((-this.SHIP_TURN_SPD / 180) * Math.PI) / this.FPS;
          break;
        default:
          break;
      }
    }
  };

  keyUp = (ev) => {
    if (!this.ship.dead) {
      switch (ev.keyCode) {
        case 32:
          this.shooting = false;
          this.ship.canShoot = true;
          break;
        case 65:
        case 37:
          this.ship.rot = 0;
          break;
        case 87:
        case 38:
          this.ship.thrusting = false;
          break;
        case 68:
        case 39:
          this.ship.rot = 0;
          break;
        default:
          break;
      }
    }
  };

  setListeners = (enable) => {
    document[enable ? "addEventListener" : "removeEventListener"](
      "keydown",
      this.keyDown
    );
    document[enable ? "addEventListener" : "removeEventListener"](
      "keyup",
      this.keyUp
    );
    window.onresize = enable ? this.fitCanvas : null
  };

  newShip = () => {
    return {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      a: (90 / 180) * Math.PI,
      r: this.SHIP_SIZE / 2,
      blinkNum: Math.ceil(this.SHIP_INV_DUR / this.SHIP_BLINK_DUR),
      blinkTime: Math.ceil(this.SHIP_BLINK_DUR * this.FPS),
      canShoot: true,
      dead: false,
      explodeTime: 0,
      lasers: [],
      rot: 0,
      thrusting: false,
      thrust: {
        x: 0,
        y: 0,
      },
    };
  };

  explodeShip = () => {
    this.ship.explodeTime = Math.ceil(this.SHIP_EXPLODE_DUR * this.FPS);
  };

  destroyAsteroid = (index) => {
    var x = this.roids[index].x;
    var y = this.roids[index].y;
    var r = this.roids[index].r;
    if (r === Math.ceil(this.ROID_SIZE / 2)) {
      this.roids.push(this.newAsteroid(x, y, Math.ceil(this.ROID_SIZE / 4)));
      this.roids.push(this.newAsteroid(x, y, Math.ceil(this.ROID_SIZE / 4)));
      this.score = this.score + this.ROID_PTS_LGE;
    } else if (r === Math.ceil(this.ROID_SIZE / 4)) {
      this.roids.push(this.newAsteroid(x, y, Math.ceil(this.ROID_SIZE / 8)));
      this.roids.push(this.newAsteroid(x, y, Math.ceil(this.ROID_SIZE / 8)));
      this.score = this.score + this.ROID_PTS_MED;
    } else {
      this.score = this.score + this.ROID_PTS_SML;
    }
    if (this.score > this.scoreHigh) {
      this.scoreHigh = this.score;
      localStorage.setItem(this.SAVE_KEY_SCORE, this.scoreHigh);
    }
    this.roids.splice(index, 1);
    this.roidsLeft = this.roidsLeft - 1;
    if (this.roids.length === 0) {
      this.level = this.level + 1;
      this.newLevel();
    }
  };

  newLevel = () => {
    this.text = "Level " + (this.level + 1);
    this.textAlpha = 1.0;
    this.createAsteroidBelt();
  };

  distBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  newAsteroid = (x, y, r) => {
    const lvlMult = 1 + 0.1 * this.level;
    let roid = {
      x: x,
      y: y,
      xv:
        ((Math.random() * this.ROID_SPD * lvlMult) / this.FPS) *
        (Math.random() < 0.5 ? 1 : -1),
      yv:
        ((Math.random() * this.ROID_SPD * lvlMult) / this.FPS) *
        (Math.random() < 0.5 ? 1 : -1),
      a: Math.random() * Math.PI * 2,
      r: r,
      offs: [],
      vert: Math.floor(
        Math.random() * (this.ROID_VERT + 1) + this.ROID_VERT / 2
      ),
    };
    for (var i = 0; i < roid.vert; i++) {
      roid.offs.push(Math.random() * this.ROID_JAG * 2 + 1 - this.ROID_JAG);
    }
    return roid;
  };

  createAsteroidBelt = () => {
    let roids = [];
    let x, y;
    for (let i = 0; i < this.ROID_NUM + this.level; i++) {
      do {
        x = Math.floor(Math.random() * this.canvas.width);
        y = Math.floor(Math.random() * this.canvas.height);
      } while (
        this.distBetweenPoints(this.ship.x, this.ship.y, x, y) <
        this.ROID_SIZE * 2 + this.ship.r
      );
      roids.push(this.newAsteroid(x, y, Math.ceil(this.ROID_SIZE / 2)));
    }
    const roidsTotal = (this.ROID_NUM + this.level) * 7;
    this.roidsTotal = roidsTotal;
    this.roidsLeft = roidsTotal;
    this.roids = roids;
  };

  newGame = () => {
    this.level = 0;
    this.lives = this.GAME_LIVES;
    this.score = 0;
    this.ship = this.newShip();
    let scoreStr = localStorage.getItem(this.SAVE_KEY_SCORE);
    if (scoreStr == null) {
      this.scoreHigh = 0;
    } else {
      this.scoreHigh = parseInt(scoreStr);
    }
    this.newLevel();
  };

  render() {
    return (
      <div
        style={{
          position: "relative",
          width: _.get(this.props, "gameStyle.width", "100%"),
          height: _.get(this.props, "gameStyle.height", "100%")
        }}>
        <canvas
          ref={(r) => {
            this.canvas = r;
          }}
        />
      </div>
    );
  }
}

export default Asteroids;
