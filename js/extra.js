var fpsData = [];

$(document).ready(function(){
	$("#graph").sparkline(fpsData, {
	    type: 'line',
	    width: '500',
	    height: '200',
	    chartRangeMin: 0,
	    chartRangeMax: 70,
	    drawNormalOnTop: false,
		tooltipSuffix: ' frames per second'
	});
})

var calculateFrames = function(dt){
	if(mediaFps == Infinity)
		sumFrames = totalCounts = 0;
	fps = 1/dt;
	totalCounts++;
	sumFrames += fps;
	mediaFps = sumFrames / totalCounts;
	document.getElementById("fps").innerHTML = "FPS: "+Math.round(fps)+"<br>Media: "+Math.round(mediaFps)+"<br>Number of lights: "+LI.NUM_LIGHTS;

	if(runChart){
		fpsData.push(fps);
		if (fpsData.length > 100)
	    	fpsData.splice(0,1);
	    $("#graph").sparkline(fpsData, {
		    type: 'line',
		    width: '500',
		    height: '200',
		    chartRangeMin: 0,
		    chartRangeMax: 70,
		    drawNormalOnTop: false,
			tooltipSuffix: ' frames per second'
		});
	}	
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

var showMode = function(renderer){
	if(mode == 1)
		document.getElementById("mode").innerHTML = 'Forward+ '+LI.TILE_SIZE;
	if(mode == 2)
		document.getElementById("mode").innerHTML = 'Tile Debug';
	if(mode == 3)
		document.getElementById("mode").innerHTML = 'Tile Debug Heat Map';
	if(mode == 4)
		document.getElementById("mode").innerHTML = 'Forward';
	if(mode == 5)
		document.getElementById("mode").innerHTML = 'Deferred';
	if(mode == 6)
		document.getElementById("mode").innerHTML = 'Deferred: Color Texture';
	if(mode == 7)
		document.getElementById("mode").innerHTML = 'Deferred: Normal Texture';
	if(mode == 8)
		document.getElementById("mode").innerHTML = 'Deferred: Depth texture';
	if(mode == 9)
		document.getElementById("mode").innerHTML = 'Tiled Deferred '+LI.TILE_SIZE;

	document.getElementById("meshes").innerHTML = renderer._nodes.length+" Nodes, "+numMeshes+" Meshes";
	numMeshes = 0;
}

var buildCity = function(scene){
	var suelo = null;
	for(var i = -7; i < 7; i++){
		for(var j = -7; j < 5; j++){
			suelo = new RD.SceneNode({
				position: [0+i*50,0,0+j*50],
				scaling: [50,50,50],
				color: [1,1,1,1],
				mesh: "planeXZ",
				shader: "texture",
				texture: "terrainTex",
				flags: {flip_normals: false, depth_test: true},
				uniforms: {}
			});
			scene.root.addChild( suelo );
		}
	}

	var build1 = new RD.SceneNode({
		position: [-300,0,-300],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	//build10.rotate(-Math.PI/2, [1,0,0], true);
	scene.root.addChild( build1 );

	var build2 = new RD.SceneNode({
		position: [-180,0,-300],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build2 );

	var build3 = new RD.SceneNode({
		position: [-80,0,-300],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build3 );

	var build4 = new RD.SceneNode({
		position: [50,0,-290],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build4 );

	var build5 = new RD.SceneNode({
		position: [120,0,-290],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build5 );

	var build6 = new RD.SceneNode({
		position: [190,0,-290],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build6 );

	var build7 = new RD.SceneNode({
		position: [265,0,-280],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build7 );

	var build8 = new RD.SceneNode({
		position: [300,0,-140],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build8.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build8 );

	var build9 = new RD.SceneNode({
		position: [180,0,-140],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build9.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build9 );

	var build10 = new RD.SceneNode({
		position: [80,0,-140],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build11 = new RD.SceneNode({
		position: [-50,0,-150],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build11.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build11 );

	var build12 = new RD.SceneNode({
		position: [-120,0,-150],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build12.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build12 );

	var build13 = new RD.SceneNode({
		position: [-190,0,-150],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build13.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build13 );

	var build14 = new RD.SceneNode({
		position: [-265,0,-160],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build14.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build14 );

	var lamp = null;
	for(var i = 0; i < 13; i++){
		for(var j = 0; j < 2; j++){
			lamp = new RD.SceneNode({
				position: [-320+i*50,0,-245+j*50],
				scaling: [1,1,1],
				color: [1,1,1,1],
				mesh: "lamp",
				shader: "texture",
				texture: "terrainTex",
				flags: {flip_normals: false, depth_test: true},
				uniforms: {}
			});
			scene.root.addChild( lamp );
		}
	}

	//
	var build1 = new RD.SceneNode({
		position: [-300,0,-50],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	//build10.rotate(-Math.PI/2, [1,0,0], true);
	scene.root.addChild( build1 );

	var build2 = new RD.SceneNode({
		position: [-180,0,-50],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build2 );

	var build3 = new RD.SceneNode({
		position: [-80,0,-50],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build3 );

	var build4 = new RD.SceneNode({
		position: [50,0,-40],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build4 );

	var build5 = new RD.SceneNode({
		position: [120,0,-40],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build5 );

	var build6 = new RD.SceneNode({
		position: [190,0,-40],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build6 );

	var build7 = new RD.SceneNode({
		position: [265,0,-30],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build7 );

	var build8 = new RD.SceneNode({
		position: [300,0,110],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build8.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build8 );

	var build9 = new RD.SceneNode({
		position: [180,0,110],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build9.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build9 );

	var build10 = new RD.SceneNode({
		position: [80,0,110],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build11 = new RD.SceneNode({
		position: [-50,0,100],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build11.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build11 );

	var build12 = new RD.SceneNode({
		position: [-120,0,100],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build12.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build12 );

	var build13 = new RD.SceneNode({
		position: [-190,0,100],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build13.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build13 );

	var build14 = new RD.SceneNode({
		position: [-265,0,90],
		scaling: [4,4,4],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "terrainTex",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build14.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build14 );

	var lamp = null;
	for(var i = 0; i < 13; i++){
		for(var j = 0; j < 2; j++){
			lamp = new RD.SceneNode({
				position: [-320+i*50,0,7.5+j*50],
				scaling: [1,1,1],
				color: [1,1,1,1],
				mesh: "lamp",
				shader: "texture",
				texture: "terrainTex",
				flags: {flip_normals: false, depth_test: true},
				uniforms: {}
			});
			scene.root.addChild( lamp );
		}
	}
}

