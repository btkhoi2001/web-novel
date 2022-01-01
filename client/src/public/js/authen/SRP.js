//CREATE CAPTCHA
let captchaText = document.querySelector('#captcha');
var ctx = captchaText.getContext("2d");
ctx.font = "67px Roboto";
ctx.fillStyle = "#08e5ff";

let refreshButton = document.querySelector('#refreshButton');

ctx.clearRect(0, 0, captchaText.width, captchaText.height);

// alphaNums contains the characters with which you want to create the CAPTCHA
let alphaNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let emptyArr = [];

// This loop generates a random string of 7 characters using alphaNums
// Further this string is displayed as a CAPTCHA
for (let i = 1; i <= 6; i++) {
    emptyArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
}
var c = emptyArr.join('');
ctx.fillText(emptyArr.join(''), captchaText.width / 15, captchaText.height / 1.6);
var userText = document.querySelector('#textBox');
// This event listener is stimulated whenever the user press the "Refresh" button
// A new random CAPTCHA is generated and displayed after the user clicks the "Refresh" button
refreshButton.addEventListener('click', function () {
    userText.value = "";
    let refreshArr = [];
    for (let j = 1; j <= 6; j++) {
        refreshArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
    }
    ctx.clearRect(0, 0, captchaText.width, captchaText.height);
    c = refreshArr.join('');
    ctx.fillText(refreshArr.join(''), captchaText.width / 15, captchaText.height / 1.6);

});



function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".mess");
    messageElement.textContent = message;
    messageElement.classList.remove("mess-success,mess-error");
    if(type === 'error')
        messageElement.classList.add('mess-error');
    else messageElement.classList.add('mess-success');
}

function setInputError(inputElement, message) {
    inputElement.classList.add("input--error");
    inputElement.parentElement.querySelector(".input-error-mes").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("input--error");
    inputElement.parentElement.querySelector(".input-error-mes").textContent = "";
}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

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
        if(checkUser && checkEmail && checkPass && checkPass2 && checkCaptcha) {
            const displayName = document.querySelector("#regUser").value;
            const email = document.querySelector("#regEmail").value;
            const password = document.querySelector("#regPass").value;
            const confirmPassword = document.querySelector("#regPass2").value;
            fetch("http://localhost:5000/api/auth/register", { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, displayName, password, confirmPassword }) 
            }).then(res => res.json()).then(res => {
                if(!(res.accessToken))
                    setFormMessage(registerForm, 'error', res.message);
                else 
                    {
                        setFormMessage(registerForm, 'success', res.message);
                        window.localStorage.setItem("token", res.accessToken);
                    }
            }).catch(err => {
                setFormMessage(registerForm, 'error', 'Something wrong!');
            })
        }
        else return;
    });
    var checkUser = false;
    var checkEmail = false;
    var checkPass = false;
    var checkPass2 = false;
    var checkCaptcha = false;
    document.querySelectorAll(".input-field").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "regUser"){
                if(e.target.value.length > 0 && e.target.value.length < 8) {
                    setInputError(inputElement, "Tên người dùng phải có ít nhất 8 kí tự");
                    checkUser = false;
                }
                else checkUser = true;
            }
            if (e.target.id === "regEmail"){ 
                if(validateEmail(e.target.value))
                    checkEmail = true;
                else {
                    setInputError(inputElement, "Email không hợp lệ");
                    checkEmail = false;
                }
            }
            if (e.target.id === "regPass") {
                if(e.target.value.length > 0 && e.target.value.length < 8) {
                    setInputError(inputElement, "Mật khẩu phải có ít nhất 8 kí tự");
                    checkPass = false;
                }
                else checkPass = true;
            }
            const P = document.querySelector("#regPass");
            if (e.target.id === "regPass2") {
                if(e.target.value !== P.value) {
                    setInputError(inputElement, "Khác mật khẩu đã nhập");
                    checkPass2 = false;
                }
                else checkPass2 = true;
            }
            if (e.target.id === "textBox") {

                if(e.target.value !== c) {
                    setInputError(inputElement, "Sai mã captcha!");
                    checkCaptcha = false;
                }
                else checkCaptcha =true;
            }
        });
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});

