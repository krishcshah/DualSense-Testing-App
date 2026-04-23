import { useState, useEffect, useRef, useCallback } from "react";

export interface GamepadState {
  connected: boolean;
  id: string;
  buttons: readonly GamepadButton[];
  axes: readonly number[];
  gamepad: Gamepad | null;
}

export const useGamepad = (): GamepadState => {
  const [gameState, setGameState] = useState<GamepadState>({
    connected: false,
    id: "",
    buttons: [],
    axes: [],
    gamepad: null,
  });

  const reqRef = useRef<number>();

  const updateGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    let targetGamepad: Gamepad | null = null;
    
    // Prefer DualSense / PlayStation controller if multiple are connected
    for (const gp of gamepads) {
      if (gp) {
        targetGamepad = gp;
        const lowId = gp.id.toLowerCase();
        if (lowId.includes("dualsense") || lowId.includes("wireless controller")) {
          break;
        }
      }
    }

    if (targetGamepad) {
      setGameState({
        connected: targetGamepad.connected,
        id: targetGamepad.id,
        // Gamepad API properties are live objects, so we need to spread/map them to trigger React renders
        buttons: targetGamepad.buttons.map(b => ({ pressed: b.pressed, touched: b.touched, value: b.value })),
        axes: [...targetGamepad.axes],
        gamepad: targetGamepad,
      });
    } else {
      setGameState((prev) => prev.connected ? { ...prev, connected: false, gamepad: null } : prev);
    }

    reqRef.current = requestAnimationFrame(updateGamepad);
  }, []);

  useEffect(() => {
    const handleConnect = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad.id);
      if (!reqRef.current) {
        reqRef.current = requestAnimationFrame(updateGamepad);
      }
    };

    const handleDisconnect = (e: GamepadEvent) => {
      console.log("Gamepad disconnected:", e.gamepad.id);
    };

    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);

    // Initial check
    if (navigator.getGamepads().filter(Boolean).length > 0) {
      reqRef.current = requestAnimationFrame(updateGamepad);
    }

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
      if (reqRef.current) {
        cancelAnimationFrame(reqRef.current);
      }
    };
  }, [updateGamepad]);

  return gameState;
};
