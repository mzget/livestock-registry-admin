import firebase from 'firebase/app';

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
    apiKey: '',
    authDomain: 'livestock-8a913.firebaseapp.com',
    databaseURL: 'https://livestock-8a913.firebaseio.com',
    projectId: 'livestock-8a913',
    storageBucket: 'livestock-8a913.appspot.com',
    messagingSenderId: '658856332140',
    appId: '1:658856332140:web:e8dab2a98763c75ce34149',
};
firebase.initializeApp(firebaseConfig);

export function uploadFile({ path, filename, file }) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`${path}/${filename}`);

    // Create file metadata including the content type
    const metadata = {
        cacheControl: 'public,max-age=604800',
        contentType: 'image/jpeg',
    };
    const uploadTask = imageRef.put(file, metadata);
    uploadTask.on(
        'state_changed',
        function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        function (error) {
            // Handle unsuccessful uploads
        },
        function () {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                    console.log('File available at', downloadURL);
                });
        }
    );
}
