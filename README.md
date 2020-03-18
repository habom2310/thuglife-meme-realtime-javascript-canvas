# Thuglife is all you need

![Alt text](result.JPG)

This cool project is done completely in javascript and is ready to deploy to any simple webserver without any worry about computation because it will run in the user side.

<b>Live demo</b> https://habom2310.github.io/2020/03/04/thug-life-simulator/

# Run

- `index.html` uses `thuglife_implement_video.js` and run thuglife in video.
- `index1.html` uses `thuglife_implement_image.js` and run thuglife in a single image.

You might get the error `URL scheme must be "http" or "https" for CORS request` when you run it simply by open the `index.html` in the browser because face detection model can only be loaded via http or https, so run a http server to load it.

- If you have python, serve a simple http server by `python -m http.server` (inside project folder) and then open your browser `localhost:8000` (Port 8000 is used by default, you can change it if you want).

# TODO
- The function `resize_and_rotate` (to sclae and rotate the sunglasses) works fine but can't draw it into canvas.


Any idea is welcome at khanhhanguyen2310@gmail.com