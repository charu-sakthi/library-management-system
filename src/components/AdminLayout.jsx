import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

export default function AdminLayout({
  breadcrumbs = [],
  showAddButton = true,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] shrink-0"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-slate-500 min-w-0 truncate"
            >
              <Link
                to="/dashboard"
                className="font-medium text-slate-500 hover:text-[#172554] transition-colors whitespace-nowrap"
              >
                Libra
              </Link>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span
                    key={crumb.label}
                    className="flex items-center gap-2 min-w-0"
                  >
                    <span aria-hidden="true" className="text-slate-300">
                      /
                    </span>
                    {crumb.to && !isLast ? (
                      <Link
                        to={crumb.to}
                        className="hover:text-[#172554] transition-colors truncate"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={`truncate ${
                          isLast ? 'font-semibold text-[#172554]' : ''
                        }`}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </span>
                );
              })}
            </nav>
          </div>

          {showAddButton && (
            <div className="shrink-0">
              <Link
                to="/books/add"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#172554] hover:bg-[#1e316b] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172554] focus-visible:ring-offset-2"
              >
                <Plus className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                <span>Add New Book</span>
              </Link>
            </div>
          )}
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
