import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

export default function Awards() {
  return (
    <ul className="space-y-4">
      <li className="flex gap-3">
        <FontAwesomeIcon icon={faTrophy} className="w-4 h-4 text-interactive shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-navy">Global Telecoms Business Innovation</div>
          <div className="text-xs text-gray-500">2015 Awards for the blah app</div>
        </div>
      </li>
      <li className="flex gap-3">
        <FontAwesomeIcon icon={faTrophy} className="w-4 h-4 text-interactive shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-navy">Tela Viva Móvel</div>
          <div className="text-xs text-gray-500">2015 Awards for the blah app</div>
        </div>
      </li>
    </ul>
  )
}
