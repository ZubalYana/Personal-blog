//pages changing
$('.home').click(() => {
    $('.mainPage').css('display', 'flex');
    $('.blogPage').css('display', 'none');
    $('.helpPage').css('display', 'none');
});
$('.blog').click(() => {
    $('.mainPage').css('display', 'none');
    $('.blogPage').css('display', 'flex');
    $('.helpPage').css('display', 'none');
});
$('.help').click(() => {
    $('.mainPage').css('display', 'none');
    $('.blogPage').css('display', 'none');
    $('.helpPage').css('display', 'flex');
});
$('.helpCompass').css('transform', 'rotate(0deg)');

$('.helpCompass').hover(
    function() {
        $(this).css('transform', 'rotate(-50deg)');
    }, 
    function() {
        $(this).css('transform', 'rotate(0deg)');
    }
);
$('.helpCompass').click(function() {
    $(this).css('transform', 'rotate(-300deg)');
});