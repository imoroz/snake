var Snake = {
	subsnakes: [],
	head: null,
	clonedBits: [],
	first: null,
	last: null,
	subsnakeCounter: 0,
	bitCounter: 0,

	getNextSubsnake: function(subsnake){
		if(subsnake.next.bits.length > 0){
			var newSubsnake = Snake.createNewSubsnake();
		}else
			var newSubsnake = subsnake.next;
		return newSubsnake;
	},

	createNewSubsnake: function(){
		var subsnake = new Subsnake();
		subsnake.id = Snake.subsnakeCounter++;
		Snake.subsnakes.push(subsnake);
		return subsnake;
	},
	setPrevious: function(currentSubsnake, previousSubsnake){
		currentSubsnake.previous = previousSubsnake;
	},
	setNext: function(currentSubsnake, previousSubsnake){
		currentSubsnake.next = nextSubsnake;
	},
	setFirst: function(subsnake){
		Snake.first = subsnake;
	},
	setLast: function(subsnake){
		Snake.last = subsnake;
	},
	setHead: function(bit){
		Snake.head = bit;
	},
	iterateThroughSubsnakes: function(callback){
		Snake.subsnakes.forEach(function(e,i,a){
			callback(e,i,a);
		});
	},
	getAllBits: function(){
		var bits = [];
		Snake.iterateThroughSubsnakes(function(snake){
			var subsnakeBits = snake.getBits();
			bits = bits.concat(subsnakeBits);
		});
		return bits;
	},
	extendSnake: function(){
        Snake.last.createNewBit();
        console.log("...");
    },
}