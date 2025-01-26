import Link from "next/link";

const HEADER = {
  links: [
    { title: "About", href: "/about" },
    { title: "Pricing", href: "/pricing" },
    { title: "Clients", href: "/clients" },
    { title: "Contact us", href: "/contact" },
  ],
};

export function Header() {
  return (
    <header className="h-12 w-full bg-[#DEEDE5]">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-2 content-center md:grid-cols-3">
        <p className="text-xl font-bold tracking-tight">TSX</p>
        <div className="flex items-center justify-between gap-3">
          {HEADER.links.map((item, index) => (
            <Link
              key={`header-link-${index}`}
              href={item.href}
              className="px-3 py-1 text-sm font-semibold tracking-tight hover:rounded-full hover:bg-[#F8FBFA66] hover:drop-shadow-md"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-end text-white">
          <Link
            href="/register"
            className="w-fit rounded bg-[#11321F] px-3 py-2 text-sm font-medium"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
