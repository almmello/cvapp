import ResumeHeader from '@/components/ResumeHeader'
import ResumeFooter from '@/components/ResumeFooter'

export default function Cases() {
  return (
    <article className="min-h-screen bg-cool-2 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none">

        <ResumeHeader />

        <div className="p-6 md:p-10">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-navy pb-3 mb-6 border-b border-navy/20">Cases</h2>

            <div className="relative w-full aspect-video mb-6 bg-gray-100 rounded-lg overflow-hidden">
              <video className="w-full h-full" controls>
                <source src="/rga/TIM-blah-EN.mp4" type="video/mp4" />
                TIM Blah Project
              </video>
            </div>

            <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video className="w-full h-full" controls>
                <source src="/rga/TIM-blah-Surfing-Bird-EN.mp4" type="video/mp4" />
                TIM Blah Surfing Bird
              </video>
            </div>

          </section>
        </div>

      </div>

      <ResumeFooter />
    </article>
  )
}
