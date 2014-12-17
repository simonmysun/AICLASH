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

var deepClone = function(obj) {
    var buffer;
    if(obj instanceof Array) {
        buf = [];
        var i = obj.length;
        while(i--) {
            buf[i] = deepClone(obj[i]);
        }
        return buf;
    } else if (obj instanceof Object) {
        buf = {};
        for(var k in obj) {
            buf[k] = deepClone(obj[k]);
        }
        return buf;
    } else {
        return obj;
    }
}
