import AuthFrom from '@/app/(auth)/components/AuthForm';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LogoIcon from '../icons/LogoIcon';

const Navbar = () => {
  //   const routes = [
  //     { name: 'Home', path: '/' },
  //     { name: 'About Us', path: '/about' },
  //     { name: 'Contact Us', path: '/contact' },
  //     { name: 'Contact Us', path: '/contact' },
  //   ];
  return (
    <header className="bg-white m-3 rounded-xl">
      <Sheet>
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-0 py-4">
          <div className="flex items-center space-x-2">
            <LogoIcon className="h-8 w-auto" /> <span className="text-xl font-semibold">Malsi</span>
          </div>
          {/* <nav className="">
          {routes?.map((route) => (
            <Link className="text-sm px-2 font-medium " key={route.name} href={route.path}>
              <span className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
                {route.name}
              </span>
            </Link>
          ))}
        </nav> */}

          <div className="flex items-center space-x-2">
            <SheetTrigger>
              <span className="text-sm font-medium border py-3 px-5 bg-primary text-white rounded-full ">
                <span className=" transition duration-150 ease-in-out">Get Started</span>
              </span>
            </SheetTrigger>
          </div>

          <SheetContent
            className="m-3 rounded-xl md:w-2xl border- border-gray-600"
            style={{ height: 'calc(100vh - 1.5rem)' }}
          >
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
              <div className="w-full h-full overflow-y-auto">
                <AuthFrom type="sign-in" />
              </div>
            </SheetHeader>
          </SheetContent>
        </div>
      </Sheet>
    </header>
  );
};

export default Navbar;
