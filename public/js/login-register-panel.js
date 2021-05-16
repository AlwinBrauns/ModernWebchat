const showRegisterPanelElement = document.getElementById('show-register-panel');
const loginFenster = document.getElementById('login-fenster');
const registerFenster = document.getElementById('register-fenster');
const accountPanel = document.getElementById('account-login-register');

let isLoginShown = true;
showRegisterPanelElement.addEventListener('click', registerPanelController);
showRegisterPanelElement.addEventListener('touchstart', registerPanelController);

function registerPanelController(e){
    if(isLoginShown){
        showRegisterPanel(e);
    }else{
        hideRegisterPanel(e);
    }
}

function showRegisterPanel(e) {
    loginFenster.style.display = "none";
    registerFenster.style.display = "flex";
    showRegisterPanelElement.textContent = 'Doch lieber Einloggen!';
    isLoginShown = false;
}

function hideRegisterPanel(e){
    loginFenster.style.display = "flex";
    registerFenster.style.display = "none";
    showRegisterPanelElement.textContent = 'Jetzt Registrieren!';
    isLoginShown = true;
}

