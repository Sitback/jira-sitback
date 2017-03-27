// ==UserScript==
// @name         Sitback JIRA enhancements
// @namespace    http://sitback.com.au
// @version      0.1.0
// @description  Tweaks for Sitback's JIRA installation.
// @author       Chin Godawita <chin@sitback.com.au
// @match        https://jira.sitback.com.au/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var $document = $(document);
    var boardDetailView = '#ghx-detail-view';
    var $boardDetailView = $(boardDetailView);
    var closeDetailView = function($target) {
        $('.ghx-controls .ghx-detail-close', $target).trigger('click');
    };

    $boardDetailView.on('click', function(e) {
        var $target = $(e.target);
        // Trigger a click on the close button to close the detail view if the
        // 'modal' background is clicked.
        if ($target.is(boardDetailView)) {
            closeDetailView($target);
        }
    });

    // Close 'modal' if escape is pressed too.
    $document.keyup(function(e) {
        if (e.keyCode == 27 && $boardDetailView.is(':visible')) {
            closeDetailView($boardDetailView);
        }
    });

    // Add numbering to comments
    function addCommentNumbers() {
        AJS.$(".commentcount").remove();

        //Assign Show More Comments object to a variable
        var showMoreComments = jQuery('.show-more-comments');
        //Count the amount of comments in the collapsed Show More Comments section so numbering starts from the first comment even if hidden
        var count = (showMoreComments.length === 0) ? 1 : (showMoreComments.data('collapsed-count') + 1);

        AJS.$('div[id|=comment][id!=comment-wiki-edit]').each(function () {
            AJS.$(this).prepend('<h3 class="commentcount">' + count + '</h3>');
            count = count + 1;
        });
    }

    AJS.$('document').ready(function () {
        addCommentNumbers();

        JIRA.bind(JIRA.Events.REFRESH_ISSUE_PAGE, function (e, context, reason) {
            addCommentNumbers();
        });
        JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context, reason) {
            addCommentNumbers();
        });
    });
})(window.jQuery);
