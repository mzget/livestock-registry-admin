import firebase from 'firebase/app';
import 'firebase/storage';
import config from '../config/dev';

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = config.firebase;
firebase.initializeApp(firebaseConfig);

export function firebaseUploadFile({ path, filename, file }) {
    return new Promise((resolve: (downloadUrl: string) => void, reject) => {
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
                console.log('Upload is ' + progress + '% done', snapshot.state);
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            reject,
            function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(resolve);
            }
        );
    });
}
