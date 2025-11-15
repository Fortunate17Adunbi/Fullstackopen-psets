import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_BIRTH } from "../queries";
import Select from "react-select";

const Authors = () => {
  const [name, setName] = useState(null);
  const [born, setBorn] = useState("");

  const [editBirth] = useMutation(EDIT_BIRTH);
  const result = useQuery(ALL_AUTHORS);
  if (result.loading) {
    return <div>loading...</div>;
  }

  const submit = (event) => {
    event.preventDefault();
    editBirth({ variables: { name: name.value, born } });

    setName(null);
    setBorn("");
  };
  const authors = result.data.allAuthors;
  const options = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }));

  console.log("option ", options);
  console.log("name ", name);
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>set birthyear</h3>

      <form onSubmit={submit}>
        <div>
          <Select value={name} onChange={setName} options={options} />
        </div>
        <div>
          born:
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
