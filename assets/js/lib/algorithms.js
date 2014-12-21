var Set = function(size) {
    var self = this;
    self.parent = [];
    self.rank = [];
    for(var i = 0; i < size; i ++ ) {
        self.parent[i] = i;
        self.rank = 0;
    };
    var findRoot = function(p) {
        if(self.parent[p] != p) {
            self.parent[p] = findRoot(self.parent[p]);
        }
        return self.parent[p];
    };
    self.merge = function(p, q) {
        var pRoot = findRoot(p);
        var qRoot = findRoot(q);
        if(pRoot == qRoot) {
            return;
        }
        if(self.rank[pRoot] < self.rank[qRoot]) {
            self.parent[pRoot] = qRoot;
        } else if(self.rank[pRoot] > self.rank[qRoot]) {
            self.parent[qRoot] = pRoot;
        } else {
            self.parent[qRoot] = pRoot;
            self.rank[pRoot] += 1;
        }
    };
    self.check = function(p, q) {
        if(findRoot(p) == findRoot(q)) {
            return true;
        } else {
            return false;
        }
    };
    return self;
}
