var vertexShaderText = 
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

var fragmentShaderText =
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

var gl;

var InitDemo = function () {

    var canvas = document.getElementById('surface');
    /**
    *! cavas.getContext(TYPE) : Canvas의 타입을 지정한다.
    * 이후 이 메서드의 반환값에 경로나 색상 등을 추가하고 랜더링하여 캔버스에 도형을 그릴 수 있다.
    * "2D" : 2차원 랜더링 컨텍스트를 나타내는 CanvasRenderingContext2D 객체를 생성한다.
    *! "webgl" : 3차원 랜더링 컨텍스트를 나타내는 WebGLRenderingContext객체를 생성
    * "bitmaprederer" : 캔버스의 컨텐츠를 주어진 ImageBitmap으로 대체하기 위한 기능만을 제공하는 ImageBitmapRenderingContext를 생성
    */
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL')
    }

    //! 컨버스 창 조절 하기
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    /**
    *! enable / disable은 OpneGL 기능을 사용하거나 사용하지 않도록 설정
    *? 거리감을 주기 위해 DEPTH_TEST 사용 */
    gl.enable(gl.DEPTH_TEST);
    
    //? CULL_FACE : 좌표의 구불구불한 다각형을 선별한다.
    // gl.enable(gl.CULL_FACE);
    
    /**
    *! frontFace : 감기방향을 설정하여 풀리곤이 앞면인지 뒷면인지 지정한다.
    *? 기본값 gl.CCW(시계반대 방향으로 감기) / gl.CW(시계방향으로 감기) */
    // gl.frontFace(gl.CCW);
    
    /**
    *! cullFace : 전면 또는 후면을 향하는 다각형을 컬링할 수 있는지 여부를 지정(기본적으로 비활성화)
    *? 기본값 gl.BACK / gl.FRONT / gl.FRONT_AND_BACK */
    // gl.cullFace(gl.BACK);

    //! createShader은 shader를 만들어준다.(type으로 VERTEX_SHADER와 FRAGMENT_SHADER가 있음)
    var vertexShader = gl.createShader(gl.VERTEX_SHADER); // 꼭짓점, 정점
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); // 조각, 파편

    /**
    *! 소스코드를 설정한다.
    *? shaderSource(shader, source)
    * shader : 소스 코드를 설정할 개체
    * source : 설정할 GLSL 소스 코드가 포함된 문자열
    */
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    /**
    *! compileShader : GLSL shader를 바 이너리 데이터로 컴파일한다.(반환 없음)
    *! getShaderParameter(shader, pname) : 주어진 shader에 대한 정보를 반환
    * pname 종류
    * GLenum : 쿼리할 정보를 지정
    * gl.DELETE_STATUS : shader에 삭제 플래그가 지정되었는지 여부를 나타내는 값을 반환
    *? gl.COMPILE_STATUS : 마지막 shader 컴파일이 성공했는지 여부를 나타내는 값을 반환
    * gl.SHADER_TYPE : shader가 gl.VERTEX_SHADER 객체인지 gl.FRAGMENT_SHADER 객체인지 여부를 나태내는 값을 반환
    */
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertes shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    /**
    *! createProgram : 객체를 생성하고 초기화한다.
    * Vertext Shader 와 Fragment Shader로 구성된 2개의 컴파일된 객체 반환
    *! attachShader(program, shader)
    *? shader를 program에 연결
    *! linkProgram(program)
    *? 프로그램의 vertex, fragment에 대한 GPU코드 준비 프로세스를 완료한다.
    *! getProgramParameter(program, pname)
    *? 주어진 프로그램에 대한 정보를 반환
    * pname 종류
    * GLenum : 쿼리할 정보를 지정
    * gl.DELETE_STATUS : 프로그램에 삭제 플래그가 지정되었는지 여부 표시
    *? gl.LINK_STATUS : 마지막 링크 작업이 성공했는지 여부를 반환
    * gl.VALIDATE_STATUS : 마지막 유효성 검사 작업이 성공했는지 여부를 반환
    * gl.ATTACHED_SHADERS : 프로그램에 연결된 shader의 수를 나타내는 값을 반환
    * gl.ACTIVE_ATTRIBUTES : 프로그램에 대한 활성 속성 변수의 수를 나타내는 값을 반환
    * gl.ACTIVE_UNIFORMS : 프로그램에 대한 활성 균일 변수의 수를 나타내는 값을 반환
    * gl.TRANSFORM_FEEDBACK_BUFFER_MODE : 변환 피드백을 활성화된 경우 버퍼 모드를 나타내는 값을 반환
    * gl.TRANSFORM_FEEDBACK_VARYINGS : 변환 피드백 모드에서 캡처할 다양한 변수의 수를 나타내는 값을 반환
    * gl.ACTIVE_UNIFORM_BLOCKS : 활성 유니폼을 포함하는 유니폼 블록의 수를 나타내는 값을 반환
    *! getProgramInfoLog(program)
    *? program 개체에 대한 정보 로그를 반환 
    */
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program); 
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program))
        return;
    } 

    /**
    *! 성공적으로 연결되었는지, 현재 WebGL 상태에서 사용할 수 있는지 확인
    */
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR validating program!', gl.getProgramInfoLog(program))
    }

    // Create buffer
    var boxVertices = 
    [ // X, Y, Z           U, V
        // Top
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,

        // Left
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,

        // Right
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,   0, 1,
        1.0, -1.0, -1.0,  0, 0,
        1.0, 1.0, -1.0,   1, 0,

        // Front
        1.0, 1.0, 1.0,    1, 1,
        1.0, -1.0, 1.0,    1, 0,
        -1.0, -1.0, 1.0,    0, 0,
        -1.0, 1.0, 1.0,    0, 1,

        // Back
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,    0, 1,
        -1.0, -1.0, -1.0,    1, 1,
        -1.0, 1.0, -1.0,    1, 0,

        // Bottom
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
    ];
	var boxIndices =
	[
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
    
    /**
    *! createBuffer : vertext 나 color과 같은 저장 데이터를 생성하고 초기화 한다.
    *! bindBuffer(target, buffer) : 
    * target 종류
    * GLenum : 바인딩 지점을 지정
    *? gl.ARRAY_BUFFER : 꼭짓점 좌표, 첵스처 좌표 데이터 또는 꼭짓점 색상 데이터와 같은 꼭짓점 속성을 포함하는 버퍼
    * gl.ELEMENT_ARRAY_BUFFER : 요소 인덱스에 사용되는 버퍼
    */
    var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);

    //! bufferData(target, srcData, usage) : 버퍼 객체의 데이터 저장소를 초기화 하고 생성
    /** 마지막 파라미터
    *? STATIC_DRAW : 한번 Vertex데이터 업로드 후, 변경이 없는 경우 사용
    * DYNAMIC_DRAW : 애니메이션처럼 Vertex 데이터가 자주 바뀌는 경우 사용한다. Vertex데이터 바뀔때마다 다시 업로드 된다.
    * STREAM_DRAW : 사용자 인터페이스처럼 계속해서 Vertex데이터가 변경되는 경우 사용한다. Vertex데이터 바뀔때마다 다시 업로드 된다.
    * 참고 사이트: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
    */
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    /**
    *! getAttribLocation(program, name)
    *? name : 위치를 가져올 속성 변수의 이름을 지정하는 문자열
    */
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var textCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');

    /**
    *! vertexAttribPointer(index, size, type, normalized, stride, offset)
    *? 현재 정점 버퍼 객체의 일반 정점 속성에 현재 바인딩된 버퍼를 바인딩 하고 레이아웃을 지정합니다.
    * index : 수정될 꼭짓점 속성의 인덱스를 지정
    * size : 정점 속성당 구성요소 수를 지정 1~4 사이여야 한다.
    * type : 배열에 있는 각 구성요소의 데이터 유형을 지정
        * type 종류
        * gl.BYTE: [-128, 127]에 값이 있는 부호 있는 8비트 정수
        * gl.SHORT: [-32768, 32767]에 값이 있는 부호 있는 16비트 정수
        * gl.UNSIGNED_BYTE: 값이 [0, 255]인 부호 없는 8비트 정수
        * gl.UNSIGNED_SHORT: 값이 [0, 65535]인 부호 없는 16비트 정수
        * gl.FLOAT: 32비트 IEEE 부동 소수점 숫자
        * gl.HALF_FLOAT: 16비트 IEEE 부동 소수점 숫자 (WebGL2에서 사용 가능)
    * normalized : 정수 데이터 값을 float로 캐스팅 할때 특정 범위로 정규화 해야 하는지 여부를 지정
        * TRUE일때
        * gl.BYTE/ gl.SHORT : 값을 [-1, 1]로 정규화
        * gl.UNSIGNED_BYTE/ gl.UNSIGNED_SHORT : 값을 [0, 1]로 정규화
        * gl.FLOAT/ gl.HALF_FLOAT:  효과가 없다.
    * stride : 연속 정점 속성의 시작 사이의 오프셋을 바이트 단위로 지정합니다. 255보다 클 수 없다.
        * 0이면 속성이 꽉 채워진 것으로 간주
    * offset : 정점 속성 배열에서 첫번째 구성 요소의 오프셋을 바이트 단위로 지정
    */
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.vertexAttribPointer(
        textCoordAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );
    
    
    //! enableVertexAttribArray(index) : 지정된 인덱스에서 속성 배열 목록의 일반 정점 속성 배열을 킨다.
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(textCoordAttribLocation);

    // create texture
    var boxTexture = gl.createTexture();
    
    /**
    *! bindTexture(target, texture) : 주어진 target을 바인딩한다.
    * target 종류
        * gl.TEXTURE_2D: 2차원 텍스처
        * gl.TEXTURE_CUBE_MAP: 큐브 매핑된 텍스처
    * texture : 바인딩할 개체
    *! texParameteri(target, GLenum pname, GLint param) : 텍스처 매개변수를 설정
    * texParameterf(target, GLenum pname, GLfloat param)
    * target 종류
        * gl.TEXTURE_2D: 2차원 텍스처
        * gl.TEXTURE_CUBE_MAP: 큐브 매핑된 텍스처
    * pname 종류(설정할 텍스처 매개변수를 지정)
        * gl.TEXTURE_WRAP_S/T : 텍스처 s/t좌표에 대한 랩핑 기능
            * gl.REPEAT(기본값)
            * gl.CLAMP_TO_EDGE
            * gl.MIRRORED_REPEAT
        * gl.TEXTURE_MIN_FILTER : 텍스처 축소 필터
            * gl.LINEAR, gl.NEAREST
            * gl.NEAREST_MIPMAP_NEAREST
            * gl.LINEAR_MIPMAP_NEAREST
            * gl.NEAREST_MIPMAP_LINEAR(기본값)
            * gl.LINEAR_MIPMAP_LINEAR
        * gl.TEXTURE_MAG_FILTER : 텍스처 확대 필터
            * gl.LINEAR(기본값)
            * gl.NEAREST
    */
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //! s/t좌표계 감싸기(반복) 방지
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    /**
    *! texImage2D(target, level, internalformat, source_internalformat, type, source)
    *? 2차원 텍스처 이미지를 지정
    *변수 종류 참고 : https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
    */
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        document.getElementById('image')
        );
    gl.bindTexture(gl.TEXTURE_2D, null)
    
    //Tell OpenGL state machine which program should be active
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld')
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView')
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj')

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, 0], [0, 1, 0])
    /**
    *! lookAt(out, eye, center, up)
    * out : 행렬
    * eye : 뷰어의 위치(카메라의 위치)
    * center : 시청자가 보고 있는 지점(사물의 중심점)
    * up : vec3가 가리키는 곳
    * 
    */

    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0 )

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix)


    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    //Main render loop
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        //! 회전 속도 조절 1000 숫자 변경시 낮으면 낮을 수록 빨리 돌아감
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle/ 4, [1, 0, 0]);
        glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        //! gl.clearColor(R, G, B, 알파값(1.0'으로 한다.))
        gl.clearColor(0, 0, 0, 1.0) //색깔만 지정하고
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // 실제 색을 칠해준다.


        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.activeTexture(gl.TEXTURE0)

        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

};