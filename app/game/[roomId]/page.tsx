import OnlineGame from "@/components/OnlineGame";

export default async function GameRoom({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const { roomId } = await params;

  return (
    <OnlineGame roomId={roomId} />
  );
}

