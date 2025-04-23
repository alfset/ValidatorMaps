import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber';

const textureFilenames = [
  '2k_ceres_fictional.jpg',
  '2k_earth_clouds.jpg',
  '2k_earth_daymap.jpg',
  '2k_earth_nightmap.jpg',
  '2k_eris_fictional.jpg',
  '2k_haumea_fictional.jpg',
  '2k_jupiter.jpg',
  '2k_makemake_fictional.jpg',
  '2k_mars.jpg',
  '2k_mercury.jpg',
  '2k_moon.jpg',
  '2k_neptune.jpg',
  '2k_sun.jpg',
  '2k_uranus.jpg',
  '2k_venus_atmosphere.jpg',
  '2k_venus_surface.jpg'
];

export const texturePaths = textureFilenames.map((name) => `../textures/${name}`);

export function usePlanetTextures() {
  const textures = useLoader(TextureLoader, texturePaths);
  return textures;
}
