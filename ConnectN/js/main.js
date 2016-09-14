'use strict';

$(() => {

    var input_n =    $('#input_n');
    var input_rows = $('#input_rows');
    var input_cols = $('#input_cols');

    var N, rows, cols, disk_size, gameRunning, can_make_move, computerColor;
    var board;

    var Size = {
        width:   0,
        height : 0
    };

    input_n.on('change', () => {
        input_rows.attr('min', input_n.val());
        input_cols.attr('min', input_n.val());

        if (input_rows.val() < input_n.val())
            input_rows.val(input_n.val());

        if (input_cols.val() < input_n.val())
            input_cols.val(input_n.val());
    });

    function newGame() {
        N =    +input_n.val();
        rows = +input_rows.val();
        cols = +input_cols.val();
        gameRunning = true;
        can_make_move = true;

        var checkedValue = $('input[name="game-type"]:checked').val();

        if (checkedValue === $('#radio-human').val()) {
            board = Board.new(rows, cols, N, Board.GameType.AgainstPlayer, 0);
        } else if (checkedValue === $('#radio-computer').val()) {
            board = Board.new(rows, cols, N, Board.GameType.AgainstComputer, 0);
            if ($('#computer-begins').is(':checked')) {
                computerColor = 0;
                board.currentPlayer = 1;
            } else {
                computerColor = 1;
            }
        } else {
            throw new Error('No checked value found.');
        }

        $('#board').empty();
        for (var i = 0; i < cols; i++) {
            $('#board').append('<div class="board-column" data-id="' + i + '"></div>');
        }
        setBoardSize();

        if (computerColor === 0)
            computerMove();
    }

    $('#button_new_game').on('click', newGame);

    $(document).on('mouseenter', '.board-column', function() {

        if (!gameRunning)
            return;

        var elem = $('<div id="move-indicator" class="disk disk-player' + board.currentPlayer + ' move"></div>');
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

    function computerMove() {
        board.currentPlayer = Board.getNextPlayer(board);
        let column = calculateMove(board);
        let row = Board.move(board, board.currentPlayer, column);
        board.currentPlayer = Board.getNextPlayer(board);
        
        // element to be inserted
        var elem = $('<div class="disk disk-player' + computerColor + '"></div>');

        // set the size of the circle
        elem.css({
            'width' :  Size.width + 'px',
            'height' : Size.width + 'px'
        });

        $('.board-column[data-id=' + column + ']').prepend(elem);
        elem.data('row', board.rows - 1 - row);
        elem.attr('id', 'pos-' + row + '-' + column);
        elem.animate({'top' : ((board.rows - 1 - row) * Size.width + $('#board').position().top) + 'px'}, 1000, 'easeOutBounce');
    
        if (Board.isGameOver(board)) {
            gameRunning = false;
            $('#move-indicator').remove();
        } else {
            can_make_move = true;
        }
    }

    $(document).on('click', '.board-column', function() {

        if (!gameRunning || !can_make_move)
            return;

        can_make_move = false;

        // get the column number
        var column = $(this).data('id');

        // element to be inserted
        var elem = $('<div class="disk disk-player' + board.currentPlayer + '"></div>');

        // set the size of the circle
        elem.css({
            'width' :  Size.width + 'px',
            'height' : Size.width + 'px'
        });

        // check if it's a valid move
        if (!Board.isValidMove(board, column)) {
            alert('Not a valid move!');
            return;
        }

        var row = Board.move(board, board.currentPlayer, column);
        if (Board.isGameOver(board)) {
            gameRunning = false;
            $('#move-indicator').remove();
        }

        if (gameRunning) {
            if (board.gameType === Board.GameType.AgainstPlayer) {
                $('#move-indicator').removeClass('disk-player' + board.currentPlayer);
                board.currentPlayer = Board.getNextPlayer(board);
                $('#move-indicator').addClass('disk-player' + board.currentPlayer);
                can_make_move = true;
            } else if (board.gameType === Board.GameType.AgainstComputer) {
                computerMove();
            }
        }

        var player0won = Board.won(board, 0);
        var player1won = Board.won(board, 1);

        // add element to current column
        $(this).prepend(elem);

        elem.data('row', board.rows - 1 - row);
        elem.attr('id', 'pos-' + row + '-' + column);

        elem.animate({'top' : ((board.rows - 1 - row) * Size.width + $('#board').position().top) + 'px'}, 1000, 'easeOutBounce', () => {
            if (player0won || player1won) {
                var moves = Board.getWinningMoves(board, player0won ? 0 : 1);
                moves.forEach((move) => {
                    $('#pos-' + move.row + '-' + move.column).css('box-shadow', 'inset 0 0 2rem #000000');
                });
            }

            if (board.gameType === Board.GameType.AgainstPlayer) {
                if (player0won) {
                    alert('Player Yellow has won!');
                } else if (player1won) {
                    alert('Player Red has won!');
                } else if (Board.legalMoves(board).length === 0) {
                    alert('Remis');
                }
            } else if (board.gameType === Board.GameType.AgainstComputer) {
                if (player0won || player1won) {
                    won_color = player0won ? 0 : 1;
                    if (won_color === computerColor) {
                        alert('Computer has won!');
                        return;
                    } else {
                        alert('Player has won!');
                        return;
                    }
                }

                if (Board.legalMoves(board).length === 0) {
                    alert('Remis');
                }
            }
        });
    });

    window.onresize = () => {
        clearTimeout(resize);
        resize = setTimeout(setBoardSize, 100);
    };

    newGame();
    console.log(board);
});