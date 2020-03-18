const glass_img = new Image();
glass_img.src = "glass2.png";

const smoke_img = new Image();
smoke_img.src = "smoke2.png";

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models')
  ]).then(ready)

function ready(){
  document.getElementById('drag_drop').style.visibility = "visible";
}

async function uploadImage() {
  const imgFile = document.getElementById('drag_drop').files[0]
  console.log(imgFile)
  // create an HTMLImageElement from a Blob
  const img = await faceapi.bufferToImage(imgFile)
  document.getElementById('inputImg').src = img.src

  startImage(img)
}

async function startImage(img){
    const canvas = document.createElement('canvas')
    const displaySize = { width: img.width, height: img.height }

    faceapi.matchDimensions(canvas, displaySize)
    ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)

    // document.body.append(canvas)
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    // console.log(detections.length)

    if(detections.length > 0){
        landmarks = detections[0]['landmarks']
        left_eyebrow = landmarks["_positions"][17]
        right_eyebrow = landmarks["_positions"][26]
        left_eye = landmarks["_positions"][36]
        right_eye = landmarks["_positions"][45]
        lip = landmarks["_positions"][66]

        // center_x_glass = (left_eye.x + right_eye.x)/2
        // center_y_glass = (left_eye.y + right_eye.y)/2

        glass_actual_length = Math.sqrt(Math.pow((left_eyebrow.x - right_eyebrow.x),2) + Math.pow((left_eyebrow.y - right_eyebrow.y),2))
        glass_img_width = glass_img.width
        scale_ratio = glass_actual_length/glass_img_width
        rotation_angle = Math.atan2(right_eye.y - left_eye.y, right_eye.x - left_eye.x)

        rotated_glass = resize_and_rotate(glass_img, scale_ratio, rotation_angle)

        console.log(rotated_glass)
        console.log(glass_img)

        console.log(left_eyebrow.x)
        console.log(left_eyebrow.y)

        ctx.drawImage(smoke_img, lip.x - smoke_img.width, lip.y)
        ctx.drawImage(rotated_glass, left_eyebrow.x, left_eyebrow.y)

    }

    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

    dataUrl = canvas.toDataURL('image/jpg')
    document.getElementById('thugImg').src = dataUrl
}

function resize_and_rotate(img, scale, rotation){
    var canvasRot = document.createElement('canvas')
    var ctx1 = canvasRot.getContext('2d')
    new_width = Math.ceil(img.width*scale)
    canvasRot.width = new_width
    new_height = Math.ceil(img.height*scale)
    canvasRot.height = new_height

    ctx1.drawImage(img, 0, 0, img.width, img.height);
    ctx1.setTransform(scale, 0, 0, scale, new_width/2, new_height/2); // sets scale and origin
    ctx1.rotate(rotation);
    ctx1.drawImage(img, -img.width / 2, -img.height / 2);
    var retImg = new Image();
    retImg.src = canvasRot.toDataURL('image/png');
    
    document.body.append(retImg);

    return retImg
}


