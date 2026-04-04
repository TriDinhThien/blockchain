 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
  import { getFirestore, setDoc, Doc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDAQH-F90Hv_f1uMOENv7hCm_bGU9f0aGs",
    authDomain: "veriglow.firebaseapp.com",
    projectId: "veriglow",
    storageBucket: "veriglow.firebasestorage.app",
    messagingSenderId: "400350869290",
    appId: "1:400350869290:web:a4bff84794214a1dcb5053"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML=message;
    setTimeout(function() {
        messageDiv.style.opacity=0;
    },5000);
    
  }

  const signUp=document.getElementById("signUp");
  signUp.addEventListener("click",(event)=>{
    event.preventDefault();
    const email=document.getElementById("rEmail").value;
    const password=document.getElementById("rPassword").value;
    const fistName=document.getElementById("fName").value;
    const lastName=document.getElementById("lName").value;
  });

    const auth=getAuth();
    const db=getFirestore();
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email:email,
            firstName:firstName,
            lastName:lastName,
            uid:user.uid
        };
        showMessage("Account created successfully! Please login.", "singUpMessage");
        const docRef=Doc(db,"users",user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href="login.html";
        })
        .catch((error)=>{
            console.error("Error writing document: ", error);
        });
        
    
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==="auth/email-already-in-use"){
            showMessage("Email already in use. Please try another email.", "singUpMessage");
        }
        else {
            showMessage('unable to create account. Please try again later.', "singUpMessage");

        }
  })

  const singIn=document.getElementById("submitsignIn");
  singIn.addEventListener("click",(event)=>{
    event.preventDefault();
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        showMessage("Login successful!", "signInMessage");
        const user=userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);
        window.location.href="homepage.html";

    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==="auth/invalid-credential"){
            showMessage('Incorrect email or password. Please try again.', "signInMessage");
        }
        else{
            showMessage('Unable to login. Please try again later.', "signInMessage");
        }
    })
})
