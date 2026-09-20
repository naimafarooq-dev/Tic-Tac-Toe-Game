export default function OnlineLoading() {
  return (
    <main className="min-h-[calc(100vh-5rem)]">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-center backdrop-blur-xl">
          <div className="text-4xl">
            🎮
          </div>

          <h1 className="mt-3 text-xl font-black">
            Loading game...
          </h1>

          <p className="mt-1 text-sm text-indigo-200">
            Connecting to Firebase
          </p>
        </div>
      </div>
    </main>
  );
}