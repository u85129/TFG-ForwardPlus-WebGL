
var calculateFrames = function(dt){
	fps = 1/dt;
	totalCounts++;
	sumFrames += fps;
	mediaFps = sumFrames / totalCounts;
	document.getElementById("fps").innerHTML = "FPS: "+Math.round(fps)+" - Media: "+Math.round(mediaFps)+" - Number of lights: "+LI.NUM_LIGHTS;
}

var manageControls = function(dt, camera){
	if(moveleft)
		camera.move(camera.getLocalVector([-speed*multiplier*dt,0,0]));
	if (moveright)
		camera.move(camera.getLocalVector([speed*multiplier*dt,0,0]));
	if(moveup)
		camera.move(camera.getLocalVector([0,0,-speed*multiplier*dt]));
	if(movedown)
		camera.move(camera.getLocalVector([0,0,speed*multiplier*dt]));
}
