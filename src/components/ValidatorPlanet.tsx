import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

type ValidatorPlanetProps = {
  orbitRadius: number;
  orbitSpeed: number; // radians per second
  size: number;
  name: string;
  power: number;
  active: boolean;
  color: { color: string; emissive: string };
  phaseOffset: number;
  onClick: () => void;
};

export default function ValidatorPlanet({
  orbitRadius,
  orbitSpeed,
  size,
  name,
  power,
  active,
  color,
  phaseOffset,
  onClick,
}: ValidatorPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * orbitSpeed + phaseOffset;

    if (meshRef.current) {
      meshRef.current.position.set(
        Math.cos(angle) * orbitRadius,
        0,
        Math.sin(angle) * orbitRadius
      );
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={[size, size, size]}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color.color}
        emissive={active ? color.emissive : 'black'}
        metalness={0.8}
        roughness={0.2}
      />

      <Html position={[0, size + 0.5, 0]} center>
        <div
          style={{
            color: 'white',
            fontSize: 12,
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
      </Html>
    </mesh>
  );
}
