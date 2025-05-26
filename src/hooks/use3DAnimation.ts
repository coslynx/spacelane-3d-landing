import {useCallback, useEffect, useRef, useState} from 'react'
import * as THREE from 'three'
import {useThree} from '@react-three/fiber'
import gsap from 'gsap'
import { Object3D } from 'three'

interface AnimationOptions {
  name: string
  timeline: gsap.core.Timeline
  onStart?: () => void
  onComplete?: () => void
  onUpdate?: () => void
}

interface Use3DAnimationResult {
  startAnimation: (name: string) => void
  pauseAnimation: (name: string) => void
  stopAnimation: (name: string) => void
  reverseAnimation: (name: string) => void
  isAnimating: (name: string) => boolean
}

/**
 * Custom hook for managing GSAP-based animations in a Three.js scene.
 * This hook provides methods for starting, pausing, stopping, and reversing animations,
 * ensuring smooth transitions and proper cleanup.
 *
 * @param animationOptions An array of AnimationOptions to define animation timelines.
 * @returns An object containing animation control functions and state information.
 */
const use3DAnimation = (animationOptions: AnimationOptions[]): Use3DAnimationResult => {
  const timelinesRef = useRef<{[key: string]: gsap.core.Timeline}>({})
  const animationStateRef = useRef<{[key: string]: boolean}>({})
  const {scene} = useThree()

  useEffect(() => {
    const timelines:{[key: string]: gsap.core.Timeline} = {}

    animationOptions.forEach((option) => {
      timelines[option.name] = option.timeline
      animationStateRef.current[option.name] = false
    })

    timelinesRef.current = timelines

    return () => {
      // Kill all timelines on unmount
      Object.values(timelinesRef.current).forEach((timeline) => {
        timeline.kill()
      })
    }
  }, [animationOptions])

  const startAnimation = useCallback((name: string) => {
    if (!timelinesRef.current[name]) {
      console.warn(`Timeline "${name}" not found.`)
      return
    }

    try {
      timelinesRef.current[name].play()
      animationStateRef.current[name] = true
    } catch (error) {
      console.error(`Error starting animation "${name}":`, error)
    }
  }, [])

  const pauseAnimation = useCallback((name: string) => {
    if (!timelinesRef.current[name]) {
      console.warn(`Timeline "${name}" not found.`)
      return
    }

    try {
      timelinesRef.current[name].pause()
      animationStateRef.current[name] = false
    } catch (error) {
      console.error(`Error pausing animation "${name}":`, error)
    }
  }, [])

  const stopAnimation = useCallback((name: string) => {
    if (!timelinesRef.current[name]) {
      console.warn(`Timeline "${name}" not found.`)
      return
    }

    try {
      timelinesRef.current[name].pause()
      timelinesRef.current[name].seek(0)
      animationStateRef.current[name] = false
    } catch (error) {
      console.error(`Error stopping animation "${name}":`, error)
    }
  }, [])

  const reverseAnimation = useCallback((name: string) => {
    if (!timelinesRef.current[name]) {
      console.warn(`Timeline "${name}" not found.`)
      return
    }

    try {
      timelinesRef.current[name].reverse()
      animationStateRef.current[name] = !animationStateRef.current[name]
    } catch (error) {
      console.error(`Error reversing animation "${name}":`, error)
    }
  }, [])

  const isAnimating = useCallback((name: string): boolean => {
    return !!animationStateRef.current[name]
  }, [])

  return {
    startAnimation,
    pauseAnimation,
    stopAnimation,
    reverseAnimation,
    isAnimating,
  }
}

export default use3DAnimation