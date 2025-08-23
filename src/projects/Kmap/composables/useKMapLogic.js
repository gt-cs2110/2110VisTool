export function useKMapLogic() {
  
  const findGroups = (ones, variables) => {
    if (ones.length === 0) return []

    const onesAsNumbers = ones.map(term => parseInt(term, 2))
    const allPossibleGroups = findAllPossibleGroups(onesAsNumbers, variables)
    allPossibleGroups.sort((a, b) => b.length - a.length)

    // Filter out groups that are subsets of larger groups
    let maximalGroups = allPossibleGroups.filter((group, i, arr) => {
      return !arr.some((other, j) =>
        j !== i &&
        other.length > group.length &&
        group.every(x => other.includes(x))
      )
    })

    // Remove duplicate groups
    maximalGroups = maximalGroups.filter((group, i, arr) => {
      return arr.findIndex(other =>
        other.length === group.length &&
        other.every(x => group.includes(x))
      ) === i
    })

    return maximalGroups.map(group => ({
      terms: group.map(num => num.toString(2).padStart(variables, '0')),
      size: group.length,
      expression: groupToExpression(group, variables)
    }))
  }

  const findAllPossibleGroups = (ones, variables) => {
    const allGroups = []
    const maxSize = Math.pow(2, variables)
    
    for (let size = maxSize; size >= 1; size /= 2) {
      const groupsOfSize = findAllGroupsOfSize(ones, size, variables)
      allGroups.push(...groupsOfSize)
    }
    
    return allGroups
  }

  const findAllGroupsOfSize = (ones, targetSize, variables) => {
    let patterns = {}
    
    if (variables === 2) {
      patterns = {
        1: ones.map(num => [num]),
        2: [
          [0, 1], [2, 3], // horizontal pairs
          [0, 2], [1, 3]  // vertical pairs
        ],
        4: [[0, 1, 2, 3]]
      }
    } else if (variables === 3) {
      patterns = {
        1: ones.map(num => [num]),
        2: [
          [0, 1], [1, 3], [3, 2], [2, 0], // top row adjacencies
          [4, 5], [5, 7], [7, 6], [6, 4], // bottom row adjacencies
          [0, 4], [1, 5], [2, 6], [3, 7]  // vertical pairs
        ],
        4: [
          [0, 1, 3, 2], [4, 5, 7, 6], // horizontal rectangles
          [0, 1, 4, 5], [1, 3, 5, 7], [3, 2, 7, 6], [2, 0, 6, 4], // vertical rectangles
          [0, 2, 4, 6], [1, 3, 5, 7] // diagonal patterns
        ],
        8: [[0, 1, 2, 3, 4, 5, 6, 7]]
      }
    } else if (variables === 4) {
      patterns = {
        1: ones.map(num => [num]),
        2: generate4VarPairs(),
        4: generate4VarQuads(),
        8: generate4VarOctets(),
        16: [[...Array(16).keys()]]
      }
    }

    const validGroups = []
    for (let pattern of patterns[targetSize] || []) {
      if (pattern.every(num => ones.includes(num))) {
        validGroups.push(pattern)
      }
    }
    return validGroups
  }

  const generate4VarPairs = () => {
    const pairs = []
    const gray = [0, 1, 3, 2]

    // Horizontal pairs
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const a = (gray[row] << 2) | gray[col]
        const b = (gray[row] << 2) | gray[(col + 1) % 4]
        pairs.push([a, b])
      }
    }
    // Vertical pairs
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        const a = (gray[row] << 2) | gray[col]
        const b = (gray[(row + 1) % 4] << 2) | gray[col]
        pairs.push([a, b])
      }
    }
    return pairs
  }

  const generate4VarQuads = () => {
    const quads = []
    const gray = [0, 1, 3, 2]

    // 2x2 blocks
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        quads.push([
          (gray[row] << 2) | gray[col],
          (gray[row] << 2) | gray[(col + 1) % 4],
          (gray[(row + 1) % 4] << 2) | gray[col],
          (gray[(row + 1) % 4] << 2) | gray[(col + 1) % 4]
        ])
      }
    }

    // 1x4 horizontal (entire row)
    for (let row = 0; row < 4; row++) {
      quads.push([
        (gray[row] << 2) | gray[0],
        (gray[row] << 2) | gray[1],
        (gray[row] << 2) | gray[2],
        (gray[row] << 2) | gray[3]
      ])
    }

    // 4x1 vertical (entire column)
    for (let col = 0; col < 4; col++) {
      quads.push([
        (gray[0] << 2) | gray[col],
        (gray[1] << 2) | gray[col],
        (gray[2] << 2) | gray[col],
        (gray[3] << 2) | gray[col]
      ])
    }

    return quads
  }

  const generate4VarOctets = () => {
    const octets = []
    const gray = [0, 1, 3, 2]

    // 2x4 blocks (two rows)
    for (let row = 0; row < 4; row++) {
      const octet = []
      for (let dr = 0; dr < 2; dr++) {
        for (let col = 0; col < 4; col++) {
          octet.push((gray[(row + dr) % 4] << 2) | gray[col])
        }
      }
      octets.push(octet)
    }

    // 4x2 blocks (two columns)
    for (let col = 0; col < 4; col++) {
      const octet = []
      for (let row = 0; row < 4; row++) {
        for (let dc = 0; dc < 2; dc++) {
          octet.push((gray[row] << 2) | gray[(col + dc) % 4])
        }
      }
      octets.push(octet)
    }

    return octets
  }

  const groupToExpression = (group, variables) => {
    if (group.length === 1) {
      return termToExpression(group[0].toString(2).padStart(variables, '0'), variables)
    }
    
    const firstTerm = group[0].toString(2).padStart(variables, '0')
    const constants = []
    
    for (let i = 0; i < variables; i++) {
      const bit = firstTerm[i]
      if (group.every(num => {
        const term = num.toString(2).padStart(variables, '0')
        return term[i] === bit
      })) {
        constants.push({
          variable: ['A', 'B', 'C', 'D'][i],
          value: bit
        })
      }
    }
    
    if (constants.length === 0) return '1'
    
    return constants.map(c => c.value === '1' ? c.variable : c.variable + "'").join('')
  }

  const termToExpression = (term, variables) => {
    const variableNames = ['A', 'B', 'C', 'D'].slice(0, variables)
    return term.split('').map((bit, index) => {
      return bit === '1' ? variableNames[index] : variableNames[index] + "'"
    }).join('')
  }

  const generateSimplifiedExpression = (kmap, groups, variables) => {
    const ones = Object.keys(kmap).filter(key => kmap[key] === '1')
    
    if (ones.length === 0) {
      return 'F = 0'
    }
    
    if (groups.length === 0) {
      const minterms = ones.map(term => termToExpression(term, variables))
      return 'F = ' + minterms.join(' + ')
    } else {
      const expressions = groups.map(group => group.expression)
      return 'F = ' + expressions.join(' + ')
    }
  }

  return {
    findGroups,
    generateSimplifiedExpression
  }
}
