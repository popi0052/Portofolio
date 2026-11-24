import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SKILLS } from "../../constants";

// The old Tech section mounted one <Canvas> per skill - fifteen WebGL contexts on
// one page. This is the same idea in a single renderer, and the faces are drawn to
// a texture at runtime, so the page downloads no icons.
const SkillBalls = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 10;
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const key = new THREE.DirectionalLight(0xc8d0ff, 1.7);
    key.position.set(2, 3, 4);
    scene.add(key);

    const labelTexture = (text) => {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 128;
      const g = c.getContext("2d");
      let size = 40;
      g.font = `600 ${size}px "IBM Plex Mono", monospace`;
      const wide = g.measureText(text).width;
      if (wide > 226) {
        size = Math.max(14, Math.floor((size * 226) / wide));
        g.font = `600 ${size}px "IBM Plex Mono", monospace`;
      }
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#f3f3f3";
      g.fillText(text, 128, 66);
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 2;
      return t;
    };

    const ballGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const labelGeo = new THREE.PlaneGeometry(0.76, 0.38);
    const balls = SKILLS.map((name, i) => {
      const grp = new THREE.Group();
      const ico = new THREE.Mesh(
        ballGeo,
        new THREE.MeshStandardMaterial({
          color: 0x1b1640,
          emissive: 0x120f33,
          flatShading: true,
          roughness: 0.5,
          metalness: 0.2,
        })
      );
      grp.add(ico);
      const label = new THREE.Mesh(
        labelGeo,
        new THREE.MeshBasicMaterial({ map: labelTexture(name), transparent: true, depthWrite: false })
      );
      label.position.z = 0.42; // sits in front and never spins away
      grp.add(label);
      grp.userData = { ico, phase: i * 0.7 };
      scene.add(grp);
      return grp;
    });

    const layout = () => {
      const bw = canvas.clientWidth;
      if (!bw) return;
      const cols = Math.max(3, Math.min(6, Math.floor(bw / 135)));
      const rows = Math.ceil(SKILLS.length / cols);
      const bh = rows * 94;
      canvas.style.height = `${bh}px`;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(bw, bh, false);
      const worldH = rows;
      const worldW = worldH * (bw / bh);
      camera.left = -worldW / 2;
      camera.right = worldW / 2;
      camera.top = worldH / 2;
      camera.bottom = -worldH / 2;
      camera.updateProjectionMatrix();
      const colW = worldW / cols;
      balls.forEach((b, i) => {
        b.position.x = (i % cols) * colW - worldW / 2 + colW / 2;
        b.userData.baseY = worldH / 2 - 0.5 - Math.floor(i / cols);
        b.position.y = b.userData.baseY;
      });
    };
    layout();
    window.addEventListener("resize", layout);

    // The font has to be there before the labels are painted, or they bake as the
    // fallback face.
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      balls.forEach((b, i) => {
        b.children[1].material.map.dispose();
        b.children[1].material.map = labelTexture(SKILLS[i]);
      });
      layout();
      renderer.render(scene, camera);
    });

    let onScreen = false;
    let raf = 0;
    let t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen) return;
      const t = (now - t0) / 1000;
      for (const b of balls) {
        b.userData.ico.rotation.y = t * 0.5 + b.userData.phase;
        b.userData.ico.rotation.x = Math.sin(t * 0.4 + b.userData.phase) * 0.3;
        // orthographic camera: depth would not read, so the float is on Y
        b.position.y = b.userData.baseY + Math.sin(t * 0.9 + b.userData.phase) * 0.07;
      }
      renderer.render(scene, camera);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const start = () => {
      if (reduce.matches) {
        stop();
        renderer.render(scene, camera);
        return;
      }
      if (!raf) {
        t0 = performance.now() - 2000;
        raf = requestAnimationFrame(frame);
      }
    };
    const watcher = new IntersectionObserver(
      (es) => {
        onScreen = es[0].isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    watcher.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", start);
    renderer.render(scene, camera);

    return () => {
      stop();
      watcher.disconnect();
      window.removeEventListener("resize", layout);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", start);
      balls.forEach((b) => {
        b.children[1].material.map.dispose();
        b.children[1].material.dispose();
        b.children[0].material.dispose();
      });
      ballGeo.dispose();
      labelGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="balls" ref={canvasRef} aria-hidden="true" />
      <p className="sr-note">
        Twelve tools I work with daily, shown as rotating 3D balls. The same list is
        written out below.
      </p>
    </>
  );
};

export default SkillBalls;
