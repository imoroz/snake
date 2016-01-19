function HTMLDrawer(Settings){
	this.settings = Settings;
  this.createFood = function(x,y){
  	console.log("drawer");
		  var div = document.getElementById("food");
    	if(div) document.body.removeChild(div);
    	var div = document.createElement("div");
    	div.id = "food";
      div.className = "food";
    	div.style.top = y + "px";
    	div.style.left = x + "px";
    	document.body.appendChild(div);
	};
	this.drawNewSnakePiece = function(currentSnakeLength){
		var newPart = document.createElement("div");
  	newPart.className = "circle";
  	newPart.id = "circle" + (currentSnakeLength + 1);
  	$("#" + Settings.boardId).append(newPart);
  	return newPart;
	},
	this.drawSnakePiece = function(e,x,y){
		//console.log("DRAWING COORDINATES x: " + x + " y: " + y );
		e.style.top = y + "px";
		e.style.left = x + "px";
	},
	this.createHead = function(x,y){
		var head = document.createElement("div");
		head.id = Settings.headId;
		head.className = "circle";
		document.getElementById(Settings.boardId).appendChild(head);
		this.drawSnakePiece(head, (x - Settings.halfCircle), (y - Settings.halfCircle));
		return head;
	}
};