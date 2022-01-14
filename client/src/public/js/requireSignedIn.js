
if (!window.localStorage.getItem('token')) {
    window.location.replace(`http://localhost:3000/authen`)
    
}

else{
    $('body').removeClass('d-none');
}