import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { auth } from "./firebase.js"
import { showMessage } from "./showMessage.js"


const signupForm = document.querySelector('#signup-form')

signupForm.addEventListener('submit', async(e)=>{
    e.preventDefault()

    const email = signupForm['singup-email'].value
    const password = signupForm['singup-password'].value

    try{
        const userCredentials = await createUserWithEmailAndPassword(auth,email,password)

        showMessage('Bienvenido  '+ userCredentials.user.email,'success')

        
    }catch(error){
        console.log(error.message)
        console.log(error.code)

        if(error.code === 'auth/email-already-in-use'){
            showMessage('Email ya esta en uso','error')
        }else if(error.code === 'auth/invalid-email'){
            showMessage('El email es invalido','error')
        }else if(error.code === 'auth/weak-password'){
            showMessage('La contraseña debe tener minimo 6 caracteres','error')
        }else if(error.code){
            showMessage('Algo fue mal en el registro','error')
        }
    }
})