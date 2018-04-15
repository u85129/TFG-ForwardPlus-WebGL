var DF = {};
(function(global){

var DF = global.DF;

DF.init = function () {

    var g_buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, g_buffer);

    DF.normalTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.normalTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth,window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    DF.colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth,window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    DF.depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if(gl.webgl_version == 2){
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, window.innerWidth,window.innerHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    }else{
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, window.innerWidth,window.innerHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, DF.depthTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, DF.colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+1, gl.TEXTURE_2D, DF.normalTexture, 0);

    if(gl.webgl_version == 1)
        gl.getExtension('WEBGL_draw_buffers').drawBuffersWEBGL([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT0+1])
    else
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT0+1]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    DF.g_buffer = g_buffer;
}

DF.renderScene = function(camera){
    var shader = gl.shaders["deferred_shader"];
    
    gl.useProgram(shader.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture( gl.TEXTURE_2D, DF.colorTexture );
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture( gl.TEXTURE_2D, DF.normalTexture );
    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, LI.positionTexture);
    gl.activeTexture(gl.TEXTURE0 + 3);
    gl.bindTexture( gl.TEXTURE_2D, DF.depthTexture );

    var inv = mat4.create();
    mat4.invert(inv, camera._viewprojection_matrix);

    shader.uniforms({
        u_color_texture : 0,
        u_normal_texture : 1,
        u_lightPositionTexture : 2,
        u_depth_texture : 3,
        u_screenWidth : window.innerWidth,
        u_screenHeight : window.innerHeight,
        u_numLights: LI.NUM_LIGHTS,
        u_ambient : vec3.fromValues(0.02,0.02,0.02),
        u_lightRadius : LI.LIGHT_RADIUS,
        u_eye: camera.position,
        u_invp: inv
    });

    shader.draw(quad);
}

DF.renderBuffer = function(target){
    var shader = gl.shaders["show_g_buffer"];
    
    gl.useProgram(shader.program);
    var bool = false;
    gl.activeTexture(gl.TEXTURE0);
    if(target == 0){
        gl.bindTexture( gl.TEXTURE_2D, DF.colorTexture );
    }else if(target == 1){
        gl.bindTexture( gl.TEXTURE_2D, DF.normalTexture );
    }else if(target == 2){
        gl.bindTexture( gl.TEXTURE_2D, DF.depthTexture );
        bool = true;
    }

    shader.uniforms({
        u_buffer : 0,
        u_screenWidth : window.innerWidth,
        u_screenHeight : window.innerHeight,
        u_depth: bool
    });

    shader.draw(quad);

}

DF.clearFrameBuffer = function(renderer, bg_color){
    gl.bindFramebuffer(gl.FRAMEBUFFER, DF.g_buffer);
    renderer.clear(bg_color);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}


})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );