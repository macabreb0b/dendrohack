(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});

  class Environment {
    constructor(xDim, yDim) {
      this.xDim = xDim
      this.yDim = yDim;
    }

    draw(ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.xDim, this.yDim);
    }
  }

  DendroHack.Environment = Environment;

  return root;
})(this);
