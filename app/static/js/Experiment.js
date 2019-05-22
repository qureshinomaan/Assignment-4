var Inst;
/**   Variable to store data globally  */

function lang_sel(language) {
    /**
     *   Function to retrieve sentences of a particular language from the database and add data to the webpage
     *       Inout: String(language)
     */

    $.ajax({
        url: 'http://0.0.0.0:5000/sentences/get',
        method: 'GET',
        data: {
            lang: language
        },
        success: function (response) {
            console.log(response.status);
            if (response.status) {
                Inst = new Instance(response.sentence);
                Inst.add_buttons();
                update_count();

            } else {
                alert("An error has occured");
            }
        },
        error: function (response) {
            console.log(response);
            alert("An error occured");
        }
    });
    $('.language_selector')[0].style.display = 'none';
    $('.experiment_content')[0].style.display = 'grid';
}

function fy(a, b, c, d) {
    /** 
     *   Funtion to randomize word order 
     *       Input: Array of words (a), placeholders(b, c, d)
     */

    c = a.length;
    while (c)
        b = Math.random() * c-- | 0,
            d = a[c],
            a[c] = a[b],
            a[b] = d
}
function casefold(string) {
    /** 
     *   Function to convert to normal Case 
     *       Input: String
     *       Returns: String
     */

    if (string.length > 0)
        return string.replace(string[0], string[0].toUpperCase());
    else
        return string;
}

function activate(elem) {
    /** 
     *   Function to activate buttons 
     *       Input: Element Object
     */

    try {
        elem.classList.remove('disabled');
        elem.classList.add('active');
    } catch (err) {
        elem.removeClass('disabled');
        elem.addClass('active');
    }
}

function disable(elem) {
    /** 
     *   Function to disable buttons 
     *       Input: Element Object
     */

    try {
        elem.classList.remove('active');
        elem.classList.add('disabled');
    } catch (err) {
           elem.removeClass('active');
           elem.addClass('disabled');
    }
}

function update_count() {
    /** 
     *   Function to update the sentence counter
     */

    $('#var_count').find('dt').text(Inst.up_count());
}
function add_sent(event) {
    /** 
     *   Function to add word (pressed) to the sentence
     *       Input: Event (Button pess)  
     */

    var W = String(event.data.word);
    if ($(this).hasClass('active')) {
        Inst.add(W);
        disable(this);
        if (!Inst.isFresh()) {
            activate($('#undo_btn'));
        }
    }
}

function undo() {
    /** 
     *   Function to undo latest word add 
     */

    $('#sentence_div').css('background-color', '#EEEEEE');
    $('#sentence_type').css('background-color', 'white');
    var last = Inst.last();
    Inst.undo();
    var elements = $('.' + last);
    for (var i in elements) {
        if (!isNaN(i) && elements[i].classList.contains('disabled')) {
            activate(elements[i]);
            break;
        }
    }
    if (Inst.isFresh())
        disable($('#undo_btn'));
}

function reset_all() {
    /** 
     *   Function to reset one complete sentence (all variations) 
     */
    
    reset();
    Inst.reset_instance();
}

function reset() {
    /** 
     *   Function to reset a particular sentence variations 
     */
    
    activate($('#check'));
    $('#sent_form').trigger('reset');
    $('#all_sents').remove();
    activate($('#show_all'));
    Inst.reset_variation();
}

function check_sent() {
    /** 
     *   Function to check correctness of Sentence 
     */

    if ($('#check').hasClass('active')) {
        if ($('#sentence_type').val() == "") {
            $('[data-toggle="popover"]').popover('show');
        }
        else {
            var type = '', div = '';
            var valid = Inst.validate();

            if (valid == 404) {
                type = 'white';
                div = 'red';
            }
            if (valid == 100) {
                type = 'green';
                div = 'green';
                setTimeout(reset, 800);
                setTimeout(update_count, 800);
                setTimeout(function () {
                    if (Inst.count == 0) {
                        $('#confirm').modal();
                    }
                }, 500);
            }
            if (valid == 200) {
                div = 'green';
                type = 'red';
            }
            $('#sentence_div').css('background-color', div);
            $('#sentence_type').css('background-color', type);
        }
    }
}

function close_popover() {
    /**
     *  Funciton to close the popover
     */

    $('[data-toggle="popover"]').popover('hide');
}

function show_all_sent() {
    /** 
     *   Function to Show all answers 
     */

    $('#all_sents').remove();
    disable($('#check'));
    var list = $('<ul class="list-group well well-lg" id="all_sents"></ul>');
    list = Inst.add_variations(list);
    $('#sub_content').append(list[0]);
    disable($('#show_all'));
}