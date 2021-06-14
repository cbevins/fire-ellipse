<script>
function augmentImageData(o) {
 o.getPixel = function (x, y) {
               var i = (x + y * this.width) * 4;
               return {R: this.data[i],
                       G: this.data[i + 1],
                       B: this.data[i + 2],
                       A: this.data[i + 3]

                }
              }
 o.setPixel = function (x, y, c) {
                var i = (x + y * this.width) * 4;
                this.data[i] = c.R;
                this.data[i + 1] = c.G;
                this.data[i + 2] = c.B;
                this.data[i + 3] = c.A;
              }
}

function createCanvas(h, w) {
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
}

function draw() {
      var ctx = document.body.appendChild(
      createCanvas(400, 400)).getContext("2d");
      var img = new Image();
      img.onload = function () {
       ctx.drawImage(img, 0, 0, 400, 300);
       var ImDat = ctx.getImageData(0, 0, 400, 300);
       augmentImageData(ImDat);
       for (var x = 0; x < 400; x++) {
        for (var y = 0; y < 300; y++) {
          var c1 = ImDat.getPixel(x, y);
          var c2 = ImDat.getPixel(x, y + 3);
          var r = Math.abs(c1.R - c2.R) + 128;
          var g = Math.abs(c1.G - c2.G) + 128;
          var b = Math.abs(c1.B - c2.B) + 128;
          var grey = (r + g + b) / 3;
          ImDat.setPixel(x, y,
            {R: grey, G: grey, B: grey, A: c1.A});
         }
        }
        ctx.putImageData(ImDat, 0, 0);
       };

     img.src = "../node_modules/images/Wildfire.jpg";
}
draw();
</script>