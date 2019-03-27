const fs = require('fs');
const ForceDirected = require('../../engine/src/layouts/ForceDirected.js');

let NUM_LEVELS = 11;
let MAX_LEVEL_MULTIPLIER = 4;

let model = {
  nodes: [],
  edges: [],
  width: 1000,
  height: 500
};

let edgeIndex = 0;
let levels = [];
let n = 0;
let nodeGroups = {};
let groupIndex = 1;

console.log('building model...');

for (let j=0; j<NUM_LEVELS; j++) {
  levels[j] = [];

  if (j === 0) {
    let group = 0;
    model.nodes[n] = {
      group: group,
      //label: n
    };
    nodeGroups[n] = group;
    levels[j].push(n);
    n++;
  }
  else {
    let lastLevel = levels[j-1];
    let lastLevelLen = lastLevel.length;
    let numNodes = lastLevelLen + lastLevelLen * Math.floor(Math.random() * MAX_LEVEL_MULTIPLIER);

    for (let k=0; k<numNodes; k++) {
      let parentIndex = lastLevel[Math.floor(Math.random() * lastLevelLen)];
      model.edges[edgeIndex] = {
        from: parentIndex,
        to: n
      };
      edgeIndex++;

      if (j === 0) {
        group = 0;
      }
      else if (j === 1) {
        group = groupIndex++;
      }
      else {
        group = nodeGroups[parentIndex];
      }

      model.nodes[n] = {
        group: group,
        label: n
      };
      nodeGroups[n] = group;
      levels[j].push(n);
      n++;
    }
  }
}


console.log('applying layout...');

let startTime = new Date().getTime();
ForceDirected(model);

fs.writeFileSync('gallery/models/bigTree.js', 'const MODEL=' + JSON.stringify(model) + ';', 'utf-8');

let endTime = new Date().getTime();

let timeDiff = (endTime - startTime) / 1000; // seconds
console.log('done!');
console.log('applying layout took ' + timeDiff + ' seconds');


