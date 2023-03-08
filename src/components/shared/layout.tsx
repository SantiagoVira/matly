import { Header } from "~/components/shared/header";
import Navbar from "./navbar";
import Footer from "./footer";
import { cn } from "~/utils/cn";

const Layout: React.FC<
  React.PropsWithChildren<{ title?: string; className?: string }>
> = ({ title, className, children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-bg-100 text-text-100">
      <Header title={title} />
      <Navbar />
      <div
        className={cn(
          "flex h-full w-full flex-1 flex-col items-center",
          className
        )}
      >
        {children}
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
