import React from 'react';
import firebase from "firebase/app";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";
import { Auth } from "./context";

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
  
firebase.initializeApp(firebaseConfig);

var functions = firebase.functions();
var auth = firebase.auth();

export class FirebaseProvider extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn:false
        }; 
    }

    componentDidMount(){
        auth.onAuthStateChanged((user) => {
            if (user){
                this.setState({
                    isLoggedIn:true,
                    uid: user.uid
                });
            }else{
                this.setState({
                    isLoggedIn:false
                });
            }
        });
    }

    render() {  
        return(
            <Auth.Provider value={this.state}>
                {this.props.children}
            </Auth.Provider>
        )
    }
}



function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export async function signUp(username, email, password, confirmpassword) { 
    if(password != confirmpassword)
        return 'Passwords do not match';
    if(password.length < 8)
        return 'Password too short';
    if(!isValidEmail(email))
        return 'Not a valid email';

    var ret;
    await auth.createUserWithEmailAndPassword(email, password)
        .then(async function(userCredential){
            var user = userCredential.user;
            await user.updateProfile({displayName: username});
            ret = {code: 'ok', uid: userCredential.user.uid};
        })
        .catch((error) => {
            var errorMessage = error.message;
            ret = {code:"error", msg: errorMessage};
        });
    
    if(ret.code != "error"){
        var changeUsername = functions.httpsCallable('changeUserName');
        await changeUsername({username: username }).then().catch((error) => {
            ret = {code:"error", msg: error.message};    
        });
    }

    return ret;
}

export async function signIn(email, password) {

    if(!isValidEmail(email)){
        return 'Not a valid email';
    }

    var ret;
    await auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            ret = {code: 'ok', uid: userCredential.user.uid}; 
        })
        .catch(function(error) {
            var msg;
            if (error.code == 'auth/wrong-password') {
                // Handle other errors such as wrong password.
                msg = "Invalid username or password"; 
            } else {
                msg = error.message;
            }
            ret = {code:"error", msg: msg};
        });
    
    return ret;
}

export async function signOut() {
    var ret;
    await auth.signOut()
        .then(() => {
            ret = 'ok';
        })
        .catch((error) => {
          // An error happened.
            var errorMessage = error.message;
            ret = errorMessage;
        });
    return ret;
}

export async function getUserdata(uid, data){
    var getUserData = functions.httpsCallable('getUserData');
    var ret;
    await getUserData({uid: uid, col: data})
        .then( res => {
            ret = {code: 'ok', data: res.data};
        }).catch((error) => {
            ret = {code: 'error', msg: error.message};
        });
    return ret;
}

export async function getPostdata(pid){
    var getPostData = functions.httpsCallable('getPostData');
    var ret;
    await getPostData({pid: pid})
        .then( res => {
            ret = {code: 'ok', data: res.data};
        }).catch((error) => {
            ret = {code: 'error', msg: error.message};
        });
    return ret;
}

export async function uploadImage(file) {
    const name = + new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type
    };
    var subcat;
    var ret;
    if (file.type.includes("image")) {
        subcat = "images";
    }
    else if (file.type.includes("application") || file.type.includes("video")) {
        subcat = "videos";
    }
    else {
        ret = {code:"error", msg: "File not Image/Video"};
        return ret;
    }
    const ref = firebase.storage().ref(subcat);
    const task = ref.child(name).put(file, metadata);
    await task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(async function(url){
            var createPost = functions.httpsCallable('createPost');
            await createPost({url: url});
        })
        .then(() => ret = {code: 'ok'})
        .catch((error) => {
            ret = {code:"error", msg: error.message}
            ref.child(name).delete().then().catch();
        });
    
    return ret;
}

export async function getUsers(username){
    var getUserNameAndId = functions.httpsCallable('getUserNameAndId');
    var ret;
    await getUserNameAndId({username: username})
        .then( res => {
            ret = {code: 'ok', data: res.data};
        }).catch((error) => {
            ret = {code: 'error', msg: error.message};
        });
    return ret;
}

export async function follow(uid){
    var follow = functions.httpsCallable('follow');
    var ret;
    await follow({id: uid})
        .then( res => {
            ret = {code: 'ok', data: res.data};
        }).catch((error) => {
            ret = {code: 'error', msg: error.message};
        });
    return ret;
}

export async function unfollow(uid){
    var unfollow = functions.httpsCallable('unfollow');
    var ret;
    await unfollow({id: uid})
        .then( res => {
            ret = {code: 'ok', data: res.data};
        }).catch((error) => {
            ret = {code: 'error', msg: error.message};
        });
    return ret;
}

export async function isFollowing(curuid, uid){
    var ret = await getUserdata(curuid, "following");
    if(ret.code === 'ok'){
        if(ret.data.includes(uid)){
            return true;
        }else{
            return false;
        }
    }
}

export async function getTrendingPost() {
    var getTrendingPost = functions.httpsCallable('getTrendingPost');
    var ret;
    await getTrendingPost()
        .then( res => {
            ret = {code: 'ok', data: res.data};
        }).catch((error) => {
            ret = {code: 'error', msg: error.message};
        });
    return ret;
}