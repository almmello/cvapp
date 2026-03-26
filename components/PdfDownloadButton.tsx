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
      // Volta ao estado normal após 3s para o usuário poder tentar novamente
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={state === 'loading'}
      className="text-left flex items-center gap-3 font-semibold transition-colors duration-150 disabled:cursor-wait
        text-mint hover:text-mint/80 data-[state=error]:text-red-400"
      data-state={state}
      aria-label="Download CV as PDF"
    >
      <span className="w-8 h-8 bg-mint/20 rounded flex items-center justify-center shrink-0">
        {state === 'loading' ? (
          <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" />
        )}
      </span>
      {state === 'idle'    && 'Download PDF Version'}
      {state === 'loading' && 'Generating PDF…'}
      {state === 'error'   && 'Error — try again'}
    </button>
  )
}
