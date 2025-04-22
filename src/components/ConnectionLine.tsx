import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';

type ConnectionLineProps = {
  startFunc: (time: number) => THREE.Vector3;
  end: THREE.Vector3;
  color?: string;
  glowing?: boolean;
  dashed?: boolean;
  blockHeight?: number; 
  active?: boolean; 
};

export default function ConnectionLine({
  startFunc,
  end,
  color = 'limegreen',
  glowing = false,
  dashed = false,
  blockHeight,
  active = false,
}: ConnectionLineProps) {
  const ref = useRef<THREE.Line>(null);
  const [positions] = useState(() => new Float32Array(6)); // 2 points x 3 coords

  // Update positions setiap frame
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();

    const startPos = startFunc(time);
    const endPos = end;

    positions[0] = startPos.x;
    positions[1] = startPos.y;
    positions[2] = startPos.z;

    positions[3] = endPos.x;
    positions[4] = endPos.y;
    positions[5] = endPos.z;

    ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ref.current.geometry.attributes.position.needsUpdate = true;

    if (dashed && ref.current.computeLineDistances) {
      ref.current.computeLineDistances();
    }
  });
  return (
    <line ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={2} array={positions} itemSize={3} />
      </bufferGeometry>
      {dashed ? (
        <lineDashedMaterial
          color={color}
          linewidth={glowing && active ? 3 : 1}
          dashSize={1}
          gapSize={0.5}
          transparent={true}
          opacity={active ? 1 : 0.3}
          toneMapped={false}
          emissive={active ? new THREE.Color(color) : new THREE.Color('black')}
          emissiveIntensity={active ? 1 : 0}
        />
      ) : (
        <lineBasicMaterial
          color={color}
          linewidth={glowing && active ? 3 : 1}
          transparent={true}
          opacity={active ? 1 : 0.3}
        />
      )}
    </line>
  );
}
