/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
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

      var studentID = 0;
      for (var i = 0; i <= 11; i++) {
        var randomBool = getRandom();
        attendance[name].push(randomBool);
      }
    });

    localStorage.attendance = JSON.stringify(attendance);
  }
}());
*/

/* ======= Model ======= */

var model = {
  students: [
    {
      id: 0,
      name: 'Slappy the Frog',
      attendance: [],
      missedDays: 0
    }, {
      id: 1,
      name: 'Lilly the Lizard',
      attendance: [],
      missedDays: 0
    }, {
      id: 2,
      name: 'Paulrus the Walrus',
      attendance: [],
      missedDays: 0
    }, {
      id: 3,
      name: 'Gregory the Goat',
      attendance: [],
      missedDays: 0
    }, {
      id: 4,
      name: 'Adam the Anaconda',
      attendance: [],
      missedDays: 0
    }
  ],

  days: 12,

  initAttendance: function() {
    console.log('Creating attendance records...');
    function getRandom() {
      return (Math.random() >= 0.5);
    }

    var numDays = this.days;
    this.students.forEach(function(student) {
      for (var i = 0; i < numDays; i++) {
        var randomBool = getRandom();
        student.attendance.push(randomBool);
      }
    });
  }
};

/* ======= Octopus ======= */

var octopus = {
  init: function() {
    model.initAttendance();
    this.countMissing();
    view.init(model.students, model.days);
  },

  countMissing: function() {
    model.students.forEach(function(student) {
      var missedCount = 0;
      student.attendance.forEach(function(attended) {
        if (attended === false) {
          missedCount++;
        }
      })
      student.missedDays = missedCount;
    })
  },

  renderMissing: function() {
    view.renderMissedDays(model.students);
  },

  updateAttendance: function(studentID, day, attended) {
    model.students[studentID].attendance[day] = attended;
    this.countMissing();
    view.renderMissedDays(model.students);
  }
};

/* ======= View ======= */

var view = {
  init: function(students, days) {
    this.initTableHeader(days);
    this.initTableContent(students, days);
    this.checkBoxes(students);
  },

  initTableHeader: function(days) {
    // Fill the table body with content
    var tableHead = document.getElementById('table-head');
    var thElement = document.createElement('th');
    // Create a table entry for Student Name
    thElement.className = 'name-col';
    thElement.appendChild(document.createTextNode('Student Name'));
    tableHead.appendChild(thElement);
    // Create table entries for each day
    for (var i = 0; i < days; i++) {
      thElement = document.createElement('th');
      thElement.appendChild(document.createTextNode(i + 1));
      tableHead.appendChild(thElement);
    }
    // Create a table entry for Days Missed
    thElement = document.createElement('th');
    thElement.className = 'missed-col';
    thElement.appendChild(document.createTextNode('Days Missed'));
    tableHead.appendChild(thElement);
  },

  initTableContent: function(students, days) {
    // Fill the table body with content
    var table = document.getElementById('table-body');
    students.forEach(function(student) {
      // Create a row for each student
      var trElement = document.createElement('tr');
      trElement.className = 'student';
      trElement.id = 'student-' + student.id;
      // Create a column element for the student name
      var tdElement = document.createElement('td');
      tdElement.appendChild(document.createTextNode(student.name));
      tdElement.className = 'name-col';
      trElement.appendChild(tdElement);
      table.appendChild(trElement);
      // Create columns for every day
      for (var day = 0; day < days; day++) {
        tdElement = document.createElement('td');
        var inputElement = document.createElement('input');
        inputElement.type = 'checkbox';
        inputElement.className = 'checkbox';
        // Add event listener to each checkbox
        inputElement.addEventListener('click', (function(student, day, checkbox) {
          return function() {
            var attended = checkbox.checked;
            octopus.updateAttendance(student.id, day, attended);
          }
        })(student, day, inputElement));
        // Attach checkbox to table
        tdElement.appendChild(inputElement);
        tdElement.className = 'attend-col';
        trElement.appendChild(tdElement);
        table.appendChild(trElement);
      }
      // Create a column for the missed days
      tdElement = document.createElement('td');
      tdElement.appendChild(document.createTextNode(student.missedDays));
      tdElement.className = 'missed-col';
      trElement.appendChild(tdElement);
      table.appendChild(trElement);
    });
  },

  checkBoxes: function(students) {
    for (var i = 0, max = students.length; i < max; i++) {
      var checkboxes = document.getElementById('student-' + i).getElementsByClassName('checkbox')
      var student = students[i];
      for (var j = 0, maxBoxes = checkboxes.length; j < maxBoxes; j++) {
        if (student.attendance[j] === true) {
          checkboxes[j].checked = true;
        } else {
          checkboxes[j].checked = false;
        }
      }
    }
  },

  renderMissedDays: function(students) {
    for (var i = 0, max = students.length; i < max; i++) {
      var missedDays = document.getElementById('student-' + i).getElementsByClassName('missed-col');
      missedDays[0].innerHTML = students[i].missedDays;
    }
  }
};

octopus.init();

