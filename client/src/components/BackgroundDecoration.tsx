export const BackgroundDecoration = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div
        className="absolute bottom-0 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(38 92% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(38 92% 50%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-primary/50 rounded-full animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-primary/40 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-40 w-1 h-1 bg-primary/60 rounded-full animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-60 right-20 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-gold-light/40 rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-gold-light/50 rounded-full animate-float" style={{ animationDelay: "2.5s" }} />
    </div>
  );
};

