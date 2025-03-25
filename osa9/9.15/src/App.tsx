import './App.css'

interface HeaderProps {
  name: string;
};

interface CourseProps {
  courses: {
    name: string;
    exerciseCount: number}[];
};

interface TotalProps {
  totalCourses: number;
};

const App = () => {
  const Header = (props: HeaderProps) => {
    return <h1>{props.name}</h1>;
  };

  const Content = (props: CourseProps) => {
    return (
      <div>
        {props.courses.map((course) =>(
          <p key={course.name}>
          {course.name} {course.exerciseCount}</p>
        ))}
      </div>
    );
  };

  const Total = (props: TotalProps) => {
    return <p>Number of exercises {props.totalCourses}</p>;
  };

  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courses={courseParts} />
      <Total totalCourses={totalExercises} />
    </div>
  );
};

export default App;