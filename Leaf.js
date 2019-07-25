(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});

  class Leaf {

    constructor(parentBranch, angle) {
      console.log('new Leaf')
      this.angle = angle;

      this.length = 10;
      this.width = 1;

      this.parentBranch = parentBranch;
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

  }

  DendroHack.Leaf = Leaf;

  return root;
})(this);
