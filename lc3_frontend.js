import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LC3Simulator from './LC3Simulator';

const LC3 = new LC3Simulator();

const InstructionsDropDown = () => {
  const InstructionOptions = Object.keys(LC3.instructions).map(instruction => ({
    value : instruction,
    label: instruction.replace('_', ' ');
  }));
  return (
    <div className="p-8 space-y-8">
      <div>
        <dropDown
          label="Instructions"
          options = {InstructionOptions}
        />
      </div>
    </div>
  );
};
/** reusable dropdown menu code */
const dropDown = options => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState();

  return (
    <div className="relative inline-block w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {selectedType}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {options.map((name) => (
              <li
                key={name}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  setSelectedType(name);
                  setIsOpen(false);
                }}
                >
                  {name}
                  </li>
            ))}
          </ul>
          </div>
        )}
    </div>
  );
};
const LC3InteractiveDatapath = () => {
  const [activeSignals, setActiveSignals] = useState({
    pcToMar: false,
    marToMemory: false,
    memoryToMdr: false,
    mdrToBus: false,
    aluOperation: false,
    registerWrite: false
  });

  // Signal animation configuration
  const signalAnimation = {
    initial: { opacity: 0, pathLength: 0 },
    animate: { 
      opacity: 1, 
      pathLength: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeInOut" 
      }
    },
    exit: { 
      opacity: 0, 
      pathLength: 0 
    }
  };

  const triggerSignalFlow = () => {
    // Simulate signal propagation
    const signalSequence = [
      { pcToMar: true },
      { marToMemory: true },
      { memoryToMdr: true },
      { mdrToBus: true },
      { aluOperation: true },
      { registerWrite: true }
    ];

    signalSequence.forEach((signal, index) => {
      setTimeout(() => {
        setActiveSignals(prev => ({
          ...prev,
          ...signal
        }));
      }, index * 500);
    });

    // Reset signals after full sequence
    setTimeout(() => {
      setActiveSignals({
        pcToMar: false,
        marToMemory: false,
        memoryToMdr: false,
        mdrToBus: false,
        aluOperation: false,
        registerWrite: false
      });
    }, signalSequence.length * 500);
  };

  return (
    <div className="relative w-full h-[800px] bg-gray-100">
      <svg 
        viewBox="0 0 1200 800" 
        className="w-full h-full"
      >
        {/* Background Components */}
        <rect x="50" y="50" width="1100" height="700" 
          fill="none" stroke="#e0e0e0" strokeWidth="2" />

        {/* Processor Components */}
        {/* Program Counter */}
        <rect x="100" y="100" width="150" height="100" 
          fill="#f0f0f0" stroke="black" />
        <text x="175" y="150" textAnchor="middle">
          Program Counter (PC)
        </text>

        {/* Memory Address Register */}
        <rect x="350" y="100" width="150" height="100" 
          fill="#f0f0f0" stroke="black" />
        <text x="425" y="150" textAnchor="middle">
          MAR
        </text>

        {/* Memory */}
        <rect x="600" y="100" width="200" height="200" 
          fill="#f0f0f0" stroke="black" />
        <text x="700" y="200" textAnchor="middle">
          Memory
        </text>

        {/* Memory Data Register */}
        <rect x="850" y="100" width="150" height="100" 
          fill="#f0f0f0" stroke="black" />
        <text x="925" y="150" textAnchor="middle">
          MDR
        </text>

        {/* Main Bus */}
        <rect x="100" y="300" width="900" height="50" 
          fill="#e0e0e0" stroke="black" />
        <text x="550" y="330" textAnchor="middle">
          Main Bus
        </text>

        {/* Signal Paths */}
        {activeSignals.pcToMar && (
          <motion.line
            x1="175" y1="200" x2="425" y2="200"
            stroke="red"
            strokeWidth="5"
            {...signalAnimation}
          />
        )}

        {activeSignals.marToMemory && (
          <motion.line
            x1="425" y1="150" x2="600" y2="150"
            stroke="red"
            strokeWidth="5"
            {...signalAnimation}
          />
        )}

        {activeSignals.memoryToMdr && (
          <motion.line
            x1="600" y1="150" x2="850" y2="150"
            stroke="red"
            strokeWidth="5"
            {...signalAnimation}
          />
        )}

        {activeSignals.mdrToBus && (
          <motion.line
            x1="925" y1="200" x2="550" y2="300"
            stroke="red"
            strokeWidth="5"
            {...signalAnimation}
          />
        )}
      </svg>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={triggerSignalFlow}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Trigger Signal Flow
        </button>
      </div>

      {/* Active Signals Display */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Active Signals:</h3>
        {Object.entries(activeSignals).map(([signal, active]) => (
          <div 
            key={signal}
            className={`mb-1 ${active ? 'text-red-500' : 'text-gray-400'}`}
          >
            {signal}: {active ? 'Active' : 'Inactive'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LC3InteractiveDatapath;
