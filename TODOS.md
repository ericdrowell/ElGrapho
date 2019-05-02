# TODOS

## P0
* optional alpha effect which builds up color intensity when there's lots of overlapping
* combine pan mode and select mode
* hook up scroll to zoom
* remove zoom in and zoom out buttons
* panning outside viewport messes it up
* lines get fat sometimes when viz stretched.  arrows don't point in right direction when viz is stretched.  this is the same problem
* tests and github CI
* node events should include x,y mouse position, or at least mouse event object
* new optional color attribute to decouple from grouping
* enable animating between models (mostly for marketing reasons)
  * to do this, would have to compute the start and end points for each point, re upload the vertices to the GPU, and then would have smooth animations
  * because the shaders would interpolate between the two points based on a time t
* new chart controls - expand/shrink along x or y
* refactor color implementation in shaders
* chords should have spacing between groups

## P1
* mobile friendly (pinch to zoom)
* Chord diagrams should have arcs for edges, i.e. edge bundling
* new hover effects.  Highlight upstream and downstream edges and nodes
* events should return the node or edge directly, with an index, function(node, index, evt)
* ability to anchor node in force directed graph, and configure a flow diretion (for example to the right)
* when creating lots of el grapho graphs, concrete throws error about too many webgl contexts
* antialiased nodes - seems to require APIs in webgl2.  Currently using webgl1.  webgl2 doesn't work on mobile, so would have to support both.
* can I use ints in glsl where appropriate? Right now using all floats
* back and forward buttons to go through state stack (pan and zoom)
