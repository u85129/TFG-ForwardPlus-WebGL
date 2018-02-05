var LI = {};
(function(global){

var LI = global.LI;
var lightPos = LI.lightPos;

// for sponza
var lightPosMin = [-1250, 0, -600];
var lightPosMax = [1250, 800, 600];

/*var lightPosMin = [-14, -0.5, -6];
var lightPosMax = [14, 18, 6];*/

var lightVelY = -2;
var LIGHT_RADIUS = 4;
var NUM_LIGHTS = LI.NUM_LIGHTS;
var TILE_SIZE = LI.TILE_SIZE;

var lightPosition = LI.position = null;
var lightColorRadius = LI.colorRadius = null;
var lightGrid = LI.lightGrid = null;
var lightIndexList = LI.lightIndexList = null;
var program = null;
var buffer = null;
var quadPositionBuffer = LI.quadPositionBuffer = null;
var quadUVBuffer = LI.quadUVBuffer = null;

var totalTilesX = LI.totalTilesX = 0;
var totalTilesY = LI.totalTilesY = 0;

var quadPositions = new Float32Array([
    // First triangle:
     1.0,  1.0,
    -1.0,  1.0,
    -1.0, -1.0,
    // Second triangle:
    -1.0, -1.0,
     1.0, -1.0,
     1.0,  1.0
]);


LI.init = function (numTiles, numLights, lightRadius) {
    NUM_LIGHTS = LI.NUM_LIGHTS = numLights;
    TILE_SIZE = LI.TILE_SIZE = numTiles;
    LIGHT_RADIUS = lightRadius;

    lightPosition = LI.position = new Float32Array(NUM_LIGHTS * 3);
    lightColorRadius = LI.colorRadius = new Float32Array(NUM_LIGHTS * 4)

    LI.clearLightCullingInfo();
    totalTilesX = LI.totalTilesX = Math.ceil(window.innerWidth/TILE_SIZE);
    totalTilesY = Math.ceil(window.innerHeight/TILE_SIZE);
    LI.totalTiles = totalTiles = totalTilesX * totalTilesY;

    for (var i = 0; i < NUM_LIGHTS*3; i+=3) {

        // pos
        LI.position[i] = Math.random() * (lightPosMax[0] - lightPosMin[0]) + lightPosMin[0];
        LI.position[i + 1] = Math.random() * (lightPosMax[1] - lightPosMin[1]) + lightPosMin[1];
        LI.position[i + 2] = Math.random() * (lightPosMax[2] - lightPosMin[2]) + lightPosMin[2];
        
    }

    for (var i = 0; i < NUM_LIGHTS*4; i+=4) {
        LI.colorRadius[i] = Math.random();
        LI.colorRadius[i + 1] = Math.random();
        LI.colorRadius[i + 2] = Math.random();
        LI.colorRadius[i + 3] = LIGHT_RADIUS;
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

    var lightColorTexture = LI.colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, lightColorTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NUM_LIGHTS, 1, 0, gl.RGBA, gl.FLOAT, LI.colorRadius);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);


    var tilePositionTexture = LI.tileTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, LI.tileTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    var tileLightIdTexture = LI.tileLightIdTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, LI.tileLightIdTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    quadPositionBuffer = LI.quadPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

LI.update = function (dt) {
    var b;
    for (var i = 0; i < NUM_LIGHTS; i++) {

        var mn = lightPosMin[1];
        var mx = lightPosMax[1];
        LI.position[(i * 3) + 1] = (LI.position[(i * 3) + 1] + (lightVelY * dt));
        if(LI.position[(i * 3) + 1] < mn)
            LI.position[(i * 3) + 1] = mx;
    }

    gl.bindTexture(gl.TEXTURE_2D, LI.positionTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, NUM_LIGHTS, 1, 0, gl.RGB, gl.FLOAT, lightPosition);
    gl.bindTexture(gl.TEXTURE_2D, null);
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

LI.clearLightCullingInfo = function(){
    totalTilesX = LI.totalTilesX = Math.ceil(window.innerWidth/TILE_SIZE);
    totalTilesY= Math.ceil(window.innerHeight/TILE_SIZE);
    totalTiles = LI.totalTiles = totalTilesY * totalTilesX;

    lightGrid = LI.lightGrid = new Float32Array(totalTiles * 3);
    LI.lightGrid.fill(0.0,0, totalTiles - 1);
    LI.lightIndexList = [];
    LI.lightIndexListAux = [];
    for (var i = 0; i < totalTiles; i++) {
        LI.lightIndexListAux[i] = [0];
    }
}

LI.lightCulling = function(camera){
    //RESET EVERY DATA STRUCTURE
    LI.clearLightCullingInfo();
    //THEN

    var up = vec3.create();
    vec3.normalize(up,camera._up);
    var right = vec3.create();
    vec3.normalize(right, camera._right);

    totalTilesX = LI.totalTilesX = Math.ceil(window.innerWidth/TILE_SIZE);
    totalTiles = LI.totalTiles = totalTilesX * totalTilesY;

    var radius = topLight = rightLight = centerLight = len1 = len2 = leftPixel = topPixel = rightPixel = bottomPixel = leftTile = rightTile = topTile = bottomTile = null;
    var d1 = d2 = vec2.create();
    var screenPositionCenter = screenPositionTop = screenPositionRight = vec2.create();
    for (var i = 0; i < NUM_LIGHTS; i++) {
        centerLight = vec4.fromValues(lightPosition[i*3], lightPosition[i*3+1], lightPosition[i*3+2],1);
        radius = lightColorRadius[(i*4)+3];
        
        topLight = vec4.fromValues(centerLight[0] + radius * up[0], centerLight[1] + radius * up[1], centerLight[2] + radius * up[2],1);
        rightLight = vec4.fromValues(centerLight[0] - radius * right[0], centerLight[1] - radius * right[1], centerLight[2] - radius * right[2],1);
        
        vec4.transformMat4(topLight, topLight, camera._viewprojection_matrix);
        vec4.transformMat4(centerLight, centerLight, camera._viewprojection_matrix);
        vec4.transformMat4(rightLight, rightLight, camera._viewprojection_matrix);
        centerLight = vec3.fromValues(centerLight[0] / centerLight[3], centerLight[1] / centerLight[3], centerLight[2] / centerLight[3]);
        topLight = vec3.fromValues(topLight[0] / topLight[3], topLight[1] / topLight[3], topLight[2] / topLight[3]);
        rightLight = vec3.fromValues(rightLight[0] / rightLight[3], rightLight[1] / rightLight[3], rightLight[2] / rightLight[3]);
        //if(centerLight[2] > 1.0)//Arreglar con todas las direcciones
          //  continue;
        screenPositionCenter = vec2.fromValues((centerLight[0] + 1) * window.innerWidth * 0.5 , (-centerLight[1] + 1) * window.innerHeight * 0.5);
        screenPositionTop = vec2.fromValues((topLight[0] + 1) * window.innerWidth * 0.5 , (-topLight[1] + 1) * window.innerHeight * 0.5);
        screenPositionRight = vec2.fromValues((rightLight[0] + 1) * window.innerWidth * 0.5 , (-rightLight[1] + 1) * window.innerHeight * 0.5);

        screenPositionCenter[1] = window.innerHeight -  screenPositionCenter[1];
        screenPositionTop[1] = window.innerHeight -  screenPositionTop[1];
        screenPositionRight[1] = window.innerHeight -  screenPositionRight[1];

        vec2.subtract(d1, screenPositionCenter, screenPositionTop);
        vec2.subtract(d2, screenPositionCenter, screenPositionRight);

        len1 = vec2.length(d1);
        len2 = vec2.length(d2);

        leftPixel = screenPositionCenter[0] - len2;
        topPixel = screenPositionCenter[1] + len1;
        rightPixel = screenPositionCenter[0] + len2;
        bottomPixel = screenPositionCenter[1] - len1;

        leftTile = Math.max(Math.floor(leftPixel / TILE_SIZE), 0);
        topTile = Math.min(Math.ceil(topPixel / TILE_SIZE), window.innerHeight / TILE_SIZE);
        rightTile = Math.min(Math.ceil(rightPixel / TILE_SIZE), window.innerWidth / TILE_SIZE);
        bottomTile = Math.max(Math.floor(bottomPixel / TILE_SIZE),0);

        for (var j = bottomTile; j < topTile; j++) {
            for (var k = leftTile; k < rightTile; k++) {
                var indexId = k + j * totalTilesX;
                if(indexId >= 0 && indexId < totalTiles)
                //Set the number of lights on tile
                LI.lightGrid[indexId*3 + 1] = LI.lightGrid[indexId*3 + 1] + 1;
                //Set the offset of the next tile
                //LI.lightGrid[(indexId + 1)*3] = LI.lightGrid[indexId*3 + 1] + LI.lightGrid[indexId*3];

                LI.lightIndexListAux[indexId].push(i);
            }
        }
    }


    var offset = 0;
    for (var i = 0; i < totalTiles; i++) {
        //Set the offset of the tiles
        LI.lightGrid[i*3] = offset;
        offset += LI.lightIndexListAux[i].length;
        for (var j = 0; j < LI.lightIndexListAux[i].length; j++) {
            LI.lightIndexList.push(LI.lightIndexListAux[i][j]);
        }
    }

    gl.bindTexture(gl.TEXTURE_2D, LI.tileTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, totalTiles, 1, 0, gl.RGB, gl.FLOAT, LI.lightGrid);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindTexture(gl.TEXTURE_2D, LI.tileLightIdTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, LI.lightIndexList.length, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array(LI.lightIndexList));
    gl.bindTexture(gl.TEXTURE_2D, null);

}

LI.lightCullingTest = function(camera){
    var shader = gl.shaders["light_culling_test"];
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, LI.tileTexture);
    totalTiles = LI.totalTiles = totalTilesY * totalTilesX;

    shader.uniforms({
        u_mvp: camera._viewprojection_matrix,
        u_numLights: NUM_LIGHTS,
        u_numTileHorizontal: totalTilesX,
        u_tileSize : TILE_SIZE,
        u_totalTiles: totalTiles
    });
    
    gl.useProgram(shader.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, quadPositionBuffer);
    gl.enableVertexAttribArray(gl.getAttribLocation(shader.program, 'a_vertex'));
    gl.vertexAttribPointer(gl.getAttribLocation(shader.program, 'a_vertex'), 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );

