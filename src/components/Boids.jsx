import { useAnimations, useGLTF } from '@react-three/drei'

import { useAtom } from 'jotai'
import { useEffect, useMemo, useRef } from 'react'
import { SkeletonUtils } from 'three-stdlib'
import { themeAtom, THEMES } from './UI'
import { useControls } from 'leva'
import {
  randFloat,
  randInt,
} from 'three/src/math/MathUtils.js'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

const limits = new Vector3()
const wander = new Vector3()
const steering = new Vector3()

export const Boids = ({ boudaries }) => {
  const [theme] = useAtom(themeAtom)

  const {
    NB_BOIDS,
    MIN_SCALE,
    MAX_SCALE,
    MIN_SPEED,
    MAX_SPEED,
    MAX_STEERING,
  } = useControls(
    'General settings',
    {
      NB_BOIDS: { value: 60, min: 1, max: 200 },
      MIN_SCALE: {
        value: 0.7,
        min: 0.1,
        max: 2,
        step: 0.1,
      },
      MAX_SCALE: {
        value: 1.3,
        min: 0.1,
        max: 2,
        step: 0.1,
      },
      MIN_SPEED: { value: 0.9, min: 0, max: 10, step: 0.1 },
      MAX_SPEED: { value: 3.6, min: 0, max: 10, step: 0.1 },
      MAX_STEERING: {
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
    {
      collapsed: true,
    }
  )

  const { threeD } = useControls(
    'Boid Rules',
    {
      threeD: { value: false },
    },
    {
      collapsed: true,
    }
  )

  const { WANDER_RADIUS, WANDER_STRENGTH, WANDER_CIRCLE } =
    useControls(
      'Wander',
      {
        WANDER_RADIUS: {
          value: 5,
          min: 1,
          max: 10,
          step: 1,
        },
        WANDER_STRENGTH: {
          value: 2,
          min: 0,
          max: 1,
          step: 1,
        },
        WANDER_CIRCLE: false,
      },
      {
        collapsed: true,
      }
    )

  const boids = useMemo(() => {
    return new Array(NB_BOIDS).fill(null).map((_, i) => ({
      model:
        THEMES[theme].models[
          randInt(0, THEMES[theme].models.length - 1)
        ],
      position: new Vector3(
        randFloat(-boudaries.x / 2, boudaries.x / 2),
        randFloat(-boudaries.y / 2, boudaries.y / 2),
        threeD
          ? randFloat(-boudaries.z / 2, boudaries.z / 2)
          : 0
      ),
      velocity: new Vector3(0, 0, 0),
      wander: randFloat(0, Math.PI * 2),
      scale: randFloat(MIN_SCALE, MAX_SCALE),
    }))
  }, [
    NB_BOIDS,
    boudaries,
    theme,
    MIN_SCALE,
    MAX_SCALE,
    threeD,
  ])

  useFrame((_, delta) => {
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i]

      //wander
      boid.wander += randFloat(-0.05, 0.05)

      wander.set(
        Math.cos(boid.wander) * WANDER_RADIUS,
        Math.sin(boid.wander) * WANDER_RADIUS,
        0
      )

      wander.normalize()
      wander.multiplyScalar(WANDER_STRENGTH)

      //reset forces
      limits.multiplyScalar(0)
      steering.multiplyScalar(0)

      //limits
      if (Math.abs(boid.position.x) + 1 > boudaries.x / 2) {
        limits.x = -boid.position.x
        boid.wander += Math.PI
      }
      if (Math.abs(boid.position.y) + 1 > boudaries.y / 2) {
        limits.y = -boid.position.y
        boid.wander += Math.PI
      }
      if (Math.abs(boid.position.z) + 1 > boudaries.z / 2) {
        limits.z = -boid.position.z
        boid.wander += Math.PI
      }
      limits.normalize()
      limits.multiplyScalar(50)

      //apply forces
      steering.add(limits)
      steering.add(wander)

      steering.clampLength(0, MAX_STEERING * delta)
      boid.velocity.add(steering)
      boid.velocity.clampLength(0, MAX_SPEED * delta)

      //apply velocity
      boid.position.add(boid.velocity)
    }
  })

  return boids.map((boid, index) => (
    <Boid
      key={index + boid.model}
      position={boid.position}
      model={boid.model}
      scale={boid.scale}
      velocity={boid.velocity}
      animation={'Fish_Armature|Swimming_Fast'}
      wanderCircle={WANDER_CIRCLE}
      wanderRadius={WANDER_RADIUS / boid.scale}
    />
  ))
}

const Boid = ({
  position,
  velocity,
  model,
  animation,
  wanderCircle,
  wanderRadius,
  ...props
}) => {
  const { scene, animations } = useGLTF(
    `/models/${model}.glb`
  )
  const clone = useMemo(
    () => SkeletonUtils.clone(scene),
    [scene]
  )
  const group = useRef()
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
      }
    })
  }, [])

  useEffect(() => {
    actions[animation]?.play()
    return () => {
      actions[animation]?.stop()
    }
  }, [animation])

  useFrame(() => {
    const target = group.current.clone(false)
    target.lookAt(
      group.current.position.clone().add(velocity)
    )
    group.current.quaternion.slerp(target.quaternion, 0.1)
    group.current.position.copy(position)
  })

  return (
    <group {...props} ref={group} position={position}>
      <primitive object={clone} rotation-y={Math.PI / 2} />
      <mesh visible={wanderCircle}>
        <sphereGeometry args={[wanderRadius, 32]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
    </group>
  )
}
