//app.js

navigator.mediaDevices.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;


function bindEvents(p) {
    p.on('error', function (error) {
        console.log('error', error);
    });

    p.on('signal', function (data) {
        document.getElementById('offer').textContent = JSON.stringify(data);
    });

    p.on('stream', function (stream) {
        let video = document.getElementById('receiver-video');
        if (video) {
            video.srcObject = stream;
            video.play();
        }
    });

    document.getElementById('incoming').addEventListener('submit', function (e) {
        e.preventDefault();
        p.signal(JSON.parse(e.target.querySelector('textarea').value));
    });
}

function startPeer(initiator) {
    navigator.mediaDevices.getUserMedia({
        // video: {
        //     width: { ideal: 1280 },
        //     height: { ideal: 720 }
        // },
        // audio: true
        video: true,
        audio: true
    })
    .then(function (stream) {
       let p = new SimplePeer({
            initiator: initiator, 
            stream: stream,
            trickle: false,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            }
        });
        bindEvents(p);
        let emitterVideo = document.getElementById('emitter-video');
        if (emitterVideo) {
            emitterVideo.srcObject = stream;
            emitterVideo.play();
        }
    })
    .catch(function (error) {
        console.log('Erreur lors de l\'accès aux périphériques multimédias :', error);
    });
}

document.getElementById('start').addEventListener('click', function (e) {
  startPeer(true)
});

document.getElementById('receive').addEventListener('click', function (e) {
  startPeer(false)
});





/////////////////////////////////////////////////////////////////////////////////

// // app.js
// document.addEventListener('DOMContentLoaded', () => {
//     const startButton = document.getElementById('start');
//     const receiverVideo = document.getElementById('receiver-video');
//     const emitterVideo = document.getElementById('emitter-video');
  
//     let localStream;
//     let peerConnection;
  
//     // Obtenez l'accès à la caméra et au microphone
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         localStream = stream;
//         emitterVideo.srcObject = localStream;
//       })
//       .catch(error => console.error('Error accessing media devices:', error));
  
//     // Configurez et initialisez la connexion WebRTC
//     startButton.addEventListener('click', () => {
//       peerConnection = new RTCPeerConnection();
  
//       // Ajoutez la piste vidéo au peerConnection
//       localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  
//       // Gestion de la piste vidéo distante
//       peerConnection.ontrack = (event) => {
//         receiverVideo.srcObject = event.streams[0];
//       };
  
//       // Créez et envoyez une offre au pair distant
//       peerConnection.createOffer()
//         .then(offer => peerConnection.setLocalDescription(offer))
//         .then(() => {
//           // Vous devrez envoyer l'offre au pair distant (par exemple, via un serveur de signalisation)
//           // et recevoir la réponse du pair distant (à implémenter)
//         })
//         .catch(error => console.error('Error creating offer:', error));
//     });
//   });
  