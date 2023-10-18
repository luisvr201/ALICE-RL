const btnprojects = document.getElementById('project-mainFirst')
const addProjects = document.getElementById('agregar')
const btndescat = document.querySelectorAll('.desact')
// const btnmapAfin = document.getElementById('btn-mapAfin')
// const btnbreakstorm = document.getElementById('btn-breakstorm')
// const btnmapImp = document.getElementById('btn-mapImp')


btnprojects.addEventListener('click',()=>{
    const contProyect = document.getElementById('contenedor-projects')
     contProyect.classList.remove('d-none')
})


addProjects.addEventListener('click',()=>{
    const proyect = document.getElementById('proyect-temp')
    proyect.classList.remove('d-none')
    for (var i=0; i<btndescat.length; i++) {
        btndescat[i].disabled = false;
    }
    
})

