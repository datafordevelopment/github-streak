'use strict';

var contribGraph = document.querySelector('.js-calendar-graph-svg > g');
if (contribGraph) {
  // HELPER FUNCTIONS
  // ==========================================================================

  var resetStreak = function () {
    return {
      amount : 0,
      start  : null,
      end    : null
    };
  };

  var getDate = function (contribNode) {
    return contribNode.getAttribute('data-date');
  };

  var MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  var dateWithoutYear = function (date) {
    return MONTHS[date.getUTCMonth()] + ' ' + date.getUTCDate();
  };

  var dateWithYear = function (date) {
    return MONTHS[date.getUTCMonth()].slice(0, 3) + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
  }

  var createDateString = function (startDate, endDate) {
    var start = new Date(startDate);
    var end   = new Date(endDate);

    var startYear = start.getUTCFullYear();
    var endYear   = end.getUTCFullYear();

    if (startYear === endYear) {
      return dateWithoutYear(start) + ' – ' + dateWithoutYear(end);
    } else {
      return dateWithYear(start) + ' – ' + dateWithYear(end);
    }
  };

  var createStatDiv = function (header, type, data) {
    var el = document.createElement('div');
    el.className = 'gh-streak-box';

    var elHeader = document.createElement('p');
    elHeader.className = 'gh-streak-box-header text-muted';
    elHeader.textContent = header;

    var elStat = document.createElement('h1');
    if (type === 'days' && data.amount === 1) {
      type = 'day';
    }
    elStat.textContent = data.amount + ' ' + type;

    var elFooter = document.createElement('p');
    elFooter.className = 'text-muted';
    elFooter.textContent = createDateString(data.start, data.end);

    el.appendChild(elHeader);
    el.appendChild(elStat);
    el.appendChild(elFooter);

    return el;
  };


  // DATA
  // ==========================================================================

  var contribContainer = document.getElementById('contributions-calendar');

  var contribs    = contribGraph.querySelectorAll('rect.day');
  var contribsLen = contribs.length - 1;

  // Total contributions
  var totalContribs   = resetStreak();
  totalContribs.start = getDate(contribs[0]);
  totalContribs.end   = getDate(contribs[contribsLen]);

  // Longest streak
  var longestStreak = resetStreak();

  // Current streak
  var isCurrentStreak = true;
  var currentStreak   = resetStreak();


  // TALLY UP THE STATS
  // ==========================================================================

  var streak = resetStreak();

  var newStreak = true;

  // Start counting from the end up
  for (var i = contribsLen; i >= 0; i--) {
    var count = parseInt(contribs[i].getAttribute('data-count'), 10);

    // Tally up all contributions
    totalContribs.amount += count;

    // If there's a contribution, add it to the current streak
    if (count > 0) {
      streak.amount++;

      // Record the end date for a new streak
      if (newStreak) {
        streak.end = getDate(contribs[i]);
        newStreak = false;
      }
    }

    // End of streak (no contributions for this day) or first day
    if (count === 0 || i === 0) {
      var startDate = i === contribsLen ? contribsLen : i + 1;
      streak.start = getDate(contribs[startDate]);

      if (streak.amount === 0) {
        streak.end = streak.start;
      }

      // If not the current day and is the first streak, set the current streak
      if (isCurrentStreak && i !== contribsLen) {
        currentStreak = streak;
        isCurrentStreak = false;
      }

      // Record if this is the longest streak encountered so far
      if (streak.amount > longestStreak.amount) {
        longestStreak = streak;
      }

      // Reset streak
      streak = resetStreak();
      newStreak = true;
    }
  }


  // APPEND STATS TO PAGE
  // ==========================================================================

  contribContainer.appendChild(createStatDiv('Year of contributions', 'total', totalContribs));
  contribContainer.appendChild(createStatDiv('Longest streak', 'days', longestStreak));
  contribContainer.appendChild(createStatDiv('Current streak', 'days', currentStreak));
}
