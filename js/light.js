var LI = {};
(function(global){

var LI = global.LI;
var lightPos = LI.lightPos;

/*var lightPosMin = [-14, -0.5, -6];
var lightPosMax = [14, 18, 6];*/

var LIGHT_RADIUS = 0;
var NUM_LIGHTS = LI.NUM_LIGHTS;
var TILE_SIZE = LI.TILE_SIZE;

var lightPosition = LI.position = null;
var lightColorRadius = LI.colorRadius = null;
var buffer = null;

var totalTilesX = LI.totalTilesX = 0;
var totalTilesY = LI.totalTilesY = 0;

var quadPositionBuffer;
var quadPositions = new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    1.0,  1.0,
    1.0,  1.0,
    -1.0,  1.0,
    -1.0, -1.0
]);


LI.init = function (numTiles, lightRadius) {
    NUM_LIGHTS = LI.NUM_LIGHTS = numLights = 26;
    TILE_SIZE = LI.TILE_SIZE = numTiles;
    LIGHT_RADIUS = LI.LIGHT_RADIUS = lightRadius;

    lightPosition = LI.position = new Float32Array(NUM_LIGHTS * 3);

    totalTilesX = LI.totalTilesX = Math.ceil(window.innerWidth/TILE_SIZE);
    totalTilesY = Math.ceil(window.innerHeight/TILE_SIZE);
    LI.totalTiles = totalTiles = totalTilesX * totalTilesY;

    for(var i = 0; i < numLights*6; i+=3){
        // pos
        LI.position[i] = -3220+Math.floor(i/6)*500;
        LI.position[i + 1] = 100;
        LI.position[i + 2] = -2450+(i/3)%2*500;
    }

    buffer = gl.createBuffer();
    var lightPositionTexture = LI.positionTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, lightPositionTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, NUM_LIGHTS, 1, 0, gl.RGB, gl.FLOAT, lightPosition);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    var lightCulled = LI.lightCulled = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, LI.lightCulled);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth, window.innerHeight, 0, gl.RGBA, gl.FLOAT, new Float32Array(window.innerWidth * window.innerHeight * 4));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    var lightCulledFrameBuffer = LI.lightCulledFrameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, LI.lightCulledFrameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, LI.lightCulled, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    quadPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

LI.light_debug = function(camera) {
    var shader = gl.shaders["light_debug"];
    shader.uniforms({u_mvp: camera._viewprojection_matrix});
    
    gl.useProgram(shader.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, LI.position, gl.DYNAMIC_DRAW);

    gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, 'a_vertex'));
    gl.vertexAttribPointer(gl.getAttribLocation(shader.program, 'a_vertex'), 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, LI.NUM_LIGHTS);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

LI.lightCulling = function(camera, render){
    var shader = gl.shaders["light_culling"];
    var inv = mat4.create();
    mat4.invert(inv, camera._viewprojection_matrix);
    
    gl.useProgram(shader.program);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, LI.positionTexture);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, LI.lightCulled);
    


    var inv1 = inv2 = mat4.create();
    mat4.invert(inv1, camera._projection_matrix);
    mat4.invert(inv2, camera._view_matrix);

    shader.uniforms({
        u_numLights : LI.NUM_LIGHTS,
        u_tileSize : LI.TILE_SIZE,
        u_screenWidth : window.innerWidth,
        u_screenHeight : window.innerHeight,
        u_invViewProjMatrix : inv,
        u_lights : 0,
        u_lightRadius : LI.LIGHT_RADIUS,
        u_lightCulled : 1,
        u_camera_position : camera._position,
        u_projectionMatrix : inv1,
        u_viewMatrix : inv2
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);

    gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, 'a_vertex'));
    gl.vertexAttribPointer(gl.getAttribLocation(shader.program, 'a_vertex'), 2, gl.FLOAT, false, 0, 0);

    if(!render)
        gl.bindFramebuffer(gl.FRAMEBUFFER, LI.lightCulledFrameBuffer);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if(!render)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

LI.lightCullingHeatMap = function(camera){
    var shader = gl.shaders["light_culling_heat_map_"+LI.TILE_SIZE];
    var inv = mat4.create();
    mat4.invert(inv, camera._viewprojection_matrix);
    
    gl.useProgram(shader.program);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, LI.lightCulled);

    var inv1 = inv2 = mat4.create();
    mat4.invert(inv1, camera._projection_matrix);
    mat4.invert(inv2, camera._view_matrix);
    shader.uniforms({
        u_numLights : LI.NUM_LIGHTS,
        u_tileSize : LI.TILE_SIZE,
        u_screenWidth : window.innerWidth,
        u_screenHeight : window.innerHeight,
        u_invViewProjMatrix : inv,
        u_lightCulled : 0,
        u_camera_position : camera._position,
        u_projectionMatrix : inv1,
        u_viewMatrix : inv2
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);

    gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, 'a_vertex'));
    gl.vertexAttribPointer(gl.getAttribLocation(shader.program, 'a_vertex'), 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );

