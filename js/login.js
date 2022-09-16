$(document).ready(function () {
    $(".login-form").show();
    $(".signup-form").hide();

});
    

$("#l-link").click((e)=>{
    $(".login-form").fadeIn();
    $(".signup-form").fadeOut();
    console.log(e);
})
$("#s-link").click((e)=>{
    $(".signup-form").fadeIn();
    $(".login-form").fadeOut();
})
