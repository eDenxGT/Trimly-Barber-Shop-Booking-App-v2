import Logo from "/logo.svg"; 

export const PublicHeader = ({className}: {className?: string}) => {
  return (
    <header className={`bg-[var(--header)] text-white py-4.5 px-6 flex justify-center items-center ${className}`}>
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-3xl font-young">Trimly</h1>
      </div>
    </header>
  );
};

