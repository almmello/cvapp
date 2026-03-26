'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons'

type State = 'idle' | 'loading' | 'error'

export default function PdfDownloadButton() {
  const [state, setState] = useState<State>('idle')

  async function handleDownload() {
    setState('loading')
    try {
      const res = await fetch('/api/pdf')
      if (!res.ok) throw new Error('PDF generation failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'almmello-cv.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setState('idle')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  const colorClass = state === 'error'
    ? 'text-red-400 decoration-red-400/50'
    : 'text-mint decoration-mint/50 hover:text-mint/80'

  return (
    <button
      onClick={handleDownload}
      disabled={state === 'loading'}
      className={`flex items-center gap-2 underline font-semibold transition-colors duration-150 disabled:cursor-wait text-sm ${colorClass}`}
      aria-label="Download CV as PDF"
    >
      <span className="w-5 h-5 bg-black/30 flex items-center justify-center shrink-0">
        {state === 'loading' ? (
          <FontAwesomeIcon icon={faSpinner} className="w-2.5 h-2.5 animate-spin" />
        ) : (
          <FontAwesomeIcon icon={faDownload} className="w-2.5 h-2.5" />
        )}
      </span>
      {state === 'idle'    && 'Download PDF Version'}
      {state === 'loading' && 'Generating PDF…'}
      {state === 'error'   && 'Error — try again'}
    </button>
  )
}
