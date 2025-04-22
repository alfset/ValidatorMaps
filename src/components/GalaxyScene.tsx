'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei'; 
import ValidatorPlanet from './ValidatorPlanet';
import AnimatedConnectionLine from './AnimatedConnectionLine';
import { fetchValidatorsFromChain } from '../utils/cosmosApi'; 
import { fetchLatestBlockFromChain } from '../utils/fetchLatestBlock'; 
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

type Validator = {
  operator_address: string;
  description: { moniker: string };
  tokens: string;
  status: number;
  delegator_shares: string;
  denom: string;
};

type BlockInfo = {
  block_height: number;
  proposer_moniker: string;
  block_time: string;
};

const chains = [
  { key: 'cosmoshub', name: 'Cosmos Hub', baseUrl: 'https://rest.cosmos.directory/cosmoshub', denom: 'uatom' },
  { key: 'osmosis', name: 'Osmosis', baseUrl: 'https://lcd.osmosis.zone', denom: 'uosmo' },
  { key: 'planq', name: 'Planq', baseUrl: 'https://rest.planq.network', denom: 'aplanq' },
  { key: 'stargaze', name: 'Stargaze', baseUrl: 'https://rest.stargaze-apis.com', denom: 'ustars' },
  { key: 'Akash', name: 'Akash', baseUrl: 'https://akash-rest.publicnode.com', denom: 'uakt' },
];

const shorten = (str: string, len = 6) =>
  str.length <= len * 2 ? str : `${str.slice(0, len)}...${str.slice(-len)}`;

export default function GalaxyScene() {
  const [selectedChainKey, setSelectedChainKey] = useState(chains[0].key);
  const [validators, setValidators] = useState<Validator[]>([]);
  const [blockInfo, setBlockInfo] = useState<BlockInfo | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const maxOrbitRadius = 180;  
  const baseOrbitRadius = 40; 
  const orbitSpacing = 20;     // sebelumnya 10

  const projectPos = new THREE.Vector3(0, 0, 0);

  const planetPositions = useRef<THREE.Vector3[]>([]);
  const phaseOffsets = useRef<number[]>([]);
  const orbitSpeeds = useRef<number[]>([]);
  const orbitRadii = useRef<number[]>([]);
  const sizes = useRef<number[]>([]);

  const [activeConnectionIndex, setActiveConnectionIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (validators.length > 0) {
        const randomIndex = Math.floor(Math.random() * validators.length);
        setActiveConnectionIndex(randomIndex);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [validators]);

  useEffect(() => {
    const chain = chains.find(c => c.key === selectedChainKey);
    if (!chain) return;

    fetchValidatorsFromChain(chain.baseUrl, chain.denom).then((data) => {
      const sorted = data.sort((a, b) => parseFloat(b.tokens) - parseFloat(a.tokens));
      setValidators(sorted);

      // Size lebih besar (multiplier 1.5 dan max 6)
      sizes.current = sorted.map((v) => Math.min(Math.log10(parseFloat(v.tokens) / 1e18 + 1) * 1.5, 6));

      orbitRadii.current = sizes.current.map((size, i) =>
        Math.min(baseOrbitRadius + i * orbitSpacing + size, maxOrbitRadius)
      );
      phaseOffsets.current = sorted.map(() => Math.random() * Math.PI * 2);
      orbitSpeeds.current = sorted.map((_, i) => 0.01 + (i / sorted.length) * 0.02);
      planetPositions.current = sorted.map(() => new THREE.Vector3());

      setSelectedValidator(null);
    }).catch((e) => {
      console.error('Failed to fetch validators:', e);
      setValidators([]);
      planetPositions.current = [];
    });
  }, [selectedChainKey]);

  useEffect(() => {
    const chain = chains.find(c => c.key === selectedChainKey);
    if (!chain) return;

    const getBlock = async () => {
      try {
        const info = await fetchLatestBlockFromChain(chain.baseUrl);
        setBlockInfo(info);
      } catch (e) {
        console.error('Failed to fetch block info:', e);
        setBlockInfo(null);
      }
    };
    getBlock();
    const interval = setInterval(getBlock, 5000);
    return () => clearInterval(interval);
  }, [selectedChainKey]);

  function UpdatePlanetPositions() {
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      planetPositions.current.forEach((pos, i) => {
        const angle = t * orbitSpeeds.current[i] + phaseOffsets.current[i];
        const radius = orbitRadii.current[i];
        pos.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      });
    });
    return null;
  }

  function formatTokens(tokens: string, denom: string) {
    const denomFactors: Record<string, number> = {
      aplanq: 1e18,
      uatom: 1e6,
      uosmo: 1e6,
      ujuno: 1e6,
      ustars: 1e6,
    };
    const factor = denomFactors[denom] ?? 1e6;
    const amount = parseFloat(tokens) / factor;
    return amount.toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' ' + denom.replace(/^u/, '').toUpperCase();
  }

  const currentChain = chains.find(c => c.key === selectedChainKey);

  // Kamera zoom out agar semua planet terlihat
  const initialCameraPosition = [0, maxOrbitRadius * 1.2, maxOrbitRadius * 1.5] as [number, number, number];

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'black', overflow: 'hidden', position: 'relative' }}>
      <div style={{
        width: 320,
        backgroundColor: 'rgba(20, 20, 20, 0.95)',
        color: 'white',
        fontFamily: 'monospace',
        padding: 20,
        overflowY: 'auto',
        userSelect: 'none',
      }}>
        <h2 style={{ marginBottom: 16 }}>Select Chain</h2>
        <select
          value={selectedChainKey}
          onChange={e => setSelectedChainKey(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            marginBottom: 20,
            backgroundColor: '#222',
            color: 'white',
            border: '1px solid #555',
            borderRadius: 4,
            fontFamily: 'monospace',
            cursor: 'pointer',
          }}
        >
          {chains.map(chain => (
            <option key={chain.key} value={chain.key}>
              {chain.name}
            </option>
          ))}
        </select>

        <h2 style={{ marginBottom: 16 }}>Validator Info</h2>
        {selectedValidator ? (
          <>
            <div><b>Moniker:</b> {shorten(selectedValidator.description.moniker, 10)}</div>
            <div><b>Address:</b> {shorten(selectedValidator.operator_address)}</div>
            <div><b>Tokens:</b> {formatTokens(selectedValidator.tokens, selectedValidator.denom)}</div>
          </>
        ) : (
          <div>Select a validator planet to see details</div>
        )}
        <hr style={{ margin: '20px 0', borderColor: '#444' }} />
        <div>
          {blockInfo ? (
            <>
              <div><b>Block Height:</b> {blockInfo.block_height}</div>
              <div><b>Proposer:</b> {blockInfo.proposer_moniker}</div>
              <div><b>Time:</b> {new Date(blockInfo.block_time).toLocaleTimeString()}</div>
            </>
          ) : (
            <div>Loading block info...</div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: initialCameraPosition, fov: 60 }} style={{ background: 'black', width: '100%', height: '100%' }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 50, 50]} />
          <Stars radius={200} depth={50} count={5000} factor={4} fade />

          <mesh position={projectPos}>
            <sphereGeometry args={[15, 64, 64]} />
            <meshStandardMaterial color={'#ffcc33'} emissive={'#ffaa00'} metalness={10} roughness={1} />
          </mesh>

          <Html position={projectPos} center>
            <div className="text-yellow-400 font-bold text-lg pointer-events-none select-none">
              {currentChain?.name}
            </div>
          </Html>

          {selectedChainKey !== null ? (
            validators.map((validator, i) => {
              const power = parseFloat(validator.tokens) / 1e18;
              const size = sizes.current[i];
              const color = {
                color: `hsl(${(i * 137.5) % 360}, 80%, 60%)`,
                emissive: `hsl(${(i * 137.5) % 360}, 100%, 40%)`,
              };
              const pos = planetPositions.current[i];

              return (
                <ValidatorPlanet
                  key={validator.operator_address}
                  orbitRadius={orbitRadii.current[i]}
                  orbitSpeed={orbitSpeeds.current[i]}
                  size={size}
                  name={validator.description.moniker}
                  power={power}
                  color={color}
                  phaseOffset={phaseOffsets.current[i]}
                  active={selectedValidator?.operator_address === validator.operator_address}
                  onClick={() => setSelectedValidator(validator)}
                  position={pos}
                />
              );
            })
          ) : (
            <Html position={projectPos} center>
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', pointerEvents: 'none', userSelect: 'none' }}>
                {currentChain?.name}
              </div>
            </Html>
          )}
 
          {activeConnectionIndex !== null && planetPositions.current[activeConnectionIndex] && selectedChainKey !== null && (
            <AnimatedConnectionLine
              key={'line-' + activeConnectionIndex}
              startFunc={() => planetPositions.current[activeConnectionIndex].clone()}
              end={projectPos}
              color="limegreen"
            />
          )}

          <UpdatePlanetPositions />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
