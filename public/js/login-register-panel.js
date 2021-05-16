let isLoginShown = true;
const showRegisterPanelElement = document.getElementById('show-register-panel');
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
    document.getElementById('login-fenster').style.display = "none";
    document.getElementById('register-fenster').style.display = "flex";
    showRegisterPanelElement.textContent = 'Doch lieber Einloggen!';
    isLoginShown = false;
}

function hideRegisterPanel(e){
    document.getElementById('login-fenster').style.display = "flex";
    document.getElementById('register-fenster').style.display = "none";
    showRegisterPanelElement.textContent = 'Jetzt Registrieren!';
    isLoginShown = true;
}