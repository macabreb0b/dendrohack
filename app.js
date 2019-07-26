(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Tree = DendroHack.Tree;
  const Node = DendroHack.Node;
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

      if (this.tree.targets.length === 0) {
        this.stop();
      }
    }

    start() {
      const ctx = this.canvas;
      const sim = this;

      this.environment = new Environment(this.xDim, this.yDim);
      this.tree = new Tree(this.xDim, this.yDim, this.generateRandomTargets(50));

      this.intervalId = setInterval(function() {
        sim.step(ctx);
      }, 1);
    }

    generateRandomTargets(numTargets) {
      var targets = [];
      // Initialize random targets
      for (var i = 0; i<numTargets; i++) {
          var radius = Math.random()*200 + 20;
          var angle = Math.random()*2*Math.PI // Random angle between 0 & 2Pi (a circle)
          const x = Math.cos(angle)*radius + this.xDim/2;
          const y = Math.sin(angle)*radius + this.yDim/2;
          
          targets.push(new Node(x, y));
      }
      return targets
    }

    stop() {
      clearInterval(this.intervalId)
    }
  }

  DendroHack.App = App;

  return root;
})(this);
