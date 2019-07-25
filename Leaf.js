(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});
  const Constants = DendroHack.Constants;
  class Leaf {

    constructor(parentBranch, tree, angle) {
      this.age = 0;

      this.angle = angle;

      this.length = Constants.NEW_LEAF_LENGTH;
      this.width = Constants.NEW_LEAF_WIDTH;

      this.parentBranch = parentBranch;
      this.tree = tree;
    }

    isDead() {
      return this.age > Constants.MAX_LEAF_AGE;
    }

    endX() {
      return this.startX() + Math.cos(this.angle) * this.length;
    }

    endY() {
      return this.startY() + Math.sin(this.angle) * this.length;
    }

    startX() {
      return this.parentBranch.endX();
    }

    startY() {
      return this.parentBranch.endY();
    }

    draw(ctx) {
      ctx.strokeStyle = '#32CD32';
      ctx.lineWidth = this.width;

      ctx.beginPath();
      ctx.moveTo(this.startX(), this.startY());
      ctx.lineTo(this.endX(), this.endY());
      ctx.closePath();
      ctx.stroke();
    }

    grow() {
      this.tree.feed();
      this.age += 1;
    }
  }

  DendroHack.Leaf = Leaf;

  return root;
})(this);
