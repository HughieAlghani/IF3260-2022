"use strict";

function main() {
    // Mempersiapkan canvas
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // Memulai program dari WebGL Utils
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);  
    
    // Mengambil data lokasi (titik) dan kode warna untuk gambar
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");   
    
    // Mengambil matriks gambar (rotasi, translasi, scale)
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");    
    
    // Set lokasi yang digunakan untuk gambar
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    // Set warna yang akan digunakan pada gambar
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);

    // Set matriks gambar
    var translation = [0, 150];
    var angleInRadians = 0;
    var scale = [1, 1];

    // Menggambarkan pada halaman
    drawScene();

    // Setup slider edit
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angle", {slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    // Fungsi update position
    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    // Fungsi update angle
    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    // Fungsi update scale
    function updateScale(index) {
        return function(event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    // Fungsi untuk menggambar pada layar
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);

        gl.enableVertexAttribArray(positionLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;          
        var type = gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        gl.enableVertexAttribArray(colorLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        var size = 4;                 
        var type = gl.UNSIGNED_BYTE;  
        var normalize = true;         
        var stride = 0;               
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
}

// Fungsi untuk set lokasi gambar
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -150, -100,
            150, -100,
            -150,  100,
            150, -100,
            -150,  100,
            150,  100]),
        gl.STATIC_DRAW);
}

// Fungsi untuk set warna gambar
function setColors(gl) {
    var r1 = Math.random() * 256;
    var b1 = Math.random() * 256;
    var g1 = Math.random() * 256;
    var r2 = Math.random() * 256;
    var b2 = Math.random() * 256; 
    var g2 = Math.random() * 256;

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array(
            [ r1, b1, g1, 255,
            r1, b1, g1, 255,
            r1, b1, g1, 255,
            r2, b2, g2, 255,
            r2, b2, g2, 255,
            r2, b2, g2, 255]),
        gl.STATIC_DRAW);
}

main();