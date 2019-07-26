(function(root){
    // Node is a point in space to guide growth.
    class Node{ 
        constructor(x, y, parent){
            this.x = x;
            this.y = y;
        }

        L2_norm(node){
            return (node.x-this.x)**2+(node.y-this.y)**2;
        }
    }
})(this);