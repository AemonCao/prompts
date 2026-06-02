# Looping, Polish & Performance

Use these terms to describe ambient motion, small visual effects, and performance concerns.

## Looping & Ambient Motion

- **Marquee**: Text or content scrolls continuously in a loop.
- **Loop**: An animation repeats a set number of times or indefinitely.
- **Alternate / Yoyo**: A loop plays forward and then reverses instead of jumping back to the start.
- **Orbit**: An element circles around another element or point.
- **Pulse**: A gentle repeating change in scale or opacity.
- **Float**: A soft continuous up-and-down drift.
- **Idle animation**: Subtle motion that plays while an element waits for interaction.

## Polish & Effects

- **Blur**: A filter that softens an element or hides small visual imperfections.
- **Clip-path**: A clipping shape used for reveals, masks, and comparison effects.
- **Mask**: A shape or gradient that hides or reveals parts of an element, often with softer edges than `clip-path`.
- **Before / after slider**: A draggable divider that reveals one of two overlaid images for comparison.
- **Line drawing**: An SVG path appears to draw itself over time.
- **Text morph**: Text changes with animated characters or shapes.
- **Skeleton / Shimmer**: A placeholder loading state with a moving sheen.
- **Number ticker**: Digits roll or count toward a new value.
- **Tabular numbers**: Fixed-width digits that prevent counters and timers from shifting.
- **Typewriter**: Text appears one character at a time.

## Performance

- **Frame rate / FPS**: The number of frames drawn per second; `60fps` is a common smoothness baseline.
- **Jank**: Visible stutter caused by missed frames.
- **Dropped frame**: A frame that missed its rendering deadline.
- **Compositing**: Moving or fading an element on a GPU layer without recalculating layout or paint.
- **will-change**: A CSS hint that prepares the browser for an upcoming animation.
- **Layout thrashing**: Repeated layout recalculation caused by animating layout-affecting properties such as `width`, `height`, `top`, or `left`.

