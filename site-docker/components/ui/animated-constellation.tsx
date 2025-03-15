// "use client"

// import { useEffect, useRef, type ReactNode } from "react"

// interface Particle {
//   x: number
//   y: number
//   vx: number
//   vy: number
//   radius: number
//   baseRadius: number
//   sizeOffset: number
//   sizeSpeed: number
//   color: string
// }

// interface AnimatedConstellationProps {
//   children?: ReactNode
// }

// export function AnimatedConstellation({ children }: AnimatedConstellationProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const particlesRef = useRef<Particle[]>([])
//   const animationFrameRef = useRef<number>(0)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // キャンバスをウィンドウサイズに設定
//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth
//       canvas.height = window.innerHeight
//       initParticles()
//     }

//     // パーティクルの初期化
//     const initParticles = () => {
//       const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
//       const particles: Particle[] = []
//       const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#FF6D01", "#46BDC6"]

//       for (let i = 0; i < particleCount; i++) {
//         const baseRadius = Math.random() * 2 + 1
//         particles.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           vx: Math.random() * 0.6 - 0.3,
//           vy: Math.random() * 0.6 - 0.3,
//           radius: baseRadius,
//           baseRadius: baseRadius,
//           sizeOffset: 0,
//           sizeSpeed: 0.01 + Math.random() * 0.03,
//           color: colors[Math.floor(Math.random() * colors.length)],
//         })
//       }

//       particlesRef.current = particles
//     }

//     // アニメーションの描画
//     const draw = () => {
//       if (!canvas || !ctx) return

//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       // 背景
//       ctx.fillStyle = "rgba(255, 255, 255, 1)"
//       ctx.fillRect(0, 0, canvas.width, canvas.height)

//       const particles = particlesRef.current

//       // パーティクルの更新と描画
//       particles.forEach((particle) => {
//         // 位置の更新
//         particle.x += particle.vx
//         particle.y += particle.vy

//         // サイズのアニメーション
//         particle.sizeOffset += particle.sizeSpeed
//         particle.radius = particle.baseRadius + Math.sin(particle.sizeOffset) * (particle.baseRadius * 0.5)

//         // 画面外に出たら反対側から再登場
//         if (particle.x < 0) particle.x = canvas.width
//         if (particle.x > canvas.width) particle.x = 0
//         if (particle.y < 0) particle.y = canvas.height
//         if (particle.y > canvas.height) particle.y = 0

//         // パーティクルの描画
//         ctx.beginPath()
//         ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
//         ctx.fillStyle = particle.color
//         ctx.fill()
//       })

//       // 近くのパーティクル同士を線で結ぶ
//       const connectionDistance = canvas.width * 0.08

//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const dx = particles[i].x - particles[j].x
//           const dy = particles[i].y - particles[j].y
//           const distance = Math.sqrt(dx * dx + dy * dy)

//           if (distance < connectionDistance) {
//             // 距離に応じて透明度を変える
//             const opacity = 1 - distance / connectionDistance
//             ctx.beginPath()
//             ctx.moveTo(particles[i].x, particles[i].y)
//             ctx.lineTo(particles[j].x, particles[j].y)
//             ctx.strokeStyle = `rgba(180, 180, 200, ${opacity * 0.8})`
//             ctx.lineWidth = 0.8
//             ctx.stroke()
//           }
//         }
//       }

//       animationFrameRef.current = requestAnimationFrame(draw)
//     }

//     // 初期化とアニメーション開始
//     resizeCanvas()
//     draw()

//     // リサイズイベントリスナー
//     window.addEventListener("resize", resizeCanvas)

//     // クリーンアップ
//     return () => {
//       window.removeEventListener("resize", resizeCanvas)
//       cancelAnimationFrame(animationFrameRef.current)
//     }
//   }, [])

//   return (
//     <div className="relative w-full h-full">
//       {/* アニメーション背景 */}
//       <div className="fixed inset-0 -z-10">
//         <canvas ref={canvasRef} className="block w-full h-full" aria-hidden="true" />
//       </div>

//       {/* 子要素 */}
//       {children && <div className="relative z-10">{children}</div>}
//     </div>
//   )
// }

"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  sizeOffset: number
  sizeSpeed: number
  color: string
}

interface AnimatedConstellationProps {
  children?: ReactNode
}

export function AnimatedConstellation({ children }: AnimatedConstellationProps) {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // キャンバスをウィンドウサイズに設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // パーティクルの初期化
    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      const particles: Particle[] = []

      // テーマに基づいて色を選択
      let colors: string[]
      if (theme === "dark") {
        // ダークテーマ用の明るい色
        colors = ["#61DAFB", "#FF6AC1", "#7CFFCB", "#FFF152", "#FF875C", "#9D8CFF"]
      } else {
        // ライトテーマ用の色
        colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#FF6D01", "#46BDC6"]
      }

      for (let i = 0; i < particleCount; i++) {
        const baseRadius = Math.random() * 2 + 1
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 0.6 - 0.3,
          vy: Math.random() * 0.6 - 0.3,
          radius: baseRadius,
          baseRadius: baseRadius,
          sizeOffset: 0,
          sizeSpeed: 0.01 + Math.random() * 0.03,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      particlesRef.current = particles
    }

    // アニメーションの描画
    const draw = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // テーマに基づいて背景色を設定
      ctx.fillStyle = theme === "dark" ? "rgb(0, 0, 0)" : "rgba(255, 255, 255, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const particles = particlesRef.current

      // パーティクルの更新と描画
      particles.forEach((particle) => {
        // 位置の更新
        particle.x += particle.vx
        particle.y += particle.vy

        // サイズのアニメーション
        particle.sizeOffset += particle.sizeSpeed
        particle.radius = particle.baseRadius + Math.sin(particle.sizeOffset) * (particle.baseRadius * 0.5)

        // 画面外に出たら反対側から再登場
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // パーティクルの描画
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // 近くのパーティクル同士を線で結ぶ
      const connectionDistance = canvas.width * 0.08

      // テーマに基づいて線の色を設定
      const lineBaseColor = theme === "dark" ? "220, 220, 255" : "180, 180, 200"
      const lineOpacityMultiplier = theme === "dark" ? 0.9 : 0.8

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            // 距離に応じて透明度を変える
            const opacity = 1 - distance / connectionDistance
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${lineBaseColor}, ${opacity * lineOpacityMultiplier})`
            ctx.lineWidth = theme === "dark" ? 1 : 0.8 // ダークテーマでは線を少し太く
            ctx.stroke()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    // 初期化とアニメーション開始
    resizeCanvas()
    draw()

    // リサイズイベントリスナー
    window.addEventListener("resize", resizeCanvas)

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [theme]) // テーマが変更されたら再実行

  return (
    <div className={`relative w-full ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div className="fixed inset-0 -z-10">
        <canvas ref={canvasRef} className="block w-full h-full" aria-hidden="true" />
      </div>
      <div className="relative z-5">
        {children}
      </div>
    </div>
  )
}

