import { Header } from "~/components/shared/header";
import Navbar from "./navbar";
import Footer from "./footer";
import { cn } from "~/utils/cn";
import { useSession } from "next-auth/react";
import { LoadingAnim } from "../loading";

const Layout: React.FC<
  React.PropsWithChildren<{
    title?: string;
    className?: string;
    loading?: boolean;
  }>
> = ({ title, className, loading, children }) => {
  const { status } = useSession();

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
        {status === "loading" || loading ? (
          <LoadingAnim />
        ) : status === "authenticated" ? (
          <>{children}</>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <h1>To begin, sign in!</h1>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
