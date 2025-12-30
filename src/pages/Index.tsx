import { useGameState } from "@/hooks/useGameState";
import { LobbyScreen } from "@/components/screens/LobbyScreen";
import { WaitingRoomScreen } from "@/components/screens/WaitingRoomScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { VotingScreen } from "@/components/screens/VotingScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";

const Index = () => {
  const { room } = useGameState();

  // No room yet - show lobby
  if (!room) {
    return <LobbyScreen />;
  }

  // Show appropriate screen based on game status
  switch (room.status) {
    case 'waiting':
      return <WaitingRoomScreen />;
    case 'playing':
      return <GameScreen />;
    case 'voting':
      return <VotingScreen />;
    case 'results':
      return <ResultsScreen />;
    default:
      return <LobbyScreen />;
  }
};

export default Index;
