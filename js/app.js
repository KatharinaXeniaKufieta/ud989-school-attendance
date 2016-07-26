/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

/* ======= Model ======= */

var model = {
  students: [
    {
      name: 'Slappy the Frog',
      missedDays: 0
    }, {
      name: 'Lilly the Lizard',
      missedDays: 0
    }, {
      name: 'Paulrus the Walrus',
      missedDays: 0
    }, {
      name: 'Gregory the Goat',
      missedDays: 0
    }, {
      name: 'Adam the Anaconda',
      missedDays: 0
    }
  ],

  days: 12
};

/* ======= Octopus ======= */

var octopus = {
  init: function() {
    view.init(model.students, model.days);
    this.countMissing();
  },

  countMissing: function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    $allMissed.each(function() {
      var studentRow = $(this).parent('tr'),
          dayChecks = $(studentRow).children('td').children('input'),
          numMissed = 0;

      dayChecks.each(function() {
        if (!$(this).prop('checked')) {
          numMissed++;
        }
      });

      $(this).text(numMissed);
    });
  }
};

/* ======= View ======= */

var view = {
  init: function(students, days) {
    this.initTableHeader(days);
    this.initTableContent(students, days);
    this.checkBoxes();
    this.addEventListener();
  },

  initTableHeader: function(days) {
    // fill the table body with content
    var tableHead = document.getElementById('table-head');
    var thElement = document.createElement('th');
    thElement.className = 'name-col';
    thElement.appendChild(document.createTextNode('Student Name'));
    tableHead.appendChild(thElement);
    for (var i = 0; i < days; i++) {
      thElement = document.createElement('th');
      thElement.appendChild(document.createTextNode(i + 1));
      tableHead.appendChild(thElement);
    }
    thElement = document.createElement('th');
    thElement.className = 'missed-col';
    thElement.appendChild(document.createTextNode('Days Missed'));
    tableHead.appendChild(thElement);
  },

  initTableContent: function(students, days) {
    console.log('inside initTableContent');
    // fill the table body with content
    var table = document.getElementById('table-body');
    students.forEach(function(student) {
      // create a row for each student
      var trElement = document.createElement('tr');
      trElement.className = 'student';
      // create column element for name
      var tdElement = document.createElement('td');
      tdElement.appendChild(document.createTextNode(student.name));
      tdElement.className = 'name-col';
      trElement.appendChild(tdElement);
      table.appendChild(trElement);
      // create column elements for every day
      for (var i = 0; i < days; i++) {
        tdElement = document.createElement('td');
        var inputElement = document.createElement('input');
        inputElement.type = 'checkbox';
        tdElement.appendChild(inputElement);
        tdElement.className = 'attend-col';
        trElement.appendChild(tdElement);
        table.appendChild(trElement);
      }
      tdElement = document.createElement('td');
      tdElement.appendChild(document.createTextNode(student.missedDays));
      tdElement.className = 'missed-col';
      trElement.appendChild(tdElement);
      table.appendChild(trElement);
    });
  },

  checkBoxes: function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
      var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
          dayChecks = $(studentRow).children('.attend-col').children('input');

      dayChecks.each(function(i) {
        $(this).prop('checked', days[i]);
      });
    });
  },


  // When a checkbox is clicked, update localStorage
  addEventListener: function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    $allCheckboxes.on('click', function() {
      var studentRows = $('tbody .student'),
          newAttendance = {};

      studentRows.each(function() {
        var name = $(this).children('.name-col').text(),
            $allCheckboxes = $(this).children('td').children('input');

        newAttendance[name] = [];

        $allCheckboxes.each(function() {
          newAttendance[name].push($(this).prop('checked'));
        });
      });

      octopus.countMissing();
      localStorage.attendance = JSON.stringify(newAttendance);
    });
  }

};

octopus.init();

