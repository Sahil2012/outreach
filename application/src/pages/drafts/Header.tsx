const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Drafts
        </h1>
        <p className="text-muted-foreground mt-1">Manage your email drafts</p>
      </div>
    </div>
  );
};

export default Header;
