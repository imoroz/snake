var Settings = {
    boardHeight: window.innerHeight,
    boardWidth: window.innerWidth,
    circleSize: 30,
    halfCircle: 15,
    foodSize: 20,
    halfFoodSize: 10,
    headId: "head",
    speed: 4,
    startingDestinationPointX: 0,
    startingDestinationPointY: 0
};


var app = {
    snake: [],
    food: {x:0, y: 0},
    head: {x:0, y: 0},
    destinationPoint: {x: Settings.startingDestinationPointX, y: Settings.startingDestinationPointY, angle: 0},
    distance: function(x1,y1, x2,y2){
    return Math.sqrt( Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2) );
},
radtoDegs: function(rads){
    return Math.round(rads / Math.PI * 180);
},

findAngle: function(xfirst, yfirst, xfollowing, yfollowing){
    var angle = Math.atan( Math.abs(yfollowing - yfirst) / Math.abs(xfollowing - xfirst) );
    
    if(xfirst > xfollowing && yfirst > yfollowing) angle += (Math.PI * 1)
    else if(xfirst < xfollowing && yfirst > yfollowing) angle += (Math.PI * 2)
    else if(xfirst > xfollowing && yfirst < yfollowing) angle += Math.PI;
    return angle;
},

findAngleThroughLegs: function(oppositeLeg, adjacentLeg){
    return Math.atan( Math.abs(oppositeLeg) / Math.abs(adjacentLeg) );
},
getAdjacentLeg: function(hypothenuse, angleRad){
    return hypothenuse * Math.abs(Math.cos(Math.abs(angleRad)));
},
getOppositeLeg: function(hypothenuse, angleRad){
    return hypothenuse * Math.abs(Math.sin(Math.abs(angleRad)));
},
getOppositeLegThroughAdjacent: function(adjacentLeg, angleRad){
    return adjacentLeg * Math.tan(angleRad);
},
getAdjacentLegThroughOpposite: function(oppositeLeg, angleRad){
    return oppositeLeg / Math.tan(angleRad);
},
isOnTheLeft: function(acc, rad){
    return acc >= 0 && Math.abs(rad) <= Math.PI/2;
},
getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
},
createFood: function(){
	var div = document.getElementById("food");
	if(div) document.body.removeChild(div);
	app.food.x = app.getRandomInt(Settings.halfCircle, (innerWidth - Settings.halfCircle));
	app.food.y = app.getRandomInt(Settings.halfCircle, (innerHeight - Settings.halfCircle));
	var div = document.createElement("div");
	div.id = "food";
	div.style.width = "10px";
	div.style.height = "10px";
	div.style.backgroundColor = "green";
	div.style.position = "absolute";
	div.style.top = app.food.y + "px";
	div.style.left = app.food.x + "px";
	document.body.appendChild(div);
},
extendSnake: function(){
	var newPart = document.createElement("div");
	newPart.className = "circle";
	newPart.id = "circle" + (app.snake.length + 1);
	document.body.appendChild(newPart);
	app.snake.push(newPart);
},
detectCollision: function(){
	var head = app.snake[0];
	var collision = null;
    if(app.distance(head.offsetLeft, head.offsetTop, app.food.x, app.food.y) < Settings.foodSize)
        collision = "food";
	app.snake.forEach(function(e, i , a){
		if(i > 1)
            if(app.distance(head.offsetLeft, head.offsetTop, e.offsetLeft, e.offsetTop) < Settings.circleSize)
				collision = "self";
	});
	return collision;
},
getDirection: function(leadingPointX, leadingPointY, followingPointX, followingPointY){
    if(leadingPointX < followingPointX && leadingPointY < followingPointY)
        return "nw";
    if(leadingPointX == followingPointX && leadingPointY < followingPointY)
        return "n";
    if(leadingPointX > followingPointX && leadingPointY < followingPointY)
        return "ne";
    if(leadingPointX > followingPointX && leadingPointY == followingPointY)
        return "e";
    if(leadingPointX > followingPointX && leadingPointY > followingPointY)
        return "se";
    if(leadingPointX == followingPointX && leadingPointY > followingPointY)
        return "s";
    if(leadingPointX < followingPointX && leadingPointY > followingPointY)
        return "sw";
    if(leadingPointX < followingPointX && leadingPointY == followingPointY)
        return "w";
},
findDestinationPoint: function(leadingPointX, leadingPointY){
    var adjacentLeg = Math.abs(leadingPointX - app.head.x);
    var oppositeLeg = Math.abs(leadingPointY - app.head.y);
    var angle = app.findAngleThroughLegs(oppositeLeg, adjacentLeg);
    var direction = app.getDirection(leadingPointX, leadingPointY, app.head.x, app.head.y);

    if(direction == "n")
        return {x: leadingPointX, y: 0};
    if(direction == "e")
        return {x: Settings.boardWidth, y: leadingPointY};
    if(direction == "s")
        return {x: leadingPointX, y: Settings.boardHeight};
    if(direction == "w")
        return {x: 0, y: leadingPointY};

    var middleAngle = app.findAngleThroughLegs(app.head.y, app.head.x);
    var whichLegToFind = "";
    var knownlegLength = 0;
    var summingFactor = 1;

    if(direction == "nw" && angle > middleAngle){
        whichLegToFind = "adjacent";
        knownlegLength = app.head.y;
        summingFactor = -1;
    }else if(direction == "nw" && angle < middleAngle){
        whichLegToFind = "opposite";
        knownlegLength = app.head.x;
        summingFactor = -1;
    }else if(direction == "ne" && angle > middleAngle){
        whichLegToFind = "adjacent";
        knownlegLength = app.head.y;
        summingFactor = 1;
    }else if(direction == "ne" && angle < middleAngle){
        whichLegToFind = "opposite";
        knownlegLength = Settings.boardWidth - app.head.x;
        summingFactor = -1;
    }else if(direction == "se" && angle > middleAngle){
        whichLegToFind = "adjacent";
        knownlegLength = Settings.boardHeight - app.head.y;
        summingFactor = 1;
    }else if(direction == "se" && angle < middleAngle){
        whichLegToFind = "opposite";
        knownlegLength = Settings.boardWidth - app.head.x;
        summingFactor = 1;
    }else if(direction == "sw" && angle > middleAngle){
        whichLegToFind = "adjacent";
        knownlegLength = Settings.boardHeight - app.head.y;
        summingFactor = -1;
    }else if(direction == "sw" && angle < middleAngle){
        whichLegToFind = "opposite";
        knownlegLength = app.head.x;
        summingFactor = 1;
    }


    if(whichLegToFind == "adjacent"){
        var unknownLeg = app.getAdjacentLegThroughOpposite(knownlegLength, angle);
        var xPosition = app.head.x + (unknownLeg * summingFactor);
        var yPosition = (direction.indexOf("n") >= 0) ?  0 : Settings.boardHeight ;
    }
    else if(whichLegToFind == "opposite"){
        var unknownLeg = app.getOppositeLegThroughAdjacent(knownlegLength, angle);
        var yPosition = app.head.y + (unknownLeg * summingFactor);
        var xPosition = (direction.indexOf("w") >= 0) ?  0 : Settings.boardWidth ;
    }
    return { x: xPosition, y: yPosition, angle: angle, direction: direction };
},
    
    initialize: function(id) {
        var snakeMovingTimeout = null;
        
    	app.createFood();
        
        app.head.y = Math.round(Settings.boardHeight / 2);
        app.head.x = Math.round(Settings.boardWidth / 2);


        var circle = document.getElementById("head");
        //var circle2 = document.getElementById("circle2");
        //var circle3 = document.getElementById("circle3");
        //var circle4 = document.getElementById("circle4");
        app.snake.push(circle);

        app.snake.forEach(function(e){
            e.style.top = app.head.y - Settings.halfCircle + "px";
            e.style.left = app.head.x - Settings.halfCircle + "px";
            //app.head.x += Settings.circleSize;    
        });

        app.snake[0].style.backgroundColor = "green";
        //app.snake[1].style.backgroundColor = "yellow";
        //app.snake[2].style.backgroundColor = "blue";
        //app.snake[3].style.backgroundColor = "purple";






    	document.getElementById("dh").innerHTML = dh;
    	document.getElementById("dw").innerHTML = dw;
      document.getElementById("outer_height").innerHTML = outerHeight;

    	document.getElementById("dcy").innerHTML = dcy;
    	document.getElementById("dcx").innerHTML = dcx;


        $(window).on("mousemove", function(event){
            //if(event.clientX >)console.log(event.clientX)
            //console.log(">>>>>>>>>");
            //console.log(snakeMovingTimeout);
            //console.log("mouse move");
            //window.clearTimeout(snakeMovingTimeout);
            //console.log(snakeMovingTimeout);
            //snakeMovingTimeout = null;
            //snakeMovingTimeout = setTimeout(function(){
                console.log("again");


            var destinationPoint = app.findDestinationPoint(event.clientX, event.clientY);
            app.destinationPoint = destinationPoint;
            console.log(app.destinationPoint);

            /*
            console.log(destinationPoint);
            var distance = app.distance(destinationPoint.x, destinationPoint.y, app.head.x, app.head.y);
            $("#" + Settings.headId).stop();
            $("#" + Settings.headId).animate({
                top: destinationPoint.y,
                left: destinationPoint.x
            },
            {
                duration: (distance/Settings.speed),
                progress: function(){ $("#" + Settings.headId).trigger("reposition"); }
            });


            //}, 60);
*/
            
        });
/*
        $("#" + Settings.headId).on("reposition", function(){
                        app.snake.forEach(function(e,i,a){
              if(i == 0){
                app.head.x = e.offsetLeft + Settings.halfCircle;
                app.head.y = e.offsetTop + Settings.halfCircle;
                  //e.style.left = event.clientX - Settings.halfCircle + "px";
                  //e.style.top = event.clientY - Settings.halfCircle + "px";
              }
              else{
                var distance = Math.round(app.distance(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop)) ;
                if(( distance ) > (Settings.circleSize)){
                    document.getElementById("distance").innerHTML = distance;

                    //var angle = app.findAngle(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);
                    var angle = app.findAngleThroughLegs((e.offsetTop - a[i-1].offsetTop), (e.offsetLeft - a[i-1].offsetLeft));
                    var direction = app.getDirection(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);

                    switch(direction){
                        case "nw":
                            var xFactor = 1;
                            var yFactor = 1;
                            break;
                        case "ne":
                            var xFactor = -1;
                            var yFactor = 1;
                            break;
                        case "se":
                            var xFactor = -1;
                            var yFactor = -1;
                            break;
                        case "sw":
                            var xFactor = 1;
                            var yFactor = -1;
                            break;
                    }

                    var xDistance = (app.getAdjacentLeg(Settings.circleSize, angle) * xFactor);
                    var yDistance = (app.getOppositeLeg(Settings.circleSize, angle) * yFactor);


                    var presumablyNewPositionX = a[i-1].offsetLeft + xDistance + "px";
                    var presumablyNewPositionY = a[i-1].offsetTop + yDistance + "px";

                    e.style.left = presumablyNewPositionX;
                    e.style.top = presumablyNewPositionY;

                    document.getElementById("angle").innerHTML = angle;
                }
            }
            });

var collision = app.detectCollision();
            if(collision && collision == "self")
                console.log("game over");
            else if(collision && collision == "food"){
                app.extendSnake();
                app.createFood();
            }
        });
*/
        setInterval(function(){
            //console.log("interval");
            app.snake.forEach(function(e,i,a){
              if(i == 0){
                var destinationPointt = app.destinationPoint;
                console.log(destinationPointt);
                
                switch(destinationPointt.direction){
                        case "nw":
                            var xFactor = -1;
                            var yFactor = -1;
                            break;
                        case "ne":
                            var xFactor = 1;
                            var yFactor = -1;
                            break;
                        case "se":
                            var xFactor = 1;
                            var yFactor = 1;
                            break;
                        case "sw":
                            var xFactor = -1;
                            var yFactor = 1;
                            break;
                    }
                var xDistance = (app.getAdjacentLeg(Settings.speed, destinationPointt.angle) * xFactor);
                var yDistance = (app.getOppositeLeg(Settings.speed, destinationPointt.angle) * yFactor);
                console.log("xDistance: " + xDistance + " yDistance: " + yDistance);
                  e.style.left = e.offsetLeft + xDistance + "px";
                  e.style.top = e.offsetTop + yDistance + "px";
                  console.log(e.style.left, e.style.top);
                app.head.x = e.offsetLeft + Settings.halfCircle;
                app.head.y = e.offsetTop + Settings.halfCircle;
                console.log("app.head.x: " + app.head.x + " app.head.y: " + app.head.y );
              }
              else{
                var distance = Math.round(app.distance(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop)) ;
                if(( distance ) > (Settings.circleSize)){
                    document.getElementById("distance").innerHTML = distance;

                    //var angle = app.findAngle(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);
                    var angle = app.findAngleThroughLegs((e.offsetTop - a[i-1].offsetTop), (e.offsetLeft - a[i-1].offsetLeft));
                    var direction = app.getDirection(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);

                    switch(direction){
                        case "nw":
                            var xFactor = 1;
                            var yFactor = 1;
                            break;
                        case "ne":
                            var xFactor = -1;
                            var yFactor = 1;
                            break;
                        case "se":
                            var xFactor = -1;
                            var yFactor = -1;
                            break;
                        case "sw":
                            var xFactor = 1;
                            var yFactor = -1;
                            break;
                    }

                    var xDistance = (app.getAdjacentLeg(Settings.circleSize, angle) * xFactor);
                    var yDistance = (app.getOppositeLeg(Settings.circleSize, angle) * yFactor);


                    var presumablyNewPositionX = a[i-1].offsetLeft + xDistance + "px";
                    var presumablyNewPositionY = a[i-1].offsetTop + yDistance + "px";

                    e.style.left = presumablyNewPositionX;
                    e.style.top = presumablyNewPositionY;

                    document.getElementById("angle").innerHTML = angle;
                }
            }
            });

var collision = app.detectCollision();
            if(collision && collision == "self")
                console.log("game over");
            else if(collision && collision == "food"){
                app.extendSnake();
                app.createFood();
            }


        },40);

        
/*
        document.body.onmousemove = function(event){
            var direction = app.getDirection(event.clientX, event.clientY, app.head.x, app.head.y);
            var destinationPoint = app.findDestinationPoint(event.clientX, event.clientY);
            console.log(destinationPoint);
        	app.snake.forEach(function(e,i,a){
              if(i == 0){
                  //e.style.left = event.clientX - Settings.halfCircle + "px";
                  //e.style.top = event.clientY - Settings.halfCircle + "px";
              }
              else{
                var distancee = Math.round(app.distance(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop)) ;
                if(( distancee ) > (Settings.circleSize)){
                    document.getElementById("distance").innerHTML = distancee;

                    //var angle = app.findAngle(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);
                    var angle = app.findAngleThroughLegs((e.offsetTop - a[i-1].offsetTop), (e.offsetLeft - a[i-1].offsetLeft));
                    var direction = app.getDirection(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);

                    switch(direction){
                        case "nw":
                            var xFactor = 1;
                            var yFactor = 1;
                            break;
                        case "ne":
                            var xFactor = -1;
                            var yFactor = 1;
                            break;
                        case "se":
                            var xFactor = -1;
                            var yFactor = -1;
                            break;
                        case "sw":
                            var xFactor = 1;
                            var yFactor = -1;
                            break;
                    }

                    var xDistance = (app.getAdjacentLeg(Settings.circleSize, angle) * xFactor);
                    var yDistance = (app.getOppositeLeg(Settings.circleSize, angle) * yFactor);


                    var presumablyNewPositionX = a[i-1].offsetLeft + xDistance + "px";
                    var presumablyNewPositionY = a[i-1].offsetTop + yDistance + "px";

                    e.style.left = presumablyNewPositionX;
                    e.style.top = presumablyNewPositionY;

                    document.getElementById("angle").innerHTML = angle;
                }
            }
            var collision = app.detectCollision();
            if(collision && collision == "self")
            	console.log("game over");
            else if(collision && collision == "food"){
            	app.extendSnake();
            	app.createFood();
            }
            });




		}
        */
	}
};