import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

// Mapping for flake textures (must be in /public/textures)
const flakeTextureMap = {
  Silver: "/textures/flakes_silver.png",
  Copper: "/textures/flakes_copper.png",
  Gold: "/textures/flakes_gold.png",
  Rust: "/textures/flakes_rust.png",
  Bronze: "/textures/flakes_bronze.png"
};

function FloorLayers({ config, nodes }) {
  // Memoize flake texture for performance
  const flakeMap = useMemo(() => {
    if (config.flakes === "Yes" && config.flakesType && flakeTextureMap[config.flakesType]) {
      const tex = new THREE.TextureLoader().load(flakeTextureMap[config.flakesType]);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(6, 6);
      return tex;
    }
    return null;
  }, [config.flakes, config.flakesType]);

  return (
    <group>
      {/* Base Layer */}
      <mesh geometry={nodes.Floor_Base.geometry} position={nodes.Floor_Base.position}>
        <meshPhysicalMaterial
          color={config.baseColor?.toLowerCase() || "grey"}
          metalness={0}
          roughness={0.78}
        />
      </mesh>
      {/* Top Layer */}
      <mesh geometry={nodes.Floor_Top.geometry} position={nodes.Floor_Top.position}>
        <meshPhysicalMaterial
          color={config.topColor?.toLowerCase() || "white"}
          metalness={0.02}
          roughness={0.52}
          transparent
          opacity={0.93}
        />
      </mesh>
      {/* Flakes Layer */}
      <mesh geometry={nodes.Floor_Flakes.geometry} position={nodes.Floor_Flakes.position} visible={config.flakes === "Yes"}>
        <meshPhysicalMaterial
          color="white"
          metalness={0.85}
          roughness={0.33}
          map={flakeMap}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Clear Coat Layer */}
      <mesh geometry={nodes.Floor_Coat.geometry} position={nodes.Floor_Coat.position} visible={config.clearCoat === "Yes"}>
        <meshPhysicalMaterial
          color="white"
          roughness={0.07}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function RoomScene({ config = {} }) {
  const { scene, nodes } = useGLTF("/models/room.glb");

  return (
    <div style={{ height: 400, width: '100%', maxWidth: 500, margin: "1.3em auto" }}>
      <Canvas camera={{ position: [7, 7, 13], fov: 44 }}>
        <Suspense fallback={<Html center>Loading 3D Room…</Html>}>
          {/* Lighting */}
          <ambientLight intensity={0.95} />
          <directionalLight position={[10, 12, 8]} intensity={0.8} />
          <Environment preset="apartment" background={false} />
          {/* Static room objects */}
          <primitive object={scene} />
          {/* Dynamic epoxy floor layers */}
          <FloorLayers config={config} nodes={nodes} />
          <OrbitControls maxPolarAngle={Math.PI / 2.02} enablePan={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
