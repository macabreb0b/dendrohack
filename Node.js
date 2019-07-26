(function(root){
    const DendroHack = root.DendroHack = (root.DendroHack || {});
    // Node is a point in space to guide growth.
    class Node{ 
        constructor(x, y){
            this.x = x;
            this.y = y;
        }

        /**
         * L1 norm is the absolute value of the distance between two points. So L1(-1, 2) is |(-1 - 2)| => 3
         * L2 norm is the square of the distance between two points. So L2(-1, 2) = (-1-2)^2 => 9
         */
        L2_norm(x, y){
            return (x-this.x)**2+(y-this.y)**2;
        }
    }
    DendroHack.Node = Node;
    return root;
})(this);