//1. Initialize WebGL
let gl;
let vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec2 vertTexCoord;',
'varying vec2 fragTexCoord;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'  fragTexCoord = vertTexCoord;',
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

let fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec2 fragTexCoord;',
'uniform sampler2D sampler;',
'',
'void main()',
'{',
'  gl_FragColor = texture2D(sampler, fragTexCoord);',
'}'
].join('\n');

function InitDemo(){
    console.log("This is working")

    //1-1. WebGL 생성
    const canvas = document.getElementById('game-surface');
    gl = initWebGL(canvas);      // Initialize the GL context
    
    if (gl) {
        gl.clearColor(0.75, 0.85, 0.8, 1.0);                      // Set clear color to black, fully opaque
        // gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        // gl.enable(gl.CULL_FACE);
        // gl.frontFace(gl.CCW);
        // gl.cullFace(gl.BACK);
      }

    //1-3. shader 생성
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR validation program!', gl.getProgramInfoLog(program));
        return;
    }

    //1-4. create buffer, Graphic card
    let boxVertices  = 
    [ //X, Y, Z             U, V
		// Top
		-10.0, 10.0, -10.0,   0, 0,
		-10.0, 10.0, 10.0,    0, 1,
		10.0, 10.0, 10.0,     1, 1,
		10.0, 10.0, -10.0,    1, 0,

		// Left
		-10.0, 10.0, 10.0,    0, 0,
		-10.0, -10.0, 10.0,   1, 0,
		-10.0, -10.0, -10.0,  1, 1,
		-10.0, 10.0, -10.0,   0, 1,

		// Right
		10.0, 10.0, 10.0,     1, 1,
		10.0, -10.0, 10.0,    0, 1,
		10.0, -10.0, -10.0,   0, 0,
		10.0, 10.0, -10.0,    1, 0,

		// Front
		10.0, 10.0, 10.0,     1, 1,
		10.0, -10.0, 10.0,    1, 0,
		-10.0, -10.0, 10.0,   0, 0,
		-10.0, 10.0, 10.0,    0, 1,

		// Back
		10.0, 10.0, -10.0,    0, 0,
		10.0, -10.0, -10.0,   0, 1,
		-10.0, -10.0, -10.0,  1, 1,
		-10.0, 10.0, -10.0,   1, 0,

		// Bottom
		-10.0, -10.0, -10.0,  1, 1,
		-10.0, -10.0, 10.0,   1, 0,
		10.0, -10.0, 10.0,    0, 0,
		10.0, -10.0, -10.0,   0, 1,
    ];

    let boxIndices = [
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
    ];

    let boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    let boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        positionAttribLocation,//Attribute location
        3, //Number of elements per attribute
        gl.FLOAT, // Type of elemetns
        gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning if a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation,
        2, 
        gl.FLOAT, 
        gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    //1-7. create texture
	let boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById('create-image')
	);
	gl.bindTexture(gl.TEXTURE_2D, null);


    //1-6. Tell OpenGL state machine which program should be active.
    gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(worldMatrix);
    // glMatrix.mat4.identity(viewMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 0], [0, 1, 0]);
    // glMatrix.mat4.identity(projMatrix);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/ canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    let xRotationMatrix = new Float32Array(16);
    let yRotationMatrix = new Float32Array(16);

    //1-5. Main render loop
    // gl.useProgram(program);
    let identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    let angle = 0;
    let loop = function () {
        angle = performance.now() / 3000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);

        // gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

function initWebGL(canvas){
    gl = null;

    try{
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }catch(e){
        console.log(e)
    }

    if(!gl){
        alert("Unable to initialize WebGL. Your browser may not support it");
        gl = null;
    }

    return gl;
}

function vertexShader(verPosition, vertColor){
    return {
        fragColor: vertColor,
        gl_Position: [verPosition.x, verPosition.y, 0.0, 1.0]
    }
};
