# El Grapho

![alt text](https://raw.githubusercontent.com/ericdrowell/ElGrapho/master/el-grapho-logo-white.png)

## Summary

El Grapho is a high performance graph visualization library leveraging WebGL and streaming technologies.  El Grapho can support millions of interactive nodes and edges in any modern browser.

## Features
* All data rendering done in GLSL
* high performance hit detection via concrete picking
* scene composites
* animated transitions
* chart controls

## Notes
* V8 engine can only JSON stringify up to 512MB
* glBufferData: cannot allocate more than 1GB.
* 1Gb size limit for GL Array Buffers, which corresponds to about 50M data points for Float 32 bit arrays
* max number of WebGL contexts = 12 on my Mac.  that is 400M interactive data points.  800M non interactive data points
* can render 16M at a time, and then rasterize the result, and then render the next 16M
* Ultimately the bottleneck is how much memory the array buffers take up.  Can support over 100M
* having a dedicated layer per shader program does not help with performance