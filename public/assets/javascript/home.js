//login/register form
$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
});

// $('#register-submit').on('click', function() {
//   var registerData = {};
//   registerData.username = $('#registerUsername').val();
//   registerData.email = $('#email').val();
//   registerData.zipCode = $('#zipCode').val();
//   registerData.password = $('#registerPassword').val();
//   registerData.confirmPassword = $('#confirm-password').val();
//
//   console.log(registerData);
// })
