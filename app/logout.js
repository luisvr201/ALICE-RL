import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { auth } from "./firebase.js"

const logout = document.querySelector('#logout')

logout.addEventListener('click',async()=>{
    await signOut(auth)
    console.log('logout')
    window.location.href = '../index.html'
})
onAuthStateChanged(auth, async(user) => {
    if(user){
        
    }else{
        window.location.href = '../index.html'
    }
})