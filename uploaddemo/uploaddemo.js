// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCvBz4a6zNkD1Hvo_QCpkKGdwEde_lql7g",
    authDomain: "bread-14467.firebaseapp.com",
    databaseURL: "https://bread-14467-default-rtdb.firebaseio.com",
    projectId: "bread-14467",
    storageBucket: "bread-14467.appspot.com",
    messagingSenderId: "1098556618565",
    appId: "1:1098556618565:web:b1027d699276a8c011b02c",
    measurementId: "G-YLSFJNRFCS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
    
// only works without authorization constraint right now

function uploadImage() {
    const ref = firebase.storage().ref("images");
    const file = document.querySelector("#image").files[0];
    // const name = + new Date() + "-" + file.name;
    const name = file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url);
            document.querySelector("#image").src = url;
        }
    )
    .catch(console.error);
}

function uploadVideo() {
    const ref = firebase.storage().ref("videos");
    const file = document.querySelector("#video").files[0];
    // const name = + new Date() + "-" + file.name;
    const name = file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(name).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            console.log(url);
            document.querySelector("#video").src = url;
        }
    )
    .catch(console.error);
}