(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Branch = DendroHack.Branch;

  class Tree {


    constructor(width, height, targets) {
      const startX = width / 2;
      const startY = height;
      this.targets = targets;
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
      // Draw branches
      this.startBranch.draw(ctx);

      // Draw targets
      this.targets.forEach(target => {
        ctx.strokeStyle = 'rgb(255,0,0)';
        ctx.beginPath();
        ctx.arc(target.x, target.y, 10, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();
      })
      console.log(this.energy);
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
