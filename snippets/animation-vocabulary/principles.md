# Principles

Use these concepts to decide when animation is helpful and how it should feel.

- **Purposeful animation**: Motion should support orientation, feedback, relationships, or comprehension instead of serving as decoration alone.
- **Anticipation**: A small preparatory motion hints at what is about to happen.
- **Follow-through**: Parts of an element continue moving briefly after the main motion, adding weight.
- **Squash & stretch**: Shape deformation communicates weight, speed, and flexibility.
- **Perceived performance**: Well-timed motion can make an interface feel faster or more responsive.
- **Frequency of use**: The more often an animation appears, the shorter and subtler it should be.
- **Spatial consistency**: Motion preserves object identity and location across states so users can track what changed.
- **Hardware acceleration**: Animating `transform` and `opacity` helps the GPU keep motion smooth.
- **Reduced motion**: Respect `prefers-reduced-motion` by toning down or removing motion for users who request it.

