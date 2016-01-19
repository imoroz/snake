function Subsnake(nextSubsnake, previousSubsnake){
	this.bits = [];
	this.next = nextSubsnake || this;
	this.previous = previousSubsnake || this;

	this.createNewBit = function(x,y){
		if(typeof x == "undefined")
			x = 0;
		if(typeof y == "undefined")
			y = 0;
		var newBit = new SnakeBit(x,y);
		this.bits.push(newBit);
		newBit.id = Snake.bitCounter++;
		return newBit;
	};
	this.setPrevious = function(previousSubsnake){
		this.previous = previousSubsnake;
	}
	this.setNext = function(nextSubsnake){
		this.next = nextSubsnake;
	}
	this.iterateThroughBits = function(callback){
		this.bits.forEach(function(e,i,a){
			callback(e,i,a);
		});
	}
	this.getBits = function(){
		return this.bits;
	},
	this.removeFirst  = function(){
		this.bits.shift();
	};
	this.addBit = function(bit){
		this.bits.push(bit)
	}
}