import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import _ from "lodash";

const Users = () => {
  const queryClient = useQueryClient();
  const blogs = queryClient.getQueryData(["blogs"]);
  const users = _.chain(blogs.map((blog) => blog.user))
    .compact() // remove all falsey value from array
    .groupBy("name") //  group using username conatining the user array
    .map((user) => ({
      ...user[0], // takes one of the object since they are all the same
      blogs: user.length, // determine how many user array to determine the number of blogs
    }))
    .value();
  console.log(" users ni bi", users);

  return (
    <>
      <h3>Users</h3>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>{" "}
              </td>
              <td>{user.blogs}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Users;
