function Q(ques, options) {
    /**
     *  This creates a class for the Questions for the quiz
     *      Input: String(ques), List[Strings] (options)
     */

    this.question = ques;
    this.options = options;
}

function Question(ID, ques, options, answer) {
    /**
     *  This class will inherit some properties from the Q class
     *      Input: Integer(ID), String(ques), List[Strings] (options), Integer(answer)      
     */

    Q.call(this, ques, options);
    this.answer = answer;
    this.ID = ID;
}

Question.prototype = {
    constructor: Question,

    getSelected: function () {
        /**
         *  This method will get the selected option from the list
         *      Return: String(selected option)
         */

        for (var i in $('.q' + this.ID)) {
            if (!isNaN(i) && $('.q' + this.ID)[i].classList.contains('active'))
                return $('.q' + this.ID)[i].title;
        }
    },
    validateAnswer: function () {
        /**
         *  This method will check if the selected option is correct or not
         *      Return: Boolean(True if correct, False if wrong)
         */

        return this.answer == this.getSelected();
    },
    addQuestion: function () {
        /**
         *  method to add this Question to the quiz
         */

        var Ques_div = $('<div class="panel-heading"></div>').append($('<h1></h1>').append($('<li></li>').text(this.question)));
        var Opts_div = $('<div class="panel-body"></div>').append($('<div class="list-group"></div'));
        var j = 0;
        for (var i of this.options) {
            var opt = $('<a class="list-group-item q' + this.ID + '" title="' + String(j) + '"></a>').text(i);
            Opts_div.append(opt);
            j++;
        }
        $('#Questions-panel').append(Ques_div, Opts_div);
    }
};


function Instance(content) {
    /**
     *   This creates a class which contains data and defines methods for the experiment
     *       Input: Sentence Object (from the database)
     */

    this.sent = content;
    fy(this.sent.Words);
    this.p_sent = '';
    this.stack = [];
    this.count = 0;
    for (var i in this.sent.Variations) this.count++;
    this.found = [];
}

Instance.prototype = {
    constructor: Instance,

    add_buttons: function () {
        /**
         *   This method adds the word buttons to the html
         */

        for (var j of this.sent.Words) {
            var button = $('<button type="button" class="btn btn-primary btn-lg active ' + j + '"></button>').text(j);
            $('#word_buttons').prepend(button[0]);
            $('.' + j).on('click', {
                word: j
            }, add_sent);
        }
    },

    up_count: function () {
        /**
         *   This method returns the count of sentences that can still be formed
         *       Returns: Integer
         */

        return this.count;
    },

    update_sent: function () {
        /**
         *   This method updates the senetence on any change in stack
         */

        this.p_sent = this.stack.join(' ').toLowerCase();
        $('#sentence').text(casefold(this.p_sent));
    },

    add: function (word) {
        /** 
         *   This method adds a pressed word to the current instance
         *       Input: Word that was pressed(String)
         */

        this.stack.push(word);
        this.update_sent();

    },

    isFresh: function () {
        /** 
         *   This method returns true if no word has been pressed in the current Instance
         *       Returns: true or false
         */

        return this.stack.length == 0;
    },

    last: function () {
        /**
         *   This method returns the last word presed
         *      Returns: String
         */

        return this.stack[this.stack.length - 1];
    },

    undo: function () {
        /**
         *   This method deletes the last word pressed and updates the sentence accordingly
         */

        this.stack.pop();
        this.update_sent();
    },

    reset_variation: function () {
        /**
         *   This method deletes every word pressed in the current instance
         */

        while (this.stack.length) undo();
    },

    reset_instance: function () {
        /**
         *   This method resets all variables of the instance
         */

        this.count = 0;
        for (var i in this.sent.Variations) this.count++;
        update_count();
        this.found = [];
    },

    validate: function () {
        /**
         *   This method validates the current answer(this.p_sent)
         *       It returns:
         *           - 0, if current answer was already accepted
         *           - 404, if current answer is incorrect
         *           - 200, if current answer is correct but the type entered is incorrect
         *           - 100, if the current answer and type entered are both correct
         */

        if (this.found.includes(this.p_sent)) {
            alert('You already Entered that Sentence!');
            return 0;
        }
        else if (this.p_sent in this.sent.Variations) {
            var p_type = $('#sentence_type').val();
            if (this.sent.Variations[this.p_sent] == p_type) {
                this.found.push(this.p_sent);
                this.count = this.count - 1;
                return 100;
            }
            else {
                return 200;
            }
        }
        else {
            return 404;
        }
    },

    add_variations: function (list) {
        /**
         *   This method adds all variations (that can be formed by given words) to the unordered list
         *       Input: Object(<ul></ul>)
         *       Returns: Filled Object(<ul><li>...</li><li>...</li>...<ul>)
         */

        var i = 1;
        $.each(this.sent.Variations, function (key, value) {
            var item = $('<li class="list-group-item list-group-item-success"></li>').text(String(i) + '. ' + casefold(key) + ' (' + casefold(value) + ')');
            list.append(item);
            i = i + 1;
        });
        return list;
    }
};