// https://poly.pizza/m/5nWeu4IQXVX
// Liz Reddington @ https://lizred.artstation.com/
// CCA https://creativecommons.org/licenses/by/3.0/
// simplified - some geometry dropped

export default {
    body: {
        vertices: [2.6,.58,10,2.9,.55,10,2.9,.76,10,2.6,.72,10,2.03,1.3,0,0,.87,0,2.03,0,0,0,.44,0,2.9,.55,10,2.6,.58,10,3.5,.58,10,6.1,.44,0,6.1,.87,0,3.5,.72,10,0,.44,0,0,.87,0,4.07,1.3,0,6.1,.87,0,6.1,.44,0,4.07,0,0,3.2,.55,10,3.5,.58,10,3.2,.76,10,3.2,.55,10].map(x=>x/10),
        uv: [.38,0,.46,0,.46,.25,.38,.25,.46,.5,.38,.5,.46,.75,.38,.75,.46,1,.38,1,.63,0,.88,0,.88,.25,.63,.25,.13,0,.13,.25,.54,.5,.63,.5,.63,.75,.54,.75,.54,1,.63,1,.54,.25,.54,0],
        indices: [0,1,2,0,2,3,3,2,4,3,4,5,5,4,6,5,6,7,7,6,8,7,8,9,10,11,12,10,12,13,14,0,3,14,3,15,16,17,18,16,18,19,20,19,18,20,18,21,22,23,10,22,10,13,16,22,13,16,13,17,4,16,19,4,19,6,2,1,23,2,23,22,8,6,19,8,19,20,4,2,22,4,22,16]
      },
      fin: {
        vertices: [3.08,1.2,7.02,.48,4.84,1.42,.12,4.84,1.44,2.45,1.2,7.02,.35,4.84,0,0,4.84,.02,2.53,1.84,1.47,1.6,1.84,1.47,3.08,1.2,7.02,2.45,1.2,7.02,0,4.84,.02,1.6,1.84,1.47,2.53,1.84,1.47,.35,4.84,0,4.18,.3,9.9,3.31,1.32,8.25,2.29,1.11,8.32,2.74,0,10,2.43,2.13,.92,1.42,1.92,.99,3.32,.77,1.79,1.88,.47,1.89,1.42,1.92,.99,1.88,.47,1.89,3.32,.77,1.79,2.43,2.13,.92].map(x=>x/10),
        uv: [.38,0,.38,.25,.63,.25,.63,0,.38,.5,.63,.5,.38,.75,.63,.75,.38,1,.63,1,.88,.25,.88,0,.13,0,.13,.25,.38,0,.38,.25,.63,.25,.63,0,.38,.5,.63,.5,.38,.75,.63,.75,.88,.25,.88,0,.13,0,.13,.25],
        indices: [0,1,2,0,2,3,1,4,5,1,5,2,4,6,7,4,7,5,6,8,9,6,9,7,3,2,10,3,10,11,12,13,1,12,1,0,14,15,16,14,16,17,15,18,19,15,19,16,18,20,21,18,21,19,17,16,22,17,22,23,24,25,15,24,15,14]
      },
      wing: {
        vertices: [7.73,.1,10,7.73,.46,10,5.37,.43,7.35,5.37,.14,7.35,5.33,.57,.85,3.55,.5,.56,5.33,0,.85,3.55,.07,.56,7.73,.1,10,5.37,.14,7.35,.65,.21,2.05,.65,.36,2.05,0,.36,0,0,.21,0,1.78,.43,.28,1.78,.14,.28,0,.21,0,0,.36,0,3.01,.17,4.7,.65,.21,2.05,3.01,.39,4.7,3.01,.17,4.7].map(x=>x/10),
        uv: [.38,0,.38,.25,.46,.25,.46,0,.38,.5,.46,.5,.38,.75,.46,.75,.38,1,.46,1,.63,0,.63,.25,.88,.25,.88,0,.54,.5,.54,.75,.63,.75,.63,.5,.54,1,.63,1,.54,.25,.54,0],
        indices: [0,1,2,0,2,3,1,4,5,1,5,2,4,6,7,4,7,5,6,8,9,6,9,7,10,11,12,10,12,13,14,15,16,14,16,17,18,19,16,18,16,15,20,11,10,20,10,21,14,17,11,14,11,20,5,7,15,5,15,14,9,18,15,9,15,7,2,20,21,2,21,3,5,14,20,5,20,2]
      }
}