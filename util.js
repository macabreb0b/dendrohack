(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});

  Util = {
    concatRgbString: (red, blue, green) => 'rgb(' + red + ',' + blue + ',' + green + ')',
    shuffle: (array) => array.sort(() => Math.random() - 0.5),
  }

  DendroHack.Util = Util;

  return root;
})(this);
