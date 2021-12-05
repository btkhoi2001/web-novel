let captchaText = document.querySelector('#captcha');
var ctx = captchaText.getContext("2d");
ctx.font = "67px Roboto";
ctx.fillStyle = "#08e5ff";

let output = document.querySelector('#output');
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
    output.innerHTML = "";
});

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#pw');

togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".loginmes");
    messageElement.textContent = message;
    messageElement.classList.remove("loginmes-success, loginmes-error");
    messageElement.classList.add('loginmes-${type}');
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
    var status
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        setFormMessage(loginForm, "error", "Sai Email/Mật khẩu!");
    });
    registerForm.addEventListener("submit", e => {
        const formData = new FormData(document.querySelector('form'));
        fetch('https//localhost:8080/auth.js', {
            method: POST,
            body: formData
        })
        .then(res => {
            status = res.status
            return res.text()
        })
        .then(data => {
            alert(data)
            if(status == 201)
                location.href="./index.html"
        })
        .catch(err => {
            alert(err)
        })
    });
    document.querySelectorAll(".input-field").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;
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
            if (e.target.id === "regEmail" && e.target.value.match(illegalChars)){
                setInputError(inputElement, "Email không được chứa các kí tự đặc biệt");
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
