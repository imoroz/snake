var Geometry = {
    distance: function(x1,y1, x2,y2){
        return Math.sqrt( Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2) );
    },
    radtoDegs: function(rads){
        return Math.round(rads / Math.PI * 180);
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
    findDestinationPoint: function(leadingPointX, leadingPointY, followingPointX, followingPointY, maxWidth, maxHeight){
        var adjacentLeg = Math.abs(leadingPointX - followingPointX);
        var oppositeLeg = Math.abs(leadingPointY - followingPointY);
        var angle = Geometry.findAngleThroughLegs(oppositeLeg, adjacentLeg);
        var direction = Geometry.getDirection(leadingPointX, leadingPointY, followingPointX, followingPointY);

        if(direction == "n")
            return {x: leadingPointX, y: 0};
        if(direction == "e")
            return {x: maxWidth, y: leadingPointY};
        if(direction == "s")
            return {x: leadingPointX, y: maxHeight};
        if(direction == "w")
            return {x: 0, y: leadingPointY};

        var middleAngle = Geometry.findAngleThroughLegs(followingPointY, followingPointX);
        var whichLegToFind = "";
        var knownlegLength = 0;
        var summingFactor = 1;

        if(direction == "nw" && angle > middleAngle){
            whichLegToFind = "adjacent";
            knownlegLength = followingPointY;
            summingFactor = -1;
        }else if(direction == "nw" && angle < middleAngle){
            whichLegToFind = "opposite";
            knownlegLength = followingPointX;
            summingFactor = -1;
        }else if(direction == "ne" && angle > middleAngle){
            whichLegToFind = "adjacent";
            knownlegLength = followingPointY;
            summingFactor = 1;
        }else if(direction == "ne" && angle < middleAngle){
            whichLegToFind = "opposite";
            knownlegLength = maxWidth - followingPointX;
            summingFactor = -1;
        }else if(direction == "se" && angle > middleAngle){
            whichLegToFind = "adjacent";
            knownlegLength = maxHeight - followingPointY;
            summingFactor = 1;
        }else if(direction == "se" && angle < middleAngle){
            whichLegToFind = "opposite";
            knownlegLength = maxWidth - followingPointX;
            summingFactor = 1;
        }else if(direction == "sw" && angle > middleAngle){
            whichLegToFind = "adjacent";
            knownlegLength = maxHeight - followingPointY;
            summingFactor = -1;
        }else if(direction == "sw" && angle < middleAngle){
            whichLegToFind = "opposite";
            knownlegLength = followingPointX;
            summingFactor = 1;
        }


        if(whichLegToFind == "adjacent"){
            var unknownLeg = Geometry.getAdjacentLegThroughOpposite(knownlegLength, angle);
            var xPosition = followingPointX + (unknownLeg * summingFactor);
            var mirroredX = followingPointX + (unknownLeg * summingFactor);
            var yPosition = (direction.indexOf("n") >= 0) ?  0 : maxHeight ;
            var mirroredY = (yPosition == 0) ? maxHeight : 0;
        }
        else if(whichLegToFind == "opposite"){
            var unknownLeg = Geometry.getOppositeLegThroughAdjacent(knownlegLength, angle);
            var yPosition = followingPointY + (unknownLeg * summingFactor);
            var mirroredY = followingPointY + (unknownLeg * summingFactor);
            var xPosition = (direction.indexOf("w") >= 0) ?  0 : maxWidth ;
            var mirroredX = (xPosition == 0) ? maxWidth : 0;
        }

        return { x: xPosition, y: yPosition, mirroredX: mirroredX, mirroredY: mirroredY, angle: angle, direction: direction };
    },
    getMovingFactors: function(direction, afterMouseMovement){
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
    	if(afterMouseMovement){
    		xFactor *= -1;
    		yFactor *= -1;
    	}
    	return {x: xFactor, y: yFactor};
    }
};