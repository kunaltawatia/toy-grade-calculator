import React from "react";
import "./App.css";

class App extends React.Component {
  state = {
    transcript: {
      semesters: [
        {
          title: "I",
          courses: {
            CS323: {
              credits: 3,
              gradeAwarded: "A",
            },
          },
        },
        {
          title: "II",
          courses: {
            CS323: {
              credits: 3,
              gradeAwarded: "A",
            },
          },
        },
      ],
    },
    details: {
      CS323: {
        name: "Artificial Intelligence",
      },
    },
    cgpa: 0,
    sgpa: [0, 0],
  };

  getGradeValue = (grade) => {
    switch (grade) {
      case "A":
        return 10;
      case "B":
        return 8;
      case "C":
        return 6;
      case "D":
        return 4;
      default:
        break;
    }
  };

  getGradeFromValue = (value) => {
    switch (value) {
      case 10:
        return "A";
      case 8:
        return "B";
      case 6:
        return "C";
      case 4:
        return "D";
      default:
        break;
    }
  };

  getNewGrade = (grade, action) => {
    switch (action) {
      case "INCREMENT":
        return this.getGradeFromValue(
          Math.min(10, this.getGradeValue(grade) + 2)
        );
      case "DECREMENT":
        return this.getGradeFromValue(
          Math.max(4, this.getGradeValue(grade) - 2)
        );
      default:
        break;
    }
  };

  changeGrade = (semesterTitle, courseCode, action) => {
    const { transcript } = this.state;
    const { semesters } = transcript;

    const newSemestersArray = semesters.map((semester) => {
      if (semester.title !== semesterTitle) return semester;

      const previousCourseDetails = semester.courses[courseCode];
      const previousGrade = previousCourseDetails.gradeAwarded;
      return {
        ...semester,
        courses: {
          ...semester.courses,
          [courseCode]: {
            ...previousCourseDetails,
            gradeAwarded: this.getNewGrade(previousGrade, action),
          },
        },
      };
    });
    /*
    [{...}, {...}]
    [{...}, {
      courses: {
        ...
        code : {
          credits: ...
          gradeAwarded: withAction
        }
      }
    }]
    */

    this.setState(
      {
        transcript: {
          semesters: newSemestersArray,
        },
      },
      () => {
        this.updateLocalStorage();
        this.calculatePointer();
      }
    );
  };

  updateLocalStorage = () => {
    localStorage.setItem("state", JSON.stringify(this.state));
  };

  calculatePointer = () => {
    const {
      transcript: { semesters },
    } = this.state;

    let totalCredits = 0,
      totalPointsEarned = 0;

    let sgpa = [];

    // sgpa
    for (const semester of semesters) {
      let semesterCredits = 0,
        semesterPointsEarned = 0;
      for (const code in semester.courses) {
        const { credits, gradeAwarded } = semester.courses[code];
        semesterCredits += credits;
        semesterPointsEarned += credits * this.getGradeValue(gradeAwarded);
      }
      const current_sgpa = semesterPointsEarned / semesterCredits;
      sgpa.push(current_sgpa);

      totalCredits += semesterCredits;
      totalPointsEarned += semesterPointsEarned;
    }

    // cgpa
    let cgpa = totalPointsEarned / totalCredits;
    this.setState({ cgpa, sgpa });
  };

  componentDidMount() {
    const { localStorage } = window;
    const prev_state = localStorage.getItem("state");
    try {
      // bulletproof
      const value = JSON.parse(prev_state);
      if (value) this.setState(value, this.calculatePointer);
    } catch (err) {
      console.error(err);
      this.calculatePointer();
    }
  }

  render() {
    const {
      transcript: { semesters },
      details,
      cgpa,
      sgpa,
    } = this.state;

    return (
      <div class="app">
        {semesters.map((semester, semester_idx) => {
          const { title, courses } = semester;
          return (
            <div class="semester-details">
              <p class="semester-title">Semester {title}</p>
              {Object.keys(courses).map((code) => {
                const { credits, gradeAwarded } = courses[code];
                const { name } = details[code];
                return (
                  <div class="course-row">
                    <p className="course-id">{code}</p>
                    <p>{name}</p>
                    <p className="course-credits">{credits}</p>
                    <button
                      onClick={() => this.changeGrade(title, code, "DECREMENT")}
                    >
                      -
                    </button>
                    <p>{gradeAwarded}</p>
                    <button
                      onClick={() => this.changeGrade(title, code, "INCREMENT")}
                    >
                      +
                    </button>
                  </div>
                );
              })}

              <p className="sgpa">SGPA: {sgpa[semester_idx]}</p>
            </div>
          );
        })}
        <p className="cgpa-box">CGPA: {cgpa}</p>
      </div>
    );
  }
}

export default App;
