import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return <section id="landing-hero" className="w-full  bg-[#DEEDE5] py-10 px-4 lg:px-10">
    <div className="max-w-6xl mx-auto grid grid-cols-1 place-content-center min-h-[calc(100vh-30rem)] lg:grid-cols-2 lg:gap-12 gap-8">
      <div className="flex flex-col justify-center gap-3 items-center lg:items-start text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl leading-tight tracking-tight font-semibold capitalize">Your school, your way: Take control today</h1>
        <p className='w-full max-w-[450px] lg:max-w-[550px]'>From seamless class management to real-time updates for admins, teachers, and students—stay connected, organized, and always in control.</p>
        <div className="flex items-center gap-4 justify-center lg:justify-start">
          <Link href='/register' className="py-2 px-4 font-medium text-white bg-[#2E8B57] rounded-md">Get started</Link>
          <Link href='#' className="py-2 px-4 font-medium border border-[#2E8B57] rounded-md">See features</Link>
        </div>
      </div>
      <div>
        <Image
          src="/images/boy-smiling.jpg"
          width={900}
          height={900}
          alt="hero-image"
          className="w-full aspect-square object-right rounded-md object-cover"
        />
      </div>
    </div>
  </section>
}
