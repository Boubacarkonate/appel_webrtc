// // app.js

// navigator.mediaDevices.getUserMedia ||
//   navigator.webkitGetUserMedia ||
//   navigator.mozGetUserMedia;

// function bindEvents(p) {
//     p.on('error', function (error) {
//         console.log('Peer connection error:', error);
//     });

//     p.on('signal', function (data) {
//         console.log('Generated signal:', data);
//         document.getElementById('offer').textContent = JSON.stringify(data);
//     });

//     p.on('stream', function (stream) {
//         console.log('Received stream:', stream);
//         let video = document.getElementById(p.initiator ? 'emitter-video' : 'receiver-video');
//         if (video) {
//             video.srcObject = stream;
//             video.play();
//             console.log('Video set and playing.');
//         }
//     });

//     document.getElementById('incoming').addEventListener('submit', function (e) {
//         e.preventDefault();
//         let signalData = e.target.querySelector('textarea').value;
//         console.log('Received incoming signal data:', signalData);
//         p.signal(JSON.parse(signalData));
//     });
// }

// function startPeer(initiator, peerName) {
//     console.log('Starting peer connection. Initiator:', initiator);
//     navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//     })
//     .then(function (stream) {
//         console.log('Media stream obtained:', stream);
//         let p;
//         try {
//             p = new SimplePeer({
//                 initiator: initiator, 
//                 stream: stream,
//                 trickle: false,
//                 config: {
//                     iceServers: [
//                         { urls: 'stun:stun.l.google.com:19302' }
//                     ]
//                 }
//             });
//         } catch (peerError) {
//             console.log('Error creating SimplePeer:', peerError);
//             // Gérer l'erreur ici
//             return;
//         }
//         bindEvents(p);
//         let video = document.getElementById(peerName + '-video');
//         if (video) {
//             video.srcObject = stream;
//             video.play();
//             console.log('Video set and playing.');
//         }

//         // Attendre que l'offre soit générée
//         p.on('signal', function (data) {
//             console.log('Offer signal:', data);
//             document.getElementById('offer').textContent = JSON.stringify(data);
//         });
//     })
//     .catch(function (error) {
//         console.log('Error accessing media devices:', error);
//     });
// }

// document.getElementById('start').addEventListener('click', function (e) {
//     startPeer(true, 'emitter');
// });

// document.getElementById('receive').addEventListener('click', function (e) {
//     startPeer(false, 'receiver');
// });

// Variables globales
let peer;
const messagesDiv = document.getElementById('messages');

// Fonction pour afficher les messages
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
}

// Gestionnaire d'événement pour le bouton de démarrage
document.getElementById('start').addEventListener('click', () => {
    // Initialiser SimplePeer
    peer = new SimplePeer({ initiator: true });

    // Événement lorsque la connexion est établie
    peer.on('signal', data => {
        displayMessage('Signal data generated. Share this with the other peer:\n' + JSON.stringify(data));
    });

    // Événement lorsque la connexion est prête pour l'échange de données
    peer.on('connect', () => {
        displayMessage('Peer connected. You can now exchange messages.');
    });

    // Événement pour recevoir des données du pair
    peer.on('data', data => {
        displayMessage('Received message: ' + data.toString());
    });

    // Événement lorsque la connexion est fermée
    peer.on('close', () => {
        displayMessage('Peer connection closed.');
    });

    // Gestion de l'erreur
    peer.on('error', err => {
        console.error('Peer error:', err);
        displayMessage('Error: ' + err.message);
    });
});

// Gestionnaire d'événement pour le bouton d'envoi de message
document.getElementById('send').addEventListener('click', () => {
    const message = prompt('Enter message to send:');
    if (peer && peer.connected) {
        peer.send(message);
        displayMessage('Sent message: ' + message);
    } else {
        displayMessage('Error: Peer not connected.');
    }
});
