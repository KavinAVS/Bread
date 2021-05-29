const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// new user sign up
exports.userSignup = functions.auth.user().onCreate(user => {

    //creates new user in firestore
    return admin.firestore().collection('users').doc(user.uid).set({
        username: 'user'.concat(user.uid),
        email: user.email,
        num_followers: 0,
        num_following: 0,
        num_posts: 0,
        followers: [],
        following: [],
        posts: [],
        liked_posts: [],
        verified: false,
        points: 0
    });
});


// user deleted
exports.userDeleted = functions.auth.user().onDelete(user => {

    //deletes user from firestore
    const user_doc = admin.firestore().collection('users').doc(user.uid);
    return user_doc.delete();
});

//get user data
exports.getUserData = functions.https.onCall((data, context) => {
    var user = admin.firestore().collection('users').doc(data.uid);
  
    //find and return data
    return user.get().then(doc => {

        if (data.col.localeCompare('username') == 0){
            return doc.data().username;
        } else if (data.col.localeCompare('email') == 0){
            return doc.data().email;
        } else if (data.col.localeCompare('num_followers') == 0){
            return doc.data().num_followers;
        } else if (data.col.localeCompare('num_following') == 0){
            return doc.data().num_following;
        } else if (data.col.localeCompare('num_posts') == 0){
            return doc.data().num_posts;
        } else if (data.col.localeCompare('followers') == 0){
            return doc.data().followers;
        } else if (data.col.localeCompare('following') == 0){
            return doc.data().following;
        } else if (data.col.localeCompare('posts') == 0){
            return doc.data().posts;
        } else if (data.col.localeCompare('liked_posts') == 0){
            return doc.data().liked_posts;
        } else if (data.col.localeCompare('verified') == 0){
            return doc.data().verified;   
        } else if (data.col.localeCompare('points') == 0){
            return doc.data().points;
        }    
    });
});

//change username
exports.changeUserName = functions.https.onCall((data, context) => {
    var user = admin.firestore().collection('users').doc(context.auth.uid);
    return user.update({
        username: data.username
    });
});

// gets tags from post
exports.getPostTags = functions.https.onCall((data, context) => {
    var post_doc = admin.firestore().collection('posts').doc(data.id);
    if (!post_doc.exists){
        return null;
    }
    return post_doc.data().tags;
});

// add tag
exports.addTag = functions.https.onCall((data, context) => {
    var post_doc = admin.firestore().collection('posts').doc(data.post_id);
    if (!post_doc.exists){
        return null;
    }
    return post_doc.get().then(doc => {

        //post already liked
        if (doc.data().tags.includes(data.tag)){
            throw new functions.https.HttpsError(
                'failed-precondition',
                'post already has tag'
            );
        }

        //increment posts likes and update user's liked posts
        return doc.update({
            tags: [...doc.data().tags, data.tag]
        });
    });
});

// Create Post
exports.createPost = functions.https.onCall((data, context) => {

    //not signed in
    if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You are not authenticated to make posts'
        );
    }

    const user = admin.firestore().collection('users').doc(context.auth.uid);
    const newPost = admin.firestore().collection('posts').doc();

    return user.get().then(doc => {

        //create new post
        return newPost.set({ 
            uid: context.auth.uid,
            tags: [],
            num_likes: 0,
            comments: [],
            url: data.url
        })
        .then(() => {
            return user.update({
                posts: [...doc.data().posts, newPost.id],
                num_posts: admin.firestore.FieldValue.increment(1)
            });
        });
    });
});


//get post data
exports.getPostData = functions.https.onCall((data, context) => {

    var post = admin.firestore().collection('posts').doc(data.pid);
  
    //find and return data
    return post.get().then(doc => {

        return {
            uid: doc.data().uid,
            tags: doc.data().tags,
            num_likes: doc.data().num_likes,
            comments: doc.data().comments,
            url: doc.data().url
        }
    });
});

// Make comment on post
exports.createComment = functions.https.onCall((data, context) => {

    //not signed in
    if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You are not authenticated to like posts'
        );
    }

    const post = admin.firestore().collestion('posts').doc(data.pid);

    return post.get().then(doc => {

        return post.update({
            comments: [...doc.data().comments, data.comment]
        });
    });
});

// like post
exports.likePost = functions.https.onCall((data, context) => {

    //not signed in
    if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You are not authenticated to like posts'
        );
    }

    const user = admin.firestore().collection('users').doc(context.auth.uid);
    const post = admin.firestore().collection('posts').doc(data.pid); 
    
    post.get().then(post => {
        poster_uid = post.data().uid;
        admin.firestore().collection('users').doc(poster_uid).update({
            points: admin.firestore.FieldValue.increment(1)
        });
    });
    

    return user.get().then(doc => {

        //post already liked
        if (doc.data().liked_posts.includes(data.pid)){
            throw new functions.https.HttpsError(
                'failed-precondition',
                'post already liked'
            );
        }
        //increment posts likes and update user's liked posts
        return user.update({
            liked_posts: [...doc.data().liked_posts, data.pid],
        })
        .then(() => {
            return post.update({
                num_likes: admin.firestore.FieldValue.increment(1)
            });
        });
    });
});

//follow a user
exports.follow = functions.https.onCall((data, context) => {

    //not signed in
    if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You are not authenticated to follow users'
        );
    }

    var user_doc = admin.firestore().collection('users').doc(context.auth.uid);
    var target_doc = admin.firestore().collection('users').doc(data.id);
    return user_doc.get().then(doc => {
    
        if (doc.data().following.includes(data.id)){
            throw new functions.https.HttpsError(
                'failed-precondition',
                'Already following this user'
            );
        }
        target_doc.update({
            followers : [...doc.data().followers, context.auth.uid],
            num_followers: admin.firestore.FieldValue.increment(1)
         });
        user_doc.update({
            following :  [...doc.data().following, data.id],
            num_following: admin.firestore.FieldValue.increment(1)
         });
    });
});

//unfollow a user
exports.unfollow = functions.https.onCall((data, context) => {

    //not signed in
    if (!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'You are not authenticated to unfollow users'
        );
    }

    var user_doc = admin.firestore().collection('users').doc(context.auth.uid);
    var target_doc = admin.firestore().collection('users').doc(data.id);

    return user_doc.get().then(doc => {

        if (!doc.data().following.includes(data.id)){
            throw new functions.https.HttpsError(
                'failed-precondition',
                'You are not following this user'
            );
        }

        user_doc.update({
            following : admin.firestore.FieldValue.arrayRemove(data.id),
            num_following: admin.firestore.FieldValue.increment(-1)
        });
        target_doc.update({
            followers : admin.firestore.FieldValue.arrayRemove(context.auth.uid),
            num_followers: admin.firestore.FieldValue.increment(-1)
        });
    });
});


// Obtain user name and id given partial (name)
exports.getUserNameAndId = functions.https.onCall((data, context) => {
    const array = [];
    const username = data.username;

    const strlen = username.length;
    const strFirst = username.slice(0, strlen-1);
    const strRest = username.slice(strlen-1,strlen);
    const strChar = strFirst + String.fromCharCode(strRest.charCodeAt(0) + 1);
    return admin.firestore().collection('users').where('username', '>=', username).where('username', '<', strChar).limit(10).get().then(users => {

            users.forEach(doc => {
                array.push({
                uid: doc.id, 
                username : doc.data().username
                });
            }); 
        return array;
    });
});



// Obtain user post based on the highest number of likes
exports.getTrendingPost = functions.https.onCall((data, context) => {
    const array = [];
    var posts = admin.firestore().collection('posts');
    return posts.orderBy('num_likes', 'desc').limit(10).get().then(collection => {
        if (!collection.empty) {
            collection.forEach(doc => {
                array.push(doc.id);         
            });
            return array;
        }
        else {
            return [];
        }
    });
});
