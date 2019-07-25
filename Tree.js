(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Branch = DendroHack.Branch;

  class Tree {
    constructor(width, height) {
      const startX = width / 2;
      const startY = height;

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
      this.startBranch.draw(ctx)
    }

    grow() {
      this.startBranch.grow();
      console.log(this.energy);
    }

    feed() {
      this.energy += 1;
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
