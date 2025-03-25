import './App.css'

interface HeaderProps {
  name: string;
}

interface CourseProps {
  courses: CoursePart[];
}

interface TotalProps {
  totalCourses: number;
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface SpecialCourses extends CoursePartBase, CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | SpecialCourses;

const App = () => {
  const Header = (props: HeaderProps) => {
    return <h1>{props.name}</h1>;
  };

  const Part = ({ course }: { course: CoursePart }) => {
      switch (course.kind) {
        case "background":
          return <div><br /><b>{course.name} {course.exerciseCount}</b><br /><i>{course.description}</i><br />submit to <a href={course.backgroundMaterial}>{course.backgroundMaterial}</a></div>;
        case "group":
          return <div><br /><b>{course.name} {course.exerciseCount}</b><br /><i>Project exercises {course.groupProjectCount}</i></div>;
        case "basic":
          return <div><br /><b>{course.name} {course.exerciseCount}</b><br /><i>{course.description}</i></div>;
        case "special":
          return <div><br /><b>{course.name} {course.exerciseCount}</b><br /><i>{course.description}</i><br />Required skills: {course.requirements.join(", ")}</div>
        default:
          return <p>ERROR</p>
      };
    };

  const Content = (props: CourseProps) => {
    return (
      <div>
      {props.courses.map(course => (
        <Part key={course.name} course={course} />
      ))}
    </div>
  )};

  const Total = (props: TotalProps) => {
    return <p>Number of exercises {props.totalCourses}</p>;
  };

  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ]

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