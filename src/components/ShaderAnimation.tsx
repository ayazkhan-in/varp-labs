import { useEffect, useRef } from "react";

// Three.js is intentionally NOT imported at the top level.
// A dynamic import inside useEffect ensures it is excluded from the initial JS bundle
// (~580KB saved), and only fetches when the component actually mounts.

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: unknown;
    scene: unknown;
    renderer: { domElement: HTMLCanvasElement; setPixelRatio: (r: number) => void; setSize: (w: number, h: number) => void; render: (s: unknown, c: unknown) => void; dispose: () => void };
    uniforms: {
      time: { value: number };
      resolution: { value: { x: number; y: number } };
    };
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let isMounted = true;

    // Dynamic import — Three.js is a ~580KB library excluded from initial bundle
    import("three").then((THREE) => {
      if (!isMounted || !container) return;

      // Check if WebGL is supported
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      try {
        const canvas = document.createElement("canvas");
        gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
      } catch (e) {
        // WebGL not supported
      }

      if (!gl) {
        console.warn("WebGL not supported by browser. Shader animation fallback to standard styling.");
        return;
      }

      // Vertex shader
      const vertexShader = `
        void main() {
          gl_Position = vec4( position, 1.0 );
        }
      `;

      // Fragment shader
      const fragmentShader = `
        #define TWO_PI 6.2831853072
        #define PI 3.14159265359

        precision highp float;
        uniform vec2 resolution;
        uniform float time;

        void main(void) {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
          float t = time * 0.05;
          float lineWidth = 0.002;

          vec3 color = vec3(0.0);
          for(int j = 0; j < 3; j++){
            for(int i=0; i < 5; i++){
              color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
            }
          }
          
          gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
        }
      `;

      // Initialize Three.js scene
      const camera = new THREE.Camera();
      camera.position.z = 1;

      const scene = new THREE.Scene();
      const geometry = new THREE.PlaneGeometry(2, 2);

      const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
      };

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixelRatio for performance

      container.appendChild(renderer.domElement);

      // Handle window resize dynamically with ResizeObserver
      const onResize = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        uniforms.resolution.value.x = width * Math.min(window.devicePixelRatio, 2);
        uniforms.resolution.value.y = height * Math.min(window.devicePixelRatio, 2);
      };

      const resizeObserver = new ResizeObserver(() => {
        onResize();
      });
      resizeObserver.observe(container);

      // Initial resize execution
      onResize();

      // Animation loop
      const animate = () => {
        const animationId = requestAnimationFrame(animate);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);

        if (sceneRef.current) {
          sceneRef.current.animationId = animationId;
        }
      };

      // Store scene references for cleanup
      sceneRef.current = {
        camera,
        scene,
        renderer,
        uniforms,
        animationId: 0,
      };

      // Start animation
      animate();

      // Attach cleanup to a separate ref so the outer cleanup can call it
      (container as HTMLDivElement & { __threeCleanup?: () => void }).__threeCleanup = () => {
        resizeObserver.disconnect();
        if (sceneRef.current) {
          cancelAnimationFrame(sceneRef.current.animationId);
          try {
            container.removeChild(sceneRef.current.renderer.domElement);
          } catch (e) {
            // Ignored if already removed
          }
          sceneRef.current.renderer.dispose();
          geometry.dispose();
          material.dispose();
        }
      };
    });

    // Cleanup function
    return () => {
      isMounted = false;
      const cleanup = (container as HTMLDivElement & { __threeCleanup?: () => void }).__threeCleanup;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}
