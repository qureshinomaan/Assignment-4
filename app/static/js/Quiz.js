/** 
 *  Object to store data globally 
 */
var Questions = [], correct = 0, total = 0;

function lang_sel(language) {
    /** 
     *  Function to retrieve sentences of a particular language from the database and add data to the webpage
     *      Input : String(language selected by the User)
     */

    $.ajax({
        url: 'http://0.0.0.0:5000/questions/get',
        method: 'GET',
        data: {
            lang: language
        },
        success: function (response) {
            console.log(response.status);
            if (response.status) {
                for (var i of response.questions) {
                    var New_Quest = new Question(i.ID, i.Question, i.Options, i.Answer);
                    Questions.push(New_Quest);
                    total++;
                }
                for (var i of Questions) {
                    i.addQuestion();
                    $('.q' + String(i.ID)).on('click', { class: 'q' + String(i.ID) }, makeActive);
                }
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

function makeActive(event) {
    /**
     *  Function to make the clicked element of list active
     *      Input: event. Uses class(String) sent in event.data
     */

    var c = event.data.class;
    $('.' + c).removeClass('active');
    $(this).addClass('active');
}

function Sub() {
    /**
     *  Function to evaluate the quiz
     */

    if ($('#Sub').hasClass('active')) {
        $('#Sub').removeClass('active');
        $('#Sub').addClass('disabled');
        for (var i of Questions) {
            if (i.validateAnswer()) {
                $('.active.q' + i.ID).addClass('correct');
                correct++;
            }
            else {
                $('.active.q' + i.ID).addClass('wrong');
            }
        }
        $('.active').removeClass('active');
        $('#score').text(String(correct) + ' out of ' + String(total) + ' correct!');
        var perc = correct/total * 100;
        var remark = '';
        if(perc >= 90) {
            remark = 'Impressive Work!';
        }
        else if(perc >= 70) {
            remark = 'Next time give your best!';
        }
        else {
            remark = 'Were you even trying?';
        }
        $('#remark').text(remark);
        setTimeout(function () {
            $('#confirm').modal();
        }, 500);
    }
}

function close_popover() {
    /**
     *  Funciton to close the popover
     */

    $('[data-toggle="popover"]').popover('hide');
}