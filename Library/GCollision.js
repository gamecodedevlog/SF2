class GCollision {
    constructor(){}

    //사각 충돌
    hitRectangle(rect1, rect2) {
        return rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y;
      }
      
    //원형 충돌
    hitCircle(circle1, circle2) { 
        // 원의 중심 좌표로부터 벡터 x, y 계산 
        var vx = circle1.centerX() - circle2.centerX(); 
        var vy = circle1.centerY() - circle2.centerY(); 
        // 원 사이의 거리 
        var d = Math.sqrt(vx * vx + vy * vy); 
        // 반지름의 합 
        var totalRadii = circle1.halfWidth() + circle2.halfWidth(); 
        // 충돌 검사 
        var hit = magnitude <= totalRadii; 
        return hit; 
    }

    //원형 충돌2
    hitCircle2(ballA, ballB) {
        var squareX = Math.pow(Math.abs(ballA.x - ballB.x), 2);
        var squareY = Math.pow(Math.abs(ballA.y - ballB.y), 2);
        var hypothenuse = Math.sqrt(squareX + squareY);
        var distance = hypothenuse - ballA.r - ballB.r;
    
        if (distance >= 0) {
            return true;
        }
        return false;
    }

    //사각 충돌 위치
    hitRectangleSide(rect1, rect2) { 
        // 충돌 위치 
        var collisionSide = "none"; 
        // 사각형의 중심으로부터 벡터 x, y 계산 
        var vx = rect1.centerX() - rect2.centerX(); 
        var vy = rect1.centerY() - rect2.centerY(); 
        // 사각형 반넓이, 반높이의 합 
        var combinedHalfWidth = rect1.halfWidth() + rect2.halfWidth(); var combinedHalfHeight = rect1.halfHeight() + rect2.halfHeight(); 
        // 충돌 감지 
        if( Math.abs(vx) < combinedHalfWidth || Math.abs(vy) < combinedHalfHeight ) { 
            // 충돌 ! // 충돌위치를 구하는 로직 // 겹친 넓이, 높이 
            var overlapX = combinedHalfWidth - Math.abs(vx); var overlapY = combinedHalfHeight - Math.abs(vy); 
            if( overlapX >= overlapY ) { 
                // x축에서 충돌 발생 
                collisionSide = vy > 0 ? 'top' : 'bottom'; 
            } else { 
                // y축에서 충돌 발생 
                collisionSide = vx > 0 ? 'left' : 'right'; 
            } 
        } return collisionSide; 
    }

    //Circle and Rectangle
    hitCircleRectangle(player,rect){
        var distX = Math.abs(circle.x - rect.x - rect.w/2);
        var distY = Math.abs(circle.y - rect.y - rect.h/2);
    
        if (distX > (rect.w/2 + circle.r)) { return false; }
        if (distY > (rect.h/2 + circle.r)) { return false; }
    
        if (distX <= (rect.w/2)) { return true; } 
        if (distY <= (rect.h/2)) { return true; }
    
        // also test for corner collisions
        var dx=distX-rect.w/2;
        var dy=distY-rect.h/2;
        return (dx*dx+dy*dy<=(circle.r*circle.r));
    }

    //angle
    getAngle(cx, cy, cx2, cy2) {
        var dy = cy2 - cy;
        var dx = cx2 - cx;
        var theta = Math.atan2(dy, dx);
        theta *= 180 / Math.PI; 
        //return theta;

        return theta >= 360 ? theta - 360 : theta < 0 ? theta + 360 : theta;
    }

    //공충돌 반응 각 (ex.당구공 충돌 반응 각도)
    angleReflect(incidenceAngle, surfaceAngle){
        var a = surfaceAngle * 2 - incidenceAngle;
        return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
    }
}