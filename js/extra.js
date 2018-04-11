
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
		document.getElementById("mode").innerHTML = 'Forward+ '+LI.TILE_SIZE;
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

	var suelo = null;
	for(var i = -7; i < 7; i++){
		for(var j = -7; j < 7; j++){
			suelo = new RD.SceneNode({
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

	var build1 = new RD.SceneNode({
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
	scene.root.addChild( build1 );

	var build2 = new RD.SceneNode({
		position: [-1800,0,-3000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build2 );

	var build3 = new RD.SceneNode({
		position: [-800,0,-3000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build3 );

	var build4 = new RD.SceneNode({
		position: [500,0,-2900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build4 );

	var build5 = new RD.SceneNode({
		position: [1200,0,-2900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build5 );

	var build6 = new RD.SceneNode({
		position: [1900,0,-2900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build6 );

	var build7 = new RD.SceneNode({
		position: [2650,0,-2800],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build7 );

	var build8 = new RD.SceneNode({
		position: [3000,0,-1400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build8.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build8 );

	var build9 = new RD.SceneNode({
		position: [1800,0,-1400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build9.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build9 );

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

	var build11 = new RD.SceneNode({
		position: [-500,0,-1500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build11.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build11 );

	var build12 = new RD.SceneNode({
		position: [-1200,0,-1500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build12.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build12 );

	var build13 = new RD.SceneNode({
		position: [-1900,0,-1500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build13.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build13 );

	var build14 = new RD.SceneNode({
		position: [-2650,0,-1600],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build14.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build14 );

	var lamp = null;
	for(var i = 0; i < 13; i++){
		for(var j = 0; j < 2; j++){
			lamp = new RD.SceneNode({
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
	}

	//
	var build1 = new RD.SceneNode({
		position: [-3000,0,-500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	//build10.rotate(-Math.PI/2, [1,0,0], true);
	scene.root.addChild( build1 );

	var build2 = new RD.SceneNode({
		position: [-1800,0,-500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build2 );

	var build3 = new RD.SceneNode({
		position: [-800,0,-500],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build3 );

	var build4 = new RD.SceneNode({
		position: [500,0,-400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build4 );

	var build5 = new RD.SceneNode({
		position: [1200,0,-400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build5 );

	var build6 = new RD.SceneNode({
		position: [1900,0,-400],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build6 );

	var build7 = new RD.SceneNode({
		position: [2650,0,-300],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	scene.root.addChild( build7 );

	var build8 = new RD.SceneNode({
		position: [3000,0,1100],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A14",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build8.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build8 );

	var build9 = new RD.SceneNode({
		position: [1800,0,1100],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A11",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build9.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build9 );

	var build10 = new RD.SceneNode({
		position: [800,0,1100],
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

	var build11 = new RD.SceneNode({
		position: [-500,0,1000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A01",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build11.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build11 );

	var build12 = new RD.SceneNode({
		position: [-1200,0,1000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build12.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build12 );

	var build13 = new RD.SceneNode({
		position: [-1900,0,1000],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A05",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build13.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build13 );

	var build14 = new RD.SceneNode({
		position: [-2650,0,900],
		scaling: [40,40,40],
		color: [1,1,1,1],
		mesh: "Building_A02",
		shader: "texture",
		texture: "stars",
		flags: {flip_normals: false, depth_test: true},
		uniforms: {}
	});
	build14.rotate(Math.PI, [0,1,0], true);
	scene.root.addChild( build14 );

	var lamp = null;
	for(var i = 0; i < 13; i++){
		for(var j = 0; j < 2; j++){
			lamp = new RD.SceneNode({
				position: [-3200+i*500,0,75+j*500],
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
	}
}

