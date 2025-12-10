import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/', label: ' Dashboard' },
  { href: '/admin/pricing', label: ' Wyceny' },
  { href: '/admin/customers', label: ' Klienci' },
  { href: '/admin/services', label: ' Usługi' },
  { href: '/admin/reports', label: ' Raporty' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d1520]/90 backdrop-blur-lg border-r border-blue-500/20 shadow-lg flex flex-col p-4 text-gray-200">
      <div className="flex items-center mb-8">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Subaru_logo_2022.svg"
          alt="Subaru"
          className="h-10 w-auto mr-2 drop-shadow-[0_0_10px_rgba(0,180,255,0.5)]"
        />
        <h2 className="text-lg font-bold tracking-wide">Subaru Admin</h2>
      </div>

            <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <span
              className={`block px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                router.pathname === link.href
                  ? 'bg-[var(--subaru-neon-blue)] text-black font-semibold shadow-[0_0_15px_rgba(0,180,255,0.5)]'
                  : 'hover:bg-blue-900/50 hover:text-white'
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </nav>


      <div className="mt-auto text-xs text-gray-500 text-center border-t border-gray-700/50 pt-4">
        Subaru Dealer Tool  2025
      </div>
    </aside>
  );
}

