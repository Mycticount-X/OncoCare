import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, LayoutDashboard, ScanLine, History, Info, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const topLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Scan', path: '/scan', icon: ScanLine },
    { name: 'History', path: '/history', icon: History },
  ];

  const bottomLinks = [
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Profile', path: '/profile', icon: User },
  ];

    return (
        <div 
            className={`h-screen bg-white border-r shadow-sm flex flex-col transition-all duration-300 relative z-50 
                ${isOpen ? 'w-64' : 'w-20'}`}
        >
            <div className="p-4 flex items-center justify-start">
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-600 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <span className={`font-bold text-blue-600 text-xl overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100 ml-2' : 'w-0 opacity-0'}`}>
                    OncoCare
                </span>
            </div>

      <div className="flex-1 px-3 py-4 flex flex-col gap-2">
        {topLinks.map((link) => (
          <NavItem key={link.name} link={link} isOpen={isOpen} />
        ))}
      </div>

      <div className="p-3 border-t flex flex-col gap-2 mb-4">
        {bottomLinks.map((link) => (
          <NavItem key={link.name} link={link} isOpen={isOpen} />
        ))}
      </div>
    </div>
  );
}

function NavItem({ link, isOpen }: { link: any, isOpen: boolean }) {
    const Icon = link.icon;
    
    return (
        <NavLink
            to={link.path}
            className={({ isActive }) =>
                `flex items-center p-3 rounded-xl transition-all group relative ${
                    isActive 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                }`
            }
        >
            <Icon size={24} className="min-w-[24px]" />
            
            <span 
                className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 
                ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}
            >
                {link.name}
            </span>

            {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-50">
                    {link.name}
                </div>
            )}
        </NavLink>
    );
}