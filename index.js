const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');
let net;
var audio = new Audio('audio_file.mp3');


async function app() {
  console.log('Loading mobilenet..');

  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();

  const addExample = classId => {
    const activation = net.infer(webcamElement, 'conv_preds');

    classifier.addExample(activation, classId);
  };

  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));


  while (true) {
    if (classifier.getNumClasses() > 0) {
      const activation = net.infer(webcamElement, 'conv_preds');
      const result = await classifier.predictClass(activation);

      const classes = ['A', 'B'];
      if(classes[result.classIndex]=="B"){
        await audio.play();
        document.body.style.backgroundColor = "rgb(245, 2, 2)";
      }
      else{
        document.body.style.backgroundColor = "rgb(17, 219, 17)";
      }
    }

    await tf.nextFrame();
  }
}

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true },
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata', () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

app();