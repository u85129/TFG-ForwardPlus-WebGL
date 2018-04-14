var scene = null;

var moveup = movedown = moveleft = moveright = false;
var debuglight = true;
var speed = 200;
var multiplier = 1;
var fps = mediaFps = totalCounts = sumFrames = 0;
var mode = 1;
var skybox = null;
var runChart = true;

function init()
{
	//create the rendering context
	var context = GL.create({width: window.innerWidth, height: window.innerHeight, webgl2:true});
	var renderer = new RD.Renderer(context);
	document.body.appendChild(renderer.canvas); //attach

	/*var ext = gl.getExtension('WEBGL_draw_buffers');
	if(!ext)
		throw "Browser doesnt have WEBGL_draw_buffers extension";*/

	//create a scene
	scene = new RD.Scene();

	//create lights
	var lights = LI;
	lights.init(16, 350);

	var deferred = DF;
	DF.init();

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

	skybox = new RD.SceneNode({
		position: [0,0,0],
		scaling: [10000,10000,10000],
		color: [1,1,1,1],
		mesh: "cube",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: true, depth_test: false},
		uniforms: {}
	});
	scene.root.addChild( skybox );

	buildCity(scene);
	
	//create camera
	var camera = new RD.Camera();
	camera.perspective( 45, gl.canvas.width / gl.canvas.height, 1, 10000 );
	camera.lookAt( [0,50,100],[0,0,0],[0,1,0] );
	
console.log(gl.webgl_version);

	//global settings
	var bg_color = vec4.fromValues(0.0,0.0,0.0,1);
	var u_color = vec4.fromValues(1.0,1.0,1.0,1);

	//main draw function
	context.ondraw = function(){
		renderer.clear(bg_color);
		switch(mode) {
			case 1: // FORWARD +
				lights.lightCulling(camera, false);
				renderer.render(scene, camera);
				break;
			case 2: // TILE DEBUG
				lights.lightCulling(camera, true);
				break;
			case 3: // TILE DEBUG HEAT MAP
				lights.lightCulling(camera, false);
				lights.lightCullingHeatMap(camera);
				break;
			case 4: // FORWARD
				renderer.render(scene, camera);
				break;
			case 5: // DEFERRED
				renderer.render(scene, camera);
				DF.renderScene();
				break;
			case 6: //DEFERRED POSITION
				renderer.render(scene, camera);
				DF.renderBuffer(0);
				break;
			case 7: //DEFERRED NORMAL
				renderer.render(scene, camera);
				DF.renderBuffer(1);
				break;
			case 8: //DEFERRED UV
				renderer.render(scene, camera);
				DF.renderBuffer(2);
				break;
			case 9: //DEFERRED COLOR
				renderer.render(scene, camera);
				DF.renderBuffer(3);
				break;
			case 10: //DEFERRED DEPTH
				renderer.render(scene, camera);
				DF.renderBuffer(4);
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
		scene.update(dt);
		switch(mode) {
		    case 1: // FORWARD +
		        break;
		    case 2: // TILE DEBUG
		        break;
		    case 3: // TILE DEBUG HEAT MAP
		        break;
		    case 4: // FORWARD
		        break;
		    case 5: // DEFERRED
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
			fpsData = [];
		}
		if(e.keyCode == 50){ // TILE DEBUG
			mode = 2;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 51){ // TILE DEBUG HEAT MAP
			mode = 3;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 52){ // FORWARD
			mode = 4;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 53){ // DEFERRED
			mode = 5;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 54){ // DEFERRED POSITION
			mode = 6;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 55){ // DEFERRED NORMAL
			mode = 7;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 56){ // DEFERRED UV
			mode = 8;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 57){ // DEFERRED COLOR
			mode = 9;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 48){ // DEFERRED DEPTH
			mode = 10;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 109){ // -
			LI.LIGHT_RADIUS -= 10;
		}
		if(e.keyCode == 107){ // +
			LI.LIGHT_RADIUS += 10;
		}
		if(e.keyCode == 90){ // Z
			LI.TILE_SIZE = 8;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 88){ // X
			LI.TILE_SIZE = 16;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 67){ // C
			LI.TILE_SIZE = 32;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 80){ // P
			runChart = !runChart;
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