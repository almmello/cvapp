import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'

function SkillBadge({ label }: { label: string }) {
  return (
    <li className="list-none">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-interactive/10 text-interactive border border-interactive/30">
        {label}
      </span>
    </li>
  )
}

export default function ProductManager() {
  return (
    <article className="pl-8 pb-8 relative">
      <span className="absolute left-0 top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-navy ring-2 ring-white border border-navy/30" />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-navy mb-0.5">Product Manager</h3>
          <div className="text-sm text-gray-400">2014 – Present</div>
        </div>
        <div className="sm:text-right mt-1 sm:mt-0">
          <div className="text-sm font-semibold text-navy-dark">TIM S/A</div>
          <div className="text-sm text-gray-400">Rio de Janeiro</div>
        </div>
      </div>

      <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-2 mb-4 leading-relaxed">
        <li>I currently manage the Private Network portfolio, with up to 50 million USD commercial proposals in various industries, including Mining, Ports, Utilities, Smart Lighting, and Connected Cars.</li>
        <li>I have also successfully launched the Blah app, which achieved over 9 million views and 3 million downloads; it was named App of the Week on the Apple Store and was twice the most downloaded app on Google Play. In addition, I have managed a team of testers assembling 1,000 scenarios of the device&apos;s testing operation, and based on user feedback, we fixed nearly 3,000 issues.</li>
      </ul>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Skills:</h4>
      <ul className="flex flex-wrap gap-1.5 mb-4">
        <SkillBadge label="Product Management" />
        <SkillBadge label="Product Strategy" />
        <SkillBadge label="Product Development" />
        <SkillBadge label="MVP" />
        <SkillBadge label="Agile Methodologies" />
        <SkillBadge label="New Business Development" />
      </ul>

      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2 print:hidden">Links:</h4>
      <ul className="space-y-1.5 print:hidden">
        <li>
          <a
            className="text-interactive hover:text-interactive-light underline decoration-interactive/40 hover:decoration-interactive transition-colors text-sm inline-flex items-center gap-1.5 print:no-underline print:text-navy"
            href="/rga/TIM-blah-Surfing-Bird-EN.mp4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFilm} className="w-3.5 h-3.5 shrink-0 print:hidden" />
            TIM Blah — Surfing Bird (EN)
          </a>
        </li>
        <li>
          <a
            className="text-interactive hover:text-interactive-light underline decoration-interactive/40 hover:decoration-interactive transition-colors text-sm inline-flex items-center gap-1.5 print:no-underline print:text-navy"
            href="/rga/TIM-blah-EN.mp4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFilm} className="w-3.5 h-3.5 shrink-0 print:hidden" />
            TIM Blah (EN)
          </a>
        </li>
      </ul>
    </article>
  )
}
