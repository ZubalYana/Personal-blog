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

// Hover event to rotate to 35 degrees
$('.helpCompass').hover(
    function() {
        $(this).css('transform', 'rotate(35deg)');
    }, 
    function() {
        $(this).css('transform', 'rotate(0deg)');
    }
);

// Click event to rotate to 58 degrees
$('.helpCompass').click(function() {
    $(this).css('transform', 'rotate(58deg)');
});