var scene = null;

var moveup = movedown = moveleft = moveright = debuglight = false;
var speed = 200;
var multiplier = 1;
var fps = mediaFps = totalCounts = sumFrames = 0;
var mode = 1;

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
	lights.init(32, 1, 1000);

	//get shaders for text file	
	renderer.loadShaders("shaders.txt");

	//folder where stuff will be loaded	
	renderer.setDataFolder("data");

	//create mesh
	renderer.loadMesh("lee.obj", "lee", null);
	renderer.loadMesh("sponza.obj", "sponza", null);

	//create texture
	renderer.loadTexture("lee_color_specular.jpg", {temp_color:[80,120,40,255], minFilter: gl.LINEAR_MIPMAP_LINEAR, name: "lee_specular"}, null);
	
	//create camera
	var camera = new RD.Camera();
	camera.perspective( 45, gl.canvas.width / gl.canvas.height, 1, 10000 );
	camera.lookAt( [0,50,100],[0,0,0],[0,1,0] );
	
	//global settings
	var bg_color = vec4.fromValues(0.1,0.1,0.1,1);
	var u_color = vec4.fromValues(1.0,1.0,1.0,1);
	var u_lightcolor = vec3.fromValues(1.0,1.0,1.0);
	var u_lightvector = vec3.fromValues(0.0,50.0,100.0);


	//create a mesh in the scene
	var node = new RD.SceneNode({
		position: [0,0,0],
		scaling: [1,1,1],
		color: [1,1,1,1],
		mesh: "sponza",
		shader: "forward_plus",
		texture: "lee_specular",
		uniforms: {
			u_numTileHorizontal: lights.totalTilesX,
			u_tileSize: lights.TILE_SIZE,
			u_totalTiles: lights.totalTiles,
			u_totalLightIndexes: lights.lightIndexList.length
		}
	});

	scene.root.addChild( node );



	//main draw function
	context.ondraw = function(){
		renderer.clear(bg_color);
		switch(mode) {
			case 1: // FORWARD +
				renderer.render(scene, camera);
				break;
			case 2: // TILE DEBUG
				lights.lightCullingTest(camera);
				break;
			case 3: // FORWARD
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
		switch(mode) {
		    case 1: // FORWARD +
		        scene.update(dt);
		        lights.lightCulling(camera);
		        break;
		    case 2: // TILE DEBUG
		        lights.lightCulling(camera);
		        break;
		    case 3: // FORWARD
		        scene.update(dt);
		        break;
		}
		//lights.update(dt);
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
		}
		if(e.keyCode == 50){ // TILE DEBUG
			mode = 2;
		}
		if(e.keyCode == 51){ // FORWARD
			mode = 3;
		}
		/*if(e.keyCode == 73){ //I
			lights.addLight();
		}
		if(e.keyCode == 75){ //K
			lights.position.splice.....
		}*/
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