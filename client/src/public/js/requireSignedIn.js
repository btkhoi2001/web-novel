if (!window.localStorage.getItem("token")) {
    window.location.replace(`https://app-webnovel.herokuapp.com/authen`);
} else {
    $("body").removeClass("d-none");
}
