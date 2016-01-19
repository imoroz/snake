var app = {
    drawer: new HTMLDrawer(Settings),
    snake: [],
    food: {x:0, y: 0},
    head: {x:0, y: 0},
    snakeMovingInterval: null,
    score: 0,
    highscore: 0,
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    createFood: function(){
        app.food.x = app.getRandomInt(Settings.halfCircle, (innerWidth - Settings.halfCircle));
        app.food.y = app.getRandomInt(Settings.halfCircle, (innerHeight - Settings.halfCircle));
        app.drawer.createFood(app.food.x, app.food.y);
    },
    extendSnake: function(){
        var newPiece = app.drawer.drawNewSnakePiece(app.snake.length);
    	app.snake.push(newPiece);
    },
    detectCollision: function(){
    	var head = app.snake[0];
    	var collision = null;
        if(head.offsetTop < 0 || head.offsetTop > (Settings.boardHeight - Settings.circleSize) || head.offsetLeft < 0 || head.offsetLeft > (Settings.boardWidth - Settings.circleSize))
            collision = "wall";
    	app.snake.forEach(function(e, i , a){
            if(Geometry.distance(head.offsetLeft, head.offsetTop, app.food.x, app.food.y) < Settings.foodSize)
                collision = "food";
    		if(i > 1)
                if(Geometry.distance(head.offsetLeft, head.offsetTop, e.offsetLeft, e.offsetTop) < Settings.circleSize)
    				collision = "self";
    	});
    	return collision;
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
        console.log(typeOfCollision);
    },
    setScore: function(){
        HTMLUiMaker.setScore(app.score);
    },
    setHighScore: function(){
        if(app.highscore == 0) return;
        HTMLUiMaker.setHighScore(app.highscore);
    },
    
    initialize: function(id) {
        HTMLUiMaker.showDialog(Settings.startGameDialogId);
        HTMLUiMaker.bind(Settings.startGameButtonClass, "click", app.startGame);
    },

    startGame: function(){
        app.score = 0;
        app.snake.length = 0;
        app.setScore();
        app.setHighScore();
        HTMLUiMaker.emptyBoard();
        console.log("go");
        app.head.y = Math.round(Settings.boardHeight / 2);
        app.head.x = Math.round(Settings.boardWidth / 2);
        var head = app.drawer.createHead(app.head.x, app.head.y);
        app.snake.push(head);
        HTMLUiMaker.hideDialog(Settings.dialogClass);
    	app.createFood();

        $(window).on("mousemove", function(event){
            var destinationPoint = Geometry.findDestinationPoint(event.clientX, event.clientY, app.head.x, app.head.y, Settings.boardWidth, Settings.boardHeight);
            console.log(destinationPoint);
            var movingFactor = Geometry.getMovingFactors(destinationPoint.direction, true);
            app.xDistanceForHead = (Geometry.getAdjacentLeg(Settings.speed, destinationPoint.angle) * movingFactor.x);
            app.yDistanceForHead = (Geometry.getOppositeLeg(Settings.speed, destinationPoint.angle) * movingFactor.y);
        });

        app.snakeMovingInterval = setInterval(function(){
            app.snake.forEach(function(e,i,a){
              if(i == 0){
                app.drawer.drawSnakePiece(e, (e.offsetLeft + app.xDistanceForHead), (e.offsetTop + app.yDistanceForHead));
                app.head.x = e.offsetLeft + Settings.halfCircle;
                app.head.y = e.offsetTop + Settings.halfCircle;
              }
              else{
                var distance = Math.round(Geometry.distance(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop)) ;
                if(( distance ) > (Settings.circleSize)){
                    var angle = Geometry.findAngleThroughLegs((e.offsetTop - a[i-1].offsetTop), (e.offsetLeft - a[i-1].offsetLeft));
                    var direction = Geometry.getDirection(a[i-1].offsetLeft, a[i-1].offsetTop, e.offsetLeft, e.offsetTop);
                    var movingFactor = Geometry.getMovingFactors(direction);
                    var xDistance = (Geometry.getAdjacentLeg(Settings.circleSize, angle) * movingFactor.x);
                    var yDistance = (Geometry.getOppositeLeg(Settings.circleSize, angle) * movingFactor.y);
                    app.drawer.drawSnakePiece(e, (a[i-1].offsetLeft + xDistance), (a[i-1].offsetTop + yDistance));
                }
            }
            });

            var collision = app.detectCollision();
            console.log(collision);
            if(collision && collision == "food"){
                app.score += Settings.speed;
                app.setScore();
                app.extendSnake();
                app.createFood();
            }else if(collision){
                app.gameOver(collision);
            }
        },40);


	}
};