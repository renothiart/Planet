$(document).ready(function () {

  var data = [];
  var activeIdx = -1;
  var user = '';

  // kick off getting the questions
  getSchedules();
  // now do it  every 5 seconds
  //setInterval(getSchedules, 5000);

  function getSchedules() {
    // TODO: make an ajax request to /api/getQuestions. on success
    //       set  the data variable equal to the response and render
    //       out the question previews (by callingrenderPreviews())
    //       Later on in the writeup, also render the active question 
    //       (to update it) with renderactive()
    $.ajax({
      url: '/api/getSchedules',
      dataType: 'json',
      type: 'GET',
      success: function(res) {
        data = res['results'];
        user = res['user'];
        renderPreviews();
        renderActive();
      }
    })
  }

  // makes a list  of questions which all have the question text and a data-qid attribute
  // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
  function renderPreviews() {
    $('#schedules').html(
        data.map((i) => '<li data-sid="' + i._id + '">' + i.scheduleName + '</li>').join('')
    )
  }

  function renderActive() {
    if (activeIdx > -1) {
      var active = data[activeIdx];
      $('#show-schedule').css('display', 'block');
      $('.schedule-area').css('display', 'block');
      $('#schedule-name').text(active.scheduleName ? active.scheduleName: '');
      $('#schedule-date').text(active.date ? 'Planning for ' + active.date: '');
      $('#schedule-creator').text(active.creator ? 'Created by ' + active.creator: '');
      renderSchedule();
    } else {
      $('#show-schedule').css('display', 'none');
    }
  }

  function getColor(num) {
      colors = ['grey','white','lightgreen', 'green', 'darkgreen']
      return colors[num + 1];
  }

  function renderSchedule() {
      var schedule = data[activeIdx]["availability"]
      $('#schedule').html(
          schedule.map((i, idx) => '<text class="time-text">' + ((idx % 12) + 1) + ':00</text><li class="time-block2" data-id="' + idx + '" data-val="' + i + '"></li>').join('')
      )
      $('.time-block2').each(function () {
        $(this).css('background-color', getColor($(this).data('val')));
      });
  }

  $('#schedules').on('click', 'li', function () {
    var _id = $(this).data('sid');
    for (var index = 0; index < data.length; index++) {
      if (data[index]['_id'] == _id) {
        activeIdx = index;
      }
    }
    renderActive();
  })

  $('#schedule').on('click', 'li', function () {
    var id = $(this).data('id');
    var schedule = data[activeIdx]["availability"];
    var userSchedule = data[activeIdx]["userSchedules"]['dic'][user];
    if (userSchedule[id] == 0) {
      userSchedule[id] = 1;
      schedule[id]++;
    } else if (userSchedule[id] == 1) {
      userSchedule[id] = 0;
      schedule[id]--;
    }
    $(this).data('val', schedule[id]);
    renderSchedule();
  })

  $('#show-schedule').on('click', '#apply-changes', function () {
    var schedule = data[activeIdx]["availability"];
    var userSchedule = data[activeIdx]["userSchedules"]['dic'][user];
      $.ajax({
        url: '/api/updateSchedule',
        data: { availability: JSON.stringify(schedule), userSchedule:JSON.stringify(userSchedule), sid: data[activeIdx]._id },
        type: 'POST',
        success: function(res) {
          console.log(res);
          // exercise for you: close the modal (hint: see how we do it in other places)
        }
      })
  })

  $('#show-schedule').on('click', '#invite-user', function () {
    var invited = $('#invitee').val();
    if(invited != '') {
      $.ajax({
        url: '/api/inviteUser',
        data: { invited: invited, sid: data[activeIdx]._id },
        type: 'POST',
        success: function(res) {
          console.log(res);
          // exercise for you: close the modal (hint: see how we do it in other places)
        }
      })
    }
  })
})
