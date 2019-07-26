(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Leaf = DendroHack.Leaf;
  const Constants = DendroHack.Constants;

  const MAX_JANK_ANGLE = Math.PI/8;
  function getNewAngle(angle, other) {
    var correction = 0;
    other.forEach(branch => {
      if(angle > branch.angle){
        correction++;
      }
      else {
        correction--;
      }
    })
    return angle + MAX_JANK_ANGLE * (randn_bm()*.2+1) * (Math.random() < (0.5-.2*correction) ? -1 : 1)
  }

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  // Standard Normal variate using Box-Muller transform.
  function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  }

  class Branch {
    constructor(parentBranch, tree, angle, startX, startY) {
      this.parentBranch = parentBranch;
      this.order = this.parentBranch ? this.parentBranch.branches.length : null; /** save order for lining up branch ends */
      this.tree = tree;

      this.angle = angle;
      this._startX = startX
      this._startY = startY

      this.length = Constants.NEW_BRANCH_LENGTH;
      this.width = Constants.NEW_BRANCH_WIDTH; // this also represents "capacity"

      this.leaves = [new Leaf(this, this.tree, getNewAngle(this.angle, []))];
      // this.leaves = [];
      this.branches = [];
    }

    endX() {
      return this.startX() + Math.cos(this.angle) * 8*Math.sqrt(this.length);
    }

    endY() {
      return this.startY() + Math.sin(this.angle) * 8*Math.sqrt(this.length);
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
      const black = [0, 0, 0];
      const brown = [222, 184, 135];
      const factor = 1-(this.width*2)/this.tree.trunkWidth();
      const color = [black[0]+(brown[0]-black[0])*factor,
                     black[1]+(brown[1]-black[1])*factor,
                     black[2]+(brown[2]-black[2])*factor]
      ctx.strokeStyle = 'rgb('+color[0]+','+color[1]+','+color[2]+')';
      // ctx.lineWidth = this.width / (Math.PI * 2);
      ctx.lineWidth = 2*Math.log(this.width);

      ctx.beginPath();
      ctx.moveTo(this.startX(), this.startY());
      ctx.lineTo(this.endX(), this.endY());
      ctx.closePath();
      ctx.stroke();

      this.branches.forEach(branch => branch.draw(ctx));
      this.leaves.forEach(leaf => leaf.draw(ctx));
    }

    grow() {
      if(Math.random()<.5) shuffle(this.branches);
      this.branches.forEach(branch => branch.grow());

      this.leaves.forEach(leaf => leaf.grow());
      this.prune();

      if (this.canGrowNewBranch()) {
        this.tree.drain(this.growBranchCost());
        this.branches.unshift(new Branch(
          this,
          this.tree,
          getNewAngle(this.angle, this.branches))
        )

      } else if (this.canGrowNewLeaf()) {
        this.tree.drain(this.growLeafCost());
        this.leaves.push(new Leaf(
          this,
          this.tree,
          getNewAngle(this.angle, []))
        )

      } else if (this.canGrowSize()) {
        this.tree.drain(this.growSizeCost());

        this.width += Constants.BRANCH_WIDTH_INCREMENT; /** TODO randomize this number to get more branches sometimes? */
        this.length += Constants.BRANCH_LENGTH_INCREMENT;
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
        this.width > Constants.NEW_BRANCH_WIDTH &&
        this.capacity() >= Constants.NEW_BRANCH_WIDTH &&
        this.branches.length < Constants.BRANCH_LIMIT &&
        this.tree.energy > this.growBranchCost()
      );
    }

    growBranchCost() {
      return Constants.NEW_BRANCH_WIDTH * Constants.NEW_BRANCH_LENGTH;
    }

    canGrowNewLeaf() {
      return (
        this.capacity() >= Constants.NEW_LEAF_WIDTH &&
        this.leaves.length < Constants.LEAF_LIMIT &&
        this.width < Constants.MATURE_BRANCH_WIDTH && /** only young branches can grow leaves */
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
      const potentialArea = (this.width + Constants.BRANCH_WIDTH_INCREMENT) * (this.length + Constants.BRANCH_LENGTH_INCREMENT);
      return (potentialArea - currentArea) * 2;
    }
  }

  DendroHack.Branch = Branch;

  return root;
})(this);
