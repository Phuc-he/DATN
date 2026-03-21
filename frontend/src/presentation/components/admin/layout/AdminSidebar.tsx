import { AuthService } from '@/src/presentation/services/auth.service';
import {
  Book,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Ticket,
  Users
} from 'lucide-react'; // Accessible icon library

const AdminSidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Authors', icon: <Book size={20} />, path: '/admin/authors' },
    { name: 'Categories', icon: <Layers size={20} />, path: '/admin/categories' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Vouchers', icon: <Ticket size={20} />, path: '/admin/vouchers' },
    { name: 'Setting', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col w-64 h-screen bg-slate-900 text-slate-100 border-r border-slate-800">
      <div className="flex items-center justify-center h-20 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400 uppercase">
          Admin Panel
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className="flex items-center px-4 py-3 transition-colors rounded-lg hover:bg-slate-800 hover:text-blue-400 group"
          >
            <span className="text-slate-400 group-hover:text-blue-400">
              {item.icon}
            </span>
            <span className="ml-3 font-medium">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center w-full px-4 py-3 text-slate-400 transition-colors rounded-lg hover:bg-red-900/20 hover:text-red-400" onClick={() => {
          AuthService.logout();
        }}>
          <LogOut size={20} />
          <span className="ml-3 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
