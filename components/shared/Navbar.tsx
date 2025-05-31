import Link from 'next/link';
import LogoIcon from '../icons/LogoIcon';

const Navbar = () => {
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  return (
    <header className="bg-white m-3 rounded-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <LogoIcon className="h-8 w-auto" /> <span className="text-xl font-semibold">Malsi</span>
        </div>
        <nav className="">
          {routes?.map((route) => (
            <Link className="text-sm px-2 font-medium " key={route.name} href={route.path}>
              <span className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
                {route.name}
              </span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <button className="text-sm font-medium border py-3 px-5 rounded-full">
            <span className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
              Sign In
            </span>
          </button>
          <button className="text-sm  font-medium capitalize border py-3 px-5 rounded-full bg-primary text-white">
            <span className=" transition duration-150 ease-in-out">register</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
