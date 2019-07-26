(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Leaf = DendroHack.Leaf;
  const Constants = DendroHack.Constants;
  const Util = DendroHack.Util;

  const MAX_JANK_ANGLE = Math.PI / 4;
  function getNewAngle(angle, other) {
    let correction = 0;
    other.forEach(branch => {
      if(angle > branch.angle){
        correction++;
      }
      else {
        correction--;
      }
    })
    return angle + MAX_JANK_ANGLE * (Math.random()) * (Math.random() < (0.5) ? -1 : 1)
  }

  function constrainAngle(angle){
    while(angle<0){
      angle+=Math.PI*2;
    }
    while(angle>2*Math.PI){
      angle-=Math.PI*2
    }
    return angle;
  }

  function getAngle(x, y){
    const angle = Math.atan2(y,x);
    return angle;
  }

  function getAngleMix(angle1, angle2, mix){//angle1*mix + angle2*(1-mix)
    let a, b, m;
    if(angle1 > angle2){
      a = angle1;
      b = angle2;
      m = mix
    }
    else{
      a = angle2;
      b = angle1;
      m = 1-mix;
    }
    if(a-b > Math.PI){
      b += 2*Math.PI;
    }
    return constrainAngle(a*m+b*(1-m));
  }

  // Standard Normal variate using Box-Muller transform.
  function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log(u) ) * Math.cos( 2.0 * Math.PI * v );
  }

  function getBranchColor(branchWidth, trunkWidth) {
    const factor =  (branchWidth * 2) / trunkWidth;
    const red = 212 - (192 * factor);
    const green = 200 - (180 * factor);
    const blue = 125 - (110 * factor);

    return Util.concatRgbString(red, blue, green);
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
      return this.startX() + Math.cos(this.angle) * 8 * Math.sqrt(this.length); // Note: actual length of branch is not the same as this.length uhhh woops.
    }

    endY() {
      return this.startY() + Math.sin(this.angle) * 8 * Math.sqrt(this.length);
    }

    startX() {
      // which branch is it? (order according to parent branch)
      return this._startX === undefined ? this.parentBranch.endX() : this._startX;
    }

    startY() {
      return this._startY === undefined ? this.parentBranch.endY() : this._startY;
    }

    getPullVector(){
      const targets = this.tree.targets;
      const vector = {dx:0, dy:0}
      targets.forEach(target => {
          const ex = this.endX();
          const ey = this.endY();
          const dist = target.L2_norm(ex, ey);
          vector.dx += (target.x - ex)/dist
          vector.dy += (target.y - ey)/dist
      });
      return vector;
    }

    draw(ctx) {
      /** use width to compute rgb value; higher width => lower number (darker shade) */
      ctx.strokeStyle = getBranchColor(this.width, this.tree.trunkWidth());

      ctx.lineWidth = 2 * Math.log(this.width);

      ctx.beginPath();
      ctx.moveTo(this.startX(), this.startY());
      ctx.lineTo(this.endX(), this.endY());
      ctx.closePath();
      ctx.stroke();

      this.branches.forEach(branch => branch.draw(ctx));
    }

    drawLeaves(ctx) {
      this.leaves.forEach(leaf => leaf.draw(ctx));
      this.branches.forEach(branch => branch.drawLeaves(ctx));
    }

    grow() {
      if (Math.random() < .5) Util.shuffle(this.branches);
      this.branches.forEach(branch => branch.grow());

      this.leaves.forEach(leaf => leaf.grow());
      this.prune();

      if (this.canGrowNewBranch()) {
        this.tree.drain(this.growBranchCost());
        const vector = this.getPullVector();
        const targetedAngle = constrainAngle(getAngle(vector.dx, vector.dy));
        const randomAngle = constrainAngle(getNewAngle(this.angle, this.branches));
        const angleMix = getAngleMix(targetedAngle, randomAngle, .15);
        console.log(targetedAngle +" "+randomAngle+" "+angleMix);
        const branch = new Branch(
          this,
          this.tree,
          angleMix)
        this.branches.unshift(branch)
        // Capture targets
        for(var i = 0;i<this.tree.targets.length;i++){
          if(this.tree.targets[i].L2_norm(branch.endX(),branch.endY()) <= 625){
              this.tree.targets.splice(i,1);
              i--;
          }
        }

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
        this.tree.targets.length > 0 &&
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
