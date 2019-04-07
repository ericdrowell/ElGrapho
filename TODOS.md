# TODOS

## P0
* node events should include x,y mouse position, or at least mouse event object
* events should return the node or edge directly, with an index, function(node, index, evt)
* new optional color attribute to decouple from grouping
* ability to anchor node in force directed graph, and configure a flow diretion (for example to the right)
* enable animating between models (mostly for marketing reasons)
* panning outside viewport messes it up

## P1
* Chord diagrams should have arcs for edges, i.e. edge bundling
* when creating lots of el grapho graphs, concrete throws error about too many webgl contexts
* lines get fat sometimes when viz stretched.  arrows don't point in right direction when viz is stretched.  this is the same problem
* tests and github CI
* tooltips are slow in big network graph.
* antialiased nodes - seems to require APIs in webgl2.  Currently using webgl1.
* new chart controls - expand/shrink along x or y
* can I use ints in glsl where appropriate? Right now using all floats
* back and forward buttons to go through state stack (pan and zoom)
