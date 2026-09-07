import React, { useMemo } from 'react'
import './Watch.css'

function Dial() {
  const ticks = useMemo(() => {
    const out = []
    for (let i = 0; i < 60; i++) {
      const hour = i % 5 === 0
      out.push(
        <line
          key={i}
          x1="200" y1="9" x2="200" y2={hour ? 17 : 13.5}
          transform={`rotate(${i * 6} 200 200)`}
          stroke={hour ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.11)'}
          strokeWidth={hour ? 1.4 : 1}
          strokeLinecap="round"
        />,
      )
    }
    return out
  }, [])

  const numerals = useMemo(() => {
    const out = []
    for (let n = 1; n <= 12; n++) {
      const a = ((n * 30 - 90) * Math.PI) / 180
      out.push(
        <text
          key={n}
          x={200 + Math.cos(a) * 170}
          y={200 + Math.sin(a) * 170}
          textAnchor="middle" dominantBaseline="central"
          fill="rgba(255,255,255,0.2)" fontSize="10.5" fontWeight="500"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {n}
        </text>,
      )
    }
    return out
  }, [])

  return (
    <svg className="watch__dial" viewBox="0 0 400 400" aria-hidden="true">
      {ticks}
      {numerals}
      <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.075)" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="128" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
    </svg>
  )
}

function Trail({ colors, diameter, angleVar }: { colors: { base: string, hot: string, deep: string }, diameter: number, angleVar: string }) {
  const style = {
    '--c': colors.base,
    '--c-hot': colors.hot,
    '--c-deep': colors.deep,
    '--d': `${diameter}%`,
    '--angle': angleVar,
  } as React.CSSProperties

  return (
    <div style={style} aria-hidden="true">
      <div className="trail trail--glow" />
      <div className="trail trail--mid" />
      <div className="trail trail--core" />
      <div className="trail-bloom" />
    </div>
  )
}

export interface WatchProps {
  mark?: string;
  size?: number | string;
  className?: string;
}

export function Watch({ mark = 'A', size = 560, className = '' }: WatchProps) {
  const time = useMemo(() => {
    const now = new Date()
    const s = now.getSeconds() + now.getMilliseconds() / 1000
    const m = now.getMinutes() + s / 60
    const h = (now.getHours() % 12) + m / 60
    return { h: h * 30, m: m * 6, s: s * 6 }
  }, [])

  const style = {
    '--size': typeof size === 'number' ? `${size}px` : size,
    '--hour-base': `${time.h}deg`,
    '--minute-base': `${time.m}deg`,
    '--second-base': `${time.s}deg`,
  } as React.CSSProperties

  return (
    <div className={`watch-tilt ${className}`} style={style}>
      <div className="watch">
        <div className="watch__aura" aria-hidden="true" />
        <div className="strap strap--top" aria-hidden="true" />
        <div className="strap strap--bottom" aria-hidden="true" />
        
        <div className="watch__crown" aria-hidden="true" />
        <div className="watch__case" aria-hidden="true" />

      <div className="watch__face">
        <div className="watch__dots" />
        <Dial />

        <div className="watch__mark" aria-hidden="true">
          <span className="mark mark--shadow">{mark}</span>
          <span className="mark mark--light">{mark}</span>
          <span className="mark">{mark}</span>
          <span className="mark mark--edge">{mark}</span>
        </div>

        <Trail 
          colors={{ base: '#e9eefc', hot: '#ffffff', deep: '#8d97b8' }} 
          diameter={72} 
          angleVar="var(--minute-angle)" 
        />
        <Trail 
          colors={{ base: '#ffc93c', hot: '#fff6d0', deep: '#ff9a00' }} 
          diameter={88} 
          angleVar="var(--second-angle)" 
        />

        <div className="hand hand--hour" aria-hidden="true" />
        <div className="hand hand--minute" aria-hidden="true" />
        <div className="hand hand--second" aria-hidden="true" />
        <div className="watch__pin" aria-hidden="true" />
        <div className="watch__glass" aria-hidden="true" />
      </div>
      </div>
    </div>
  )
}

export default Watch;
