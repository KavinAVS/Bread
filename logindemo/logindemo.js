// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
    
const auth = firebase.auth();

function signUp() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed up and signed in 
            alert("Signed Up"); 
            var user = userCredential.user;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    
}

function signIn() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    const promise = auth.signInWithEmailAndPassword(email.value, password.value)
        .then(function(userCredential) {
        // User successfully signed in and is not enrolled with a second factor.
            alert("Signed In " + email.value); 
        })
        .catch(function(error) {
            if (error.code == 'auth/multi-factor-auth-required') {
                // The user is a multi-factor user. Second factor challenge is required.
                resolver = error.resolver;

            } else if (error.code == 'auth/wrong-password') {
                // Handle other errors such as wrong password.
                alert("Invalid username or password"); 
            } else {
                alert(error.message);
            }
      });
    // promise.catch(e => alert(e.message));

}

function signOut() {
    auth.signOut()
        .then(() => {
            // Sign-out successful.
            alert("Signed Out");
        })
        .catch((error) => {
            // An error happened.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });
    
}