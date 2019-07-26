(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});

  Util = {
    concatRgbString: (red, blue, green) => 'rgb(' + red + ',' + blue + ',' + green + ')',
  }

  DendroHack.Util = Util;

  return root;
})(this);
