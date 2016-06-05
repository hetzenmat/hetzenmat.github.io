$(() => {

    var input_n = $('#input_n');
    var input_rows = $('#input_rows');
    var input_cols = $('#input_cols');

    var N, rows, cols, disk_size;
    var currentPlayer = 1;

    var Size = {
        width: 0,
        height : 0
    };

    function getNextPlayer() {
        currentPlayer = (currentPlayer + 1) % 3 + 1;
    }

    input_n.on('change', () => {
        input_rows.attr('min', input_n.val());
        input_cols.attr('min', input_n.val());

        if (input_rows.val() < input_n.val())
            input_rows.val(input_n.val());

        if (input_cols.val() < input_n.val())
            input_cols.val(input_n.val());
    });

    function newGame() {
        N = input_n.val();
        rows = input_rows.val();
        cols = input_cols.val();
        
        $('#board').empty();
        for (var i = 0; i < cols; i++) {
            $('#board').append('<div class="board-column" data-id="' + i + '"></div>');
        }
    }

    $('#button_new_game').on('click', newGame);

    $(document).on('mouseenter', '.board-column', function() {
        var elem = $('<div class="disk disk-player' + currentPlayer + ' move"></div>');
        elem.css({
            'opacity' : '0',
            'width' : Size.width + 'px',
            'height' : Size.width + 'px'
        });

        $(this).prepend(elem);

        elem.animate({'opacity' : '0.5'}, 500);
    });

    $(document).on('mouseleave', '.board-column', function() {
        $('.move').remove();
    });

    var resize;
    function setBoardSize() {
        var margin = Math.min($(window).height(), $(window).width()) * 0.05;

        var height = $(window).height() - $('#inputs').height();
        var width = $(window).width();

        var height_size = (height - margin) / rows;
        var width_size = (width - margin) / cols;

        disk_size = Math.min(height_size, width_size);

        $('#board').width(disk_size * cols);
        $('#board').height(disk_size * rows);

        Size = {
            height: $('#board').height(),
            width: disk_size
        };

        $('.board-column').css({
            'height' : Size.height,
            'width'  : Size.width
        });

        $('.disk').each(function() {

            $(this).css({
                'width'  : Size.width,
                'height' : Size.width,
                'top'    : ($(this).data('row') * Size.width + $('#board').position().top) + 'px'
            });
            //console.log(($(this).data('row') * Size.width) + 'px');
        });
    }

    $(document).on('click', '.board-column', function() {

        // get the column number
        var column = $(this).data('id');

        // element to be inserted
        var elem = $('<div class="disk disk-player' + currentPlayer + '"></div>');

        // set the size of the circle
        elem.css({
            'width' :  Size.width + 'px',
            'height' : Size.width + 'px'
        });

        // check if it's a valid move

        // add element to current column
        $(this).prepend(elem);

        elem.data('row', (rows-1));

        elem.animate({'top' : ((rows-1) * Size.width + $('#board').position().top) + 'px'}, 1000, 'easeOutBounce');
    });

    window.onresize = () => {
        clearTimeout(resize);
        resize = setTimeout(setBoardSize, 100);
    };

    newGame();
    setBoardSize();
    
});