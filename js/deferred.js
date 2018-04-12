var DF = {};
(function(global){

var DF = global.DF;

DF.init = function () {

    DF.positionTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.positionTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth,window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    DF.normalTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.normalTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth,window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    DF.uvTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.uvTexture);
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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, window.innerWidth,window.innerHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    DF.colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, DF.colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth,window.innerHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    var g_buffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, g_buffer);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, DF.positionTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+1, gl.TEXTURE_2D, DF.normalTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+2, gl.TEXTURE_2D, DF.uvTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0+3, gl.TEXTURE_2D, DF.colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, DF.depthTexture, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    DF.g_buffer = g_buffer;
}

DF.renderScene = function(){

}

DF.renderBuffer = function(target){
    var shader = gl.shaders["show_g_buffer"];
    
    gl.useProgram(shader.program);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.activeTexture(gl.TEXTURE0);
    if(target == 0){
        gl.bindTexture( gl.TEXTURE_2D, DF.positionTexture );
    }else if(target == 1){
        gl.bindTexture( gl.TEXTURE_2D, DF.normalTexture );
    }else if(target == 2){
        gl.bindTexture( gl.TEXTURE_2D, DF.uvTexture );
    }else if(target == 3){
        gl.bindTexture( gl.TEXTURE_2D, DF.colorTexture );
    }else if(target == 4){
        gl.bindTexture( gl.TEXTURE_2D, DF.depthTexture );
    }    

    shader.uniforms({
        u_color_texture : 0,
        u_screenWidth : window.innerWidth,
        u_screenHeight : window.innerHeight
    });

    shader.draw(quad);


}


})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );