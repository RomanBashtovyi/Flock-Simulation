# Flock Simulation (React Three Fiber)

Interactive flocking (boids) simulation rendered with React Three Fiber, Drei and postprocessing. Features animated koi fish models, configurable flocking rules, and cinematic post effects (Bloom, DOF, GodRays) tuned for performance.

## Features

- Boids flocking rules: wander, alignment, avoidance, cohesion
- Animated GLTF koi models with shadow casting
- Post-processing: Bloom, Depth of Field, God Rays (configurable)
- Adaptive performance tuning (DPR clamp, reduced shadows, fixed-step physics)
- Theme switcher (Underwater, Space)
- Live tweaking via Leva control panel

## Tech Stack

- React + Vite
- @react-three/fiber, @react-three/drei
- @react-three/postprocessing
- jotai, leva, tailwindcss

## Getting Started

1. Install dependencies

```bash
npm install
# or
yarn
```

2. Run dev server

```bash
npm run dev
# or
yarn dev
```

3. Build for production

```bash
npm run build
npm run preview
# or
yarn build && yarn preview
```

## Project Structure

- `src/App.jsx`: Canvas setup (DPR clamp, fog, loader, UI)
- `src/components/Experience.jsx`: scene, lighting, postprocessing, text
- `src/components/Boids.jsx`: flocking simulation, models, animations
- `src/components/UI.jsx`: theme switching, preloading
- `public/models`: GLB models for koi
- `public/fonts`: 3D font JSON

## Controls

- OrbitControls: mouse/touch to rotate, pan, zoom
- Leva (panel): adjust boundaries, flocking and effect parameters in real-time
- UI buttons: switch themes

## Key Parameters (Leva)

- General settings
  - `NB_BOIDS` (count)
  - `MIN_SCALE` / `MAX_SCALE`
  - `MIN_SPEED` / `MAX_SPEED`
  - `MAX_STEERING`
- Boid Rules: enable/disable `ALIGNEMENT`, `AVOIDANCE`, `COHESION`, 3D movement
- Radii/Strength per rule: ALIGN/AVOID/COHESION
- Wander: radius/strength
- Depth of Field: `focusRange`, `focusDistance`, `focalLength`, `bokehScale`

## Assets & Credits

- Models: `public/models/*.glb` (koi variants)
- Font: `public/fonts/Poppins Black_Regular.json`

## License

This project is for learning/demo purposes. Review asset licenses before reuse.
