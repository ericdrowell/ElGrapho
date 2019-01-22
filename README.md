# El Grapho

<img width="300" src="https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/img/el-grapho-logo-white.png"/>

## What is El Grapho?

El Grapho is a high performance graph data visualization engine that leverages WebGL and streaming technologies.  El Grapho can support millions of interactive nodes and edges in any modern browser.

## Why Would I Use This?

If you need to build a graph visualization for the web of any kind, such as a tree, force directed graph, network graph, etc., and you want it to really scale and be super performant, then El Grapho is a great option.  It was built from the ground up to scale as much as possible given modern constraints of browser execution speeds and OpenGL shader performance on GPUs.

## What Does it Look Like?

<img width="800" src="https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/img/el-grapho-example-tree.png"/>

<img width="800" src="https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/img/el-grapho-big-network.png"/>

<img width="800" src="https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/img/el-grapho-spiral.png"/>

## Live Examples

* https://codepen.io/ericdrowell/pen/qLYrEm

## Getting Started

To get started, you can install it from npm like this

```npm install elgrapho```

or you can download the latest El Grapho distribution file found here 

https://github.com/ericdrowell/ElGrapho/blob/master/engine/dist/ElGrapho.min.js

## API

To create a simple El Grapho data visualization, you can instantiate a new graph like this

```
let graph = new ElGrapho({
  container: document.getElementById('container'),

  model: {
    nodes: {
      xs:     new Float32Array([0,  -0.4, 0.4, -0.6, -0.2,  0.2,  0.6]),
      ys:     new Float32Array([0.6, 0,   0,   -0.6, -0.6, -0.6, -0.6]),
      colors: new Float32Array([0,   1,   1,    2,    2,    2,    2])
    },
    edges: new Float32Array([
      0, 1, 
      0, 2, 
      1, 3,
      1, 4,
      2, 5,
      2, 6
    ])
  },

  width: 800,
  height: 400
});
```

### container

The ```container``` config property defines the DOM element that will contain the El Grapho graph.

### nodes

The ```nodes``` object contains information about all of the nodes in the graph (graphs are made up of nodes and edges).  Each node is defined by a position (x and y), and also a color.  El Grapho x and y ranges are between -1 and 1.  For example, if x is -1, then the node position is on the very left of the viewport.  If x is 0 it is in the center.  And if x is 1 it is on the very right of the viewport.  Colors are integer values between 0 and 7.  These integer values map to the El Grapho color palette.  

### edges

The ```edges``` array defines the edges between nodes based on their indices.  In the example above, the first edge begins at node ```0``` and ends at node ```1```.  For non directed graphs, or bi-directional graphs, the order of the first node and second node do not matter.  However, for directed graphs, the first index is the *from* node, and the second index is the *to* node.

### width and height

The ```width``` and ```height``` properties simply define the width and height of the El Grapho viewport in pixels.

### Models

Determining the positions of the nodes for your graph can be alot of work!  While it's nice to have the power to construct custom graph shapes, most El Grapho users will want to leverage the provided El Grapho models which will generate node positions and edge relationships for you.  Currently, ElGrapho supports ```Tree``` and ```Spiral```

#### Tree Model

```
let rootNode = {
  children: [
    {
      children: [
        {},
        {}
      ]
    },
    {
      children: [
        {},
        {}
      ]
    }
  ]
};

let graph = new ElGrapho({
  container: document.getElementById('container'),
  model: ElGrapho.models.Tree({
    rootNode: rootNode
  }),
  width: 800,
  height: 400
});
```

The ```Tree``` model takes in a nested tree structure and builds the nodes and edges for you.  In this example, the root node has two children, and each of those children have two children of their own.  In other words, this is a simple binary tree with two levels.  For more complex trees, you could have super complex trees with over one million nodes.

#### Spiral Model

```
let graph = new ElGrapho({
  container: document.getElementById('container'),
  model: ElGrapho.models.Spiral({
    nodes: {
      colors: [0, 1, 1, 2, 2, 2, 2, 2]
    },
    edges: [
      0, 1,
      0, 2, 
      0, 3,
      0, 4,
      0, 5,
      0, 6,
      0, 7,
      0, 8
    ]
  }),
  width: 800,
  height: 400
});
```

The ```Spiral``` model takes in an array of colors, and an array of edges.  The config is identical to the raw ```model``` schema except that the ```xs``` and ```ys``` are generated for you.  If a single color is used for all of the nodes, ElGrapho will generate a single centered spiral.  If there are several colors used, ElGrapho will cluster the spirals separately.  Because Spiral models can be generated in ```O(n)``` time, i.e. linear time, they are very fast to construct compared to other models such as force directed graphs which are polynomial in time.

## Server Side Model Generation

Because the El Grapho models are fully decoupled from the rendering engine itself, they can be executed on the client or on the server, depending on your needs.  For really complex models, it may be best to build the model on the server side and then deliver the output over http to the browser, and passed directly into the El Grapho config.

## Controls

El Grapho has controls in the upper right corner of the visualization that enable users to navigate large and complex graphs.  There are three modes:

* __select__ - use this mode to select nodes
* __zoom__ - use this mode to draw zoom boxes around areas of interest or to zoom into a particular region of the graph
* __pan__ - use this mode to pan the visualization around

And there are three action buttons:

* __reset__
* __zoom in__
* __zoom out__

## Tooltips

El Grapho ships with a default template and default content.  It is assumed however that you will be providing your own tooltip content (at the end of the day, most people want something custom anyways).  To set the tooltip template, simple do the following:

```
let graph = new ElGrapho(config);

graph.tooltipTemplate = function(index, el) {
  el.innerHTML = 'node index: ' + index;
};
```

This means that your tooltips can be anything!  You can show lots of information about the node, insert images, etc.

## Events

El Grapho also has a built in event bus.  Currently, the supported events are:

* ```idle```
* ```node-mouseover```
* ```node-mouseout```
* ```node-click```

and you can use these events like this:

```
let graph = new ElGrapho(config);

graph.on('idle', function() {
  console.log('idle');
});

graph.on('node-mouseover', function(evt) {
  console.log('node-mouseover: ' + evt.dataIndex);
});
```

## About the Name and Logo

Why is this called El Grapho? - *Why not?*

Okay... and why is the logo a skeleton with a rose in his mouth? - *Why not?*





