import { GoogleAuthProvider,TwitterAuthProvider, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { auth } from "./firebase.js"


const googleButton = document.querySelector('#googleLogin')

googleButton.addEventListener('click',async()=>{
    const provider = new GoogleAuthProvider()

    try{
        const credentials = await signInWithPopup(auth,provider)
        

        const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleModal'))
        modal.hide()
    }catch(error){
        console.log(error)
    }
    
})

const githubButton = document.querySelector('#githubLogin')

githubButton.addEventListener('click',async()=>{
    const provider = new GithubAuthProvider()

    try{
        const credentials = await signInWithPopup(auth,provider)

        const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleModal'))
        modal.hide()
    }catch(error){
        console.log(error)
    }
    
})

const twitterButton = document.querySelector('#twitterLogin')

twitterButton.addEventListener('click',async()=>{
    const provider = new TwitterAuthProvider()

    try{
        const credentials = await signInWithPopup(auth,provider)

        const modal = bootstrap.Modal.getInstance(document.querySelector('#exampleModal'))
        modal.hide()
    }catch(error){
        console.log(error)
    }
    
})