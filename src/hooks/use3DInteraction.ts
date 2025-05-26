import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface InteractionOptions {
    enabled?: boolean;
    hoveredStyle?: {
        color?: THREE.ColorRepresentation;
        scale?: number;
    };
    onClick?: (event: THREE.Intersection) => void;
    onHover?: (event: THREE.Intersection) => void;
    onUnhover?: () => void;
    draggable?: boolean;
}

interface Use3DInteractionResult {
    isHovered: boolean;
    isDragging: boolean;
    object: THREE.Object3D | null;
    setObject: (object: THREE.Object3D | null) => void;
}

/**
 * A custom hook for managing 3D object interactions within a React Three Fiber scene.
 *
 * This hook provides raycasting, hover effects, click handling, and drag-and-drop functionality for 3D objects.
 *
 * @param options Interaction options, including event handlers and styling configurations.
 * @returns  An object containing interaction state and a setter for the intersected object.
 */
const use3DInteraction = (options?: InteractionOptions): Use3DInteractionResult => {
    const { camera, scene, gl } = useThree()
    const [isHovered, setIsHovered] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [object, setObjectState] = useState<THREE.Object3D | null>(null)
    const intersectedObject = useRef<THREE.Object3D | null>(null);
    const [enabled, setEnabled] = useState(options?.enabled !== false);
    const lastPosition = useRef({ x: 0, y: 0 });
    const raycaster = useRef(new THREE.Raycaster());
    const pointer = useRef(new THREE.Vector2());

    const setEnabledCB = useCallback((newEnabled: boolean) => {
        setEnabled(newEnabled);
    }, [setEnabled]);

    const setObject = useCallback((newObject: THREE.Object3D | null) => {
        intersectedObject.current = newObject;
        setObjectState(newObject);
    }, [setObjectState]);

    const raycast = useCallback((event: PointerEvent) => {
        pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.current.setFromCamera(pointer.current, camera);
        const intersects = raycaster.current.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            return intersects[0];
        }

        return null;
    }, [camera, scene]);

    const handlePointerMove = useCallback((event: PointerEvent) => {
        if (!enabled) return;

        const intersect = raycast(event);

        if (intersect && intersect.object) {
            if (intersectedObject.current !== intersect.object) {
                if (intersectedObject.current) {
                    options?.onUnhover?.();
                    document.body.style.cursor = 'auto';
                    setIsHovered(false);
                }
                setObject(intersect.object);
                setIsHovered(true);
                document.body.style.cursor = 'pointer';
                options?.onHover?.(intersect);
                intersectedObject.current = intersect.object;
            }

            if (isDragging && options?.draggable) {
                const deltaX = event.clientX - lastPosition.current.x;
                const deltaY = event.clientY - lastPosition.current.y;

                if (intersectedObject.current) {
                    intersectedObject.current.position.x += deltaX / 100;
                    intersectedObject.current.position.y -= deltaY / 100;
                }

                lastPosition.current = { x: event.clientX, y: event.clientY };
            }
        } else if (intersectedObject.current) {
            options?.onUnhover?.();
            document.body.style.cursor = 'auto';
            setIsHovered(false);
            setObject(null);
            intersectedObject.current = null;
        }
    }, [raycast, enabled, isDragging, options, setObject]);

    const handlePointerDown = useCallback((event: PointerEvent) => {
        if (!enabled) return;
        const intersect = raycast(event);

        if (intersect && intersect.object) {
            setIsDragging(true);
            lastPosition.current = { x: event.clientX, y: event.clientY };
            setObject(intersect.object);
            intersectedObject.current = intersect.object;
        }
    }, [raycast, enabled]);

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleClick = useCallback((event: PointerEvent) => {
        if (!enabled) return;
        const intersect = raycast(event);

        if (intersect) {
            options?.onClick?.(intersect);
        }
    }, [raycast, enabled, options]);

    useEffect(() => {
        gl.domElement.addEventListener('pointermove', handlePointerMove);
        gl.domElement.addEventListener('pointerdown', handlePointerDown);
        gl.domElement.addEventListener('pointerup', handlePointerUp);
        gl.domElement.addEventListener('click', handleClick);

        return () => {
            gl.domElement.removeEventListener('pointermove', handlePointerMove);
            gl.domElement.removeEventListener('pointerdown', handlePointerDown);
            gl.domElement.removeEventListener('pointerup', handlePointerUp);
            gl.domElement.removeEventListener('click', handleClick);
        };
    }, [gl, handlePointerMove, handlePointerDown, handlePointerUp, handleClick, enabled]);

    useEffect(() => {
        if (options?.hoveredStyle?.color && object instanceof THREE.Mesh && object.material instanceof THREE.Material) {
            const originalColor = object.material.color.clone();
            if (isHovered) {
                object.material.color.set(options.hoveredStyle.color);
            } else {
                object.material.color.copy(originalColor);
            }
            object.material.needsUpdate = true;
            return () => {
                object.material.color.copy(originalColor);
                object.material.needsUpdate = true;
            };
        }
        return () => {};
    }, [isHovered, object, options?.hoveredStyle?.color]);

    useEffect(() => {
        if (options?.enabled !== undefined) {
            setEnabledCB(options.enabled);
        }
    }, [options?.enabled, setEnabledCB]);

    return {
        isHovered,
        isDragging,
        object,
        setObject
    };
}
export default use3DInteraction