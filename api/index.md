---
layout: page
title: AIClash 评测平台选手接口文档
---
## 全局变量

选手应使用基本 JavaScript 语法编写代码, 通常不会因本平台全局变量的变化而导致问题. 若有更高级的需求, 可以参阅此部分. 

	Infinity: Infinity
	Array: function Array() { [native code] }
	ArrayBuffer: function ArrayBuffer() { [native code] }
	Blob: function Blob() { [native code] }
	Boolean: function Boolean() { [native code] }
	DataView: function DataView() { [native code] }
	Date: function Date() { [native code] }
	Error: function Error() { [native code] }
	EvalError: function EvalError() { [native code] }
	EventSource: function EventSource() { [native code] }
	FileError: function FileError() { [native code] }
	FileException: function FileException() { [native code] }
	FileReader: function FileReader() { [native code] }
	FileReaderSync: function FileReaderSync() { [native code] }
	Float32Array: function Float32Array() { [native code] }
	Float64Array: function Float64Array() { [native code] }
	Function: function Function() { [native code] }
	JSON: JSON
	Math: MathConstructor
	MessageChannel: function MessageChannel() { [native code] }
	MessageEvent: function MessageEvent() { [native code] }
	NaN: NaN
	Number: function Number() { [native code] }
	Object: function Object() { [native code] }
	RangeError: function RangeError() { [native code] }
	ReferenceError: function ReferenceError() { [native code] }
	RegExp: function RegExp() { [native code] }
	String: function String() { [native code] }
	SyntaxError: function SyntaxError() { [native code] }
	TEMPORARY: 0
	TypeError: function TypeError() { [native code] }
	URIError: function URIError() { [native code] }
	URL: function URL() { [native code] }
	WebSocket: function WebSocket() { [native code] }
	WorkerLocation: function WorkerLocation() { [native code] }
	XMLHttpRequest: function XMLHttpRequest() { [native code] }
	addEventListener: function addEventListener() { [native code] }
	close: function close() { [native code] }
	constructor: function DedicatedWorkerContext() { [native code] }
	decodeURI: function decodeURI() { [native code] }
	decodeURIComponent: function decodeURIComponent() { [native code] }
	dispatchEvent: function dispatchEvent() { [native code] }
	encodeURI: function encodeURI() { [native code] }
	encodeURIComponent: function encodeURIComponent() { [native code] }
	escape: function escape() { [native code] }
	eval: function eval() { [native code] }
	hasOwnProperty: function hasOwnProperty() { [native code] }
	importScripts: function importScripts() { [native code] }
	isFinite: function isFinite() { [native code] }
	isNaN: function isNaN() { [native code] }
	isPrototypeOf: function isPrototypeOf() { [native code] }
	location: WorkerLocation
	navigator: WorkerNavigator
	onMyTurn: function onMyTurn() { ... }
	parseFloat: function parseFloat() { [native code] }
	parseInt: function parseInt() { [native code] }
	postMessage: function postMessage() { [native code] }
	propertyIsEnumerable: function propertyIsEnumerable() { [native code] }
	removeEventListener: function removeEventListener() { [native code] }
	self: DedicatedWorkerContext
	toLocaleString: function toLocaleString() { [native code] }
	toString: function toString() { [native code] }
	undefined: undefined
	unescape: function unescape() { [native code] }
	valueOf: function valueOf() { [native code] }

## 注册被触发的方法

当轮到选手的回合时, 方法 `onMyTurn` 会被以当前状态为参数调用. 

	onMyTurn(game);

因此选手应编写自己的代码并赋值给全局变量 `onMyTurn`. 

	onMyTurn = function(g) {
		...
	};

或者, 

	var myCode = function(status) {
		...
	};

	onMyTurn = myCode;

## 游戏状态的表示

游戏状态由调用选手代码时通过参数给出, 所有状态均在一个对象中. 

	var game = {
	    'width': 200, 
	    'height': 150, 
	    'gnomes': [
		{
		    'x': 0, 
		    'y': 0
		}, 
		...
	    ], 
	    'map': {
		'data': [
		    [
		        0,
		        1,
		        ...
		    ],
		    ...
		],
		'visited': [
		    [
		        3, 
		        2, 
		        ...
		    ],
		    ...
		]
	    }
	};

注意: 每回合得到的对象仅确保准确描述当前玩家可见视野中的内容! 访问当前视野外的内容会导致出错终止运行或得到过时信息. 

### 例子

#### 查询第二个地精的位置

	var gX = game.gnomes[1].x; // typeof gX === 'number'
	var gY = game.gnomes[1].y; // typeof gY === 'number'

#### 查询对方在 `(x, y)` 处经过的次数

	var c = game.map.visited[x][y]; // typeof c === 'number'

#### 查询 `(x, y)` 处与四周的连通状态

	var c = game.map.data[x][y]; // typeof c === 'number'

说明: `c` 的值表示此节点与上右下左四个方向的连通状态, 
若 `c & 1 > 0` 则与上方节点连通, 
若 `c & 2 > 0` 则与右方节点连通, 
若 `c & 4 > 0` 则与下方节点连通, 
若 `c & 8 > 0` 则与左方节点连通. 

## 选手可以调用的接口

### 深度复制一个对象的函数

	deepClone: deepClone(obj) { [native code] }

将会返回一个新的属性和值与 `obj` 相同的对象(递归复制). 

## 推荐使用的调试用函数

**实际评测时, console 对象会被删除, 如果选手提交的代码中包含此对象, 将会出错而无法继续运行!**

### 打印变量至控制台的函数

	console.log({{要输出的变量}});

### 打印数组至控制台的函数

	console.table({{要输出的数组}});
