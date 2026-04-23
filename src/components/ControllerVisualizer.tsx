import React, { useState } from 'react';
import { GamepadState } from '../hooks/useGamepad';
import { Dualsense, TriggerEffect } from 'dualsense-ts';
import { Triangle, Circle, Square, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Menu, Share2, Unlock } from 'lucide-react';

interface Props {
  gameState: GamepadState;
  hidController?: Dualsense | null;
  requestDevice?: () => void;
  hidSupported?: boolean;
  securityError?: boolean;
}

const getButtonProp = (buttons: readonly GamepadButton[], index: number) => {
  return buttons[index] || { pressed: false, touched: false, value: 0 };
};

export const ControllerVisualizer: React.FC<Props> = ({ gameState, hidController, requestDevice, hidSupported, securityError }) => {
  const { buttons, axes } = gameState;
  const [leftTriggerMode, setLeftTriggerMode] = useState<string>('off');
  const [rightTriggerMode, setRightTriggerMode] = useState<string>('off');

  // DualSense specific mapping (Standard Gamepad API vs WebHID)
  const cross = hidController ? { pressed: hidController.cross.state, touched: false, value: hidController.cross.state ? 1 : 0 } : getButtonProp(buttons, 0);
  const circle = hidController ? { pressed: hidController.circle.state, touched: false, value: hidController.circle.state ? 1 : 0 } : getButtonProp(buttons, 1);
  const square = hidController ? { pressed: hidController.square.state, touched: false, value: hidController.square.state ? 1 : 0 } : getButtonProp(buttons, 2);
  const triangle = hidController ? { pressed: hidController.triangle.state, touched: false, value: hidController.triangle.state ? 1 : 0 } : getButtonProp(buttons, 3);
  const l1 = hidController ? { pressed: hidController.left.bumper.state, touched: false, value: hidController.left.bumper.state ? 1 : 0 } : getButtonProp(buttons, 4);
  const r1 = hidController ? { pressed: hidController.right.bumper.state, touched: false, value: hidController.right.bumper.state ? 1 : 0 } : getButtonProp(buttons, 5);
  const l2 = hidController ? { pressed: hidController.left.trigger.state > 0.05, touched: false, value: hidController.left.trigger.state } : getButtonProp(buttons, 6);
  const r2 = hidController ? { pressed: hidController.right.trigger.state > 0.05, touched: false, value: hidController.right.trigger.state } : getButtonProp(buttons, 7);
  const share = hidController ? { pressed: hidController.create.state, touched: false, value: hidController.create.state ? 1 : 0 } : getButtonProp(buttons, 8);
  const options = hidController ? { pressed: hidController.options.state, touched: false, value: hidController.options.state ? 1 : 0 } : getButtonProp(buttons, 9);
  const l3 = hidController ? { pressed: hidController.left.analog.button.state, touched: false, value: hidController.left.analog.button.state ? 1 : 0 } : getButtonProp(buttons, 10);
  const r3 = hidController ? { pressed: hidController.right.analog.button.state, touched: false, value: hidController.right.analog.button.state ? 1 : 0 } : getButtonProp(buttons, 11);
  const dup = hidController ? { pressed: hidController.dpad.up.state, touched: false, value: hidController.dpad.up.state ? 1 : 0 } : getButtonProp(buttons, 12);
  const ddown = hidController ? { pressed: hidController.dpad.down.state, touched: false, value: hidController.dpad.down.state ? 1 : 0 } : getButtonProp(buttons, 13);
  const dleft = hidController ? { pressed: hidController.dpad.left.state, touched: false, value: hidController.dpad.left.state ? 1 : 0 } : getButtonProp(buttons, 14);
  const dright = hidController ? { pressed: hidController.dpad.right.state, touched: false, value: hidController.dpad.right.state ? 1 : 0 } : getButtonProp(buttons, 15);
  const ps = hidController ? { pressed: hidController.ps.state, touched: false, value: hidController.ps.state ? 1 : 0 } : getButtonProp(buttons, 16);
  const touchpad = hidController ? { pressed: hidController.touchpad.button.state, touched: false, value: hidController.touchpad.button.state ? 1 : 0 } : getButtonProp(buttons, 17);

  const leftStickX = hidController ? hidController.left.analog.x.state : (axes[0] || 0);
  const leftStickY = hidController ? hidController.left.analog.y.state : (axes[1] || 0);
  const rightStickX = hidController ? hidController.right.analog.x.state : (axes[2] || 0);
  const rightStickY = hidController ? hidController.right.analog.y.state : (axes[3] || 0);

  const triggerRumble = () => {
    if (gameState.gamepad && gameState.gamepad.vibrationActuator) {
      // @ts-ignore - experimental API
      gameState.gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 500,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
      }).catch(console.error);
    }
  };

  const isActive = (btn: GamepadButton) => (btn.pressed ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] border-transparent text-white' : 'bg-[#1a1b26] border-[#3b4261] text-slate-400');
  const isTextActive = (btn: GamepadButton) => (btn.pressed ? 'text-white' : 'text-slate-400');
  const dpadBtnClasses = "border flex items-center justify-center transition-all duration-75";

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-xl border border-white/10 max-w-4xl w-full mx-auto relative overflow-hidden backdrop-blur-sm shadow-2xl">
      <div className="absolute w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>
      
      {/* --- Triggers and Bumpers --- */}
      <div className="flex justify-between w-full max-w-3xl mb-8 px-12 z-10">
        <div className="flex flex-col items-center gap-2">
          {/* L2 Analogue Trigger */}
          <div className="w-16 h-20 bg-[#16161e] rounded-t-xl overflow-hidden border border-[#3b4261] relative flex flex-col justify-end shadow-inner">
            <div 
              className="w-full bg-blue-500 transition-all duration-75"
              style={{ height: `${l2.value * 100}%` }}
            />
            <span className="absolute inset-x-0 top-2 text-center text-[10px] text-slate-400 uppercase tracking-widest z-10 font-bold">L2</span>
            <span className="absolute inset-x-0 bottom-2 text-center text-[10px] text-white mix-blend-difference z-10 font-mono tracking-wider font-semibold">
              {l2.value.toFixed(2)}
            </span>
          </div>
          {/* L1 Bumper */}
          <div className={`w-24 h-10 rounded-xl font-bold font-mono tracking-widest text-xs uppercase flex items-center justify-center transition-all duration-75 ${isActive(l1)}`}>
            L1
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {/* R2 Analogue Trigger */}
          <div className="w-16 h-20 bg-[#16161e] rounded-t-xl overflow-hidden border border-[#3b4261] relative flex flex-col justify-end shadow-inner">
            <div 
              className="w-full bg-blue-500 transition-all duration-75"
              style={{ height: `${r2.value * 100}%` }}
            />
            <span className="absolute inset-x-0 top-2 text-center text-[10px] text-slate-400 uppercase tracking-widest z-10 font-bold">R2</span>
            <span className="absolute inset-x-0 bottom-2 text-center text-[10px] text-white mix-blend-difference z-10 font-mono tracking-wider font-semibold">
              {r2.value.toFixed(2)}
            </span>
          </div>
          {/* R1 Bumper */}
          <div className={`w-24 h-10 rounded-xl font-bold font-mono tracking-widest text-xs uppercase flex items-center justify-center transition-all duration-75 ${isActive(r1)}`}>
            R1
          </div>
        </div>
      </div>

      {/* --- Main Controller Body --- */}
      <div className="relative w-full max-w-3xl flex justify-between items-center mt-4 z-10">
        
        {/* Left Side: D-Pad */}
        <div className="w-48 h-48 relative flex items-center justify-center ml-4">
          <div className={`absolute top-0 w-12 h-14 rounded-t-lg pt-2 ${dpadBtnClasses} ${isActive(dup)}`}>
            <ArrowUp size={24} />
          </div>
          <div className={`absolute bottom-0 w-12 h-14 rounded-b-lg pb-2 ${dpadBtnClasses} ${isActive(ddown)}`}>
            <ArrowDown size={24} />
          </div>
          <div className={`absolute left-0 w-14 h-12 rounded-l-lg pl-2 ${dpadBtnClasses} ${isActive(dleft)}`}>
            <ArrowLeft size={24} />
          </div>
          <div className={`absolute right-0 w-14 h-12 rounded-r-lg pr-2 ${dpadBtnClasses} ${isActive(dright)}`}>
            <ArrowRight size={24} />
          </div>
          <div className="w-12 h-12 bg-[#1a1b26] border border-[#3b4261] relative z-10 rounded shadow-sm"></div>
        </div>

        {/* Center: Touchpad, Share, Options, PS */}
        <div className="flex flex-col items-center flex-1 mx-4 gap-8">
          <div className="flex items-start justify-center gap-4 w-full">
            {/* Share */}
            <div className={`w-6 h-10 mt-2 rounded-full flex items-center justify-center transition-all duration-75 ${isActive(share)}`}>
              <Share2 size={12} className={share.pressed ? "opacity-100" : "opacity-40"} />
            </div>
            
            {/* Touchpad */}
            <div className={`w-56 h-36 rounded-xl flex items-center justify-center transition-all duration-75 ${isActive(touchpad)}`}>
              <div className={`text-[10px] tracking-widest font-bold uppercase transition-opacity ${touchpad.pressed ? "opacity-100 text-blue-100" : "opacity-40 text-slate-500"}`}>Touchpad Click</div>
            </div>

            {/* Options */}
            <div className={`w-6 h-10 mt-2 rounded-full flex items-center justify-center transition-all duration-75 ${isActive(options)}`}>
              <Menu size={12} className={options.pressed ? "opacity-100" : "opacity-40"} />
            </div>
          </div>

          {/* PS Button & Mute Button Area */}
          <div className="flex flex-col items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-75 ${isActive(ps)}`}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="w-48 h-48 relative flex items-center justify-center mr-4">
          <div className={`absolute top-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-75 border ${isActive(triangle)}`}>
             <Triangle size={24} className={triangle.pressed ? "text-white" : "text-[#bb9af7]"} strokeWidth={3} />
          </div>
          <div className={`absolute bottom-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-75 border ${cross.pressed ? "bg-[#7dcfff] shadow-[0_0_20px_rgba(125,207,255,0.4)] border-transparent text-black" : "bg-[#1a1b26] border-[#3b4261]"}`}>
             <X size={24} className={cross.pressed ? "text-black" : "text-[#7dcfff]"} strokeWidth={3} />
          </div>
          <div className={`absolute left-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-75 border ${isActive(square)}`}>
             <Square size={20} className={square.pressed ? "text-white" : "text-[#e0af68]"} strokeWidth={3} />
          </div>
          <div className={`absolute right-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-75 border ${isActive(circle)}`}>
             <Circle size={22} className={circle.pressed ? "text-white" : "text-[#f7768e]"} strokeWidth={3} />
          </div>
        </div>

      </div>

      {/* --- Thumbsticks --- */}
      <div className="flex justify-center w-full gap-24 mt-4 z-10">
        {/* Left Stick */}
        <div className="flex flex-col items-center gap-4">
          <div className={`w-36 h-36 rounded-full border-[3px] flex items-center justify-center relative transition-colors duration-75 bg-[#05060a]/50 backdrop-blur ${l3.pressed ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-[#414868]'}`}>
             <div className="absolute inset-0 rounded-full border border-[#16161e] pointer-events-none"></div>
             {/* Crosshairs */}
             <div className="absolute w-full h-[1px] bg-[#414868]/30"></div>
             <div className="absolute h-full w-[1px] bg-[#414868]/30"></div>
             
             {/* Thumbstick visual component moving inside boundary */}
             <div 
               className={`w-16 h-16 rounded-full border-[3px] shadow-[0_8px_16px_rgba(0,0,0,0.5)] absolute flex flex-col items-center justify-center transition-transform duration-[15ms] ease-linear ${l3.pressed ? 'bg-[#3d59a1] border-blue-400' : 'bg-[#16161e] border-[#414868]'}`}
               style={{
                 transform: `translate(${leftStickX * 40}px, ${leftStickY * 40}px)`
               }}
             >
                <div className={`w-8 h-8 rounded-full opacity-30 ${l3.pressed ? 'bg-white blur-sm' : 'bg-[#414868] blur-md'}`}></div>
             </div>
          </div>
          <div className="text-center font-mono text-[10px] text-slate-400 bg-black/40 border border-[#3b4261] px-4 py-2 rounded-lg backdrop-blur shadow-xl uppercase tracking-wider">
            <span className="text-blue-400 uppercase tracking-widest opacity-80">Axis_L_X:</span> {(leftStickX).toFixed(2)}<br />
            <span className="text-blue-400 uppercase tracking-widest opacity-80 mt-1 inline-block">Axis_L_Y:</span> {(leftStickY).toFixed(2)}
            <div className={`mt-2 border-t border-[#3b4261] pt-2 text-[9px] font-bold ${l3.pressed ? 'text-indigo-400' : 'text-slate-500'}`}>L3 CLICK: {l3.pressed ? 'ACTIVE' : 'IDLE'}</div>
          </div>
        </div>

        {/* Right Stick */}
        <div className="flex flex-col items-center gap-4">
          <div className={`w-36 h-36 rounded-full border-[3px] flex items-center justify-center relative transition-colors duration-75 bg-[#05060a]/50 backdrop-blur ${r3.pressed ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-[#414868]'}`}>
             <div className="absolute inset-0 rounded-full border border-[#16161e] pointer-events-none"></div>
             {/* Crosshairs */}
             <div className="absolute w-full h-[1px] bg-[#414868]/30"></div>
             <div className="absolute h-full w-[1px] bg-[#414868]/30"></div>
             
             {/* Thumbstick visual component moving inside boundary */}
             <div 
               className={`w-16 h-16 rounded-full border-[3px] shadow-[0_8px_16px_rgba(0,0,0,0.5)] absolute flex flex-col items-center justify-center transition-transform duration-[15ms] ease-linear ${r3.pressed ? 'bg-[#3d59a1] border-blue-400' : 'bg-[#16161e] border-[#414868]'}`}
               style={{
                 transform: `translate(${rightStickX * 40}px, ${rightStickY * 40}px)`
               }}
             >
                <div className={`w-8 h-8 rounded-full opacity-30 ${r3.pressed ? 'bg-white blur-sm' : 'bg-[#414868] blur-md'}`}></div>
             </div>
          </div>
          <div className="text-center font-mono text-[10px] text-slate-400 bg-black/40 border border-[#3b4261] px-4 py-2 rounded-lg backdrop-blur shadow-xl uppercase tracking-wider">
            <span className="text-orange-400 uppercase tracking-widest opacity-80">Axis_R_X:</span> {(rightStickX).toFixed(2)}<br />
            <span className="text-orange-400 uppercase tracking-widest opacity-80 mt-1 inline-block">Axis_R_Y:</span> {(rightStickY).toFixed(2)}
            <div className={`mt-2 border-t border-[#3b4261] pt-2 text-[9px] font-bold ${r3.pressed ? 'text-indigo-400' : 'text-slate-500'}`}>R3 CLICK: {r3.pressed ? 'ACTIVE' : 'IDLE'}</div>
          </div>
        </div>
      </div>

      {/* Rumble Test Button */}
      {/* @ts-ignore - experimental API */}
      {gameState.gamepad?.vibrationActuator && (
        <button 
          onClick={triggerRumble}
          className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs uppercase font-bold tracking-widest transition-all z-10 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          Test Vibration Engine
        </button>
      )}

      {/* Adaptive Triggers UI */}
      <div className="mt-12 w-full max-w-3xl border border-[#3b4261] rounded-xl bg-[#16161e]/50 p-6 z-10 backdrop-blur-sm relative overflow-hidden">
        
        {/* Security / Iframe Block Overlay */}
        {securityError && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 border border-rose-500/30 rounded-xl">
             <div className="text-rose-500 font-bold mb-2 uppercase tracking-widest text-sm flex items-center gap-2">
                 <X size={16} /> Iframe Security Policy
             </div>
             <p className="text-slate-300 text-[11px] leading-relaxed max-w-md">
                 WebHID is restricted within this preview iframe for your safety. To experience the adaptive haptic triggers, please open this app in a new tab using the "Open in New Tab" button in the top right.
             </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold tracking-widest uppercase text-sm">Adaptive Triggers</h3>
          {hidSupported && !hidController && requestDevice && !securityError && (
            <button
               onClick={requestDevice}
               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded font-bold text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
            >
              <Unlock size={14} /> Unlock WebHID
            </button>
          )}
          {hidController && (
            <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WebHID Active
            </div>
          )}
          {!hidSupported && (
            <div className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">
              WebHID Unsupported
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {['left', 'right'].map((side) => {
             const activeMode = side === 'left' ? leftTriggerMode : rightTriggerMode;
             const setActiveMode = side === 'left' ? setLeftTriggerMode : setRightTriggerMode;
             
             return (
               <div key={side} className="flex flex-col gap-2">
                  <div className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-2">{side.toUpperCase()} Trigger Force Config</div>
                  <div className="grid grid-cols-2 gap-2">
                    <TriggerButton side={side} mode="off" activeMode={activeMode} setActiveMode={setActiveMode} hidController={hidController} />
                    <TriggerButton side={side} mode="feedback" activeMode={activeMode} setActiveMode={setActiveMode} hidController={hidController} />
                    <TriggerButton side={side} mode="weapon" activeMode={activeMode} setActiveMode={setActiveMode} hidController={hidController} />
                    <TriggerButton side={side} mode="bow" activeMode={activeMode} setActiveMode={setActiveMode} hidController={hidController} />
                    <TriggerButton side={side} mode="vibration" activeMode={activeMode} setActiveMode={setActiveMode} hidController={hidController} />
                    <TriggerButton side={side} mode="machine" activeMode={activeMode} setActiveMode={setActiveMode} hidController={hidController} />
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

// Internal component for trigger buttons
const TriggerButton = ({ side, mode, activeMode, setActiveMode, hidController }: { side: string, mode: string, activeMode: string, setActiveMode: (m: string) => void, hidController: Dualsense | null | undefined }) => {
  const setTriggerEffect = () => {
    if (!hidController) return;
    
    let config: any = { effect: TriggerEffect.Off };
    switch (mode) {
      case 'weapon':
        config = { effect: TriggerEffect.Weapon, start: 0.1, end: 0.6, strength: 1.0 };
        break;
      case 'bow':
        config = { effect: TriggerEffect.Bow, start: 0.0, end: 1.0, strength: 0.8, snapForce: 1.0 };
        break;
      case 'vibration':
         config = { effect: TriggerEffect.Vibration, position: 0.3, amplitude: 0.8, frequency: 20 };
         break;
      case 'feedback':
         config = { effect: TriggerEffect.Feedback, position: 0.0, strength: 1.0 };
         break;
      case 'machine':
         config = { effect: TriggerEffect.Machine, start: 0.1, end: 0.9, amplitudeA: 1.0, amplitudeB: 0.0, frequency: 15, period: 10 };
         break;
    }

    if (side === 'left') {
      hidController.left.trigger.feedback.set(config);
    } else {
      hidController.right.trigger.feedback.set(config);
    }
    setActiveMode(mode);
  };

  const isActive = activeMode === mode;

  return (
    <button 
      onClick={setTriggerEffect} 
      disabled={!hidController} 
      className={`p-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-mono uppercase tracking-widest transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500
      ${isActive 
        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
        : 'bg-[#0a0a0f] border-[#3b4261] hover:bg-[#3b4261] text-slate-300 active:bg-indigo-600'
      }`}
    >
      {mode}
    </button>
  );
};
