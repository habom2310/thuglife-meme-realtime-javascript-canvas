const glass_img = new Image();
glass_img.src = "glass2.png";

const smoke_img = new Image();
smoke_img.src = "smoke2.png";

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models')
  ]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    // canvas.style.position = "absolute"
    // canvas.style.left = "0"
    // canvas.style.top = "0"
    // canvas.style.zIndex = "1"
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () => {
        console.log("a")
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        
        ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, video.width, video.height)

        if(resizedDetections.length > 0){
            landmarks = resizedDetections[0]['landmarks']
            left_eyebrow = landmarks["_positions"][17]
            right_eyebrow = landmarks["_positions"][26]
            left_eye = landmarks["_positions"][36]
            right_eye = landmarks["_positions"][45]
            lip1 = landmarks["_positions"][62]
            lip2 = landmarks["_positions"][66]
    
            // center_x_glass = (left_eye.x + right_eye.x)/2
            // center_y_glass = (left_eye.y + right_eye.y)/2
    
            glass_actual_length = Math.sqrt(Math.pow((left_eyebrow.x - right_eyebrow.x),2) + Math.pow((left_eyebrow.y - right_eyebrow.y),2))
            glass_img_width = glass_img.width
            scale_ratio = glass_actual_length/glass_img_width
            rotation_angle = Math.atan2(right_eye.y - left_eye.y, right_eye.x - left_eye.x)
    
            // rotated_glass = resize_and_rotate(glass_img, scale_ratio, rotation_angle)
            // console.log(rotated_glass.width)
            // console.log(glass_img)

            // ctx.clearRect(0, 0, canvas.width, canvas.height)
    
            // console.log(left_eyebrow.x)
            // console.log(left_eyebrow.y)
            
            // console.log(resizedDetections)
            // faceapi.draw.drawDetections(canvas, resizedDetections)
    
            ctx.drawImage(smoke_img, lip1.x - smoke_img.width, (lip1.y + lip2.y)/2)
            ctx.drawImage(glass_img, left_eyebrow.x, left_eyebrow.y)
        }
    }, 100)
})

function resize_and_rotate(img, scale, rotation){
    var canvasRot = document.createElement('canvas')
    var ctx1 = canvasRot.getContext('2d')
    new_width = Math.ceil(img.width*scale)
    canvasRot.width = new_width
    new_height = Math.ceil(img.height*scale)
    canvasRot.height = new_height
    newSize = {width:new_width,height:new_height}

    ctx1.drawImage(img, 0, 0, img.width, img.height);

    faceapi.matchDimensions(canvasRot, newSize)

    // ctx1.setTransform(scale, 0, 0, scale, new_width/2, new_height/2); // sets scale and origin
    // ctx1.rotate(rotation);
    // ctx1.drawImage(img, -img.width / 2, -img.height / 2);
    var retImg = new Image();
    retImg.src = canvasRot.toDataURL('image/png');
    // document.body.append(retImg);
    return retImg
}


