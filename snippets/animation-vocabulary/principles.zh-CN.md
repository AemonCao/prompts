# 动效原则

用于判断什么时候应该使用动画，以及动画应该呈现怎样的节奏和感受。

- **Purposeful animation（有目的的动画）**：动画应服务于定位、反馈、关系表达或理解，而不只是装饰。
- **Anticipation（预备动作）**：正式动作发生前先出现一个小的反向或准备动作，提示即将发生的变化。
- **Follow-through（跟随动作）**：主体动作结束后，部分元素继续轻微运动并逐渐稳定，让动画更有重量。
- **Squash & stretch（挤压与拉伸）**：通过形状变形表达重量、速度和弹性。
- **Perceived performance（感知性能）**：恰当的动效能让界面感觉更快、更灵敏。
- **Frequency of use（使用频率）**：用户越常看到的动画，越应该短、轻、克制。
- **Spatial consistency（空间一致性）**：动画要帮助用户追踪元素在状态之间的位置和身份变化。
- **Hardware acceleration（硬件加速）**：优先动画化 `transform` 和 `opacity`，让 GPU 更容易保持流畅。
- **Reduced motion（减少动态效果）**：尊重用户的 `prefers-reduced-motion` 设置，为需要的人降低或移除动效。

