"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

// Array of SVG objects representing the pale pastel shapes seen in the image
const PASTEL_SHAPES = [
  { id: 1, type: "tag", x: 15, y: 20, z: 20, scale: 1.2, color: "text-blue-300", rotate: -15 },
  { id: 2, type: "css", x: 75, y: 15, z: -10, scale: 1.4, color: "text-emerald-300", rotate: 10 },
  { id: 3, type: "html", x: 10, y: 70, z: 40, scale: 1.1, color: "text-sky-300", rotate: -25 },
  { id: 4, type: "brackets", x: 85, y: 75, z: -20, scale: 1.5, color: "text-amber-300", rotate: 20 },
  { id: 5, type: "cube", x: 40, y: 10, z: 15, scale: 1.3, color: "text-rose-300", rotate: -5 },
  { id: 6, type: "js", x: 60, y: 85, z: 30, scale: 1.2, color: "text-violet-300", rotate: 15 },
  { id: 7, type: "tag", x: 30, y: 50, z: -30, scale: 1.4, color: "text-orange-300", rotate: -10 },
  { id: 8, type: "brackets", x: 80, y: 45, z: 10, scale: 1.1, color: "text-fuchsia-300", rotate: -15 },
  { id: 9, type: "css", x: 85, y: 35, z: 25, scale: 1.2, color: "text-red-300", rotate: 5 },
  { id: 10, type: "cube", x: 20, y: 85, z: -15, scale: 1.3, color: "text-cyan-300", rotate: 25 },
  { id: 11, type: "html", x: 50, y: 25, z: 35, scale: 1.4, color: "text-lime-300", rotate: -20 },
  { id: 12, type: "tag", x: 15, y: 55, z: -5, scale: 1.2, color: "text-pink-300", rotate: 15 },
  { id: 13, type: "js", x: 90, y: 60, z: 20, scale: 1.1, color: "text-indigo-300", rotate: -5 },
  { id: 14, type: "brackets", x: 35, y: 80, z: 45, scale: 1.5, color: "text-teal-300", rotate: -30 },
  { id: 15, type: "cube", x: 65, y: 15, z: -25, scale: 1.2, color: "text-yellow-300", rotate: 10 },
  { id: 16, type: "html", x: 45, y: 55, z: 5, scale: 1.3, color: "text-rose-200", rotate: -15 },
  { id: 17, type: "css", x: 25, y: 30, z: 15, scale: 1.4, color: "text-blue-200", rotate: -25 },
  { id: 18, type: "js", x: 70, y: 70, z: -15, scale: 1.2, color: "text-orange-200", rotate: 20 },
];

function getPastelSVG(type) {
  switch (type) {
    case "tag": // < >
      return <svg className="w-full h-full" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    case "brackets": // { }
      return <svg className="w-full h-full" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    case "cube":
      return <svg className="w-full h-full opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l10 5.5v7L12 21l-10-5.5v-7L12 3zm0 2.2L4.5 9.4l7.5 4.1 7.5-4.1L12 5.2zm-8.5 5.8v4.6l7.5 4.1v-4.6l-7.5-4.1zm17 0l-7.5 4.1v4.6l7.5-4.1v-4.6z"/></svg>;
    case "html": // HTML text badge
      return <svg className="w-full h-full" viewBox="0 0 40 16" fill="currentColor"><text x="0" y="14" fontSize="14" fontWeight="900" fontFamily="sans-serif">HTML</text></svg>;
    case "css": // CSS text badge
      return <svg className="w-full h-full" viewBox="0 0 40 16" fill="currentColor"><text x="0" y="14" fontSize="14" fontWeight="900" fontFamily="sans-serif">CSS</text></svg>;
    case "js": // JS text badge
      return <svg className="w-full h-full" viewBox="0 0 30 16" fill="currentColor"><text x="0" y="14" fontSize="14" fontWeight="900" fontFamily="sans-serif">JS</text></svg>;
    default:
      return <svg className="w-full h-full" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
  }
}

function AnimatedParticle({ p, index, springX, springY }) {
  // Slower scattering effect
  const intensityX = (p.z * -0.6) + (index % 2 === 0 ? 15 : -15);
  const intensityY = (p.z * -0.6) + (index % 3 === 0 ? 10 : -10);

  const xPos = useTransform(springX, [-1, 1], [intensityX, -intensityX]);
  const yPos = useTransform(springY, [-1, 1], [intensityY, -intensityY]);
  const rotZ = useTransform(springX, [-1, 1], [-8, 8]);

  return (
    <motion.div
      style={{
        x: xPos,
        y: yPos,
        rotateZ: rotZ,
        left: `${p.x}%`,
        top: `${p.y}%`,
        scale: p.scale,
        translateZ: `${p.z}px`
      }}
      className={`absolute w-12 h-12 md:w-16 md:h-16 opacity-60 mix-blend-multiply drop-shadow-sm pointer-events-none ${p.color}`}
    >
      <div style={{ transform: `rotate(${p.rotate}deg)` }} className="w-full h-full">
        {getPastelSVG(p.type)}
      </div>
    </motion.div>
  );
}

function AnimatedLetter({ letter, index, totalLength, springX, springY }) {
  // Slower scatter factor for letters matching the image style
  const scatterFactorX = (index - totalLength / 2) * 12;
  const scatterFactorY = (index % 2 === 0 ? -1 : 1) * 15;

  const xOff = useTransform(springX, [-1, 1], [scatterFactorX, -scatterFactorX]);
  const yOff = useTransform(springY, [-1, 1], [scatterFactorY, -scatterFactorY]);
  const rot = useTransform(springX, [-1, 1], [scatterFactorX / 8, -scatterFactorX / 8]);

  return (
    <motion.span
      style={{ x: xOff, y: yOff, rotate: rot }}
      className="inline-block transform-gpu"
    >
      {letter}
    </motion.span>
  );
}

export default function Hero3DLayer() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very soft springs for dreamy, slow scattering for letters
  const slowSpringX = useSpring(mouseX, { stiffness: 30, damping: 50 });
  const slowSpringY = useSpring(mouseY, { stiffness: 30, damping: 50 });

  // Faster springs for the background icons
  const fastSpringX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const fastSpringY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);
      mouseY.set((e.clientY - cy) / cy);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseX.set((e.touches[0].clientX - cx) / cx);
        mouseY.set((e.touches[0].clientY - cy) / cy);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mouseX, mouseY]);

  const title = "bootNode".split("");

  if (!mounted) return null;

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-white flex flex-col items-center justify-center font-sans tracking-tight">
      
      {/* 3D Container context for background icons */}
      <div className="absolute inset-0 preserve-3d perspective-[800px]">
        {PASTEL_SHAPES.map((p, i) => (
           <AnimatedParticle key={i} p={p} index={i} springX={fastSpringX} springY={fastSpringY} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 pointer-events-none mt-10">
        
        {/* Modern, Bold Black Title */}
        <div className="flex font-black text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] mb-6 text-black mx-auto justify-center tracking-tighter">
          {title.map((letter, i) => (
            <AnimatedLetter key={i} letter={letter} index={i} totalLength={title.length} springX={slowSpringX} springY={slowSpringY} />
          ))}
        </div>

        {/* Subheading: Fixed, tracking widely, uppercase */}
        <div className="text-xs sm:text-sm md:text-[15px] text-slate-500 font-light tracking-[0.2em] uppercase mb-[40px] md:mb-[50px] text-center flex flex-col sm:flex-row items-center gap-3">
          GENERATE YOUR 
          <span className="font-black text-sm md:text-base bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg border border-slate-700 mx-1 transform -rotate-1 mt-2 sm:mt-0">
            project scaffolding
          </span> 
          IN SECONDS.
        </div>
      </div>

      {/* Button is strictly fixed, completely decoupled from mouse tracking */}
      <div className="relative z-20">
        <Link
          href="/templates"
          className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-transparent px-10 py-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-slate-200 cursor-pointer pointer-events-auto"
        >
          <span className="text-base font-semibold px-2">Continue</span>
        </Link>
      </div>
      
      {/* Minimal version tag on bottom right */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 cursor-default pointer-events-none opacity-50">
         <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">Version 2.0.4 // Build_Stable</span>
      </div>

    </div>
  );
}
