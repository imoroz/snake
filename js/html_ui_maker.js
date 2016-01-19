var HTMLUiMaker = {
	showDialog: function(dialogId){
		$("#" + dialogId).css({ top: "50%", left: "50%" });
		$("#" + dialogId).show();
	},
	showEndGameDialog: function(typeOfCollision, finalScore, newHighScore){
		var message = Settings.collisionMessage;
		if(typeOfCollision == "wall")
			message += " a wall.";
		else
			message += " yourself";
		$("#end_game_message").html(message);
		$("#final_score_value").html(finalScore);
		if(newHighScore)
			$("#new_high_score").show();
		else
			$("#new_high_score").hide();
		this.showDialog(Settings.endGameDialogId);
	},
	hideDialog: function(dialogId){
		$(dialogId).hide();
	},
	bind: function(elementId, event, callback){
		$(elementId).on(event, callback);
	},
	emptyBoard: function(){
		$("#" + Settings.boardId).empty();
	},
	setScore: function(score){
		document.getElementById("score").innerHTML = app.score;
	},
	setHighScore: function(score){
		$("#high_score_bar").show();
    document.getElementById("high_score").innerHTML = app.highscore;
	}
};