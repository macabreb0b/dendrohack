(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Branch = DendroHack.Branch;
  const Node = DendroHack.Node;

  generateRandomTargets = (xDim, yDim, numTargets) => {
    var targets = [];
    // Initialize random targets
    for (var i = 0; i<numTargets; i++) {
        var radius = Math.random()*200 + 20;
        var angle = Math.random()*2*Math.PI // Random angle between 0 & 2Pi (a circle)
        const x = Math.cos(angle)*radius + xDim/2;
        const y = Math.sin(angle)*radius + yDim/3;

        targets.push(new Node(x, y));
    }
    return targets
  }

  generateSquiggleTargets = (xDim, yDim, numSquiggle, numTargets) => {
    var squiggleTargets = []
    // Squiggle
    while(squiggleTargets.length < numSquiggle){
      var radius = Math.random()*20+90;
      var angle = Util.constrainAngle(Math.random()*Math.PI-Math.PI/2);
      const x = Math.cos(angle)*radius + xDim/2;
      const y = Math.sin(angle)*radius + yDim/2;
      squiggleTargets.push(new Node(x,y));
    }

    while(squiggleTargets.length < numSquiggle+numTargets){
      var radius = Math.random()*50+10;
        var angle = Math.random()*2*Math.PI // Random angle between 0 & 2Pi (a circle)
        const x = Math.cos(angle)*radius + xDim/2;
        const y = Math.sin(angle)*radius + yDim/2-50;
        
        squiggleTargets.push(new Node(x, y));
    }
    return squiggleTargets;
  }

  class Tree {
    constructor(width, height) {
      const startX = width / 2;
      const startY = height;
      this.targets = generateSquiggleTargets(width, height, 35, 15);
      this.energy = 3;

      this.startBranch = new Branch(
        null /** no parent branch for the first branch */,
        this, /** reference to Tree */
        4.71239, /** 270 degrees in radians (point straight up to start) */
        startX, /** only root branch gets startX / startY */
        startY, /** only root branch gets startX / startY */
      )
    }

    draw(ctx) {
      this.startBranch.draw(ctx);
      this.startBranch.drawLeaves(ctx);

      // Draw targets
      this.targets.forEach(target => {
        ctx.strokeStyle = 'rgb(255,0,0)';
        ctx.beginPath();
        ctx.arc(target.x, target.y, 10, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();
      })
      //console.log(this.energy);
    }

    grow() {
      this.startBranch.grow();
    }

    feed() {
      this.energy += DendroHack.Constants.LEAF_ENERGY;
    }

    drain(amount) {
      this.energy -= amount;
    }

    trunkWidth() {
      return this.startBranch.width;
    }



  }



  DendroHack.Tree = Tree;

  return root;
})(this);
