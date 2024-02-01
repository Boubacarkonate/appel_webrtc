// app.js
navigator.mediaDevices.getUserMedia =
    navigator.mediaDevices.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

function bindEvents(p) {
    p.on('error', function (error) {
        console.log('Erreur de connexion pair à pair :', error);
    });

    p.on('signal', function (data) {
        console.log('Signal généré :', data);
        document.getElementById('offer').textContent = JSON.stringify(data);
    });

    p.on('stream', function (stream) {
        console.log('Flux reçu :', stream);
        let video = document.getElementById('receiver-video');
        if (video) {
            video.srcObject = stream;
            video.play();
            console.log('Vidéo du récepteur configurée et en lecture.');
        }
    });

    document.getElementById('incoming').addEventListener('submit', function (e) {
        e.preventDefault();
        let signalData = document.getElementById('incoming').querySelector('textarea').value;
        console.log('Données de signal entrant reçues :', signalData);
        p.signal(JSON.parse(signalData));
    });
}

function startPeer(initiator) {
    console.log('Démarrage de la connexion pair à pair. Initiateur :', initiator);
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then(function (stream) {
        console.log('Flux multimédia obtenu :', stream);
        let p;
        try {
            p = new SimplePeer({
                initiator: initiator, 
                stream: stream,
                trickle: false,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.stunprotocol.org:3478' }
                    ]
                }
            });
        } catch (peerError) {
            console.log('Erreur lors de la création de SimplePeer :', peerError);
            // Gérer l'erreur ici
            return;
        }
        bindEvents(p);
        let emitterVideo = document.getElementById('emitter-video');
        if (emitterVideo) {
            emitterVideo.srcObject = stream;
            emitterVideo.play();
            console.log('Vidéo de l\'émetteur configurée et en lecture.');
        }

        // Attendre que l'offre soit générée
        p.on('signal', function (data) {
            console.log('Signal d\'offre :', data);
            document.getElementById('offer').textContent = JSON.stringify(data);
        });
    })
    .catch(function (error) {
        console.log('Erreur lors de l\'accès aux périphériques multimédias :', error);
    });
}

document.getElementById('start').addEventListener('click', function (e) {
    startPeer(true);
});

document.getElementById('receive').addEventListener('click', function (e) {
    startPeer(false);
});



/////////////////////////////////////////////////////////////////////////////////

// //app.js

// navigator.mediaDevices.getUserMedia ||
//   navigator.webkitGetUserMedia ||
//   navigator.mozGetUserMedia;


// function bindEvents(p) {
//     p.on('error', function (error) {
//         console.log('error', error);
//     });

//     p.on('signal', function (data) {
//         console.log('Offer signal:', data);
//         document.getElementById('offer').textContent = JSON.stringify(data);
//     });

//     p.on('stream', function (stream) {
//         let video = document.getElementById('receiver-video');
//         if (video) {
//             video.srcObject = stream;
//             video.play();
//         }
//     });

//     document.getElementById('incoming').addEventListener('submit', function (e) {
//         e.preventDefault();
//         p.signal(JSON.parse(e.target.querySelector('textarea').value));
//     });
// }

// function startPeer(initiator) {
//     console.log('1°) Starting peer connection. Initiator:', initiator)
//     navigator.mediaDevices.getUserMedia({
//         // video: {
//         //     width: { ideal: 1280 },
//         //     height: { ideal: 720 }
//         // },
//         // audio: true
//         video: true,
//         audio: true
//     })
//     .then(function (stream) {
//         console.log('2°) Media stream obtained:', stream);
//        let p = new SimplePeer({
//             initiator: initiator, 
//             stream: stream,
//             trickle: false,
//             config: {
//                 iceServers: [
//                     { urls: 'stun:stun.l.google.com:19302' }
//                 ]
//             }
//         });
//         bindEvents(p);
//         let emitterVideo = document.getElementById('emitter-video');
//         if (emitterVideo) {
//             emitterVideo.srcObject = stream;
//             emitterVideo.play();
//             console.log('3°) Emitter video set and playing.');
//         }
//     })
//     .catch(function (error) {
//         console.log('Erreur lors de l\'accès aux périphériques multimédias :', error);
//     });
// }


// document.getElementById('start').addEventListener('click', function (e) {
//   startPeer(true)
// });

// document.getElementById('receive').addEventListener('click', function (e) {
//   startPeer(false)
// });






