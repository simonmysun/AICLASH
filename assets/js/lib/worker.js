var game = {};

onmessage = function(sdata) {
    var data = sdata.data;
    if(data.type === 'init') {
        importScripts(data.src);
    } else if(data.type === 'game status') {
        game = data.data;
        onMyTurn();
    }
};

var action = [];

var takeAction = function(action) {
    postMessage() {
        type: 'next step',
        data: action
    };
};

var onMyTurn = function() {
    
};
