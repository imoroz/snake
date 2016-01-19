CanvasDrawer = (function(Settings, $){
	var canvas;
	var context;
	var spriteSheet;
	var BUBBLE_IMAGE_DIM = 44;
	var CanvasDrawer = {
		init: function(callback){
			canvas = document.createElement("canvas");
			$(canvas).addClass("game_canvas");
			$(document.body).prepend(canvas);
			$(canvas).attr("width", Settings.boardWidth);
			$(canvas).attr("height", Settings.boardHeight);
			context = canvas.getContext("2d");
		},
		renderBits: function(bits){
			context.beginPath();
			$.each(bits, function(index, bit){
				context.moveTo(bit.x,bit.y);
				context.arc(bit.x, bit.y, Settings.circleSize/2, 0, 2 * Math.PI);
				context.fillStyle = "red";
				context.stroke();
				context.fill();
			});

		},
		renderFood: function(food){
			context.beginPath();
			context.arc(food.x, food.y, Settings.foodSize/2, 0, 2* Math.PI);
			context.stroke();
			context.fillStyle = "yellow";
			context.fill();
		},
		clearCanvas: function(){
			context.clearRect(0,0, Settings.boardWidth, Settings.boardHeight);
		}
	};
	return CanvasDrawer;
})(Settings,jQuery);