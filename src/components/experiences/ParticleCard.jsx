import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import "./ParticleCard.css";
import {
  createRenderLoop,
  fitDistance,
  isTouchDevice,
  maxPixelRatio,
  observeSize,
} from "../../utils/renderLoop";

// Builds a soft round sprite so points read as glowing dots instead of hard squares.
const buildParticleTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
};

// Evenly spreads points across a sphere surface using a fibonacci lattice. Got this from YouTube.This Math adn code is above my pay grade but it works well for creating a visually appealing particle distribution.
const fibonacciSphere = (count, radius) => {
  const points = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points[i * 3] = x * radius;
    points[i * 3 + 1] = y * radius;
    points[i * 3 + 2] = z * radius;
  }

  return points;
};

const SPHERE_RADIUS = 1.6;
const CAMERA_FOV = 50;
// Fewer points on phones: the sphere still reads as a dense cloud at that
// size, and the per-frame position update is half the work.
const particleCount = () => (isTouchDevice() ? 450 : 900);

// How long the explode animation runs before the content replaces it.
export const MATERIALIZE_MS = 550;

const ParticleCard = ({ title, color = "#4db5ff", children }) => {
  const mountRef = useRef(null);
  const stateRef = useRef({
    hovering: false,
    materializing: false,
    dematerializing: false,
  });

  const [materialized, setMaterialized] = useState(false);
  // True from the tap until the sphere/content swap has finished, so rapid
  // double taps can't start a second, overlapping transition.
  const busyRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;
    const PARTICLE_COUNT = particleCount();
    const touch = isTouchDevice();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.1, 100);
    camera.position.z = fitDistance(SPHERE_RADIUS, CAMERA_FOV, width / height);

    // Antialiasing does nothing for soft round sprites; skip it on phones.
    const renderer = new THREE.WebGLRenderer({ antialias: !touch, alpha: true });
    renderer.setPixelRatio(maxPixelRatio());
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const basePositions = fibonacciSphere(PARTICLE_COUNT, SPHERE_RADIUS);
    const positions = basePositions.slice();

    // A random "explode to" target used only during the materialize transition.
    const explodedPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      const distance = SPHERE_RADIUS * (3 + Math.random() * 4);
      explodedPositions[i * 3] = dir.x * distance;
      explodedPositions[i * 3 + 1] = dir.y * distance;
      explodedPositions[i * 3 + 2] = dir.z * distance;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.045,
      map: buildParticleTexture(),
      color,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let time = 0;
    let transitionProgress = 0; // 0 = sphere, 1 = fully exploded/hidden
    let hiddenFrameDrawn = false;

    const animate = (delta) => {
      time += delta;

      const { hovering, materializing, dematerializing } = stateRef.current;

      // Once the sphere has fully exploded the content covers it: draw one
      // last (empty) frame, then do no work until it reforms.
      if (materializing && transitionProgress === 1) {
        if (hiddenFrameDrawn) return;
        hiddenFrameDrawn = true;
      } else {
        hiddenFrameDrawn = false;
      }

      // Drive the explode/reform transition.
      const transitionSpeed = 2.6;
      if (materializing && transitionProgress < 1) {
        transitionProgress = Math.min(
          1,
          transitionProgress + delta * transitionSpeed,
        );
      } else if (dematerializing && transitionProgress > 0) {
        transitionProgress = Math.max(
          0,
          transitionProgress - delta * transitionSpeed,
        );
      }

      const posAttr = geometry.attributes.position;
      const hoverAmp = hovering && transitionProgress === 0 ? 0.06 : 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const bx = basePositions[ix];
        const by = basePositions[ix + 1];
        const bz = basePositions[ix + 2];

        // Gentle per-particle noise-like jitter on hover.
        const jitter = hoverAmp ? Math.sin(time * 3 + i) * hoverAmp : 0;

        const nx = bx + bx * jitter;
        const ny = by + by * jitter;
        const nz = bz + bz * jitter;

        const ex = explodedPositions[ix];
        const ey = explodedPositions[ix + 1];
        const ez = explodedPositions[ix + 2];

        posAttr.array[ix] = nx + (ex - nx) * transitionProgress;
        posAttr.array[ix + 1] = ny + (ey - ny) * transitionProgress;
        posAttr.array[ix + 2] = nz + (ez - nz) * transitionProgress;
      }
      posAttr.needsUpdate = true;

      material.opacity = 0.9 * (1 - transitionProgress);

      const rotationSpeed = hovering ? 0.6 : 0.18;
      points.rotation.y += delta * rotationSpeed;
      points.rotation.x = Math.sin(time * 0.3) * 0.15;

      renderer.render(scene, camera);
    };
    const loop = createRenderLoop(mount, animate);

    const stopObservingSize = observeSize(mount, (w, h) => {
      camera.aspect = w / h;
      camera.position.z = fitDistance(SPHERE_RADIUS, CAMERA_FOV, w / h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    mountRef.current._particleApi = {
      setHovering: (val) => {
        stateRef.current.hovering = val;
      },
      startMaterialize: () => {
        stateRef.current.materializing = true;
        stateRef.current.dematerializing = false;
      },
      startDematerialize: () => {
        stateRef.current.dematerializing = true;
        stateRef.current.materializing = false;
      },
    };

    return () => {
      loop.stop();
      stopObservingSize();
      geometry.dispose();
      material.dispose();
      material.map?.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hover effects are for mice only. On a phone a tap fires mouseenter with
  // no matching mouseleave, which left spheres spinning fast and jittering.
  const handlePointerEnter = (event) => {
    if (event.pointerType === "mouse") {
      mountRef.current?._particleApi?.setHovering(true);
    }
  };

  const handlePointerLeave = () => {
    mountRef.current?._particleApi?.setHovering(false);
  };

  const handleMaterialize = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    mountRef.current?._particleApi?.setHovering(false);
    mountRef.current?._particleApi?.startMaterialize();
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMaterialized(true);
      busyRef.current = false;
    }, MATERIALIZE_MS);
  };

  const handleDematerialize = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setMaterialized(false);
    // Let the content fade out first, then reform the sphere.
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      mountRef.current?._particleApi?.startDematerialize();
      busyRef.current = false;
    }, 50);
  };

  // Blurring a whole card while it animates is expensive on phone GPUs.
  const softBlur = !isTouchDevice();

  return (
    <div
      className="particle_card"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={mountRef} className="particle_card-canvas" />

      <AnimatePresence mode="wait">
        {!materialized ? (
          <motion.button
            key="sphere-overlay"
            type="button"
            className="particle_card-prompt"
            onClick={handleMaterialize}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="particle_card-title">{title}</span>
            <span className="particle_card-hint">Click to materialize</span>
          </motion.button>
        ) : (
          <motion.div
            key="materialized-content"
            className="particle_card-content"
            initial={{ opacity: 0, scale: 0.9, ...(softBlur && { filter: "blur(6px)" }) }}
            animate={{ opacity: 1, scale: 1, ...(softBlur && { filter: "blur(0px)" }) }}
            exit={{ opacity: 0, scale: 0.9, ...(softBlur && { filter: "blur(6px)" }) }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <button
              type="button"
              className="particle_card-back"
              onClick={handleDematerialize}
              aria-label="Return to particle sphere"
            >
              &larr;
            </button>
            <h3>{title}</h3>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticleCard;
