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
};
