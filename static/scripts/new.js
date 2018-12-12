$(document).ready(function () {

    // the currently created schedule, initially unavailable
    var schedule = [];
    for (let i = 0; i < 24; i++) {
        schedule.push(-1);
    }

    function getColor(num) {
        colors = ['grey','white','lightgreen', 'green', 'darkgreen']
        return colors[num + 1];
    }

    function renderSchedule() {
        console.log('in render sched');
        $('#schedule').html(
            schedule.map((i, idx) => '<text class="time-text">' + ((idx % 12) + 1) + ':00</text><li class="time-block" data-id="' + idx + '" data-val="' + i + '"></li>').join('')
        )
        $('.time-block').each(function () {
            $(this).css('background-color', getColor($(this).data('val')));
        });
    }
  
    $('#schedule').on('click', 'li', function () {
      var id = $(this).data('id');
      if (schedule[id] == 0) {
        schedule[id] = 1;
      } else if (schedule[id] == 1) {
        schedule[id] = 0;
      }
      $(this).data('val', schedule[id]);
      renderSchedule();
    })
  
    $('#new-schedule-btn').on('click', function () {

        // make data immutable
        $('#schedule-name-text').prop('disabled', true);
        $('#datepicker').prop('disabled', true);
        $('#slider-range').prop('disabled', true);

        // update schedule list
        let early = $("#slider-range").slider("values", 0);
        let late = $("#slider-range").slider("values", 1);
        for (let i = 0; i < 24; i++) {
            if (i >= early && i <= late) {
                schedule[i] = 0;
            }
        }

        // show schedule on right
        $('.schedule-area').css('display', 'block');
        $('#new-schedule-submit').css('display', 'block');
        renderSchedule();
    })

    $('#new-schedule-submit').on('click', function() {
        $.ajax({
            url: '/api/newSchedule',
            data: 
            { 
                scheduleName: $('#schedule-name-text').val(),
                earlyBound: $("#slider-range").slider("values", 0),
                lateBound: $("#slider-range").slider("values", 1),
                date: $('#datepicker').val(),
                availability: JSON.stringify(schedule)
            },
            type: 'POST',
            success: function(res) {
                console.log(res);
            }
        })
    })
})
  