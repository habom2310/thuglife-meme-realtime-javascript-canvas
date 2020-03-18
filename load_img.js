

var openFile = function(url) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function(readerEvent){
      var image = new Image();
      image.onload = function (imageEvent) {
          // Resize the image
        var canvas = document.createElement('canvas');
        var max_size = 1600;// TODO : pull max size from a site config
        var width = image.width;
        var height = image.height;
        if (width > height) {
            if (width > max_size) {
                height *= max_size / width;
                width = max_size;
            }
        } else {
            if (height > max_size) {
                width *= max_size / height;
                height = max_size;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        var resizedImage = dataURLToBlob(dataUrl);
        $.event.trigger({
                    type: "imageResized",
                    blob: resizedImage,
                    url: dataUrl
                });
      }

      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);

    // var output = document.getElementById('output');
    // var dataURL = reader.result;
    // output.src = dataURL;
};

/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}
/* End Utility function to convert a canvas to a BLOB      */

$(document).on("imageResized", function (event) {
    var data = new FormData($("form[id*='uploadImageForm']")[0]);
    if (event.blob && event.url) {
        data.append('image_data', event.blob);

        var output = document.getElementById('inputImg');
        var predict = document.getElementById('predict');
        var noti = document.getElementById('noti');
        // var drag_drop = document.getElementById('drag_drop')

        // var dataURL = reader.result;
        // drag_drop.style.visibility = "hidden";
        noti.style.visibility = "hidden";
        output.src = event.url;
        // console.log(event.url);

        $.ajax({
            url: "http://127.0.0.1:5000/thuglife",
            data: {"img_base64":event.url},
            dataType: 'json',
            type: 'POST',
            success: function(response){
                console.log(response);
                document.getElementById('thugImg').setAttribute(
                    'src', 'data:image/png;base64,' + response.data["thugImg"]
                );
            }
        });
        
    }
});

function sendRequest(image){

}