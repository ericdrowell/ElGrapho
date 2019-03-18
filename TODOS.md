# TODOS

## P0
* when creating lots of el grapho graphs, concrete throws error about too many webgl contexts
* lines get fat sometimes when viz stretched.  arrows don't point in right direction when viz is stretched.  this is the same problem
* controls button that live updates step count

## P1
* tests and github CI
* node events should include x,y mouse position, or at least mouse event object
* tooltips are slow in big network graph.
* antialiased nodes - seems to require APIs in webgl2.  Currently using webgl1.
* ability to anchor node in force directed graph, and configure a flow diretion (for example to the right)
* look into Licensing again.  May try dual license. maybe MIT.

## P2
* Radial tree
* consider rework clusters to cluster by edges, not colors.  The result should be less cross connections between clusters
* new chart controls - expand/shrink along x or y
* panning outside viewport messes it up
* can I use ints in glsl where appropriate? Right now using all floats
* back and forward buttons to go through state stack (pan and zoom)
* chord diagram
