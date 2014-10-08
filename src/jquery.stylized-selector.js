/**
 * jquery.stylized-selector.js
 * -----------------------------
 * @author aganglada
 * @since 06/01/2014
 * @link https://github.com/aganglada/stylized-selector
 * @version 1.0
 *
 */

(function ( $ )
{
    $.fn.stylizedSelector = function(options)
    {
            // select data-id
        var selectCount = 0,

            // keyboard utilities
            UP = 38, DOWN = 40, SPACE = 32, RETURN = 13, TAB = 9, ESC = 27, DELETE = 8,

            // to be used on search
            timer = undefined,

            defaults = {
                hiddenClass: 	        'hidden',
                wrapperClass: 			'select',
                styledSelectorClass: 	'styled-select',
                optionsClass: 			'options',
                openSelectorClass: 		'open',
                activeOptionClass: 		'selected',
                currentTextClass: 		'current',
                isMultipleClass: 		'multiple',
                arrowIconClass: 		false,
                onKeyDownTimeout:       2000,
                onOpen: 				function(){},
                onChange: 				function(){}
            },

            settings = $.extend(
                {},
                defaults,
                options
            ),

            /**
             * saving data on selector.
             * to be used later :)
             * @param $selector
             */
            updateDataSelector = function($selector)
            {
                $selector.data( {
                    'isMultiple':       $selector.attr('multiple') !== undefined,
                    'styledSelect':     $selector.next('div.' + settings.styledSelectorClass),
                    'optionList':       $selector.children(),
                    'optionSelected':   $selector.children().filter(':selected')
                });
            },

            /**
             * general method to get a data(index).
             * @param $selector
             * @param index
             * @returns {*}
             */
            dataSelector = function($selector, index)
            {
                return $selector.data(index);
            },

            /**
             * initializing selector,
             * building structure to wrap it.
             * @param $selector
             */
            buildSelector = function($selector)
            {
                var isMultipleClass = dataSelector($selector, 'isMultiple') ? ' ' + settings.isMultipleClass : '';

                $selector.attr('tabindex', -1)
                    .addClass(settings.hiddenClass)
                    .wrap('<div data-id="' + selectCount + '" class="' + settings.wrapperClass + isMultipleClass + '"></div>');


                // if is not a multiple select
                if (!dataSelector($selector, 'isMultiple'))
                {
                    $selector.after('<div class="' + settings.styledSelectorClass + '">' +
                        '<span class="' + settings.currentTextClass + '"></span>' +
                        '</div>');

                    setSelectedOption($selector);

                    if (settings.arrowIconClass !== false)
                    {
                        var $styledSelect = $selector.next('div.' + settings.styledSelectorClass);
                        $styledSelect.append('<i class="' + settings.arrowIconClass + '"></i>');
                    }
                }
                // TODO feature: multiple select support
            },

            /**
             * set initial value.
             * @param $selector
             */
            setSelectedOption = function($selector)
            {
                updateDataSelector($selector);

                var $selectedOption = dataSelector($selector, 'optionSelected'),
                    $styledSelect   = dataSelector($selector, 'styledSelect'),
                    $currentOption  = $styledSelect.children();

                $currentOption.html($selectedOption.text());
            },

            /**
             * building options in selector list.
             * @param $selector
             */
            updateSelect = function($selector)
            {
                updateDataSelector($selector);

                var $selectedOption = dataSelector($selector, 'optionSelected'),
                    $styledSelect   = dataSelector($selector, 'styledSelect');

                var $list = $('<ul />', {
                    'class': settings.optionsClass
                }).insertAfter($styledSelect ? $styledSelect : $selector);

                for (var i = 0; i < dataSelector($selector, 'optionList').length; i++)
                {
                    $('<li />', {
                        text: $selector.children('option').eq(i).text(),
                        rel: $selector.children('option').eq(i).val(),
                        'class': $selectedOption[0] && $selectedOption[0].index == i ? settings.activeOptionClass : ''
                    }).appendTo($list);
                }
            },

            /**
             * onClick selector.
             * @param event
             */
            toggleOpen = function(event)
            {
                event.stopPropagation();

                var $styledSelect = $(event.target).closest('.' + settings.styledSelectorClass),
                    $selectorWrapper = $styledSelect.parent(),
                    selectorIsOpen = $styledSelect.is('.' + settings.openSelectorClass);

                closeAll();

                if (!selectorIsOpen)
                {
                    $styledSelect.toggleClass(settings.openSelectorClass).next('ul.' + settings.optionsClass).toggle();
                    $('select', $selectorWrapper).trigger('onOpen');
                }
            },

            /**
             * triggered on toggleOpen method.
             */
            closeAll = function()
            {
                var $styledSelectors = $('.' + settings.styledSelectorClass),
                    $selectorWrapper = $styledSelectors.parent();

                $styledSelectors.removeClass(settings.openSelectorClass);
                $('ul', $selectorWrapper).hide();
            },

            /**
             * on optionList click.
             * @param event
             */
            selectListItem = function(event)
            {
                selectItem(event, $(event.target).closest('li'));
            },

            /**
             *
             * @param event
             * @param $_optionClicked
             */
            selectItem = function(event, $_optionClicked)
            {
                event.stopPropagation();

                var $selectorWrapper = $_optionClicked.closest('.' + settings.wrapperClass),
                    $currentOption = $selectorWrapper.find('.' + settings.currentTextClass),
                    $list = $selectorWrapper.find('ul'),
                    $selector = $selectorWrapper.find('select');

                $currentOption.text($_optionClicked.text());
                $list.children('li').removeClass(settings.activeOptionClass);
                $_optionClicked.addClass(settings.activeOptionClass);
                $selector.val($_optionClicked.attr('rel'));

                if (event.type == 'click')
                {
                    $selectorWrapper.find('.' + settings.styledSelectorClass).removeClass(settings.openSelectorClass);
                    $list.hide();
                    $selector.trigger('onChange', [{
                        'selectedValue': $_optionClicked.attr('rel')
                    }]);
                }
            },

            /**
             * this is what's happen always when a selector is clicked (open).
             * @param event
             */
            onDefaultOpen = function(event)
            {
                var target = event.target,
                    $selectorWrapper = $(target).parent(),
                    $list = $selectorWrapper.find('ul'),
                    $selectedOption = $list.children('li').filter('.' + settings.activeOptionClass);

                reloadSelectedPosition($list, $selectedOption);
                settings.onOpen.call(this);
            },

            /**
             * on open we go to the centered position of the selected value.
             * @param $list
             * @param $current
             */
            reloadSelectedPosition = function($list, $current)
            {
                $list.scrollTop($list.scrollTop() + $current.position().top - $list.height()/2 + $current.height()/2);
            },

            /**
             * onKeyPress (if select is open)
             * @param event
             */
            selectKeyPress = function(event)
            {
                var $currentOpenSelector    = $('.' + settings.styledSelectorClass + '.' + settings.openSelectorClass),
                    $currentWrapperSelector = $currentOpenSelector.parent(),
                    $selector               = $('select', $currentWrapperSelector),
                    $list                   = $('ul', $currentWrapperSelector),
                    $current                = $('li.' + settings.activeOptionClass, $list),
                    $currentPrev            = $current.prev(),
                    $currentNext            = $current.next(),
                    matchString             = '',
                    count                   = $selector.data('count') || 0;

                // keyboard conditions
                var currentKeyCode = event.keyCode,
                    keyboard = event.keyCode >= 48 && event.keyCode <= 90,
                    numeric  = event.keyCode >= 96 && event.keyCode <= 105;

                if ($currentOpenSelector.length > 0)
                {
                    event.preventDefault();
                }

                matchString = $selector.data('matchString') !== undefined
                    ?
                    $selector.data('matchString')
                    :
                    '';

                if (
                    currentKeyCode == RETURN
                        ||
                        currentKeyCode == SPACE
                        ||
                        currentKeyCode == TAB
                        ||
                        currentKeyCode == ESC
                    )
                {
                    $current.trigger('click');
                    return;
                }
                else if (currentKeyCode == UP && $currentPrev.length && $currentPrev.is('li'))
                {
                    selectItem(event, $currentPrev);
                    reloadSelectedPosition($list, $current);
                }
                else if (currentKeyCode == DOWN && $currentNext.length && $currentNext.is('li'))
                {
                    selectItem(event, $currentNext);
                    reloadSelectedPosition($list, $current);
                }
                else if (currentKeyCode == DELETE)
                {
                    matchString = matchString.slice(0, -1);
                    $selector.data(
                        'matchString',
                        matchString
                    );
                }
                else if (keyboard || numeric)
                {
                    currentKeyCode = numeric ? currentKeyCode -48 : currentKeyCode;

                    var string = String.fromCharCode(currentKeyCode).toLowerCase();

                    // #1
                    if (string != matchString)
                    {
                        matchString = matchString + String.fromCharCode(currentKeyCode).toLowerCase();
                        $selector.data('count', 0);
                    }
                    else
                    {
                        matchString = string;
                        $selector.data('count', count+1);
                    }

                    $selector.data(
                        'matchString',
                        matchString
                    );
                    checkForMatch(event, $currentOpenSelector);
                }

                timer = $selector.data('timer');

                if (timer !== undefined)
                {
                    clearTimeout(timer);
                }

                timer = setTimeout(
                    callClearTimeout,
                    settings.onKeyDownTimeout
                );

                $selector.data('timer', timer);
            },

            /**
             * 3 sec. to clear out the search data.
             */
            callClearTimeout = function()
            {
                var $currentOpenSelector = $('.' + settings.styledSelectorClass + '.' + settings.openSelectorClass),
                    $selector = $('select', $currentOpenSelector.parent());

                clearKeyStrokes($selector);
            },

            /**
             * looking for a match in the options,
             * if the select is open.
             * @param event
             * @param $currentOpenSelector
             */
            checkForMatch = function(event, $currentOpenSelector)
            {
                var $openSelectorWrapper = $currentOpenSelector.parent(),
                    $selector            = $('select', $openSelectorWrapper),
                    $list                = $('ul', $openSelectorWrapper),
                    matchString          = $('select', $openSelectorWrapper).data('matchString'),
                    matchesElements      = [],
                    $selectedOption      = undefined,
                    count                = $selector.data('count');

                $('li', $list).each(function(key, element)
                {
                    var text = $(element).text().toLowerCase().trim();

                    if (text.indexOf(matchString) == 0)
                    {
                        $selectedOption = $(this);
                        matchesElements.push($selectedOption);
                    }
                });

                if (count >= matchesElements.length)
                {
                    $selector.data('count', 0);
                    count = 0;
                }

                $selectedOption = matchesElements[count];

                if ($selectedOption !== undefined)
                {
                    selectItem(event, $selectedOption);
                    reloadSelectedPosition($list, $selectedOption);
                }

            },

            /**
             * reset search
             * @param $selector
             */
            clearKeyStrokes = function($selector)
            {
                $selector.removeData();
                timer = undefined;
            };

        /**
         * jQuery plugin Loop
         *
         * Add a handler to manage the original select
         *
         */
        this.each(function()
        {
            var $selector = $(this);

            updateDataSelector($selector);
            buildSelector($selector);
            updateSelect($selector);
            selectCount++;
        });

        $(document).on('click', '.' + settings.styledSelectorClass, toggleOpen);
        $(document).on('click', closeAll);
        $(document).on('click', '.' + settings.optionsClass, selectListItem);
        $(document).on('keydown', selectKeyPress);
        $(document).on('onOpen', 'select', onDefaultOpen);
        $(document).on('onChange', 'select', function(event, data)
        {
            settings.onChange.call(this, data.selectedValue);
        });

        return this;
    };

}( jQuery ));
