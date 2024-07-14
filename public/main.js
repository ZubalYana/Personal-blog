//pages changing
$('home').click(() => {
    $('.mainPage').css('display', 'flex');
    $('.blogPage').css('display', 'none');
    $('.helpPage').css('display', 'none');
    $('home').addClass('active');
    $('blog').removeClass('active');
    $('help').removeClass('active');
});
$('blog').click(() => {
    $('.mainPage').css('display', 'none');
    $('.blogPage').css('display', 'flex');
    $('.helpPage').css('display', 'none');
    $('home').removeClass('active');
    $('blog').addClass('active');
    $('help').removeClass('active');
});
$('hohelpe').click(() => {
    $('.mainPage').css('display', 'none');
    $('.blogPage').css('display', 'none');
    $('.helpPage').css('display', 'flex');
    $('home').removeClass('active');
    $('blog').removeClass('active');
    $('help').addClass('active');
});
