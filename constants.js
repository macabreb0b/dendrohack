(function (root) {
  const DendroHack = root.DendroHack = (root.DendroHack || {});

  DendroHack.Constants = {
    MAX_LEAF_AGE: 3,
    NEW_BRANCH_WIDTH: 2,
    NEW_BRANCH_LENGTH: 8,
    NEW_LEAF_WIDTH: 1,
    NEW_LEAF_LENGTH: 5,
    BRANCH_WIDTH_INCREMENT: 3,
    BRANCH_LENGTH_INCREMENT: 2,
    MATURE_BRANCH_WIDTH: 10,
    BRANCH_LIMIT: 4,
    LEAF_LIMIT: 3,
  }

  return root;
})(this);
