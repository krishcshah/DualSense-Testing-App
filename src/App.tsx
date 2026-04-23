/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { useGamepad } from './hooks/useGamepad';
import { useDualSenseWebHID } from './hooks/useDualSenseWebHID';
import { ControllerVisualizer } from './components/ControllerVisualizer';
import { Gamepad2, Usb } from 'lucide-react';

export default function App() {
  const gameState = useGamepad();
  const { controller: hidController, requestDevice, supported: hidSupported } = useDualSenseWebHID();

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100 font-sans selection:bg-blue-900 selection:text-white flex flex-col items-center py-12 px-4 selection:bg-blue-500/30 leading-relaxed">
      
      {/* Header */}
      <header className="flex flex-col items-center justify-center mb-10 border-b border-white/10 pb-6 w-full max-w-5xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gamepad2 size={40} className="text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">
            DualSense Tester
          </h1>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-semibold max-w-lg mx-auto text-center">
          Connect your PlayStation DualSense or compatible controller via USB or Bluetooth. Tests buttons, analog sticks, triggers, and haptics (on supported browsers).
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl relative flex-1">
        {gameState.connected ? (
          <div>
            <div className="flex justify-between items-center mb-4 px-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-300 tracking-normal normal-case">{gameState.id}</span>
              </div>
              <div>
                Raw Buttons: <span className="text-blue-400">{gameState.buttons.length}</span> | Axes: <span className="text-blue-400">{gameState.axes.length}</span>
              </div>
            </div>
            
            <ControllerVisualizer 
              gameState={gameState} 
              hidController={hidController} 
              requestDevice={requestDevice} 
              hidSupported={hidSupported} 
            />
            
            {/* Debug Text Area */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 mb-12">
              <div className="col-span-full">
                <h3 className="text-[11px] uppercase tracking-widest text-slate-500 mb-2">Raw Data Stream</h3>
              </div>
              {gameState.buttons.map((btn, i) => (
                <div key={i} className={`p-3 rounded-lg border font-mono text-[10px] flex justify-between items-center ${btn.pressed ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/10 text-white/50'}`}>
                  <span className="uppercase tracking-widest">BTN {i}</span>
                  <span className="font-bold text-xs">{btn.value > 0 ? btn.value.toFixed(2) : (btn.pressed ? '1.00' : '0.00')}</span>
                </div>
              ))}
            </div>
            
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-8 bg-white/5 border border-white/10 rounded-xl max-w-3xl mx-auto text-center relative overflow-hidden backdrop-blur-sm">
            <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
            <div className="w-24 h-24 rounded-full bg-[#16161e] border border-[#3b4261] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
              <Gamepad2 size={48} className="text-blue-500/50 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2 tracking-tight text-white/90 uppercase">No Hardware Detected</h2>
            <p className="text-sm text-slate-400 mb-8 max-w-md">
              Please connect your controller and press any button to wake it up. Make sure your browser has permission to access gamepads.
            </p>
            <div className="bg-[#16161e] border border-[#3b4261] rounded-lg p-5 font-mono text-[11px] text-left text-slate-400 w-full max-w-md">
              <span className="block text-indigo-400 mb-3 uppercase tracking-widest font-bold">Diagnostics:</span>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-slate-600">-</span> Press any button to trigger connection stream.</li>
                <li className="flex gap-2"><span className="text-slate-600">-</span> Ensure Bluetooth or USB connection is initialized.</li>
                <li className="flex gap-2"><span className="text-slate-600">-</span> Some environments require initial frame interaction.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
      
    </div>
  );
}
