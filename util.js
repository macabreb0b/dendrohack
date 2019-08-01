(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});

  Util = {
    concatRgbString: (red, blue, green) => 'rgb(' + red + ',' + blue + ',' + green + ')',
    shuffle: (array) => array.sort(() => Math.random() - 0.5),
    constrainAngle: (angle) => { 
      while(angle<0){
        angle+=Math.PI*2;
      }
      while(angle>2*Math.PI){
        angle-=Math.PI*2
      }
      return angle;
    },
    getAngle: (x, y) => {
      const angle = Math.atan2(y,x);
      return angle;
    },
    getAngleMix: (angle1, angle2, mix) => {//angle1*mix + angle2*(1-mix)
      var a, b, m;
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
      return Util.constrainAngle(a*m+b*(1-m));
    }
  }

  DendroHack.Util = Util;

  return root;
})(this);
