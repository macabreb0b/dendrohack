(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Branch = DendroHack.Branch;

  class Tree {
    // this.intervalId = DendroHack.intervalId// ??

    constructor(width, height) {
      const startX = width / 2;
      const startY = height * 3 / 4;

      this.startBranch = new Branch(
        null /** no parent branch for the first branch */,
        4.71239,
        startX, /** only root branch gets startX / startY */
        startY, /** only root branch gets startX / startY */
      )
    }

    draw(ctx) {
      this.startBranch.draw(ctx)
    }

    grow() {
      this.startBranch.grow();
    }
  }

  DendroHack.Tree = Tree;

  return root;
})(this);
