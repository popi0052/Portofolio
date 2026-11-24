import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const DEEP = 0xaa17df;

// One fixed canvas behind the whole page: the logo, its halo and the star field,
// all in a single scene. Plain three.js rather than react-three-fiber - there is
// no React state in here, only a render loop.
const HeroScene = () => {
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
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // The logo is a metal material, so it needs something to reflect. A generated
    // room costs no download, unlike the 1.7 MB city.hdr the old site fetched.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xc8d0ff, 2.2);
    key.position.set(2, 3, 4);
    scene.add(key);

    const mark = new THREE.Group();
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.016, 12, 160),
      new THREE.MeshBasicMaterial({ color: DEEP, transparent: true, opacity: 0.55 })
    );
    mark.add(halo);
    scene.add(mark);

    let gone = false;
    let logo3d = null;
    new GLTFLoader().load("./public/logoap/logoap7.glb", (gltf) => {
      if (gone) return;
      const logo = gltf.scene;
      const box = new THREE.Box3().setFromObject(logo);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      // The model arrives at whatever size it was exported at; the layout below is
      // built around an outer radius of ~1.75, so scale it to match and recentre it.
      const s = 3.5 / Math.max(size.x, size.y, size.z);
      logo.scale.setScalar(s);
      logo.position.copy(centre).multiplyScalar(-s);
      // Rotating the holder, not the model, keeps it spinning around its own centre.
      const holder = new THREE.Group();
      holder.add(logo);
      if (size.y < size.x * 0.5) holder.rotation.x = Math.PI / 2; // exported lying flat
      mark.add(holder);
      logo3d = holder;
      if (!raf) still();
    });

    // The star field, as points in the same scene.
    const N = 900;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      // deterministic spherical scatter, so the field is identical on every load
      const a = i * 2.39996;
      const r = 7 + (i % 29) * 0.42;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(i * 1.7) * 7;
      pos[i * 3 + 2] = Math.sin(a) * r - 10;
    }
    const field = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pos, 3)),
      new THREE.PointsMaterial({ color: 0xf3f3f3, size: 0.035, transparent: true, opacity: 0.55 })
    );
    scene.add(field);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Park the mark against the right edge without clipping it: work out half the
      // visible width at z=0 and keep the whole outer radius inside it.
      const wide = w > 900;
      const scale = wide ? 0.82 : 0.6;
      mark.scale.setScalar(scale);
      const halfW =
        Math.tan(((camera.fov * Math.PI) / 180) / 2) * camera.position.z * camera.aspect;
      mark.position.x = wide ? Math.max(0, halfW - (1.95 * scale + 0.12)) : 0;
      mark.position.y = wide ? 0.3 : -1.35;
    };
    resize();
    window.addEventListener("resize", resize);

    // pointer parallax, desktop only
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    const onPointer = (e) => {
      tx = (e.clientX / w - 0.5) * 0.3;
      ty = (e.clientY / h - 0.5) * 0.3;
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const t = (now - t0) / 1000;
      px += (tx - px) * 0.045;
      py += (ty - py) * 0.045;
      // The logo carries the AP monogram, so it turns in its own plane the way the
      // old site did - a full spin on Y would put it edge-on and hide the mark.
      if (logo3d) logo3d.rotation.z = -t * 0.22;
      mark.rotation.y = Math.sin(t * 0.25) * 0.55 + px;
      mark.rotation.x = Math.sin(t * 0.21) * 0.16 - py;
      halo.rotation.z = -t * 0.4;
      field.rotation.y = t * 0.012;
      renderer.render(scene, camera);
    };
    const still = () => renderer.render(scene, camera);
    const start = () => {
      if (reduce.matches) {
        cancelAnimationFrame(raf);
        raf = 0;
        still();
        return;
      }
      if (!raf) {
        t0 = performance.now() - 2000; // start mid-motion, not from a dead stop
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", start);

    // Past the hero the mark would compete with the skill balls, so it recedes.
    const hero = document.querySelector(".hero");
    const watcher = new IntersectionObserver(
      (es) => document.body.classList.toggle("scrolled", !es[0].isIntersecting),
      { threshold: 0 }
    );
    if (hero) watcher.observe(hero);

    return () => {
      gone = true;
      stop();
      watcher.disconnect();
      window.removeEventListener("resize", resize);
      if (fine) window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", start);
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="scene" ref={canvasRef} aria-hidden="true" />;
};

export default HeroScene;
