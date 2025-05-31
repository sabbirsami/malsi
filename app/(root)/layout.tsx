import Navbar from '@/components/shared/Navbar';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
};

export default RootLayout;
