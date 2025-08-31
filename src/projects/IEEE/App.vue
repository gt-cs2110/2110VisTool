<template>
  <div class="ieee-component container">
    <h1>
      IEEE 754 Floating Point Visualizer
    </h1>
    
    <div class="input-section">
      <div class="input-group">
        <div class="input-label">
          <label for="numberInput">
            {{ inputMode === 'binary' ? 'Binary Input' : 'Decimal Input' }}
            <button 
              class="help-btn" 
              @click="showHelp = !showHelp"
              type="button"
              title="Show input format help"
            >
              ?
            </button>
          </label>
          <input 
            type="text" 
            id="numberInput" 
            v-model="inputValue"
            :placeholder="inputMode === 'binary' ? 'e.g., 100.001, inf, -inf, nan' : 'e.g., -5.25, 123.456, inf, -inf, nan'"
            @input="handleInput"
            @keypress="handleKeypress"
          >
        </div>
        <div class="mode-toggle">
          <button 
            class="mode-btn" 
            :class="{ active: inputMode === 'binary' }"
            @click="setInputMode('binary')"
          >
            Binary
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: inputMode === 'decimal' }"
            @click="setInputMode('decimal')"
          >
            Decimal
          </button>
        </div>
      </div>
      
      <!-- Help Popup -->
      <div v-if="showHelp" class="help-popup">
        <div class="help-header">
          <h4>Input Format Guide</h4>
          <button class="close-btn" @click="showHelp = false">×</button>
        </div>
        <div class="help-content">
          <div class="help-section">
            <h5>Binary Numbers</h5>
            <ul>
              <li><code>101</code> - Integer binary (5 in decimal)</li>
              <li><code>101.11</code> - Binary with fractional part (5.75 in decimal)</li>
              <li><code>1100011000000</code> - Long binary integer</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h5>Decimal Numbers</h5>
            <ul>
              <li><code>5.25</code> - Positive decimal</li>
              <li><code>-5.25</code> - Negative decimal</li>
              <li><code>123.456</code> - Any decimal number</li>
            </ul>
          </div>
          
          <div class="help-section">
            <h5>Special IEEE 754 Values</h5>
            <ul>
              <li><code>inf</code> or <code>infinity</code> - Positive infinity</li>
              <li><code>-inf</code> or <code>-infinity</code> - Negative infinity</li>
              <li><code>nan</code> - Not a Number</li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>

    <div class="visualization" v-html="visualizationHtml"></div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

/* IEEE Project Scoped Styles */
.ieee-component.container {
    --gt-navy: #003057;
    --gt-gold: #B3A369;
    --gt-light-gold: #E8D5A3;
    --gt-dark-navy: #001a33;
    --gt-accent: #FFD700;
    --surface: rgba(0, 48, 87, 0.95);
    --surface-light: rgba(179, 163, 105, 0.1);
    --text-primary: #ffffff;
    --text-secondary: #E8D5A3;
    --border-color: rgba(179, 163, 105, 0.3);
    --shadow: rgba(0, 26, 51, 0.4);
    
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, var(--gt-dark-navy) 0%, var(--gt-navy) 50%, #002244 100%);
    min-height: 100vh;
    padding: 24px;
    color: var(--text-primary);
    position: relative;
    max-width: 1300px;
    margin: 0 auto;
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px var(--shadow);
}

.ieee-component.container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 20% 20%, rgba(179, 163, 105, 0.05) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%);
    pointer-events: none;
    border-radius: inherit;
    z-index: -1;
}

.ieee-component.container > * {
    position: relative;
    z-index: 1;
}

.ieee-component.container h1 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, var(--gt-gold) 0%, var(--gt-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
}

.input-section {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
}

.input-group {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 1rem;
}

.input-label {
    flex: 1;
}

.input-label label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.input-label input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.3s ease;
}

.input-label input:focus {
    outline: none;
    border-color: var(--gt-gold);
    box-shadow: 0 0 0 3px rgba(179, 163, 105, 0.2);
    background: rgba(255, 255, 255, 0.08);
}

.input-label input::placeholder {
    color: rgba(232, 213, 163, 0.6);
}

.help-btn {
    background: var(--gt-gold);
    color: var(--gt-navy);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 0.5rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.help-btn:hover {
    background: var(--gt-accent);
    transform: scale(1.1);
}

.mode-toggle {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
}

.mode-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.mode-btn.active {
    background: var(--gt-gold);
    color: var(--gt-navy);
}

.mode-btn:not(.active):hover {
    background: rgba(179, 163, 105, 0.1);
    color: var(--text-primary);
}

.help-popup {
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 1rem;
    backdrop-filter: blur(20px);
}

.help-header {
    margin-bottom: 1rem;
}

.help-header h3 {
    color: var(--gt-gold);
    margin-bottom: 0.5rem;
}

.visualization {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    backdrop-filter: blur(10px);
}

.ieee-representation {
    background: linear-gradient(135deg, var(--gt-navy) 0%, var(--gt-dark-navy) 100%);
    padding: 36px;
    border-radius: 20px;
    margin-bottom: 32px;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    border: 1px solid var(--border-color);
    box-shadow: 
        0 16px 40px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
}

.ieee-representation::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(179, 163, 105, 0.05) 50%, transparent 100%);
    pointer-events: none;
}

.ieee-representation h3 {
    color: var(--gt-light-gold);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    z-index: 1;
    margin-bottom: 1rem;
}

/* Bit labels aligned with bits */
.bit-labels {
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  gap: 3px;
  margin: 0 0 6px 0;
  padding: 0 20px 0 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-secondary);
}

.bit-labels .bit-label {
  text-align: center;
  user-select: none;
}

.bit-display {
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  gap: 3px;
  margin: 12px 0;
  padding: 20px 20px 20px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  width: 100%;
}

.bit {
  aspect-ratio: 1 / 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: clamp(10px, 0.9vw, 14px);
  font-family: 'JetBrains Mono', monospace;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  cursor: pointer;
}

.bit:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.sign-bit {
    background: linear-gradient(135deg, #DC2626, #B91C1C);
    color: white;
    border-color: #EF4444;
}

.exponent-bit {
    background: linear-gradient(135deg, #7C3AED, #6D28D9);
    color: white;
    border-color: #8B5CF6;
}

.mantissa-bit {
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
    border-color: #10B981;
}

.bit-zero {
    background: linear-gradient(135deg, #374151, #4B5563);
    color: #D1D5DB;
    border-color: #6B7280;
}

.bit-one {
    background: linear-gradient(135deg, var(--gt-gold), var(--gt-accent));
    color: var(--gt-navy);
    border-color: var(--gt-light-gold);
}

.section-labels {
    display: flex;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.sign-label {
    width: 40px;
    text-align: center;
    color: #EF4444;
}

.exponent-label {
    width: 264px;
    text-align: center;
    color: #8B5CF6;
}

.mantissa-label {
    flex: 1;
    text-align: center;
    color: #10B981;
}

.bit-indices {
    display: flex;
    margin-top: 8px;
    font-size: 10px;
    color: var(--text-secondary);
    font-family: 'JetBrains Mono', monospace;
}

.bit-index {
    width: 32px;
    text-align: center;
    margin-right: 3px;
    flex-shrink: 0;
}

.conversion-details {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 24px;
    margin-top: 24px;
    border: 1px solid var(--border-color);
}

.conversion-details h4 {
    color: var(--gt-light-gold);
    margin-bottom: 16px;
    font-size: 1.1rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(179, 163, 105, 0.1);
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    color: var(--text-secondary);
    font-weight: 500;
}

.detail-value {
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
}

.format-buttons {
    display: flex;
    gap: 12px;
    margin: 20px 0;
    flex-wrap: wrap;
}

.format-btn {
    padding: 8px 16px;
    border: 2px solid #7f53ac;
    background: #23243a;
    color: #7f53ac;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.9rem;
}

.format-btn.active {
    background: #7f53ac;
    color: #fff;
}

.format-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(127, 83, 172, 0.3);
}

.help-section {
    margin-bottom: 1.5rem;
}

.help-section h5 {
    color: var(--gt-gold);
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.help-section ul {
    list-style: none;
    padding: 0;
}

.help-section li {
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;
}

.help-section li::before {
    content: "•";
    color: var(--gt-gold);
    position: absolute;
    left: 0;
}

.help-section code {
    background: rgba(179, 163, 105, 0.2);
    color: var(--gt-accent);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
}

.close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: var(--text-primary);
}

.help-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.help-header h4 {
    color: var(--gt-gold);
    margin: 0;
}

/* Analysis and Calculation Sections */
.legend {
    display: flex;
    gap: 20px;
    margin: 20px 0;
    padding: 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.calculations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 24px 0;
}

.calc-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--border-color);
}

.calc-title {
    color: var(--gt-gold);
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid var(--gt-gold);
    padding-bottom: 8px;
}

.calc-step {
    color: var(--text-primary);
    font-family: 'JetBrains Mono', monospace;
    margin: 8px 0;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    border-left: 3px solid var(--gt-light-gold);
    font-size: 0.95rem;
    line-height: 1.4;
}

.result {
    background: linear-gradient(135deg, var(--gt-navy), var(--gt-dark-navy));
    border: 2px solid var(--gt-gold);
    border-radius: 12px;
    padding: 20px;
    margin: 24px 0;
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--gt-accent);
    box-shadow: 0 8px 24px rgba(179, 163, 105, 0.2);
    position: relative;
}

.result::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, var(--gt-gold), var(--gt-accent), var(--gt-gold));
    border-radius: 12px;
    z-index: -1;
    opacity: 0.8;
}
</style>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const inputValue = ref('100.001')
    const visualizationHtml = ref('')
    const currentFormat = ref(32)
    const showHelp = ref(false)
    const inputMode = ref('binary') // 'binary' or 'decimal'

    const parseSpecialInput = (str) => {
      const s = str.trim().toLowerCase()
      if (s === 'inf' || s === 'infinity') return Infinity
      if (s === '-inf' || s === '-infinity') return -Infinity
      if (s === 'nan') return NaN
      return null
    }

    const isValidBinary = (str) => {
      const dotCount = (str.match(/\./g) || []).length
      return dotCount <= 1 && /^[01.]+$/.test(str) && str.length > 0
    }

    const binaryToDecimal = (binaryStr) => {
      if (binaryStr.includes('.')) {
        const [integerPart, fractionalPart] = binaryStr.split('.')
        
        let decimal = 0
        if (integerPart) {
          decimal = parseInt(integerPart, 2)
        }
        
        if (fractionalPart) {
          for (let i = 0; i < fractionalPart.length; i++) {
            if (fractionalPart[i] === '1') {
              decimal += Math.pow(2, -(i + 1))
            }
          }
        }
        
        return decimal
      } else {
        return parseInt(binaryStr, 2)
      }
    }

    const generateBinaryConversionSteps = (binaryStr) => {
      if (!binaryStr.includes('.')) {
        const integerPart = binaryStr
        let steps = '<div class="calc-step">Integer part: ' + integerPart + '</div>'
        let calculation = ''
        let total = 0
        
        for (let i = 0; i < integerPart.length; i++) {
          const bit = integerPart[i]
          const power = integerPart.length - 1 - i
          const value = parseInt(bit) * Math.pow(2, power)
          total += value
          
          if (bit === '1') {
            if (calculation) calculation += ' + '
            calculation += `${bit}×2^${power}`
          }
        }
        
        if (calculation) {
          steps += `<div class="calc-step">${calculation} = ${total}</div>`
        }
        
        return steps
      } else {
        const [integerPart, fractionalPart] = binaryStr.split('.')
        let steps = ''
        let totalInteger = 0
        let totalFractional = 0
        
        if (integerPart && integerPart !== '0') {
          steps += '<div class="calc-step">Integer part: ' + integerPart + '</div>'
          let intCalculation = ''
          
          for (let i = 0; i < integerPart.length; i++) {
            const bit = integerPart[i]
            const power = integerPart.length - 1 - i
            const value = parseInt(bit) * Math.pow(2, power)
            totalInteger += value
            
            if (bit === '1') {
              if (intCalculation) intCalculation += ' + '
              intCalculation += `${bit}×2^${power}`
            }
          }
          
          if (intCalculation) {
            steps += `<div class="calc-step">${intCalculation} = ${totalInteger}</div>`
          }
        }
        
        if (fractionalPart) {
          steps += '<div class="calc-step">Fractional part: .' + fractionalPart + '</div>'
          let fracCalculation = ''
          
          for (let i = 0; i < fractionalPart.length; i++) {
            const bit = fractionalPart[i]
            const power = -(i + 1)
            const value = parseInt(bit) * Math.pow(2, power)
            totalFractional += value
            
            if (bit === '1') {
              if (fracCalculation) fracCalculation += ' + '
              fracCalculation += `${bit}×2^${power}`
            }
          }
          
          if (fracCalculation) {
            steps += `<div class="calc-step">${fracCalculation} = ${totalFractional}</div>`
          }
        }
        
        const total = totalInteger + totalFractional
        steps += `<div class="calc-step">Total: ${totalInteger} + ${totalFractional} = ${total}</div>`
        
        return steps
      }
    }

    const generateFloat32Visualization = (number, binaryInput) => {
      const buffer = new ArrayBuffer(4)
      const view = new DataView(buffer)
      view.setFloat32(0, number)
      const bits = view.getUint32(0)
      
      const sign = (bits >>> 31) & 1
      const exponent = (bits >>> 23) & 0xFF
      const mantissa = bits & 0x7FFFFF
      
      const signBit = sign.toString()
      const exponentBits = exponent.toString(2).padStart(8, '0')
      const mantissaBits = mantissa.toString(2).padStart(23, '0')
      
      const biasedExponent = exponent
      const actualExponent = exponent - 127
      const mantissaValue = 1 + mantissa / Math.pow(2, 23)
      
      const bitLabels = Array.from({length: 32}, (_, i) => 31 - i)
      
      return `
        <div class="ieee-representation">
          
          <div style="margin-bottom: 24px; text-align: center;">
            <div style="font-size: 1.1rem; color: var(--gt-light-gold); margin-bottom: 8px;">
              <strong>Input:</strong> ${binaryInput} → <strong>Decimal:</strong> ${number}
            </div>
          </div>
          
          <div class="bit-labels">
            ${bitLabels.map(label => `<div class="bit-label">${label}</div>`).join('')}
          </div>
          
          <div class="bit-display">
            <div class="bit sign-bit" title="Sign Bit: ${sign === 0 ? 'Positive' : 'Negative'}">${signBit}</div>
            ${exponentBits.split('').map((bit, index) => `<div class="bit exponent-bit" title="Exponent Bit ${7-index}">${bit}</div>`).join('')}
            ${mantissaBits.split('').map((bit, index) => `<div class="bit mantissa-bit" title="Mantissa Bit ${22-index}">${bit}</div>`).join('')}
          </div>
          
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color sign-bit"></div>
              <span>Sign (1 bit)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color exponent-bit"></div>
              <span>Exponent (8 bits)</span>
            </div>
            <div class="legend-item">
              <div class="legend-color mantissa-bit"></div>
              <span>Mantissa (23 bits)</span>
            </div>
          </div>
        </div>
        
        <div class="calculations">
          <div class="calc-section">
            <div class="calc-title">Sign Analysis</div>
            <div class="calc-step">Bit: ${sign}</div>
            <div class="calc-step">Value: ${sign === 0 ? 'Positive (+)' : 'Negative (-)'}</div>
          </div>
          
          <div class="calc-section">
            <div class="calc-title">Exponent Analysis</div>
            <div class="calc-step">Bits: ${exponentBits}</div>
            <div class="calc-step">Biased: ${biasedExponent}</div>
            <div class="calc-step">Actual: ${biasedExponent} - 127 = ${actualExponent}</div>
          </div>
          
          <div class="calc-section">
            <div class="calc-title">Mantissa Analysis</div>
            <div class="calc-step">Bits: ${mantissaBits}</div>
            <div class="calc-step">Value: 1 + ${mantissa}/2²³</div>
            <div class="calc-step">Result: ${mantissaValue.toFixed(10)}</div>
          </div>
        </div>
        
        <div class="result">
          IEEE 754 Result: ${sign === 0 ? '+' : '-'} ${mantissaValue.toFixed(10)} × 2^${actualExponent} = ${view.getFloat32(0)}
        </div>
      `
    }

    const handleKeypress = (event) => {
      // Allow control keys (backspace, delete, arrow keys, etc.)
      if (event.ctrlKey || event.metaKey || 
          ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter'].includes(event.key)) {
        return;
      }
      
      const char = event.key;
      const currentValue = event.target.value;
      const cursorPosition = event.target.selectionStart;
      
      if (inputMode.value === 'binary') {
        // For binary mode, allow only 0, 1, ., -, and special value characters
        const allowedBinaryChars = /^[01.\-infan]$/i;
        if (!allowedBinaryChars.test(char)) {
          event.preventDefault();
          return;
        }
        
        if (char === '.') {
          // Only allow one decimal point
          if (currentValue.includes('.')) {
            event.preventDefault();
            return;
          }
        } else if (char === '-') {
          // Only allow minus at the beginning
          if (cursorPosition !== 0 || currentValue.includes('-')) {
            event.preventDefault();
            return;
          }
        }
      } else {
        // For decimal mode, allow digits, decimal point, minus sign, and special value characters
        const allowedDecimalChars = /^[0-9.\-einfan]$/i;
        if (!allowedDecimalChars.test(char)) {
          event.preventDefault();
          return;
        }
        
        // Additional validation for decimal input
        if (char === '.') {
          // Only allow one decimal point
          if (currentValue.includes('.')) {
            event.preventDefault();
            return;
          }
        } else if (char === '-') {
          // Only allow minus at the beginning or after 'e' for scientific notation
          const beforeCursor = currentValue.substring(0, cursorPosition);
          const lastChar = beforeCursor[beforeCursor.length - 1];
          if (cursorPosition !== 0 && lastChar !== 'e' && lastChar !== 'E') {
            event.preventDefault();
            return;
          }
        } else if (char.toLowerCase() === 'e') {
          // Only allow one 'e' for scientific notation
          if (currentValue.toLowerCase().includes('e')) {
            event.preventDefault();
            return;
          }
        }
      }
    }
    
    const handleInput = (event) => {
      let value = event.target.value;
      
      if (inputMode.value === 'binary') {
        // Remove non-binary input
        value = value.replace(/[^01.\-infan]/gi, '');
      } else {
        // Remove non-decimal input
        value = value.replace(/[^0-9.\-einfan]/gi, '');
      }
      
      // Update the input value if it was cleaned
      if (value !== event.target.value) {
        inputValue.value = value;
        // Set cursor position to the end
        setTimeout(() => {
          event.target.setSelectionRange(value.length, value.length);
        }, 0);
      }
      
      updateVisualization();
    }

    const setInputMode = (mode) => {
      inputMode.value = mode
      updateVisualization()
    }

    const updateVisualization = () => {
      const special = parseSpecialInput(inputValue.value)

      if (special !== null) {
        visualizationHtml.value = generateFloat32Visualization(special, inputValue.value)
        return
      }

      if (inputMode.value === 'decimal') {
        // In decimal mode, try to parse as decimal number
        const decimalMatch = inputValue.value.trim().match(/^-?\d+(\.\d+)?$/)
        if (decimalMatch) {
          const decimalNumber = parseFloat(inputValue.value)
          visualizationHtml.value = generateFloat32Visualization(decimalNumber, `${inputValue.value} (decimal)`)
          return
        } else if (inputValue.value.trim() !== '') {
          // Invalid decimal input
          visualizationHtml.value = `
            <div class="calc-section" style="text-align: center; background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(185, 28, 28, 0.1)); border: 1px solid rgba(220, 38, 38, 0.3);">
              <div class="calc-title" style="color: #FCA5A5;">⚠ Invalid Decimal Input</div>
              <div style="color: var(--text-secondary); margin-top: 12px;">
                Please enter a valid decimal number: <code style="color: var(--gt-gold);">-5.25</code>, <code style="color: var(--gt-gold);">123.456</code><br>
                or special values: <code style="color: var(--gt-gold);">inf</code>, <code style="color: var(--gt-gold);">-inf</code>, <code style="color: var(--gt-gold);">nan</code>
              </div>
            </div>
          `
          return
        }
      } else {
        // In binary mode, parse as binary
        const binaryString = inputValue.value.replace(/[^01.]/g, '')
        if (binaryString && isValidBinary(binaryString)) {
          const number = binaryToDecimal(binaryString)
          visualizationHtml.value = generateFloat32Visualization(number, binaryString)
          return
        } else if (inputValue.value.trim() !== '') {
          // Invalid binary input
          visualizationHtml.value = `
            <div class="calc-section" style="text-align: center; background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(185, 28, 28, 0.1)); border: 1px solid rgba(220, 38, 38, 0.3);">
              <div class="calc-title" style="color: #FCA5A5;">⚠ Invalid Binary Input</div>
              <div style="color: var(--text-secondary); margin-top: 12px;">
                Please enter a valid binary number: <code style="color: var(--gt-gold);">100.001</code>, <code style="color: var(--gt-gold);">1101</code><br>
                or special values: <code style="color: var(--gt-gold);">inf</code>, <code style="color: var(--gt-gold);">-inf</code>, <code style="color: var(--gt-gold);">nan</code>
              </div>
            </div>
          `
          return
        }
      }
      
      // Empty input
      if (inputValue.value.trim() === '') {
        visualizationHtml.value = ''
      }
    }

    onMounted(() => {
      updateVisualization()
    })

    return {
      inputValue,
      visualizationHtml,
      updateVisualization,
      showHelp,
      inputMode,
      setInputMode,
      handleKeypress,
      handleInput
    }
  }
}
</script>
