# Re/Place Frontend
This is a remake of [r/Place](https://www.reddit.com/r/place/).

See it in action here: https://replace-frontend.vercel.app/

You can take a look at the back-end here: https://github.com/cmoyates/RePlace-Backend

## How does it work?
- There's a 2D grid of colors in the backend that gets reflected in the frontend whenever someone opens the page.
- Whenever someone clicks on the canvas, a square of their selected color gets placed where they clicked, and a message gets sent to the server detailing what happened.
- The server then updates its grid, and sends out messages to all of the other open frontends, telling them to make the same change on their canvases.
- When the server shuts down, the current backend grid gets uploaded to a [MongoDB](https://www.mongodb.com/) database, and when the server starts up again, it loads the data back in from there.

## To-Do
- [x] Set pixels on canvas
- [x] Connect to backend via websocket
- [x] Edit backend grid when place pixel
- [x] Load pixels from backend grid on load
- [x] Update canvas when another use places a pixel
- [x] Be able to select pixel color
- [x] Canvas persistent through server restarts
- [ ] Save button
- [ ] "Polish"
