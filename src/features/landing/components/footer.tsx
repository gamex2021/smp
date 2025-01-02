import Link from 'next/link'

const footerData = {
  footerLinks: [
    {
      title: "Company",
      links: [
        {
          title: "About",
          href: "/about"
        },
        {
          title: "Services",
          href: "/services"
        },
        {
          title: "Testimonials",
          href: "/testimonials"
        },
      ]
    },
    {
      title: "Support",
      links: [
        {
          title: "Help center",
          href: "/help-center"
        },
        {
          title: "Feedback",
          href: "/feedback"
        },
        {
          title: "Create ticket",
          href: "/create-ticket"
        },
      ]
    }

  ],
  socials: [
    {
      title: 'X',
      href: "#"
    },
    {
      title: 'LinkedIn',
      href: "#"
    }, {
      title: 'Threads',
      href: "#"
    }, {
      title: 'Instagram',
      href: "#"
    },
  ],
  phone: '+234 000 000 0000',
  email: 'tsx@techseriesx.com'
}

export function Footer({ withBanner = true }: { withBanner?: boolean }) {
  return <div className="w-full flex flex-col justify-center">
    {withBanner && <Banner />}
    <div className=" max-w-7xl mx-auto ">

      <div className='grid grid-cols-1 md:grid-cols-2 px-2 place-content-center content-center gap-4 lg:grid-cols-3 min-h-[12rem]'>
        <div className='space-y-4'>
          <p className='text-xl font-bold tracking-tight'>TechSeriesX</p>
          <span className='text-sm'>a platform for school management by connecting admins, teachers, and students with tools for communication</span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {
            footerData.footerLinks.map((item, index) => <div className='space-y-3' key={`footer-item-${index}`}>
              <span className="font-semibold">{item.title}</span>
              <ul className='space-y-1 text-sm'>
                {item.links.map((link, index) => <li key={`footer-item-link-${index}`}><Link href={link.href}>{link.title}</Link></li>)}
              </ul>
            </div>)
          }
        </div>
        <div className='space-y-3'>
          <p className="font-semibold">Contact us</p>
          <ul className='space-y-1 text-sm'>
            <li><span className="font-medium">Phone: </span> {footerData.phone}</li>
            <li><span className="font-medium">Email: </span> {footerData.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 px-2 w-full text-center">
        <span className="text-xs ">&copy; {new Date().getFullYear()} TSX. All Rights Reserved</span>
      </div>
    </div>
  </div>
}

function Banner() {
  return <div className='bg-[#11321F] min-h-[calc(70vh-30rem)] py-12 px-3 w-full flex items-center justify-center flex-col'>
    <div className="max-w-6xl mx-auto text-white text-center space-y-4">
      <p className="capitalize text-3xl font-semibold leading-loose">Ready to take control?</p>
      <p className="text-sm max-w-[500px]">Manage your school with ease and confidence—simplify operations, stay connected, and keep everything running smoothly, all in one platform.</p>
      <div className="pt-8">
        <Link href="#" className="py-3 px-4 bg-[#F8FBFA33] rounded border border-[#F8FBFA66] text-lg font-medium">Join us</Link>
      </div>
    </div>
  </div>
}
