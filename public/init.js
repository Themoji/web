'use strict';

(($) => {
    let emojis = Object.create(null);
    let emojiNames = Object.create(null);
    let emojiKeys = [];
    $.get('/emojis.json', (resp) => {
        for (const emoji of resp) {
            emojis[emoji.name] = emoji.unified;
            emojis[String.fromCodePoint.apply(String, emoji.unified)] = emoji.unified;
            emojiNames[JSON.stringify(emoji.unified)] = emoji.name;
            for (const shortName of emoji.short_names) {
                emojis[shortName] = emoji.unified;
            }
        }
        emojiKeys = Object.keys(emojis);
    });

    $(() => {
        let emojiText = '';

        function updateDisplay() {
            $('#emoji-display').html(twemoji.parse(emojiText, {
                folder: 'svg',
                ext: '.svg'
            }));
        }

        $(document).on('keydown', () =>
            $('#emoji-input').focus()
        );

        $('#emoji-input').typeahead({
            minLength: 2,
            highlight: true
        }, {
            name: "emojis",
            source(query, syncResults) {
                const matches = fuzzy.filter(query.trim(), emojiKeys)
                    .sort((resA, resB) => resB.score - resA.score)
                    .map((e) => emojiNames[JSON.stringify(emojis[e.string])])
                    .filter((el, idx, self) => self.indexOf(el) === idx);
                syncResults(matches);
            },
            display(match) {
                return String.fromCodePoint.apply(String, emojis[match]) + ' ' + match;
            },
            templates: {
                suggestion(match) {
                    const text = String.fromCodePoint.apply(String, emojis[match]) + ' ' + match;
                    return '<div>' + twemoji.parse(text, {
                        folder: 'svg',
                        ext: '.svg'
                    }) + '</div>';
                }
            }
        }).on('typeahead:select', (e, match) => {
            const emoji = String.fromCodePoint.apply(String, emojis[match]);
            emojiText = emojiText + emoji;
            $('#emoji-input').typeahead('val', '');
            updateDisplay();
        });
/*
        $('#emoji-input').on('keydown', (e) => {
           if (e.keyCode === 8 && document.getElementById('emoji-input').selectionEnd === 0) {
               let last = null;
               for (const emoji of emojiText) {
                   last = emoji;
               }
               emojiText = emojiText.replace(new RegExp(last + '$'), '');
               updateDisplay();
           }
        });

        $('#emoji-input').on('input', (e) => {
            const input = $('#emoji-input').val();
            if (input.indexOf('\n') !== -1) {
                const matches = fuzzy.filter(input.split(/\n/)[0].trim(), emojiKeys)
                    .sort((resA, resB) => resB.score - resA.score);
                if (matches.length) {
                    const text = $('#emoji-display').text();
                    const emoji = String.fromCodePoint.apply(String, emojis[matches[0].string]);
                    emojiText = emojiText + emoji;
                    updateDisplay();
                }
                $('#emoji-input').val('');
            }
        });
        */
    })
})(jQuery);