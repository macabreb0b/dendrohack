(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Leaf = DendroHack.Leaf;

  const MAX_JANK_ANGLE = 1.5708
  function getNewAngle(angle) {
    return angle + MAX_JANK_ANGLE * Math.random() * (Math.random() < 0.5 ? -1 : 1)
  }

  class Branch {
    constructor(parentBranch, angle, startX, startY) {
      this.angle = angle;
      this._startX = startX
      this._startY = startY

      this.length = 8;
      this.width = 2; // this also represents "capacity"

      this.leaves = [new Leaf(this, getNewAngle(this.angle))];
      this.branches = [];
      this.parentBranch = parentBranch;
    }

    endX() {
      return this.startX() + Math.cos(this.angle) * this.length;
    }

    endY() {
      return this.startY() + Math.sin(this.angle) * this.length;
    }

    startX() {
      return this._startX === undefined ? this.parentBranch.endX() : this._startX;
    }

    startY() {
      return this._startY === undefined ? this.parentBranch.endY() : this._startY;
    }

    draw(ctx) {
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = this.width;

      ctx.beginPath();
      ctx.moveTo(this.startX(), this.startY());
      ctx.lineTo(this.endX(), this.endY());
      ctx.closePath();
      ctx.stroke();

      this.leaves.forEach(leaf => leaf.draw(ctx));
      this.branches.forEach(branch => branch.draw(ctx));
    }

    grow() {
      this.branches.forEach(branch => branch.grow());

      this.leaves.forEach(leaf => leaf.grow());
      this.prune();

      if (this.canGrowNewBranch()) {
        this.branches.push(new Branch(this, getNewAngle(this.angle)))
      } else if (this.canGrowNewLeaf()) {
        this.leaves.push(new Leaf(this, getNewAngle(this.angle)))
      } else if (this.canGrowSelf()) {
        this.width += 1; /** TODO randomize this number to get more branches sometimes? */
        this.length += 1;
      }
    }

    prune() {
      this.leaves = this.leaves.filter(leaf => leaf.age < 5);
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
      return this.capacity() >= 2 && this.branches.length < 2;
    }

    canGrowNewLeaf() {
      return this.capacity() >= 1 && this.leaves.length == 0;
    }

    canGrowSelf() {
      if(!this.parentBranch) return true;

      return this.parentBranch.capacity() > 0;
    }
  }

  DendroHack.Branch = Branch;

  return root;
})(this);
