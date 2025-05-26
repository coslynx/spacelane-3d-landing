import { useState, useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  elementRef: React.RefObject<HTMLElement>;
  target: THREE.Object3D;
  startScroll: number;
  endScroll: number;
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
}

interface UseScrollAnimationResult {
  scrollY: number;
}

/**
 * Custom hook for creating scroll-based animations for 3D objects.
 * Tracks scroll position within a specified container and animates 3D objects based on scroll progress.
 *
 * @param options - Configuration options for the scroll animation.
 * @returns An object containing the current scrollY value.
 */
const useScrollAnimation = (options: ScrollAnimationOptions): UseScrollAnimationResult => {
  const { elementRef, target, startScroll, endScroll, startPosition, endPosition } = options;
  const [scrollY, setScrollY] = useState(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current || !target) return;

    try {
      timelineRef.current = gsap.to(target.position, {
        x: endPosition.x,
        y: endPosition.y,
        z: endPosition.z,
        scrollTrigger: {
          trigger: elementRef.current,
          start: `top+=${startScroll} center`,
          end: `top+=${endScroll} center`,
          scrub: 0.5,
          onUpdate: ({ progress }) => {
            setScrollY(progress);
          },
          onEnter: () => {
            timelineRef.current?.play();
          },
          onLeave: () => {
            timelineRef.current?.pause();
          },
          onEnterBack: () => {
            timelineRef.current?.play();
          },
          onLeaveBack: () => {
            timelineRef.current?.pause();
          },
        },
        ease: 'power2.out',
      });
    } catch (error) {
      console.error('Error creating scroll animation:', error);
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, [elementRef, target, startScroll, endScroll, startPosition, endPosition]);

  return { scrollY };
};

export default useScrollAnimation;