var scene = null;

var moveup = movedown = moveleft = moveright = false;
var debuglight = true;
var speed = 200;
var multiplier = 1;
var fps = mediaFps = totalCounts = sumFrames = 0;
var mode = 1;
var speedLightModifier = 1;
var skybox = null;

function init()
{
	//create the rendering context
	var context = GL.create({width: window.innerWidth, height: window.innerHeight});
	var renderer = new RD.Renderer(context);
	document.body.appendChild(renderer.canvas); //attach

	//create a scene
	scene = new RD.Scene();

	//create lights
	var lights = LI;
	lights.init(16, 350);

	//folder where stuff will be loaded	
	renderer.setDataFolder("data");

	//create mesh
	//renderer.loadMesh("lee.obj", "lee", null);
	renderer.loadMesh("streetlamp.obj", "lamp", null);
	

	for(var i = 1; i < 15; i++){
		if(i<10)
			var text = "Building_A0";
		else
			var text = "Building_A";

		renderer.loadMesh(text+i+".obj", text+i, null);
	}


	//create texture
	renderer.loadTexture("stars.jpg", {temp_color:[80,120,40,255], name: "stars"}, null);
	renderer.loadTexture("brick.jpg", {temp_color:[80,120,40,255], name: "terrainTex"}, null);
	
	//create camera
	var camera = new RD.Camera();
	camera.perspective( 45, gl.canvas.width / gl.canvas.height, 1, 10000 );
	camera.lookAt( [0,50,100],[0,0,0],[0,1,0] );
	
	//global settings
	var bg_color = vec4.fromValues(0.0,0.0,0.0,1);
	var u_color = vec4.fromValues(1.0,1.0,1.0,1);
	var u_lightcolor = vec3.fromValues(1.0,1.0,1.0);
	var u_lightvector = vec3.fromValues(0.0,50.0,100.0);

	buildCity(scene);
	
	//main draw function
	context.ondraw = function(){
		renderer.clear(bg_color);
		switch(mode) {
			case 1: // FORWARD +
				renderer.render(scene, camera);
				break;
			case 2: // TILE DEBUG
				lights.lightCulling(camera, true);
				break;
			case 3: // TILE DEBUG HEAT MAP
				lights.lightCullingHeatMap(camera);
				break;
			case 4: // FORWARD
				renderer.render(scene, camera);
				break;
		}
		if(debuglight)
			lights.light_debug(camera);
	}

	//main update
	context.onupdate = function(dt)
	{
		calculateFrames(dt);
		showMode();
		skybox.position = camera.position;
		switch(mode) {
		    case 1: // FORWARD +
		        scene.update(dt);
		        lights.lightCulling(camera, false);
		        break;
		    case 2: // TILE DEBUG
		        break;
		    case 3: // TILE DEBUG HEAT MAP
		    	lights.lightCulling(camera, false);
		        break;
		    case 4: // FORWARD
		        scene.update(dt);
		        break;
		}
		manageControls(dt, camera);
	}
	
	context.animate(); //launch loop
	
	//user input
	context.onmousemove = function(e)
	{
		if(e.dragging)
		{
			camera.rotate(e.deltax * 0.002, [0,-1,0]);
			camera.rotate(e.deltay * 0.002, camera.getLocalVector( [-1,0,0]));

			camera._must_update_matrix = true;
		}
	}

	context.captureMouse(true);

	
	context.onmousewheel = function(e)
	{
		camera.move(camera.getLocalVector([0,0,-2 * e.wheel]));
	}

	context.onkeydown = function(e)
	{
		if(e.keyCode == 37 || e.keyCode == 65){ //Left
			moveleft = true;
		}
		if(e.keyCode == 39 || e.keyCode == 68){ //Right
			moveright = true;
		}
		if(e.keyCode == 38 || e.keyCode == 87){ //Up
			moveup = true;
		}
		if(e.keyCode == 40 || e.keyCode == 83){ //Down
			movedown = true;
		}
		if(e.keyCode == 16){ //Shift
			multiplier = 4;
		}
		if(e.keyCode == 49){ // FORWARD+
			mode = 1;
			sumFrames = totalCounts = 0;
		}
		if(e.keyCode == 50){ // TILE DEBUG
			mode = 2;
			sumFrames = totalCounts = 0;
		}
		if(e.keyCode == 51){ // TILE DEBUG HEAT MAP
			mode = 3;
			sumFrames = totalCounts = 0;
		}
		if(e.keyCode == 52){ // FORWARD
			mode = 4;
			sumFrames = totalCounts = 0;
		}
		if(e.keyCode == 53){ // DEFERRED
			mode = 5;
			sumFrames = totalCounts = 0;
		}
		if(e.keyCode == 54){ // TOON SHADING
			mode = 6;
			sumFrames = totalCounts = 0;
		}
		if(e.keyCode == 109){ // -
			speedLightModifier /= 1.25;
		}
		if(e.keyCode == 107){ // +
			speedLightModifier *= 1.25;
		}
	}

	context.onkeyup = function(e)
	{
		if(e.keyCode == 37 || e.keyCode == 65){ //Left
			moveleft = false;
		}
		if(e.keyCode == 39 || e.keyCode == 68){ //Right
			moveright = false;
		}
		if(e.keyCode == 38 || e.keyCode == 87){ //Up
			moveup = false;
		}
		if(e.keyCode == 40 || e.keyCode == 83){ // Down
			movedown = false;
		}
		if(e.keyCode == 16){ //Shift
			multiplier = 1;
		}
		if(e.keyCode == 76){ //L
			debuglight = !debuglight;
		}

	}

	context.captureKeys();
}