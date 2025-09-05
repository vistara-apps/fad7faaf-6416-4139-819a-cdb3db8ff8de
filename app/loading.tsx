export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="glass-card rounded-lg p-8 text-center animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 animate-spin">
            <div className="w-full h-full rounded-full border-4 border-white/30 border-t-white"></div>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Loading EduConnect...
          </h2>
          <p className="text-text-secondary">
            Connecting you to your study squad
          </p>
        </div>
      </div>
    </div>
  );
}
