function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".loginmes");
    messageElement.textContent = message;
    messageElement.classList.remove("loginmes-success,loginmes-error");
    if(type == 'error')
        messageElement.classList.add('loginmes-error');
    else messageElement.classList.add('loginmes-success');
}

function setInputError(inputElement, message) {
    inputElement.classList.add("input--error");
    inputElement.parentElement.querySelector(".input-error-mes").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("input--error");
    inputElement.parentElement.querySelector(".input-error-mes").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const registerForm = document.querySelector("#register");

    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.querySelector("#em").value;
        const password = document.querySelector("#pw").value;
        const remember = document.querySelector("#flexCheckDefault").value;
        fetch("http://localhost:5000/api/auth/login", { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, remember }) 
        }).then(res => res.json()).then(res => { 
            if(!(res.accessToken))
                setFormMessage(loginForm, 'error', res.message);
            else 
                {
                    setFormMessage(loginForm, 'success', res.message);
                    window.localStorage.setItem("token", res.accessToken);
                }
        }).catch(err => {
            setFormMessage(loginForm, 'error', 'Something wrong!');
        })

    });
    registerForm.addEventListener("submit", e => {
        e.preventDefault();
        const user = document.querySelector("#regUser").value;
        const email = document.querySelector("#regEmail").value;
        const password = document.querySelector("#regPass").value;
        const confpass = document.querySelector("#regPass2").value;
        fetch("http://localhost:5000/api/auth/register", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, user, password, confpass }) 
        }).then(res => res.json()).then(res => {

        }).catch(e => {
            setFormMessage(loginForm, 'error', 'Tên đăng nhập/Email/Mật khẩu không hợp lệ!');
        })
    });
    document.querySelectorAll(".input-field").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "regUser" && e.target.value.length > 0 && e.target.value.length < 8) {
                setInputError(inputElement, "Tên người dùng phải có ít nhất 8 kí tự");
            }
            if (e.target.id === "regPass" && e.target.value.length > 0 && e.target.value.length < 8) {
                setInputError(inputElement, "Mật khẩu phải có ít nhất 8 kí tự");
            }
            const P = document.querySelector("#regPass");
            if (e.target.id === "regPass2" && e.target.value !== P.value) {
                setInputError(inputElement, "Khác mật khẩu đã nhập");
            }
            if (e.target.id === "textBox" && e.target.value !== c) {
                setInputError(inputElement, "Sai mã captcha!");
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});


// This event listener is stimulated whenever the user press the "Enter" button
// "Correct!" or "Incorrect, please try again" message is
// displayed after validating the input text with CAPTCHA
/*userText.addEventListener('keyup', function (event) {
    // Key Code Value of "Enter" Button is 13
    if (event.keyCode === 13) {
        document.submitButton.click;
    }
});*/
