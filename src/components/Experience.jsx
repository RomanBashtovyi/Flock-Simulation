import {
  Environment,
  OrbitControls,
  SoftShadows,
} from '@react-three/drei'
import { useControls } from 'leva'
import { useState, useEffect } from 'react'
import { DoubleSide } from 'three'

import { useAtom } from 'jotai'
import { Boids } from './Boids'
import { themeAtom, THEMES } from './UI'

export const Experience = () => {
  const [theme] = useAtom(themeAtom)

  const boudaries = useControls(
    'Boudaries',
    {
      debug: true,
      x: { value: 12, min: 0, max: 40 },
      y: { value: 8, min: 0, max: 40 },
      z: { value: 20, min: 0, max: 40 },
    },
    {
      collapsed: true,
    }
  )

  const [size, setSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ])
  const scaleX = Math.max(0.5, size[0] / 1920)
  const scaleY = Math.max(0.5, size[1] / 1080)

  const responsiveBoudaries = {
    x: boudaries.x * scaleX,
    y: boudaries.y * scaleY,
    z: boudaries.z,
  }

  useEffect(() => {
    let timeout
    function updateSize() {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setSize([window.innerWidth, window.innerHeight])
      }, 50)
    }
    window.addEventListener('resize', updateSize)
    return () =>
      window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <>
      <OrbitControls />

      <Boids boudaries={responsiveBoudaries} />
      <mesh visible={boudaries.debug}>
        <boxGeometry
          args={[
            responsiveBoudaries.x,
            responsiveBoudaries.y,
            responsiveBoudaries.z,
          ]}
        />
        <meshStandardMaterial
          color="orange"
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>

      {/* LIGHTS */}
      <SoftShadows size={15} focus={1.5} samples={12} />
      <Environment preset="sunset"></Environment>
      <directionalLight
        position={[15, 15, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-far={300}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
      />
      <hemisphereLight
        intensity={1.35}
        color={THEMES[theme].skyColor}
        groundColor={THEMES[theme].groundColor}
      />
    </>
  )
}
