import * as firebase from 'firebase'
require("firebase/firestore");

// Initialize Firebase
const config = {
    apiKey: "AIzaSyDQ6Vbwf3gVj0z2GU2Uzu1HYsR3MmhVY1c",
    authDomain: "practice-12.firebaseapp.com",
    databaseURL: "https://practice-12.firebaseio.com",
    projectId: "practice-12",
    storageBucket: "practice-12.appspot.com",
    messagingSenderId: "116039392334"
  };
  firebase.initializeApp(config);

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

const registerFirebase = (data) => {
    return new Promise((resolve,reject) => {
        firebase.auth().createUserWithEmailAndPassword(data.email,data.password)
            .then(async res => {
                localStorage.setItem("userUid",res.user.uid);
                delete data.password;
                const url = await uploadImageFirebase("profilepictures",data.file)
                    .catch(err => console.log(err));
                
                if(url){
                    delete data.file;
                    data.profilepicture = url;
                    return db.collection("users")
                        .doc(res.user.uid)
                        .set(data)
                }
            })
            .then(res => resolve("User registered"))
            .catch(err => reject(err));
    })
}

const readFirestore = () => {
    const uid = firebase.auth().currentUser.uid;
    return new Promise(async (resolve,reject) => {
        const user = await db.collection('users').doc(uid).get()
            .catch(err => reject(err));
        resolve(user)
    })
}

const loginFirebase = (data) => {
    return new Promise((resolve,reject) => {
        firebase.auth().signInWithEmailAndPassword(data.email,data.password)
            .then(res => {
                console.log("response in config -->", res);
                resolve(res);
            })
            .catch(err => {
                console.log("Error in config -->", err);
                reject(err);
            })
    })
}

const uploadImageFirebase = async (bucketName,image) => {
    const uid = firebase.auth().currentUser.uid;
    const imageName = `${Date.now()}-${uid}`;
    const storage = firebase.storage().ref();
    const ref = storage.child(`${bucketName}/${imageName}`);
    console.log(imageName)
    return new Promise((resolve,reject) => {
        ref.put(image)
            .then(res => ref.getDownloadURL())
            .then(url => resolve(url))
            .catch(err => reject(err))  
    })
}

const logoutFirebase = () => {
    return new Promise((resolve,reject) => {
        firebase.auth().signOut()
            .then(res => resolve("Logged out successfully!"))
            .catch(err => reject(err))
    })
}

export {
    registerFirebase,
    loginFirebase,
    readFirestore,
    logoutFirebase
}