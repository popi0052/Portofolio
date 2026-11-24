import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import {
  siTypescript,
  siReact,
  siNextdotjs,
  siNodedotjs,
  siPython,
  siGraphql,
  siPrisma,
  siDocker,
  siTerraform,
  siLanggraph,
  siModelcontextprotocol,
} from "simple-icons";
import awsPng from "../../assets/tech/aws.png";

// simple-icons gives each logo as a 24x24 path plus its brand colour, so the page
// downloads no icon files. AWS is the exception - it was pulled from the set over
// trademark, so it is still the PNG the old site shipped.
const SKILLS = [
  { name: "TypeScript", icon: siTypescript },
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "Node", icon: siNodedotjs },
  { name: "Python", icon: siPython },
  { name: "GraphQL", icon: siGraphql },
  { name: "Prisma", icon: siPrisma },
  { name: "AWS", image: awsPng },
  { name: "Docker", icon: siDocker },
  { name: "Terraform", icon: siTerraform },
  { name: "LangGraph", icon: siLanggraph },
  { name: "MCP", icon: siModelcontextprotocol },
];

const BALL_COLOUR = 0x1b1640;
const LIGHT = "#f3f3f3";
const SIZE = 256;

// sRGB -> relative luminance, for the contrast check below
const lum = (hex) => {
  const v = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
// Next.js, MCP and Prisma are near-black brands; on a dark ball they would be a
// hole, so those fall back to the page's off-white.
const ballLum = lum("1b1640");
const readable = (hex) =>
  (lum(hex) + 0.05) / (ballLum + 0.05) < 2 ? LIGHT : `#${hex}`;

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

    const draw = (skill) => {
      const c = document.createElement("canvas");
      c.width = SIZE;
      c.height = SIZE;
      const g = c.getContext("2d");
      const texture = new THREE.CanvasTexture(c);
      texture.anisotropy = 4;

      if (skill.icon) {
        const pad = SIZE * 0.16;
        const s = (SIZE - pad * 2) / 24;
        g.translate(pad, pad);
        g.scale(s, s);
        g.fillStyle = readable(skill.icon.hex);
        g.fill(new Path2D(skill.icon.path));
      } else {
        const img = new Image();
        img.onload = () => {
          const r = Math.min(SIZE / img.width, SIZE / img.height) * 0.86;
          const w = img.width * r;
          const h = img.height * r;
          g.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
          // the AWS wordmark is near-black and would vanish into the ball
          const d = g.getImageData(0, 0, SIZE, SIZE);
          for (let i = 0; i < d.data.length; i += 4) {
            if (d.data[i + 3] < 12) continue;
            const l = (d.data[i] * 0.299 + d.data[i + 1] * 0.587 + d.data[i + 2] * 0.114) / 255;
            if (l < 0.3) {
              d.data[i] = 243;
              d.data[i + 1] = 243;
              d.data[i + 2] = 243;
            }
          }
          g.putImageData(d, 0, 0);
          texture.needsUpdate = true;
          render();
        };
        img.src = skill.image;
      }
      return texture;
    };

    const IDLE_Y = 0.5;
    const IDLE_X = 0.09;
    const ballGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const balls = SKILLS.map((skill, i) => {
      const ico = new THREE.Mesh(
        ballGeo,
        new THREE.MeshStandardMaterial({
          color: BALL_COLOUR,
          emissive: 0x120f33,
          flatShading: true,
          roughness: 0.5,
          metalness: 0.2,
        })
      );
      ico.updateMatrixWorld();

      // A real decal, projected onto the facets, rather than a plate floating in
      // front: it wraps the ball and turns away with it when you spin it.
      const decal = new THREE.Mesh(
        new DecalGeometry(
          ico,
          new THREE.Vector3(0, 0, 0.4),
          new THREE.Euler(),
          new THREE.Vector3(0.56, 0.56, 0.9)
        ),
        new THREE.MeshBasicMaterial({
          map: draw(skill),
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
        })
      );

      const ball = new THREE.Group();
      ball.add(ico, decal);
      const holder = new THREE.Group();
      holder.add(ball);
      holder.userData = { ball, ico, phase: i * 0.7, baseY: 0, spin: { x: IDLE_X, y: IDLE_Y } };
      ico.userData.holder = holder;
      scene.add(holder);
      return holder;
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
      balls.forEach((h, i) => {
        h.position.x = (i % cols) * colW - worldW / 2 + colW / 2;
        h.userData.baseY = worldH / 2 - 0.5 - Math.floor(i / cols);
        h.position.y = h.userData.baseY;
      });
    };
    layout();
    window.addEventListener("resize", layout);

    // ---- drag to spin ----
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const icos = balls.map((h) => h.userData.ico);
    let held = null;
    let lastX = 0;
    let lastY = 0;

    const pick = (e) => {
      const r = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      return ray.intersectObjects(icos, false)[0]?.object.userData.holder ?? null;
    };

    const onDown = (e) => {
      const hit = pick(e);
      if (!hit) return;
      held = hit.userData;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onMove = (e) => {
      if (!held) {
        canvas.style.cursor = pick(e) ? "grab" : "default";
        return;
      }
      const k = 0.012;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      held.ball.rotation.y += dx * k;
      held.ball.rotation.x += dy * k;
      // carried into the loop as momentum; 60 turns a per-frame delta into rad/s
      const cap = (v) => Math.max(-14, Math.min(14, v));
      held.spin.y = cap(dx * k * 60);
      held.spin.x = cap(dy * k * 60);
      if (!raf) renderer.render(scene, camera); // reduced motion: no loop running
    };

    const onUp = (e) => {
      if (!held) return;
      held = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // the pointer was already released; nothing to do
      }
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // ---- loop ----
    let onScreen = false;
    let raf = 0;
    let t0 = performance.now();
    let prev = t0;
    const render = () => renderer.render(scene, camera);
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!onScreen) return;
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const t = (now - t0) / 1000;
      for (const h of balls) {
        const u = h.userData;
        if (u !== held) {
          // let a thrown ball ease back into the idle turn instead of stopping dead
          u.spin.x += (IDLE_X - u.spin.x) * 0.03;
          u.spin.y += (IDLE_Y - u.spin.y) * 0.03;
        }
        u.ball.rotation.x += u.spin.x * dt;
        u.ball.rotation.y += u.spin.y * dt;
        h.position.y = u.baseY + Math.sin(t * 0.9 + u.phase) * 0.07;
      }
      render();
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
        render();
        return;
      }
      if (!raf && onScreen) {
        prev = performance.now();
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
    render();

    return () => {
      stop();
      watcher.disconnect();
      window.removeEventListener("resize", layout);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", start);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      balls.forEach((h) => {
        const [ico, decal] = h.userData.ball.children;
        ico.material.dispose();
        decal.geometry.dispose();
        decal.material.map.dispose();
        decal.material.dispose();
      });
      ballGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="balls" ref={canvasRef} aria-hidden="true" />
      <p className="sr-note">
        Twelve tools I work with daily, shown as 3D balls you can spin by dragging.
        The same list is written out below.
      </p>
    </>
  );
};

export default SkillBalls;
