// ****** SELECT ITEMS **********
const alertP = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
const cancelEdit = document.querySelector(".cancel-edit");
const title = document.querySelector(".title");
const divTitle = document.querySelector(".div-title");
const spanLang = document.querySelector(".lang");
const langPtBr = document.querySelector(".pt-br");
const langEn = document.querySelector(".en");

// edit option
let editElement;
let editFlag = false;
let editID = "";
let checking;
let languagePtBr = false;

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearItems);
// cancel editing
cancelEdit.addEventListener("click", setBackToDefault);
// load items
window.addEventListener("DOMContentLoaded", setupItems);

// language in PT-BR
langPtBr.addEventListener("click", ()=> {
    languagePtBr = true;
    changeLanguage();
});
// language in EN
langEn.addEventListener("click", ()=> {
    languagePtBr = false;
    changeLanguage();
})

// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value.toLowerCase();
    const id = new Date().getTime().toString()
    if(value && !editFlag){
        // verify item
        checkItem(value);
        if(checking === true) {
            return;
        } else {
        // create item
        createListItem(id, value);
        // display alert
        if(languagePtBr) {
            displayAlert('Item adicionado à lista', 'success');
        } else {
            displayAlert('item added to the list', 'success');
        }
        // show container
        container.classList.add('show-container');
        // add to localStorage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }
    }
    else if(value && editFlag){
        // verify item
        checkItem(value);
        if(checking === true) {
            return;
        } else {
        editElement.innerHTML = value;
        if(languagePtBr) {
            displayAlert('Nome alterado', 'success');
        } else {
            displayAlert('value change', 'success');
        }
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    }
    else{
        if(languagePtBr) {
            displayAlert('Por favor, insira o valor', 'danger');
        } else {
            displayAlert('please enter value', 'danger');
        }
    }
    
}
// display alert
function displayAlert(text, action) {
    alertP.textContent = text;
    alertP.classList.add(`alert-${action}`);

    // remove alert
    setTimeout(function(){
        alertP.textContent = '';
        alertP.classList.remove(`alert-${action}`);
    }, 1200);
}
// clear items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    
    if(items.length > 0) {
        items.forEach((item)=> {
            list.removeChild(item);
        });
    }
    // hidden container
    container.classList.remove('show-container');
    if(languagePtBr) {
        displayAlert('Lista limpa com sucesso', 'success');
    } else {
        displayAlert('empty list', 'success');
    }
    setBackToDefault();
    localStorage.removeItem('list');
}
// delete item
function deleteItem(evt) {
    const element = evt.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0) {
        container.classList.remove("show-container");
    }
    if(languagePtBr) {
        displayAlert('Item removido', 'danger');
    } else {
        displayAlert('item removed', 'danger');
    }
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}
// edit item
function editItem(evt) {
    const element = evt.currentTarget.parentElement.parentElement;
    // set edit element
    editElement = evt.currentTarget.parentElement.previousElementSibling;
    // set form
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    if(languagePtBr) {
        submitBtn.textContent = 'Editar'
    } else {
        submitBtn.textContent = 'Edit';
    }
    grocery.focus();
    cancelEdit.classList.add('show-cancel-edit');

}
// set back to default
function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editID = '';
    if(languagePtBr) {
        submitBtn.textContent = 'Adicionar';
    } else {
        submitBtn.textContent = 'Submit';
    }
    cancelEdit.classList.remove('show-cancel-edit');
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = { id,value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter((item)=> {
        if(item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map((item)=> {
        if(item.id === id) {
            item.value = value;
        }
        return item;
    });

    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function checkItem(value) {
    items = getLocalStorage();
    for (let i = 0; i < items.length; i++) {
        if (items[i].value === value) {
            if(languagePtBr) {
                displayAlert('Item já adicionado', 'danger');
            } else {
                displayAlert('item exist in your list', 'danger');
            }
            return checking = true;
        }
    }

    return checking = false;
}
// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.map((item)=> {
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}

function createListItem(id, value) {
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
                        <div class="btn-container">
                            <button type="button" class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    // append child
    list.appendChild(element);
}

function changeLanguage() {
    if(languagePtBr) {
        title.innerHTML = 'Lista de Compras';
        divTitle.innerHTML = 'Lista de Compras';
        submitBtn.innerHTML = 'Adicionar';
        grocery.setAttribute('placeholder', 'ex. ovos');
        clearBtn.innerHTML = 'Limpar Itens';
        spanLang.innerHTML = 'Idiomas:';
    } else {
        title.innerHTML = 'Grocery Bud';
        divTitle.innerHTML = 'Grocery Bud';
        submitBtn.innerHTML = 'Submit';
        grocery.setAttribute('placeholder', 'e.g. eggs');
        clearBtn.innerHTML = 'Clear items';
        spanLang.innerHTML = 'Languages:';
    }

}