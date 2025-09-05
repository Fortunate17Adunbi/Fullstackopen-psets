const Header = ({ text }) => {
    return (
        <h3> {text} </h3>
    )
}

const Part = ({ name, exercise }) => {
    return (
        <p>{name} {exercise}</p>
    )
}

const Content = ({ parts }) => {

    return (
        <>
            {parts.map(part => {
                return (
                    <Part key={part.id} name={part.name} exercise={part.exercises} />
                )
            })}

            <h4>
                Total of {parts.reduce((sum, exercise) => {
                    return sum + exercise.exercises
                }, 0)}
            </h4>
        </>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            {course.map(course => {
                return (
                    <div key={course.id}>
                        <Header key={course.id} text={course.name} />
                        <Content parts={course.parts} />
                    </div>
                )
            }
            )}

        </div>
    )
}

export default Course