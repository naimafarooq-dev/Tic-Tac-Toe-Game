type Props = {
  message: string;
};

export default function OnlineError({
  message,
}: Props) {
  return (
    <main className="min-h-[calc(100vh-5rem)]">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-red-300/20 bg-red-400/10 p-8 text-center backdrop-blur-xl">
          <div className="text-5xl">
            ❌
          </div>

          <h1 className="mt-4 text-2xl font-black">
            Game Error
          </h1>

          <p className="mt-2 text-sm text-red-100/80">
            {message}
          </p>
        </div>
      </div>
    </main>
  );
}