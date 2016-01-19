var app = {
    //drawer: new HTMLDrawer(Settings),
    snakes: [],
    snake: [],
    clones: [],
    cellCounter: 0,
    subsnakeCounter: 0,
    food: {x:0, y: 0},
    head: {x:0, y: 0, movingFactor: {}},
    snakeMovingInterval: null,
    score: 0,
    highscore: 0,
    last: null,
    first: null,
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    createFood: function(){
        app.food.x = app.getRandomInt(Settings.halfCircle, (innerWidth - Settings.halfCircle));
        app.food.y = app.getRandomInt(Settings.halfCircle, (innerHeight - Settings.halfCircle));
    },
    detectCollision: function(bits){
    	//var head = snakeArray[0];
    	var collision = null;
    	bits.forEach(function(bit, i , a){
            if(Geometry.distance(bit.x, bit.y, app.food.x, app.food.y) < Settings.foodSize)
                collision = "food";
    		//if(i > 1)
            //    if(Geometry.distance(head.offsetLeft, head.offsetTop, e.offsetLeft, e.offsetTop) < Settings.circleSize)
    		//		collision = "self";
    	});
    	return collision;
    },
    detectWallCollission: function(bit){
        var shiftX = 0;
        var shiftY = 0;
        if(bit.y > (Settings.boardHeight - Settings.halfCircle))
            shiftY = Settings.boardHeight - bit.y;
        if(bit.y < (0 + Settings.halfCircle))
            shiftY = bit.y;
        if(bit.x > (Settings.boardWidth - Settings.halfCircle))
            shiftX = Settings.boardWidth - bit.x;
        if(bit.x < (0 + Settings.halfCircle))
            shiftX = bit.x;


        if(Math.abs(shiftX) > (Settings.halfCircle) || Math.abs(shiftY) > (Settings.halfCircle)){
            bit.withinBorders = false;
            bit.outofview = true;
        }
        else if(Math.abs(shiftX) > 0 || Math.abs(shiftY) > 0){
            bit.withinBorders = false;
            bit.shift = {x: shiftX, y: shiftY};
        }
        else
            bit.withinBorders = true;
    },
    gameOver: function(typeOfCollision){
        clearInterval(app.snakeMovingInterval);
        $(window).off();
        if(app.score > app.highscore){
            var newHighScore = app.score;
            app.highscore = app.score;
            app.setHighScore();
        }
        HTMLUiMaker.showEndGameDialog(typeOfCollision, app.score, newHighScore);
    },
    setScore: function(){
        HTMLUiMaker.setScore(app.score);
    },
    setHighScore: function(){
        if(app.highscore == 0) return;
        HTMLUiMaker.setHighScore(app.highscore);
    },
    
    initialize: function(id) {
        CanvasDrawer.init();
        HTMLUiMaker.showDialog(Settings.startGameDialogId);
        HTMLUiMaker.bind(Settings.startGameButtonClass, "click", app.startGame);
    },

    startGame: function(){
        app.score = 0;

        var newSubsnake = Snake.createNewSubsnake();
        newSubsnake.setNext(newSubsnake);
        newSubsnake.setPrevious(newSubsnake);
        Snake.setFirst(newSubsnake);
        Snake.setLast(newSubsnake);
        var newBit = newSubsnake.createNewBit();
        Snake.setHead(newBit);

        app.setScore();
        app.setHighScore();
        HTMLUiMaker.emptyBoard();
        Snake.head.y = Math.round(Settings.boardHeight / 2);
        Snake.head.x = Math.round(Settings.boardWidth / 2);
        Snake.head.isHead = true;
        Snake.head.isEntering = false;
        HTMLUiMaker.hideDialog(Settings.dialogClass);
    	app.createFood();

        $(window).on("mousemove", function(event){
            if(Snake.head.x < Settings.circleSize || Snake.head.x > (Settings.boardWidth - Settings.circleSize) || Snake.head.y < Settings.circleSize || Snake.head.y > (Settings.boardHeight - Settings.circleSize))
                return;
            var destinationPoint = Geometry.findDestinationPoint(event.clientX, event.clientY, Snake.head.x, Snake.head.y, Settings.boardWidth, Settings.boardHeight);
            var movingFactor = Geometry.getMovingFactors(destinationPoint.direction, true);
            Snake.head.mirroredX = destinationPoint.mirroredX;
            Snake.head.mirroredY = destinationPoint.mirroredY;
            Snake.head.movingFactor.x = movingFactor.x;
            Snake.head.movingFactor.y = movingFactor.y;
            Snake.head.xDistanceForHead = (Geometry.getAdjacentLeg(Settings.speed, destinationPoint.angle) * movingFactor.x);
            Snake.head.yDistanceForHead = (Geometry.getOppositeLeg(Settings.speed, destinationPoint.angle) * movingFactor.y);
        });

        app.snakeMovingInterval = setInterval(function(){
            Snake.iterateThroughSubsnakes(function(snake, i, a){
                snake.iterateThroughBits(function(bit, i,a){
                    console.log("snake id: " + snake.id + " bit id: " + bit.id);
                if(i == 0){
                    bit.x += bit.xDistanceForHead;
                    bit.y += bit.yDistanceForHead;

                    app.detectWallCollission(bit);
                    console.log(bit);
                    console.log("...");

                    if(!bit.withinBorders){
                        console.log(bit);
                        console.log("...");
                        if (bit.isEntering){
                            //do nothing if element only entering board
                        }else if(bit.outofview){
                            if(snake.bits[i+1]){
                                snake.bits[i+1].yDistanceForHead = bit.yDistanceForHead;
                                snake.bits[i+1].xDistanceForHead = bit.xDistanceForHead;
                                console.log(snake.bits[i+1]);
                                console.log("...");  
                            }
                            snake.removeFirst();
                            if(snake.bits.length == 0){
                                var newLast = Snake.last.next;
                                Snake.last = newLast;
                            }
                            Snake.clonedBits[bit.id] = false;
                        }else if(!Snake.clonedBits[bit.id]){
                            if(snake == Snake.first){
                                var nextSubsnake = Snake.getNextSubsnake(snake);
                                nextSubsnake.setNext(Snake.last);
                                nextSubsnake.setPrevious(snake);
                                snake.setNext(nextSubsnake);
                                Snake.setFirst(nextSubsnake);
                                bit.isHead = false;
                            }
                            else
                                var nextSubsnake = snake.next;

                            if(!Snake.clonedBits[bit.id]){
                                console.log("BEGIN CLONING BIT");
                                console.log("...");

                                var clonedBit = $.extend(true, {}, bit);
                                if(nextSubsnake.bits.length == 0){
                                    clonedBit.isHead = true;
                                    Snake.head = clonedBit;
                                }
                                
                                clonedBit.isEntering = true;
                                Snake.clonedBits[bit.id] = true;
                                nextSubsnake.addBit(clonedBit);
                                var x = bit.mirroredX + (bit.shift.x * -bit.movingFactor.x); // NEED TO MAKE
                                var y = bit.mirroredY + (bit.shift.y * -bit.movingFactor.y) // NEED TO MAKE
                                Snake.head.x = x;
                                Snake.head.y = y;

                                if(bit.mirroredX == 0 || bit.mirroredX == Settings.boardWidth){
                                    bit.xDistanceForHead = Settings.speed * bit.movingFactor.x;
                                    bit.yDistanceForHead = 0;
                                }else if(bit.mirroredY == 0 || bit.mirroredY == Settings.boardHeight){
                                    bit.xDistanceForHead = 0;
                                    bit.yDistanceForHead = Settings.speed * bit.movingFactor.y;
                                }
                            }
                            else{

                            }
                            
                        }
                        console.log("after snake on border");
                    } 
                    if(bit.isEntering && bit.withinBorders)
                        bit.isEntering = false;
                }else{
                        console.log("not first element");
                        console.log(bit);
                        if(typeof bit.x == "undefined")
                            bit.x = 0;
                        if(typeof bit.y == "undefined")
                            bit.y = 0;
                        var distance = Math.round(Geometry.distance(snake.bits[i-1].x, snake.bits[i-1].y, bit.x, bit.y)) ;
                        if( distance > Settings.circleSize){
                            var angle = Geometry.findAngleThroughLegs((bit.y - snake.bits[i-1].y), (bit.x - snake.bits[i-1].x));
                            var direction = Geometry.getDirection(snake.bits[i-1].x, snake.bits[i-1].y, bit.x, bit.y);
                            var movingFactor = Geometry.getMovingFactors(direction);
                            var xDistance = (Geometry.getAdjacentLeg(Settings.circleSize, angle) * movingFactor.x);
                            var yDistance = (Geometry.getOppositeLeg(Settings.circleSize, angle) * movingFactor.y);
                            bit.x = snake.bits[i-1].x + xDistance;
                            bit.y = snake.bits[i-1].y + yDistance;
                        }
                    }
                
                });
               
            });
            var allBits = Snake.getAllBits();
            var collision = app.detectCollision(allBits);
            if(collision && collision == "food"){
                app.score += Settings.speed;
                app.setScore();
                Snake.extendSnake();
                app.createFood();
            }else if(collision && collision != "wall"){
                app.gameOver(collision);
            }
            CanvasDrawer.clearCanvas();
            CanvasDrawer.renderBits(allBits);
            CanvasDrawer.renderFood(app.food);
            
        },40);


	}
};