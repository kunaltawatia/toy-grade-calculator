import React from "react";

class App extends React.Component {
  state = {
    transcript: {
      semesters: [
        {
          title: "I",
          courses: {
            CS111: { credits: 5, gradeAwarded: "A" },
            CY211: { credits: 4, gradeAwarded: "A" },
            HS111: { credits: 3, gradeAwarded: "A" },
            MA111: { credits: 5, gradeAwarded: "A" },
            ME111: { credits: 4, gradeAwarded: "A" },
            PH111: { credits: 5, gradeAwarded: "A" },
          },
        },
        {
          title: "II",
          courses: {
            CS112: { credits: 4, gradeAwarded: "A" },
            EE121: { credits: 5, gradeAwarded: "A" },
            HS121: { credits: 3, gradeAwarded: "A" },
            MA121: { credits: 5, gradeAwarded: "A" },
            ME121: { credits: 4, gradeAwarded: "A" },
            ME122: { credits: 5, gradeAwarded: "A" },
          },
        },
        {
          title: "III",
          courses: {
            CS121: { credits: 5, gradeAwarded: "A" },
            CS211: { credits: 4, gradeAwarded: "A" },
            CS212: { credits: 4, gradeAwarded: "A" },
            EE211: { credits: 5, gradeAwarded: "A" },
            EE213: { credits: 4, gradeAwarded: "A" },
            HS211: { credits: 3, gradeAwarded: "A" },
          },
        },
        {
          title: "IV",
          courses: {
            CS221: { credits: 3, gradeAwarded: "A" },
            CS222: { credits: 3, gradeAwarded: "A" },
            CS223: { credits: 4, gradeAwarded: "A" },
            HS221: { credits: 3, gradeAwarded: "A" },
            MA221: { credits: 5, gradeAwarded: "A" },
            CS299: { credits: 3, gradeAwarded: "A" },
          },
        },
        {
          title: "V",
          courses: {
            CS311: { credits: 4, gradeAwarded: "A" },
            CS314: { credits: 3, gradeAwarded: "A" },
            CS323: { credits: 3, gradeAwarded: "A" },
            HSL4010: { credits: 3, gradeAwarded: "A" },
          },
        },
        {
          title: "V-VI",
          courses: {
            CS321: { credits: 4, gradeAwarded: "A" },
            CS322: { credits: 3, gradeAwarded: "A" },
            CS399: { credits: 4, gradeAwarded: "A" },
            HSL4040: { credits: 3, gradeAwarded: "A" },
          },
        },
      ],
    },
    details: {
      CS111: { name: "Computer Programming" },
      CY211: { name: "Chemistry" },
      HS111: { name: "English Language and Communication Skills" },
      MA111: { name: "Linear Algebra and Calculus" },
      ME111: { name: "System Exploration--Drawing" },
      PE111: { name: "Physical Exercises I" },
      PH111: { name: "Electromagnetism and Optics" },
      CS112: { name: "Discrete Mathematics" },
      EE121: { name: "Basic Electronics Engineering" },
      HS121: { name: "Rights Responsibilities Law and Constitution" },
      MA121: { name: "Complex Analysis and Differential Equation" },
      ME121: { name: "System Exploration Workshop" },
      ME122: { name: "Engineering Mechanics" },
      PE121: { name: "Physical Exersice II" },
      CS121: { name: "Data Structures and Algorithms" },
      CS211: { name: "Digital Logic & Design" },
      CS212: { name: "Object Oriented Analysis & Design" },
      EE211: { name: "Basic Electrical Engineering" },
      EE213: { name: "Signals and Systems" },
      HS211: { name: "Economics" },
      CS221: { name: "Computer Organization and Architecture" },
      CS222: { name: "Theory of Computation" },
      CS223: { name: "Software Engineering" },
      HS221: { name: "Principles of Management" },
      MA221: { name: "Probability Statistics and Random Processes" },
      CS311: { name: "Data Communication" },
      CS314: { name: "Algorithm Design and Analysis" },
      CS323: { name: "Artificial Intelligence" },
      HSL4010: { name: "Fundamentals of Logic" },
      HSL4040: { name: "Foundations of Sustainability" },
      CS299: { name: "B.Tech. Project" },
      CS399: { name: "B.Tech. Project" },
      CS321: { name: "Computer Networks" },
      CS322: { name: "Database Systems" },
    },
    cgpa: 0,
    sgpa: [0, 0, 0, 0, 0, 0],
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

      const toBeRetrned = {
        ...semester,
        courses: {
          ...semester.courses,
          [courseCode]: {
            ...previousCourseDetails,
            gradeAwarded: this.getNewGrade(previousGrade, action),
          },
        },
      };
      console.log(toBeRetrned);

      return toBeRetrned;
    });

    this.setState(
      {
        transcript: {
          semesters: newSemestersArray,
        },
      },
      this.calculatePointer
    );
  };

  updateLocalStorage = () => {
    localStorage.setItem(
      "transcript",
      JSON.stringify({ transcript: this.state.transcript })
    );
  };

  calculatePointer = () => {
    const semesters = this.state.transcript.semesters;

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
    this.setState({ cgpa, sgpa }, this.updateLocalStorage);
  };

  componentDidMount() {
    const { localStorage } = window;
    const prev_state = localStorage.getItem("transcript");
    try {
      const value = JSON.parse(prev_state);
      if (value) this.setState(value, this.calculatePointer);
    } catch (err) {
      console.error(err);
    } finally {
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
      <div className="flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {semesters.map((semester, semester_idx) => {
            const { title, courses } = semester;
            return (
              <div key={title} className="border-2 border-dashed p-4 md:p-8">
                <p className="font-bold text-3xl mb-6">Semester {title}</p>
                {Object.keys(courses).map((code) => {
                  const { credits, gradeAwarded } = courses[code];
                  const { name } = details[code] ?? {};
                  return (
                    <div
                      className="flex items-center my-1 space-x-8"
                      key={code}
                    >
                      <div className="flex flex-grow space-x-2">
                        <p className="font-bold">{code}</p>
                        <p>{name}</p>
                      </div>
                      <p>{credits}</p>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          class="bg-gray-100 rounded-md px-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          onClick={() =>
                            this.changeGrade(title, code, "DECREMENT")
                          }
                        >
                          -
                        </button>
                        <p>{gradeAwarded}</p>
                        <button
                          type="button"
                          class="bg-gray-100 rounded-md px-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          onClick={() =>
                            this.changeGrade(title, code, "INCREMENT")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
                <p className="font-bold text-lg mt-6">
                  SGPA: {sgpa[semester_idx]}
                </p>
              </div>
            );
          })}
        </div>
        <p className="self-center border-2 border-dashed p-4 font-bold text-xl my-8">
          CGPA: {cgpa}
        </p>
      </div>
    );
  }
}

export default App;
