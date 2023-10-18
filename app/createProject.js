const acordeon = document.querySelector('#accordionFlushExample')

const btnAdd = document.querySelector('#addProject')

btnAdd.addEventListener('click', ()=>{
    const projectnew = document.createElement('div')
    projectnew.classList.add('accordion-item')
    projectnew.innerHTML = `
    <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                Proyecto taller
              </button>
            </h2>
            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample">
              <button class="form-control">proyecto</button>
              <button class="form-control" disabled>mapa de afinidad</button>
              <button class="form-control" disabled>brainstorming</button>
              <button class="form-control" disabled>mapa de inpacto</button>
            </div>
    `
    acordeon.appendChild(projectnew)
})
