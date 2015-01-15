;(function(){

  // @lib https://github.com/bgrins/javascript-astar/blob/master/astar.js
  !function(t){if("object"==typeof module&&"object"==typeof module.exports)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();window.astar=n.astar,window.Graph=n.Graph}}(function(){function t(t){for(var n=t,i=[];n.parent;)i.push(n),n=n.parent;return i.reverse()}function n(){return new o(function(t){return t.f})}function i(t,n){n=n||{},this.nodes=[],this.diagonal=!!n.diagonal,this.grid=[];for(var i=0;i<t.length;i++){this.grid[i]=[];for(var o=0,s=t[i];o<s.length;o++){var r=new e(i,o,s[o]);this.grid[i][o]=r,this.nodes.push(r)}}this.init()}function e(t,n,i){this.x=t,this.y=n,this.weight=i}function o(t){this.content=[],this.scoreFunction=t}var s={search:function(i,e,o,r){i.cleanDirty(),r=r||{};var h=r.heuristic||s.heuristics.manhattan,c=r.closest||!1,u=n(),a=e;for(e.h=h(e,o),u.push(e);u.size()>0;){var f=u.pop();if(f===o)return t(f);f.closed=!0;for(var p=i.neighbors(f),l=0,d=p.length;d>l;++l){var g=p[l];if(!g.closed&&!g.isWall()){var v=f.g+g.getCost(f),y=g.visited;(!y||v<g.g)&&(g.visited=!0,g.parent=f,g.h=g.h||h(g,o),g.g=v,g.f=g.g+g.h,i.markDirty(g),c&&(g.h<a.h||g.h===a.h&&g.g<a.g)&&(a=g),y?u.rescoreElement(g):u.push(g))}}}return c?t(a):[]},heuristics:{manhattan:function(t,n){var i=Math.abs(n.x-t.x),e=Math.abs(n.y-t.y);return i+e},diagonal:function(t,n){var i=1,e=Math.sqrt(2),o=Math.abs(n.x-t.x),s=Math.abs(n.y-t.y);return i*(o+s)+(e-2*i)*Math.min(o,s)}},cleanNode:function(t){t.f=0,t.g=0,t.h=0,t.visited=!1,t.closed=!1,t.parent=null}};return i.prototype.init=function(){this.dirtyNodes=[];for(var t=0;t<this.nodes.length;t++)s.cleanNode(this.nodes[t])},i.prototype.cleanDirty=function(){for(var t=0;t<this.dirtyNodes.length;t++)s.cleanNode(this.dirtyNodes[t]);this.dirtyNodes=[]},i.prototype.markDirty=function(t){this.dirtyNodes.push(t)},i.prototype.neighbors=function(t){var n=[],i=t.x,e=t.y,o=this.grid;return o[i-1]&&o[i-1][e]&&n.push(o[i-1][e]),o[i+1]&&o[i+1][e]&&n.push(o[i+1][e]),o[i]&&o[i][e-1]&&n.push(o[i][e-1]),o[i]&&o[i][e+1]&&n.push(o[i][e+1]),this.diagonal&&(o[i-1]&&o[i-1][e-1]&&n.push(o[i-1][e-1]),o[i+1]&&o[i+1][e-1]&&n.push(o[i+1][e-1]),o[i-1]&&o[i-1][e+1]&&n.push(o[i-1][e+1]),o[i+1]&&o[i+1][e+1]&&n.push(o[i+1][e+1])),n},i.prototype.toString=function(){for(var t,n,i,e,o=[],s=this.grid,r=0,h=s.length;h>r;r++){for(t=[],n=s[r],i=0,e=n.length;e>i;i++)t.push(n[i].weight);o.push(t.join(" "))}return o.join("\n")},e.prototype.toString=function(){return"["+this.x+" "+this.y+"]"},e.prototype.getCost=function(){return this.weight},e.prototype.isWall=function(){return 0===this.weight},o.prototype={push:function(t){this.content.push(t),this.sinkDown(this.content.length-1)},pop:function(){var t=this.content[0],n=this.content.pop();return this.content.length>0&&(this.content[0]=n,this.bubbleUp(0)),t},remove:function(t){var n=this.content.indexOf(t),i=this.content.pop();n!==this.content.length-1&&(this.content[n]=i,this.scoreFunction(i)<this.scoreFunction(t)?this.sinkDown(n):this.bubbleUp(n))},size:function(){return this.content.length},rescoreElement:function(t){this.sinkDown(this.content.indexOf(t))},sinkDown:function(t){for(var n=this.content[t];t>0;){var i=(t+1>>1)-1,e=this.content[i];if(!(this.scoreFunction(n)<this.scoreFunction(e)))break;this.content[i]=n,this.content[t]=e,t=i}},bubbleUp:function(t){for(var n=this.content.length,i=this.content[t],e=this.scoreFunction(i);;){var o,s=t+1<<1,r=s-1,h=null;if(n>r){var c=this.content[r];o=this.scoreFunction(c),e>o&&(h=r)}if(n>s){var u=this.content[s],a=this.scoreFunction(u);(null===h?e:o)>a&&(h=s)}if(null===h)break;this.content[t]=this.content[h],this.content[h]=i,t=h}}},{astar:s,Graph:i}});

  game.on('input', processData)
  respawn()

  function processData(data) {
    // console.time('tick')

    if(playerDied(data.events)) {
      console.log('snake-died')
      return respawn()
    }

    var snake   = data.snakes[0]
      , start   = getSnakePos(snake)
      , behind  = posBehindPos(start, snake.direction)
      , targets = data.foods
      , grid    = processGrid(data.grid, start, behind)
      , path    = shortestArray(getPaths(grid, start, targets))

    if(path.length < 1){
      return console.warn('no path resolved')
    }

    game.emit('output', navigate(start, [path[0].x, path[0].y]))

    // console.timeEnd('tick')
  }

  function processGrid(grid, start, behind) {
    return grid.map(function(row, x){
      return row.map(function(block, y){

        // can touch current pos
        if(posEqual([x,y], start)) return 1

        // can't touch anything that isn't empty or food
        if(block !== 1 && block !== 0) return 0

        // can't touch directly behind
        if(posEqual([x,y], behind)) return 0

        return 1
      })
    })
  }

  function getPaths(grid, start, targets) {
    return targets.map(function(target) {
      return getPath(grid, start, target)
    })
  }

  function shortestArray(arr) {
    return arr.sort(function(a,b) {
      return b.length > 0 && a.length > b.length
    })[0]
  }

  function navigate(pos, target) {
    if(pos[0] > target[0]) return 'LEFT'
    if(pos[0] < target[0]) return 'RIGHT'
    if(pos[1] > target[1]) return 'UP'
    if(pos[1] < target[1]) return 'DOWN'
  }

  function getPath(grid, start, target) {
    var graph = new Graph(grid)
      , graphStart = graph.grid[start[0]][start[1]]
      , graphTarget = graph.grid[target[0]][target[1]]

    return astar.search(graph, graphStart, graphTarget)
  }

  function respawn() {
    game.emit('spawn')
  }

  function playerDied(events) {
    return hasEvent(events, 'snake-die')
  }

  function hasEvent(events, name) {
    return events.length && events.some(function(x) {
      return x.type === name
    })
  }

  function posEqual(a, b) {
    return a[0] === b[0] && a[1] === b[1]
  }

  function getSnakePos(snake){
    return snake.sections[snake.sections.length - 1]
  }

  function posBehindPos(pos, direction) {
    var x = pos[0]
      , y = pos[1]

    x = x + (direction === 'LEFT' ? 1 : direction === 'RIGHT' ? -1 : 0)
    y = y + (direction === 'UP' ? 1 : direction === 'DOWN' ? -1 : 0)

    return [x, y]
  }

})()