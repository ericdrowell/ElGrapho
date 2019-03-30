# Changlog

## v2.1.0
* models are now called layouts

## v2.0.0
* License is now MIT!
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
* All models will now have the same schema.  This enables polymorphism.  Tree model schema has changed
* width and height properties moved to model level
* fixed box zoom for scrolled pages
* auto magic zoom
* removed magicZoom property from graph config
* clusters are now perfectly circle despite width and height ratio
* new debug property for graph config.  Setting it to true shows node and edge count
* chart controls hide when the mouse is moved off of the graph