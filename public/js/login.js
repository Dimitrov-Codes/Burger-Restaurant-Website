
$(document).ready(function () {
    $(".login-form").show();
    $(".signup-form").hide();

});
    

$("#l-link").click((e)=>{
    $(".login-form").fadeIn();
    $(".signup-form").fadeOut();
})
$("#s-link").click((e)=>{
    $(".signup-form").fadeIn();
    $(".login-form").fadeOut();
})

// let phone;
// let appVerifier;
// $("#login").click((e)=>{
//     phone = $("#phLogin").val();
//     fetch("/auth?no=" + phone).then(r=>{return r.json()}).then(fetch("/"));
// })