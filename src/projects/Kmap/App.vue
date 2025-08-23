<template>
  <div class="kmap-app container">
    <header>
      <h1>Boolean Logic Simplifier</h1>
      <p class="subtitle">Advanced Karnaugh Map Visualization & Analysis Tool</p>
    </header>

    <div class="controls">
      <div class="control-group">
        <label>Number of Variables</label>
        <div class="variable-controls">
          <Button 
            v-for="num in [2, 3, 4]" 
            :key="num"
            :class="{ active: variables === num }"
            @click="setVariables(num)"
            :severity="variables === num ? 'primary' : 'secondary'"
          >
            {{ num }} Variables
          </Button>
        </div>
      </div>
      <div class="control-group">
        <label>Actions</label>
        <div class="action-controls">
          <Button @click="clearKMap">Clear K-Map</Button>
          <Button @click="randomFill">Random Fill</Button>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="kmap-section">
        <h2 class="section-title">Karnaugh Map</h2>
        <KMapGrid 
          :variables="variables"
          :kmap="kmap"
          @toggle-cell="toggleCell"
        />
        <p class="kmap-instructions">
          Click cells to toggle between 0 and 1<br>
          <small>K-map groupings will automatically appear below once you add values</small>
        </p>

        <!-- K-map Groupings Section moved here -->
        <div class="groups-container" style="margin-top: 2rem;">
          <h4 class="groupings-title">K-map Groupings</h4>
          <div>
            <div 
              v-if="groups.length === 0"
              class="group-item no-groupings"
            >
              <strong>No K-map Groupings Found</strong><br>
            </div>
            <div 
              v-else
              v-for="(group, index) in groups" 
              :key="index"
              class="group-item fade-in"
            >
              <strong>Grouping {{ index + 1 }}:</strong> {{ group.terms.join(', ') }}<br>
              <em>Simplified Form: {{ group.expression }}</em>
            </div>
          </div>
        </div>
      </div>

      <div class="analysis-section">
        <h2 class="section-title">Analysis</h2>
        
        <TruthTable 
          :variables="variables"
          :kmap="kmap"
        />

        <div>
          <h4 class="expression-title">Simplified Expression</h4>
          <div class="expression-display">
            {{ simplifiedExpression }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import KMapGrid from './components/KMapGrid.vue'
import TruthTable from './components/TruthTable.vue'
import { useKMapLogic } from './composables/useKMapLogic'

export default {
  name: 'App',
  components: {
    KMapGrid,
    TruthTable
  },
  setup() {
    const variables = ref(3)
    const kmap = reactive({})
    
    const { 
      findGroups, 
      generateSimplifiedExpression 
    } = useKMapLogic()

    const groups = ref([])
    
    const simplifiedExpression = computed(() => {
      return generateSimplifiedExpression(kmap, groups.value, variables.value)
    })

    const setVariables = (num) => {
      variables.value = num
      clearKMap()
    }

    const toggleCell = (minterm) => {
      if (kmap[minterm] === '1') {
        delete kmap[minterm]
      } else {
        kmap[minterm] = '1'
      }
      updateGroups()
    }

    const clearKMap = () => {
      Object.keys(kmap).forEach(key => delete kmap[key])
      groups.value = []
    }

    const randomFill = () => {
      clearKMap()
      const numCells = Math.pow(2, variables.value)
      
      for (let i = 0; i < numCells; i++) {
        const binary = i.toString(2).padStart(variables.value, '0')
        if (Math.random() > 0.5) {
          kmap[binary] = '1'
        }
      }
      updateGroups()
    }

    const updateGroups = () => {
      const ones = Object.keys(kmap).filter(key => kmap[key] === '1')
      groups.value = findGroups(ones, variables.value)
    }

    // Watch for changes in variables to update groups
    watch(variables, () => {
      updateGroups()
    })

    return {
      variables,
      kmap,
      groups,
      simplifiedExpression,
      setVariables,
      toggleCell,
      clearKMap,
      randomFill
    }
  }
}
</script>

<style>
/* Kmap component styles - fully restored & scoped */
.kmap-app {
  --gt-navy: #003057;
  --gt-gold: #B3A369;
  --gt-tech-gold: #EAAA00;
  --gt-light-gold: #F7F3E9;
  --gt-dark-navy: #001B35;
  --gt-accent: #8BB8E8;
  --shadow: rgba(0, 48, 87, 0.15);
  --light-shadow: rgba(0, 48, 87, 0.08);
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, var(--gt-light-gold) 0%, #ffffff 100%);
  color: var(--gt-navy);
  line-height: 1.6;
  min-height: 100vh;
}

.kmap-app header {
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--gt-navy) 0%, var(--gt-dark-navy) 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 24px var(--shadow);
  position: relative;
  overflow: visible;
  min-height: 80px;
}

.kmap-app h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: linear-gradient(45deg, white, var(--gt-tech-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.kmap-app .subtitle { font-size: .95rem; opacity: .9; color: var(--gt-light-gold); }

.kmap-app .controls {
  background: white; padding:1.5rem; border-radius:10px; margin-bottom:1.5rem;
  box-shadow:0 3px 15px var(--light-shadow); border:1px solid rgba(179,163,105,.2);
}
.kmap-app .control-group { margin-bottom:1rem; }
.kmap-app .control-group:last-child { margin-bottom:0; }
.kmap-app .control-group label { display:block; font-weight:600; color:var(--gt-navy); margin-bottom:.5rem; font-size:.85rem; text-transform:uppercase; letter-spacing:.5px; }
.kmap-app .variable-controls, .kmap-app .action-controls { display:flex; gap:.75rem; flex-wrap:wrap; }

/* Layout */
.kmap-app .main-content { display:grid; grid-template-columns: 2fr 1fr; gap:2rem; margin-bottom:1rem; }
.kmap-app .kmap-section, .kmap-app .analysis-section { background:white; border-radius:10px; padding:1.5rem; box-shadow:0 3px 15px var(--light-shadow); border:1px solid rgba(179,163,105,.2); }
.kmap-app .section-title { color:var(--gt-navy); font-size:1.25rem; font-weight:700; margin-bottom:1rem; text-align:center; position:relative; padding-bottom:.4rem; }
.kmap-app .section-title::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:60px; height:3px; background:linear-gradient(90deg,var(--gt-gold) 0%, var(--gt-tech-gold) 100%); border-radius:2px; }

/* K-map instructions */
.kmap-app .kmap-instructions { text-align:center; margin-top:1rem; color:#666; font-size:.9rem; line-height:1.5; }
.kmap-app .kmap-instructions small { opacity:.8; }
.kmap-app .groupings-title { margin-bottom:1rem; color:var(--gt-navy); font-size:1.1rem; font-weight:600; }
.kmap-app .expression-title { margin:1.5rem 0 1rem; color:var(--gt-navy); font-weight:600; }

/* K-Map grid */
.kmap-app .kmap { display:grid; gap:1px; background:var(--gt-gold); border-radius:8px; overflow:hidden; margin:0 auto; box-shadow:0 4px 16px var(--light-shadow); }
.kmap-app .kmap-2var { grid-template-columns:auto 1fr 1fr; grid-template-rows:auto 1fr 1fr; max-width:300px; }
.kmap-app .kmap-3var { grid-template-columns:auto repeat(4,1fr); grid-template-rows:auto repeat(2,1fr); max-width:400px; }
.kmap-app .kmap-4var { grid-template-columns:auto repeat(4,1fr); grid-template-rows:auto repeat(4,1fr); max-width:450px; }
.kmap-app .kmap-header, .kmap-app .kmap-label { background:var(--gt-navy); color:white; padding:.75rem; font-weight:600; text-align:center; font-size:.85rem; display:flex; align-items:center; justify-content:center; border:1px solid rgba(179,163,105,.3); }
.kmap-app .kmap-cell { background:white; padding:.75rem; text-align:center; font-weight:700; font-size:1rem; cursor:pointer; transition:all .2s ease; display:flex; align-items:center; justify-content:center; min-height:40px; position:relative; border:2px solid transparent; z-index:1; }
.kmap-app .kmap-cell:hover { background:var(--gt-light-gold); border-color:var(--gt-gold); transform:scale(1.02); z-index:2; box-shadow:0 2px 8px var(--light-shadow); }
.kmap-app .kmap-cell.value-1 { background:linear-gradient(135deg,var(--gt-tech-gold) 0%, var(--gt-gold) 100%); color:var(--gt-navy); border-color:var(--gt-gold); box-shadow:0 2px 8px rgba(179,163,105,.3); }
.kmap-app .kmap-cell.value-0 { background:#f8fafc; color:#64748b; border-color:rgba(179,163,105,.2); }

/* Truth table */
.kmap-app .truth-table-container { overflow-x:auto; border-radius:8px; box-shadow:0 2px 8px var(--light-shadow); margin-bottom:1.5rem; }
.kmap-app .truth-table { width:100%; border-collapse:collapse; background:white; color:var(--gt-navy); }
.kmap-app .truth-table th { background:var(--gt-navy); color:white; padding:.75rem; font-weight:600; text-align:center; font-size:.9rem; text-transform:uppercase; letter-spacing:.5px; }
.kmap-app .truth-table td { padding:.75rem; text-align:center; border-bottom:1px solid rgba(179,163,105,.2); font-family:'Courier New', monospace; font-weight:500; color:var(--gt-navy); }
.kmap-app .truth-table tr:nth-child(even) { background:var(--gt-light-gold); }
.kmap-app .truth-table tr:hover { background:rgba(179,163,105,.1); }

/* Groups */
.kmap-app .groups-container { background:linear-gradient(135deg, rgba(255,255,255,.95) 0%, rgba(247,243,233,.95) 100%); border-radius:10px; padding:1.5rem; margin-bottom:1rem; border:2px solid var(--gt-gold); box-shadow:0 3px 15px var(--light-shadow); backdrop-filter:blur(10px); }
.kmap-app .group-item { background:linear-gradient(135deg,#ffffff 0%, #fafafa 100%); padding:1rem; border-radius:6px; margin-bottom:.75rem; border-left:3px solid var(--gt-tech-gold); box-shadow:0 2px 8px rgba(0,48,87,.1); transition:all .3s ease; border:1px solid rgba(179,163,105,.2); }
.kmap-app .group-item:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,48,87,.15); border-left-color:var(--gt-navy); }
.kmap-app .group-item:last-child { margin-bottom:0; }
.kmap-app .group-item strong { color:var(--gt-navy); font-weight:600; font-size:1rem; }
.kmap-app .group-item em { color:var(--gt-tech-navy); font-weight:500; font-style:normal; }
.kmap-app .group-item.no-groupings { background:linear-gradient(135deg, rgba(255,243,224,.8) 0%, rgba(224,228,5,.8) 100%); border-left-color:#ff9800; text-align:center; font-style:italic; color:#795548; }

/* Expression display */
.kmap-app .expression-display { background:linear-gradient(135deg,var(--gt-navy) 0%, var(--gt-dark-navy) 100%); color:white; padding:1rem; border-radius:6px; font-size:1rem; font-weight:600; text-align:center; box-shadow:0 3px 12px var(--shadow); border:2px solid var(--gt-gold); }

/* Animations */
.kmap-app .fade-in { animation: fadeInUp .5s ease-out forwards; }
@keyframes fadeInUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }

/* PrimeVue button theming (scoped via prefix) */
.kmap-app button[data-pc-name="button"],
.kmap-app .p-component.p-button,
.kmap-app [data-pc-name="button"] {
  background:linear-gradient(135deg,var(--gt-gold) 0%, var(--gt-tech-gold) 100%);
  color:var(--gt-navy);
  border:2px solid var(--gt-gold);
  padding:.75rem 1.25rem;
  border-radius:6px; font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.5px;
  transition:all .25s ease; cursor:pointer; box-shadow:0 2px 4px rgba(179,163,105,.2);
}
.kmap-app button[data-pc-name="button"]:hover,
.kmap-app .p-component.p-button:hover,
.kmap-app [data-pc-name="button"]:hover { background:linear-gradient(135deg,var(--gt-tech-gold) 0%, #d4af37 100%); transform:translateY(-2px); box-shadow:0 4px 10px rgba(179,163,105,.3); }
.kmap-app button[data-pc-name="button"].active,
.kmap-app .p-component.p-button.active,
.kmap-app [data-pc-name="button"].active { background:linear-gradient(135deg,var(--gt-navy) 0%, var(--gt-dark-navy) 100%); color:#fff; border-color:var(--gt-navy); }

/* Responsive */
@media (max-width: 900px) { .kmap-app .main-content { grid-template-columns:1fr; gap:1.5rem; } }
@media (max-width: 600px) { .kmap-app h1 { font-size:1.7rem; } .kmap-app .kmap { font-size:.9rem; } }
</style>
