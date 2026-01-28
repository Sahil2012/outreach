import { PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {
  header: string;
  description: string;
}

const Layout = ({ header, description, children }: LayoutProps) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{header}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default Layout;
