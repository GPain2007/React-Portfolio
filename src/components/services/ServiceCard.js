import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import * as THREE from "three";
import "./ServiceCard.css";

// Soft round sprite so the halo particles read as glowing dots, not squares.
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

const PARTICLE_COUNT = 140;

// General-purpose "pop out" card: title up front, mouse-tracked 3D tilt on
// hover, and a three.js wireframe + particle halo that dims once the card
// is clicked open to reveal its content.
const ServiceCard = ({ title, color = "#4db5ff", children }) => {
  const cardRef = useRef(null);
  const mountRef = useRef(null);
  const hoveringRef = useRef(false);
  const expandedRef = useRef(false);

  const [hovering, setHovering] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 18, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 18, mass: 0.5 });

  const rotateX = useTransform(springY, [0, 1], [12, -12]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const wireGeometry = new THREE.IcosahedronGeometry(1.15, 0);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireMesh);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      const radius = 1.6 + Math.random() * 0.9;
      positions[i * 3] = dir.x * radius;
      positions[i * 3 + 1] = dir.y * radius;
      positions[i * 3 + 2] = dir.z * radius;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.035,
      map: buildParticleTexture(),
      color,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(points);

    let frameId;
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      const hover = hoveringRef.current;
      const open = expandedRef.current;
      const spin = hover ? 0.55 : 0.15;

      wireMesh.rotation.y += delta * spin;
      wireMesh.rotation.x = Math.sin(time * 0.4) * 0.2;
      points.rotation.y -= delta * spin * 0.6;

      // Once the card is opened, ease the background back so the content
      // reads clearly instead of competing with it.
      const targetWireOpacity = open ? 0.12 : hover ? 0.6 : 0.3;
      const targetParticleOpacity = open ? 0.2 : hover ? 0.85 : 0.55;
      wireMaterial.opacity += (targetWireOpacity - wireMaterial.opacity) * 0.08;
      particleMaterial.opacity +=
        (targetParticleOpacity - particleMaterial.opacity) * 0.08;

      const targetScale = open ? 0.9 : hover ? 1.08 : 1;
      const scale = wireMesh.scale.x + (targetScale - wireMesh.scale.x) * 0.08;
      wireMesh.scale.setScalar(scale);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      wireGeometry.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleMaterial.map?.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = (event) => {
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.article
      ref={cardRef}
      className="service_card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      animate={{
        scale: hovering ? 1.06 : 1,
        z: hovering ? 60 : 0,
        boxShadow: hovering
          ? "0 2.5rem 4rem rgba(0, 0, 0, 0.45)"
          : "0 0.8rem 1.5rem rgba(0, 0, 0, 0.15)",
      }}
      transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.6 }}
    >
      <div ref={mountRef} className="service_card-canvas" />

      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="title-view"
            type="button"
            className="service_card-title-view"
            onClick={() => setExpanded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3 }}
          >
            <span className="service_card-title">{title}</span>
            <span className="service_card-hint">Click to explore</span>
          </motion.button>
        ) : (
          <motion.div
            key="content-view"
            className="service_card-body"
            initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <button
              type="button"
              className="service_card-back"
              onClick={() => setExpanded(false)}
              aria-label={`Back to ${title} title`}
            >
              &larr;
            </button>
            <div className="service_head">
              <h3>{title}</h3>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default ServiceCard;
