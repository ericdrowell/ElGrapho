# El Grapho

<img width="300" src="https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/img/elgrapho.png"/>

## Website

https://www.elgrapho.com/

## What is El Grapho?

<img width="800" src="https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/img/elgrapho-examples.png"/>

El Grapho is a high performance WebGL graph data visualization engine.  El Grapho can support millions of interactive nodes and edges in any modern browser.

## Why Would I Use This?

If you need to build a graph visualization for the web of any kind, such as a tree, force directed graph, network graph, etc., and scale and performance are important to you, then El Grapho is a great option.  It was built from the ground up to optimize for CPU and GPU performance.

## Live Examples

* https://codepen.io/ericdrowell/pen/qLYrEm
* https://codepen.io/ericdrowell/pen/wNRyoZ

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
      xs:     [0,  -0.4, 0.4, -0.6, -0.2,  0.2,  0.6],
      ys:     [0.6, 0,   0,   -0.6, -0.6, -0.6, -0.6],
      colors: [0,   1,   1,      2,    2,    2,    2]
    },
    edges: {
      from: [0, 0, 1, 1, 2, 2],
      to:   [1, 2, 3, 4, 5, 6]
    },
    width: 800,
    height: 400
  }
});
```

* ```container``` - DOM element that will contain the El Grapho graph.

* ```model.nodes``` - object that defines the nodes in the graph (graphs are made up of nodes and edges).  Each node is defined by a position (x and y), and also a color.  El Grapho x and y ranges are between -1 and 1.  If x is -1, then the node position is on the very left of the viewport.  If x is 0 it is in the center.  And if x is 1 it is on the very right of the viewport.  Colors are integer values between 0 and 7.  These integer values map to the El Grapho color palette.  

* ```model.edges``` - object that defines the edges between nodes based on their indices.  Each edge is defined by a from-node-index and a to-node-index.  In the example above, the first edge begins at node ```0``` and ends at node ```1```.  For non directed graphs, or bi-directional graphs, ```from``` and ```to``` are interchangeable. 

* ```model.width``` - number that defines the width of the El Grapho viewport in pixels.

* ```model.height``` - number defines the height of the El Grapho viewport in pixels.

* ```animations``` - boolean that defines animation strategy.  When animations is true, zoom and pan transitions will be animated.  Otherwise the transitions will be immediate.  Although animations utilize requestAnimationFrame for dynamic frame rates, in some situations you may prefer to set animations to false to improve transition performance for very high cardinality graphs with millions of nodes and edges.  The default is true.

* ```debug``` - boolean that can be used to enable debug mode.  Debug mode will show the node and edge count in the bottom right corner of the visualization.  The default is false.

* ```arrows``` - boolean that enables or disables edge arrows. For non directed or bi-directional graphs, you should set ```arrows``` to ```false```.  The default is true. 

* ```labels``` - array of strings used to define labels for each node.  If your visualization has 100 nodes, there should be 100 strings in the ```labels``` array.  The default is an empty array which results in no labels.

### Models

Determining the positions of the nodes for your graph can be alot of work!  While it's nice to have the power to construct custom graph shapes, most El Grapho users will want to leverage the provided El Grapho models which will generate node positions for you.  Currently, ElGrapho supports ```Tree```, ```Ring```, ```Cluster```, and ```ForceDirectedGraph```

#### Tree Model

```
let modelConfig = {
  nodes: {
    colors: [0, 1, 1, 2, 2, 3, 3]
  },
  edges: {
    from: [0, 0, 1, 1, 2, 2],
    to:   [1, 2, 3, 4, 5, 6]
  },
  width: 800,
  height: 400
};

let graph = new ElGrapho({
  container: document.getElementById('container'),
  model: ElGrapho.models.Tree(modelConfig)
});
```

#### Ring Model

```
let modelConfig = {
  nodes: {
    colors: [0, 1, 1, 2, 2, 3, 3]
  },
  edges: {
    from: [0, 0, 1, 1, 2, 2],
    to:   [1, 2, 3, 4, 5, 6]
  },
  width: 800,
  height: 400
};

let graph = new ElGrapho({
  container: document.getElementById('container'),
  model: ElGrapho.models.Ring(modelConfig)
});
```

#### Cluster Model

```
let modelConfig = {
  nodes: {
    colors: [0, 1, 1, 2, 2, 2, 2, 2]
  },
  edges: {
    from: [0, 0, 0, 0, 0, 0, 0, 0],
    to:   [1, 2, 3, 4, 5, 6, 7, 8]
  },
  width: 800,
  height: 400
};

let graph = new ElGrapho({
  container: document.getElementById('container'),
  model: ElGrapho.models.Cluster(modelConfig)
});
```

The Cluster model clusters nodes by color.  If a single color is used for all of the nodes, ElGrapho will generate a single centered cluster.  If there are several colors used, ElGrapho will render distinct clusters.  Because Cluster models can be generated in ```O(n)``` time, i.e. linear time, they are very fast to construct compared to other models such as force directed graphs which are polynomial in time.

#### ForceDirectedGraph Model

```
let modelConfig = {
  nodes: {
    colors: [0, 1, 1, 2, 2, 2, 2, 2]
  },
  edges: {
    from: [0, 0, 0, 0, 0, 0, 0, 0],
    to:   [1, 2, 3, 4, 5, 6, 7, 8]
  },
  width: 800,
  height: 400
};

let graph = new ElGrapho({
  container: document.getElementById('container'),
  model: ElGrapho.models.ForceDirectedGraph(modelConfig)
});
```

The ```ForceDirectedGraph``` uses a physics simulator to repel and attract nodes in order to generate natural layouts.  Be warned that force directed graphs take O(n^2) time, which means they may not be appropriate for generating models on the client with lots of nodes.  If it's possible to build your models in advance, it's a good idea to build the force directed graph model on the server and then cache it.  If you require your models to be constructed at execution time, and the number of nodes is very high, you may consider using an O(n) model such as ```Cluster```

The ```ForceDirectedGraph``` model accepts a ```steps``` property from the modelConfig which can be used to define the accuracy of the result.  This is because force directed graphs require multiple passes to obtain the final result.  The default is 10.  Lowering this number will result in faster model construction but less accurate results.  Increasing this number will result in slower model construction but more accurate results. 

## Model Polymorphism

You may have noticed that the model config schema is identical for all models.  As a result, El Grapho visualizations are polymorphic, meaning you can pass the same data structure into different models and get different graph visualizations.  Pretty cool!

## Server Side Model Generation

Because the El Grapho models are fully decoupled from the rendering engine itself, they can be executed on the client or on the server, depending on your needs.  For really complex models, it may be best to build the model on the server side and then deliver the output over http to the browser, and passed directly into the El Grapho config.

## Controls

El Grapho has controls in the upper right corner of the visualization that enable users to navigate large and complex graphs.  These controls appear when you mouseover the visualizztion.  There are three modes:

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





