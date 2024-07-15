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
            var $this = $(this);
            $this.css('transition', 'transform 0.1s ease');
            $this.css('transform', 'rotate(-300deg)');
            setTimeout(function() {
                $this.css('transform', 'rotate(-200deg)');
                setTimeout(function() {
                    $this.css('transform', 'rotate(-250deg)');
                    setTimeout(function() {
                        $this.css('transform', 'rotate(-220deg)');
                        setTimeout(function() {
                            $this.css('transition', 'transform 0.3s ease');
                            $this.css('transform', 'rotate(-50deg)');
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });

        $('.icon').hover(
            function() {
                $(this).css('color', '#4F6F52');
            }, 
            function() {
                $(this).css('color', '#45474B');
            }
        );
        $('.iconWhite').hover(
            function() {
                $(this).css('color', '#4F6F52');
            }, 
            function() {
                $(this).css('color', '#fff');
            }
        );