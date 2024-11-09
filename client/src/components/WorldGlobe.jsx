import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import styled from "styled-components";

const GlobeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WorldGlobe = () => {
  const globeEl = useRef();

  useEffect(() => {
    const globe = globeEl.current;

    // Increase the autoRotateSpeed for faster rotation (2x faster)
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 1.5; // Increased from 0.75 to 1.5

    const CLOUDS_IMG_URL =
      "https://raw.githubusercontent.com/turban/webgl-earth/master/examples/earth-clouds.png";
    const CLOUDS_ALT = 0.004;

    // Increase the CLOUDS_ROTATION_SPEED for faster cloud rotation (2x faster)
    const CLOUDS_ROTATION_SPEED = -0.024; // Increased from -0.012 to -0.024

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(
          globe.getGlobeRadius() * (1 + CLOUDS_ALT),
          75,
          75
        ),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      globe.scene().add(clouds);

      const rotateClouds = () => {
        clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
        requestAnimationFrame(rotateClouds);
      };
      rotateClouds();
    });
  }, []);

  return (
    <GlobeContainer>
      <Globe
        ref={globeEl}
        animateIn={false}
        height={250}
        width={250}
        backgroundColor="rgba(0,0,0,0)" // Transparent background
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        // bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        // backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      />
    </GlobeContainer>
  );
};

export default WorldGlobe;