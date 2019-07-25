(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Leaf = DendroHack.Leaf;

  const NEW_BRANCH_WIDTH = 2;
  const NEW_BRANCH_LENGTH = 8;
  const BRANCH_WIDTH_INCREMENT = 1;
  const BRANCH_LENGTH_INCREMENT = .5;
  const NEW_LEAF_SIZE = 1;

  const MAX_JANK_ANGLE = 1
  function getNewAngle(angle) {
    return angle + MAX_JANK_ANGLE * Math.random() * (Math.random() < 0.5 ? -1 : 1)
  }

  class Branch {
    constructor(parentBranch, tree, angle, startX, startY) {
      this.parentBranch = parentBranch;
      this.order = this.parentBranch ? this.parentBranch.branches.length : null; /** save order for lining up branch ends */
      this.tree = tree;

      this.angle = angle;
      this._startX = startX
      this._startY = startY

      this.length = NEW_BRANCH_LENGTH;
      this.width = NEW_BRANCH_WIDTH; // this also represents "capacity"

      this.leaves = [new Leaf(this, this.tree, getNewAngle(this.angle))];
      // this.leaves = [];
      this.branches = [];
    }

    endX() {
      return this.startX() + Math.cos(this.angle) * this.length;
    }

    endY() {
      return this.startY() + Math.sin(this.angle) * this.length;
    }

    startX() {
      // which branch is it? (order according to parent branch)
      return this._startX === undefined ? this.parentBranch.endX() : this._startX;
    }

    startY() {
      return this._startY === undefined ? this.parentBranch.endY() : this._startY;
    }

    draw(ctx) {
      /** use width to compute rgb value; higher width => lower number (darker shade) */
      ctx.strokeStyle = 'rgb(' + (255 - (245 * ((this.width * 2) / this.tree.trunkWidth()))) + ',0,0)';
      ctx.lineWidth = Math.sqrt(this.width) / Math.PI;

      ctx.beginPath();
      ctx.moveTo(this.startX(), this.startY());
      ctx.lineTo(this.endX(), this.endY());
      ctx.closePath();
      ctx.stroke();

      this.branches.forEach(branch => branch.draw(ctx));
      this.leaves.forEach(leaf => leaf.draw(ctx));
    }

    grow() {
      this.branches.forEach(branch => branch.grow());

      this.leaves.forEach(leaf => leaf.grow());
      this.prune();

      if (this.canGrowNewBranch()) {
        this.branches.unshift(new Branch(this, this.tree, getNewAngle(this.angle)))
        this.tree.drain(this.growBranchCost())
      } else if (this.canGrowNewLeaf()) {
        this.leaves.push(new Leaf(this, this.tree, getNewAngle(this.angle)))
        this.tree.drain(this.growLeafCost())
      } else if (this.canGrowSize()) {
        this.tree.drain(this.growSizeCost());

        this.width += BRANCH_WIDTH_INCREMENT; /** TODO randomize this number to get more branches sometimes? */
        this.length += BRANCH_LENGTH_INCREMENT;
      }
    }

    prune() {
      this.leaves = this.leaves.filter(leaf => !leaf.isDead());
    }

    capacity() {
      let usedCapacity = 0;
      this.leaves.forEach(leaf => {
        usedCapacity += leaf.width;
      });
      this.branches.forEach(branch => {
        usedCapacity += branch.width;
      })
      return this.width - usedCapacity;
    }

    canGrowNewBranch() {
      return (
        this.width > NEW_BRANCH_WIDTH &&
        this.capacity() >= NEW_BRANCH_WIDTH &&
        this.branches.length < 4 &&
        this.tree.energy > this.growBranchCost()
      );
    }

    growBranchCost() {
      return NEW_BRANCH_WIDTH * NEW_BRANCH_LENGTH;
    }

    canGrowNewLeaf() {
      return (
        this.capacity() >= NEW_LEAF_SIZE &&
        this.leaves.length < 2 &&
        this.width < 100 && /** only young branches can grow leaves */
        this.tree.energy > this.growLeafCost()
      );
    }

    growLeafCost() {
      return 1;
    }

    canGrowSize() {
      return this.tree.energy > this.growSizeCost() && (this.parentBranch ? this.parentBranch.capacity() > 0 : true);
    }

    growSizeCost() {
      const currentArea = this.width * this.length;
      const potentialArea = (this.width + BRANCH_WIDTH_INCREMENT) * (this.length + BRANCH_LENGTH_INCREMENT);
      return (potentialArea - currentArea) * 2;
    }
  }

  DendroHack.Branch = Branch;

  return root;
})(this);
