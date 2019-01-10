## About Klotski

"Klotski (from Polish klocki—wooden blocks) is a sliding block puzzle thought to have originated in the early 20th century. The name may refer to a specific layout of ten blocks, or in a more global sense to refer to a whole group of similar sliding-block puzzles where the aim is to move a specific block to some predefined location. " from [wikipedia](https://en.wikipedia.org/wiki/Klotski)

## App screenshots

You could choose predefined game position to test the solver
![Game layouts](https://github.com/cedricoode/klotski-app/blob/master/public/layouts.png)

You could try to solve your selected game position by clicking the solve button, once you have a solution, you could use the same button to replay the correct move.
Even better you could use the slider to change the playback speed!
![Game operation](https://github.com/cedricoode/klotski-app/blob/master/public/solver.png)

## Some considerations

1. During the development of the algorithm, I tried various hashing method to save the history of game positions. It turns out [object-hash](https://www.npmjs.com/package/object-hash) is pretty slow no matter how big the object is. It will generally take 5-6 seconds to hash 1000 game positions during the computation. Though it is the obvious choice in regards of the game positions collision, [Zobrist Hashing](https://en.wikipedia.org/wiki/Zobrist_hashing) with a bit higher collision probability is still a sound choice in consideration of its performance, ~40ms for 1000 computations.

2. This application uses BFS algorithm to search for a viable solution, and then visualize the right solution on the page. The default layout is a 4x5 board. It has options to readjust the size of the board. However, this is strongly not recommended, since making the board larger without adding any new pieces onto the board will increase the time of finding a solution exponentially. Running time consuming script is not advised on browser, it will hange the browser. There are multiple techniques to try to solve this problem, one is to use [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker), another is to use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) browser api.
   RequestAnimationFrame Api will not help a lot here, since it runs in the same thread, the only thing it does is to split the computation within the optimal frame rate budget, so it will only lengthen the computation timespan.
   So the next thing I would try is to serialize the puzzle configuration and result then offload the work to a service worker.

## TODO List

- [] offload computation into ServiceWorker
- [] let user configure board pieces initial position
- [] let user configure the success situation of the puzzle, e.g. to move the red piece to the center of the board.
