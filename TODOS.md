# TODOS

## P0
* tooltips: false to disable tooltips
* fixed bug with tooltips interfering with chart controls
* dynamic viewport resizing

## P1
* Chord diagrams should have arcs for edges, i.e. edge bundling
* sometimes the first node is already highlighted
* new hover effects.  Highlight upstream and downstream edges and nodes
* node events should include x,y mouse position, or at least mouse event object
* events should return the node or edge directly, with an index, function(node, index, evt)
* panning outside viewport messes it up

## P2
* new optional color attribute to decouple from grouping
* ability to anchor node in force directed graph, and configure a flow diretion (for example to the right)
* enable animating between models (mostly for marketing reasons)
* when creating lots of el grapho graphs, concrete throws error about too many webgl contexts
* lines get fat sometimes when viz stretched.  arrows don't point in right direction when viz is stretched.  this is the same problem
* tests and github CI
* antialiased nodes - seems to require APIs in webgl2.  Currently using webgl1.
* new chart controls - expand/shrink along x or y
* can I use ints in glsl where appropriate? Right now using all floats
* back and forward buttons to go through state stack (pan and zoom)
