import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

type ValidatorPlanetProps = {
  orbitRadius: number;
  orbitSpeed: number; 
  size: number;
  name: string;
  power: number;
  active: boolean;
  color: { color: string; emissive: string };
  phaseOffset: number;
  onClick: () => void;
  textureUrl: string;
  position: THREE.Vector3;
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
  textureUrl,
  position,
}: ValidatorPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);

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
      <sphereGeometry args={[1, 15, 15]} />
      <meshStandardMaterial
        map={texture}
        emissive={active ? 'magenta' : color.emissive}
        emissiveIntensity={active ? 0.25 : 0.1}
        metalness={0.6}
        roughness={0.3}
      />

      <Html position={[0, size + 0.5, 0]} center>
        <div
          style={{
            color: active ? 'yellow' : 'white',
            fontSize: 12,
            opacity: active ? 1 : 0.4,
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {name} {active && <span style={{ color: 'lightgreen' }}>● </span>}
        </div>
      </Html>
    </mesh>
  );
}
