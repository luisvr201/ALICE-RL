class UndoRedoManager {
    constructor(maxSize) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    }

    performAction(state) {
    this.undoStack.push(JSON.parse(JSON.stringify(state)));

    if (this.undoStack.length > this.maxSize) {
            this.undoStack.shift();
    }

    this.redoStack = [];
    }

    undo(cur) {
    if (this.undoStack.length === 0) {
            return null;
    }

    var prevState = this.undoStack.pop();
    if (this.undoStack.length === 0) {
        this.undoStack.push(prevState);
    }
    if (prevState == cur) {
        if (this.undoStack.length < 2) {
        return null;
        } else {
        return undo(cur);
        }
    }
    this.redoStack.push(JSON.parse(JSON.stringify(prevState)));
    return prevState;
    }

    redo() {
    if (this.redoStack.length === 0) {
            return null;
    }

    const nextState = this.redoStack.pop();
    this.undoStack.push(JSON.parse(JSON.stringify(nextState)));
    return nextState;
    }
}


function createUpdatePopupSize(maxHeight, maxWidth, div) {
    return function () {
    const windowHeight = window.innerHeight;
    if (windowHeight < maxHeight) {
        div.style.height = (windowHeight * 0.8) + "px"; // Establezca la altura de la ventana emergente al 80% de la altura de la ventana
    } else {
        div.style.height = maxHeight;
    }
    const windowWidth = window.innerWidth;
    if (windowWidth < maxWidth) {
        div.style.width = (windowWidth * 0.8) + "px"; // Establezca la altura de la ventana emergente al 80% de la altura de la ventana

    } else {
        div.style.width = maxWidth; // Restablecer la altura de la ventana emergente a automática cuando la ventana sea más grande

    }
    };
}


function setupPopSizeListener(maxHeight, maxWidth, popup) {
    const updatePopupSize = createUpdatePopupSize(maxHeight, maxWidth, popup);

    // Llame a updatePopupHeight al cambiar el tamaño de la ventana
    window.addEventListener("resize", updatePopupSize);

    // Llame a updatePopupHeight al cargar la página
    updatePopupSize();
          
}

const undoRedoManager = new UndoRedoManager(20);
