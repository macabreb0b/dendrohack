(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Tree = DendroHack.Tree;
  const Environment = DendroHack.Environment;

  class App {
    constructor(xDim, yDim, canvasEl) {
      this.canvas = canvasEl.getContext("2d");
      this.xDim = xDim;
      this.yDim = yDim;
    }

    draw(ctx) {
      this.environment.draw(ctx);
      this.tree.draw(ctx)
    }

    step() {
      this.draw(this.canvas);
      this.tree.grow();
    }

    start() {
      const ctx = this.canvas;
      const sim = this;

      this.environment = new Environment(this.xDim, this.yDim);
      this.tree = new Tree(this.xDim, this.yDim);

      this.intervalId = setInterval(function() {
        sim.step(ctx);
      }, 10);
    }

    stop() {
      clearInterval(this.intervalId)
    }
  }

  DendroHack.App = App;

  return root;
})(this);
