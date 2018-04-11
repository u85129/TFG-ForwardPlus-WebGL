
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
	if(mode == 5)
		document.getElementById("mode").innerHTML = 'Deferred';
}

var buildCity = function(scene){
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

	for(var i = -7; i < 7; i++){
		for(var j = -7; j < 7; j++){
			var suelo = new RD.SceneNode({
				position: [0+i*500,0,0+j*500],
				scaling: [500,500,500],
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

	/*var build10 = new RD.SceneNode({
		position: [-3000,0,-3000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	//build10.rotate(-Math.PI/2, [1,0,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [-1800,0,-3000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [-800,0,-3000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [500,0,-2900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [1200,0,-2900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [1900,0,-2900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [2650,0,-2800],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build10 );

	//
	var build10 = new RD.SceneNode({
		position: [3000,0,-1400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [1800,0,-1400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [800,0,-1400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [-500,0,-1500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [-1200,0,-1500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [-1900,0,-1500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	var build10 = new RD.SceneNode({
		position: [-2650,0,-1600],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build10.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build10 );

	for(var i = 0; i < 13; i++){
		for(var j = 0; j < 2; j++){
			var lamp = new RD.SceneNode({
				position: [-3200+i*500,0,-2450+j*500],
				scaling: [10,10,10],
				color: [1,1,1,1],
				mesh: "lamp",
				shader: "texture",
				texture: "stars",
				flags: {flip_normals: false, depth_test: true},
				uniforms: {}
			});
			scene.root.addChild( lamp );
		}
	}*/
}

