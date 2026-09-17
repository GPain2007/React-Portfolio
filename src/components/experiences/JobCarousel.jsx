import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as THREE from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { BsPauseFill, BsPlayFill, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import JobModal from "./JobModal";
import "./JobCarousel.css";

const AUTO_ROTATE_SPEED = 0.28; // radians per second
const DRAG_SENSITIVITY = 0.012; // radians per pixel
const DRAG_CLICK_THRESHOLD = 6; // px
const RESUME_DELAY = 2600; // ms before autoplay resumes after interaction

const normalizeAngle = (angle) => {
  let a = angle % (Math.PI * 2);
  if (a > Math.PI) a -= Math.PI * 2;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
};

const buildCardElement = (job) => {
  const card = document.createElement("div");
  card.className = "job_carousel3d-card";
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  card.setAttribute(
    "aria-label",
    `View details for ${job.role} at ${job.company}`,
  );

  const face = document.createElement("div");
  face.className = "job_carousel3d-face";

  const company = document.createElement("span");
  company.className = "job_carousel3d-company";
  company.textContent = job.company;

  const role = document.createElement("h4");
  role.className = "job_carousel3d-role";
  role.textContent = job.role;

  const meta = document.createElement("div");
  meta.className = "job_carousel3d-meta";
  const location = document.createElement("span");
  location.textContent = job.location;
  const period = document.createElement("span");
  period.textContent = job.period;
  meta.appendChild(location);
  meta.appendChild(period);

  const teaser = document.createElement("p");
  teaser.className = "job_carousel3d-teaser";
  teaser.textContent = job.points[0] || "";

  const cta = document.createElement("span");
  cta.className = "job_carousel3d-cta";
  cta.textContent = "View Details";

  face.appendChild(company);
  face.appendChild(role);
  face.appendChild(meta);
  face.appendChild(teaser);
  face.appendChild(cta);
  card.appendChild(face);

  return { card, face };
};

const JobCarousel = ({ jobs }) => {
  const mountRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  const isPausedRef = useRef(isPaused);
  const selectedJobRef = useRef(selectedJob);
  const apiRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    selectedJobRef.current = selectedJob;
    apiRef.current?.setModalOpen(selectedJob !== null);
  }, [selectedJob]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || jobs.length === 0) return undefined;

    const count = jobs.length;
    const angleStep = (Math.PI * 2) / count;

    const scene = new THREE.Scene();
    // Orthographic camera: card size on screen stays tied to our own scale()
    // logic below instead of being distorted by perspective foreshortening.
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 5000);

    const renderer = new CSS3DRenderer();
    renderer.domElement.className = "job_carousel3d-renderer";
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const entries = jobs.map((job) => {
      const { card, face } = buildCardElement(job);
      const object = new CSS3DObject(card);
      group.add(object);
      return { job, object, card, face, lastScale: null, lastOpacity: null, lastZIndex: null, lastActive: null };
    });

    let radius = 1;
    let cardWidth = 1;

    const layout = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      cardWidth = Math.max(200, Math.min(260, width * 0.4));
      const cardHeight = cardWidth * 1.15;
      radius = (cardWidth + 60) / (2 * Math.tan(angleStep / 2));

      entries.forEach(({ object, card }, index) => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        const angle = angleStep * index;
        object.position.set(
          radius * Math.sin(angle),
          0,
          radius * Math.cos(angle),
        );
        object.rotation.y = angle;
      });

      camera.position.set(0, 0, radius * 2.4);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    layout();

    // Interaction state, kept in refs so the render loop always sees fresh values.
    const state = {
      hovering: false,
      dragging: false,
      dragStartX: 0,
      dragStartRotation: 0,
      dragDistance: 0,
      justDragged: false,
      angularVelocity: 0,
      snapTarget: null,
      resumeAt: 0,
      modalOpen: false,
    };

    const clock = new THREE.Clock();
    let frameId;
    let lastReportedIndex = -1;

    const closestIndexToFront = () => {
      let best = 0;
      let bestDelta = Infinity;
      entries.forEach((_, index) => {
        const worldAngle = Math.abs(
          normalizeAngle(group.rotation.y + angleStep * index),
        );
        if (worldAngle < bestDelta) {
          bestDelta = worldAngle;
          best = index;
        }
      });
      return best;
    };

    const snapToIndex = (index) => {
      const current = group.rotation.y;
      const rawTarget = -angleStep * index;
      // Pick the equivalent target angle closest to the current rotation for the shortest spin.
      const delta = normalizeAngle(rawTarget - current);
      state.snapTarget = current + delta;
      state.resumeAt = performance.now() + RESUME_DELAY;
    };

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      if (state.snapTarget !== null) {
        const diff = state.snapTarget - group.rotation.y;
        if (Math.abs(diff) < 0.001) {
          group.rotation.y = state.snapTarget;
          state.snapTarget = null;
        } else {
          group.rotation.y += diff * Math.min(1, delta * 6);
        }
      } else if (!state.dragging) {
        const now = performance.now();
        const shouldSpin =
          !isPausedRef.current &&
          !state.hovering &&
          !state.modalOpen &&
          now >= state.resumeAt;
        const targetVelocity = shouldSpin ? AUTO_ROTATE_SPEED : 0;
        state.angularVelocity +=
          (targetVelocity - state.angularVelocity) * Math.min(1, delta * 3);
        group.rotation.y += state.angularVelocity * delta;
      }

      entries.forEach((entry, index) => {
        const { object, face } = entry;
        const worldAngle = normalizeAngle(group.rotation.y + angleStep * index);
        const facing = Math.max(0, Math.cos(worldAngle));
        // Round so a settled ring writes identical style strings frame to frame
        // instead of retriggering style recalculation with imperceptible deltas.
        const scale = Number((0.82 + facing * 0.22).toFixed(3));
        const opacity = Number((0.35 + facing * 0.65).toFixed(3));
        const zIndex = Math.round(facing * 1000);
        const isActive = Math.abs(worldAngle) < angleStep / 2;

        if (entry.lastScale !== scale) {
          face.style.transform = `scale(${scale})`;
          entry.lastScale = scale;
        }
        if (entry.lastOpacity !== opacity) {
          face.style.opacity = opacity;
          entry.lastOpacity = opacity;
        }
        if (entry.lastZIndex !== zIndex) {
          object.element.style.zIndex = zIndex;
          entry.lastZIndex = zIndex;
        }
        if (entry.lastActive !== isActive) {
          face.classList.toggle("is-active", isActive);
          entry.lastActive = isActive;
        }
      });

      const frontIndex = closestIndexToFront();
      if (frontIndex !== lastReportedIndex) {
        lastReportedIndex = frontIndex;
        setActiveIndex(frontIndex);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => layout();
    window.addEventListener("resize", handleResize);

    const handlePointerEnter = () => {
      state.hovering = true;
    };
    const handlePointerLeave = () => {
      state.hovering = false;
    };

    // Drag tracking is done with window-level listeners (added/removed per
    // drag) rather than setPointerCapture: capturing the pointer on `mount`
    // retargets the browser's derived "click" event to `mount` as well,
    // which would stop it from ever reaching a card's own click listener.
    const handleWindowPointerMove = (event) => {
      if (!state.dragging) return;
      const deltaX = event.clientX - state.dragStartX;
      state.dragDistance = Math.abs(deltaX);
      group.rotation.y = state.dragStartRotation + deltaX * DRAG_SENSITIVITY;
    };

    const handleWindowPointerUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      state.resumeAt = performance.now() + RESUME_DELAY;
      if (state.dragDistance > DRAG_CLICK_THRESHOLD) {
        state.justDragged = true;
        setTimeout(() => {
          state.justDragged = false;
        }, 0);
      }
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };

    const handlePointerDown = (event) => {
      state.dragging = true;
      state.dragStartX = event.clientX;
      state.dragStartRotation = group.rotation.y;
      state.dragDistance = 0;
      state.snapTarget = null;
      window.addEventListener("pointermove", handleWindowPointerMove);
      window.addEventListener("pointerup", handleWindowPointerUp);
      window.addEventListener("pointercancel", handleWindowPointerUp);
    };

    mount.addEventListener("pointerenter", handlePointerEnter);
    mount.addEventListener("pointerleave", handlePointerLeave);
    mount.addEventListener("pointerdown", handlePointerDown);

    const cardHandlers = entries.map(({ job, card }) => {
      const openJob = () => {
        if (state.justDragged) return;
        selectedJobRef.current = job;
        setSelectedJob(job);
      };
      const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openJob();
        }
      };
      card.addEventListener("click", openJob);
      card.addEventListener("keydown", onKeyDown);
      return { card, openJob, onKeyDown };
    });

    apiRef.current = {
      goToIndex: (index) => snapToIndex(index),
      goRelative: (offset) => {
        const current = closestIndexToFront();
        snapToIndex((current + offset + count) % count);
      },
      setModalOpen: (open) => {
        state.modalOpen = open;
      },
    };

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeEventListener("pointerenter", handlePointerEnter);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      mount.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
      cardHandlers.forEach(({ card, openJob, onKeyDown }) => {
        card.removeEventListener("click", openJob);
        card.removeEventListener("keydown", onKeyDown);
      });
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  return (
    <div className="job_carousel3d">
      <div className="job_carousel3d-stage" ref={mountRef} />

      <div className="job_carousel3d-controls">
        <button
          type="button"
          className="job_carousel3d-arrow"
          onClick={() => apiRef.current?.goRelative(-1)}
          aria-label="Previous job"
        >
          <BsChevronLeft />
        </button>

        <div className="job_carousel3d-dots">
          {jobs.map((entry, index) => (
            <button
              key={entry.company + entry.role}
              type="button"
              className={`job_carousel3d-dot${
                index === activeIndex ? " is-active" : ""
              }`}
              onClick={() => apiRef.current?.goToIndex(index)}
              aria-label={`Show ${entry.role} at ${entry.company}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>

        <button
          type="button"
          className="job_carousel3d-arrow"
          onClick={() => apiRef.current?.goRelative(1)}
          aria-label="Next job"
        >
          <BsChevronRight />
        </button>

        <button
          type="button"
          className="job_carousel3d-toggle"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? "Resume rotation" : "Pause rotation"}
        >
          {isPaused ? <BsPlayFill /> : <BsPauseFill />}
        </button>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobCarousel;
