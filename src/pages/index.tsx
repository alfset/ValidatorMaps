import dynamic from 'next/dynamic';

const GalaxyScene = dynamic(() => import('../components/GalaxyScene'), { ssr: false });

export default function Home() {
  return (
    <main className="h-screen w-screen bg-black">
      <GalaxyScene />
    </main>
  );
}
