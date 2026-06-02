# Easing & Springs

Use these terms to describe how animation speed changes over time and how physics-based motion behaves.

## Easing

- **Easing**: The rate curve that controls how an animation speeds up or slows down.
- **Ease-out**: Starts quickly and slows near the end; useful for responsive UI feedback.
- **Ease-in**: Starts slowly and accelerates; use carefully because it can feel delayed.
- **Ease-in-out**: Starts slow, speeds up, and slows down again; useful for moving elements already on screen.
- **Linear**: Moves at a constant speed; better for spinners, loaders, and marquees than ordinary UI motion.
- **Cubic-bezier**: A custom easing curve used for more precise motion control.
- **Asymmetric easing**: An easing curve with different acceleration and deceleration behavior.

## Springs

- **Spring**: Physics-based motion driven by tension, mass, and damping rather than a fixed duration.
- **Stiffness / Tension**: How strongly a spring pulls toward its target; higher values feel snappier.
- **Damping**: How quickly the spring settles; lower damping creates more overshoot and bounce.
- **Mass**: How heavy the animated object feels; more mass usually makes motion slower.
- **Bounce**: A spring behavior that overshoots the target and settles back.
- **Perceptual duration**: How long the motion feels like it takes to finish, even if micro-motion continues.
- **Momentum**: Carried movement based on existing velocity, especially after a drag or interruption.
- **Velocity**: The speed and direction of an element at a moment in time.
- **Interruptible animation**: Motion that can be redirected smoothly before it finishes.

