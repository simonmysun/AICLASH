onmessage = function(sdata) {
    var data = sdata.data;
    //console.log(data);
    if(data.type === 'init') {
        importScripts(data.src);
    } else if(data.type === 'query') {
        postMessage({
            type: 'action',
            action: onMyTurn(data.game)
        });
    }
};

var action = [];

var takeAction = function(action) {
    postMessage({
        type: 'next step',
        data: action
    });
};

var onMyTurn = function() {
    return [0, 0, 0];
};
