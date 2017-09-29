$(document).ready(function() {

console.log('home js loaded');

  $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    $('.alert-register').hide();
    $('.login-register').show();
    e.preventDefault();
  });

  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    $('.alert-register').show();
    $('.login-register').hide();
    e.preventDefault();
  });

  $(".alert-logout").delay(3000).fadeOut(1500);

  if (window.location.href.indexOf('register') > -1) {
    $('#register-form-link').trigger('click');
  }

});
