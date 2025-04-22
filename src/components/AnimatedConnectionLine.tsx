import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

type AnimatedConnectionLineProps = {
  startFunc: (time: number) => THREE.Vector3;
  end: THREE.Vector3;
  color: string;
};

export default function AnimatedConnectionLine({ startFunc, end, color }: AnimatedConnectionLineProps) {
  const ref = useRef<THREE.Line>(null!);

  const endVec = useMemo(() => new THREE.Vector3(end.x, end.y, end.z), [end]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const start = startFunc(time);

    // Update posisi garis
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    positions.set([start.x, start.y, start.z, endVec.x, endVec.y, endVec.z]);
    ref.current.geometry.attributes.position.needsUpdate = true;

    // Animasi alpha blinking (lebih smooth dan terkontrol)
    const rawAlpha = 0.5 + 0.5 * Math.sin(time * 2);
    const alpha = Math.max(0.2, Math.min(1, rawAlpha));

    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = alpha;
    mat.transparent = true;
    mat.color.setStyle(color);
  });

  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2} array={new Float32Array(6)} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.5} linewidth={2} />
    </line>
  );
}
