
var calculateFrames = function(dt){
	if(mediaFps == Infinity)
		sumFrames = totalCounts = 0;
	fps = 1/dt;
	if(fps > 60)
		fps = 60;
	totalCounts++;
	sumFrames += fps;
	mediaFps = sumFrames / totalCounts;
	document.getElementById("fps").innerHTML = "FPS: "+Math.round(fps)+" - Media: "+Math.round(mediaFps)+"<br>Number of lights: "+LI.NUM_LIGHTS;
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

var showMode = function(){
	if(mode == 1)
		document.getElementById("mode").innerHTML = 'Forward+';
	if(mode == 2)
		document.getElementById("mode").innerHTML = 'Tile Debug';
	if(mode == 3)
		document.getElementById("mode").innerHTML = 'Tile Debug Heat Map';
	if(mode == 4)
		document.getElementById("mode").innerHTML = 'Forward';
}