# Changlog

## v2.3.0
* new edgeSize property
* now supporting usecases where some nodes have labels and some nodes do not

## v2.2.1
* oops, mobile devices don't support webgl2 yet.  Rolled back to webgl
* now using gray color channels, rather than alpha, to focus on groups when clicking.  Results are much nicer.

## v2.2.0
* fast tooltips for large graphs
* smart label zooming
* group focusing on node click, or via graph.selectGroup()
* upgraded to webgl2 and GLSL v3.0

## v2.1.1
* fixed bug related to events firing multiple times when creating multiple graphs
* fixed Concrete dependency issue
* fixed ElGraphoCollection issue in which it was being instantiated everytime a new graph was created
* fixed tooltip hide and show issues

## v2.1.0
* models are now called layouts
* Ring layout renamed to Chord
* Web layout renamed to Hairball
* ForceDirected layouts now using d3-force which is O(nlog(n)) instead of Webcola which is much slower
* new RadialTree layout
* nodeSize range now 0 to 1
* Cluster layout now better positions the cluster centers to fully utilize viewport space

## v2.0.0
* License is now MIT
* new API
* ForceDirected model now using Webcola for layout
* new Web model which is a simplified force directed graph that runs in O(n) time
* node color cycling
* auto viewport fitting

## v1.6.0
* new edges API (see docs)
* labels for nodes
* edge arrows for directed graphs

## v1.5.4
* fix npm export

## v1.5.0
* new ForceDirectedGraph model
* new Ring model
* circle nodes
* node strokes
* better Count aesthetics

## v1.4.0
* all models will now have the same schema.  This enables polymorphism.  Tree model schema has changed
* width and height properties moved to model level
* fixed box zoom for scrolled pages
* auto magic zoom
* removed magicZoom property from graph config
* clusters are now perfectly circle despite width and height ratio
* new debug property for graph config.  Setting it to true shows node and edge count
* chart controls hide when the mouse is moved off of the graph