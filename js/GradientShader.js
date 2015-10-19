function GradientShader(){
		this.uniforms = THREE.UniformsUtils.merge([
			{
				"texture"  : { type: "t", value: null },
				"texture2"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"bgO"  : { type: "f", value: 0.0 },
				"texO"  : { type: "f", value: 1.0 },

			}
		]);

		this.vertexShader = [

			"varying vec2 vUv;",
			"void main() {",
			"    vUv = uv;",
			"    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		
		].join("\n");
		
		this.fragmentShader = [
			
			"uniform sampler2D texture;",
			"uniform sampler2D texture2;",
			"uniform vec2 resolution;",
			"uniform vec2 mouse;",
			"uniform float time;",
			"uniform float bgO;",
			"uniform float texO;",
			"varying vec2 vUv;",
			"float ease(float p) { return 3.0*p*p-2.0*p*p*p; }",

			"vec3 skyCol(vec3 rd, vec3 sunpos, float t){",
			"    float dt = clamp(t,0.0,1.3);",
			"    float nt = clamp(t-1.1,0.2,1.2);",

			"    vec3 col = vec3(0.6, 0.7, 0.9);",
			"    float sun = max(pow(clamp(dot(rd,sunpos),0.0,1.0),16.0),0.0);",

			"    col += vec3(0.6,0.6,0.4)*sun;",
			"    vec3 daycol = vec3(0.5,0.5,0.5)*pow(0.7-clamp(rd.y,0.0,1.0),3.0);",
			"    vec3 setcol = vec3(0.7,0.0,-0.6)*(pow(0.7-clamp(rd.y,0.0,1.0),3.0)+0.3*rd.z);",
			"    col += mix(daycol,setcol,dt*dt*dt);",
			"    col = mix(col,vec3(0.0,0.0,0.1),ease(nt-0.2));",
			"        ",
			"        return col;",
			"}",

			"void main(){",
			"    float t = 2.2*cos(0.1*time);//0.1*(25.0-time);",
			"    vec3 light = normalize(vec3(0.0,1.0-t,1.0+t/2.2));",
			"    vec3 lightcol = skyCol(normalize(vec3(0.0,1.0,1.0)),light,t);",
			"	if(mod(gl_FragCoord.x, 0.03) == 0.0){",
			"		if(mod(gl_FragCoord.y, 0.03) == 0.0){",
			"    		gl_FragColor = vec4(skyCol(normalize(vec3(0.0,1.0,1.0)),light,t), 1.0);",
			"		}",
			"	}",
			"}"
		
		].join("\n");
}