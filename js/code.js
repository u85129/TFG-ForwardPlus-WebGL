var scene = null;

var moveup = movedown = moveleft = moveright = colorLights = false;
var debuglight = true;
var speed = 20;
var multiplier = 1;
var fps = mediaFps = totalCounts = sumFrames = 0;
var mode = 1;
var skybox = null;
var numMeshes = 0;
var drawCalls = 0;
var stats = null;
var timerQuery = null;
var query = null;
var available = false;

function init()
{
	stats = new Stats();
	stats.showPanel(0);
	document.getElementById("stats2").appendChild(stats.dom);

	//create the rendering context
	var context = GL.create({width: window.innerWidth, height: window.innerHeight, webgl2:true});
	var renderer = new RD.Renderer(context);
	document.body.appendChild(renderer.canvas); //attach

	//create a scene
	scene = new RD.Scene();

	//create lights
	var lights = LI;
	lights.init(16, 35);

	var deferred = DF;
	DF.init();

	//folder where stuff will be loaded	
	renderer.setDataFolder("data");

	//load and create mesh I will use on the scene
	renderer.loadMesh("streetlamp.obj", "lamp", null);

	for(var i = 1; i < 15; i++){
		if(i<10)
			var text = "Building_A0";
		else
			var text = "Building_A";

		renderer.loadMesh(text+i+".obj", text+i, null);
	}

	//load and create texture I will use on some objects
	renderer.loadTexture("stars.jpg", {temp_color:[80,120,40,255], name: "stars"}, null);
	renderer.loadTexture("brick.jpg", {temp_color:[80,120,40,255], name: "terrainTex"}, null);

	//create a skybox
	skybox = new RD.SceneNode({
		position: [0,0,0],
		scaling: [1000,1000,1000],
		color: [1,1,1,1],
		mesh: "cube",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: true, depth_test: false},
		uniforms: {}
	});
	scene.root.addChild( skybox );

	//place meshes with textures on the scene
	buildCity(scene);
	
	//create camera
	var camera = new RD.Camera();
	camera.perspective( 45, gl.canvas.width / gl.canvas.height, 1, 1000 );
	camera.lookAt( [0,50,100],[0,0,0],[0,1,0] );
	
	//global settings
	var bg_color = vec4.fromValues(0.0,0.0,0.0,1);
	var u_color = vec4.fromValues(1.0,1.0,1.0,1);


	//main draw function
	context.ondraw = function(){
		stats.begin();
		drawCalls = 0;
		renderer.clear(bg_color);
		if(timerQuery){
			available = timerQuery.getQueryObjectEXT(query, timerQuery.QUERY_RESULT_AVAILABLE_EXT);
			//var disjoint = gl.getParamater(timerQuery.GPU_DISJOINT_EXT);
			if (available) {
			  // See how much time the rendering of the object took in nanoseconds.
			  var timeElapsed = timerQuery.getQueryObjectEXT(query, timerQuery.QUERY_RESULT_EXT);
			  console.log(timeElapsed/1000000);
			}
			//query = timerQuery.createQueryEXT();
		    timerQuery.beginQueryEXT(timerQuery.TIME_ELAPSED_EXT, query);
		    
		}
		

		//Depending on the mode we compute lightculling/g-buffer and render the scene
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
				DF.clearFrameBuffer(renderer, bg_color);
				renderer.render(scene, camera);
				DF.renderScene(camera);
				break;
			case 6: //DEFERRED COLOR
				DF.clearFrameBuffer(renderer, bg_color);
				renderer.render(scene, camera);
				DF.renderBuffer(0);
				break;
			case 7: //DEFERRED NORMAL
				DF.clearFrameBuffer(renderer, bg_color);
				renderer.render(scene, camera);
				DF.renderBuffer(1);
				break;
			case 8: //DEFERRED DEPTH
				DF.clearFrameBuffer(renderer, bg_color);
				renderer.render(scene, camera);
				DF.renderBuffer(2);
				break;
			case 9: // TILED DEFERRED
				DF.clearFrameBuffer(renderer, bg_color);
				renderer.render(scene, camera);
				lights.lightCulling(camera, false);
				DF.renderSceneTiled(camera);
				break;

		}
		if(debuglight)
			lights.light_debug(camera);

		document.getElementById("drawcalls").innerHTML = "Number of draw calls: "+drawCalls;
		stats.end();
if(timerQuery){
			timerQuery.endQueryEXT(timerQuery.TIME_ELAPSED_EXT);
			
		}
		
	}

	//main update
	context.onupdate = function(dt)
	{
		//keep track of fps, and update skybox so camera is always at the center of it
		calculateFrames(dt);
		showMode(renderer);
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
		//manage some inputs
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
		if(e.keyCode == 49){ // 1
			mode = 1;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 50){ // 2
			mode = 2;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 51){ // 3
			mode = 3;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 52){ // 4
			mode = 4;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 53){ // 5
			mode = 5;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 54){ // 6
			mode = 6;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 55){ // 7
			mode = 7;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 56){ // 8
			mode = 8;
			sumFrames = totalCounts = 0;
			fpsData = [];
		}
		if(e.keyCode == 109){ // -
			LI.LIGHT_RADIUS /= 2;
		}
		if(e.keyCode == 107){ // +
			LI.LIGHT_RADIUS *= 2;
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
			if(gl.extensions["EXT_disjoint_timer_query"]){
				if(!timerQuery){
					timerQuery = gl.extensions["EXT_disjoint_timer_query"];
					query = timerQuery.createQueryEXT();
				}else{
					timerQuery = null;
					query = null;
				}
			}
		}
		if(e.keyCode == 75){ // K
			colorLights = !colorLights;
		}

		if(e.keyCode == 57){ // 9
			mode = 9;
			sumFrames = totalCounts = 0;
			fpsData = [];
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