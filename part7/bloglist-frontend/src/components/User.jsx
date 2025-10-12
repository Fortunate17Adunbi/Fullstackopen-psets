import { userContextData } from "../context/AppContext";

const User = ({ blogs }) => {
  const user = userContextData();
  if (!user) {
    return null;
  }
  return (
    <>
      <h2>{blogs[0].user.name}</h2>
      <div>
        <h6>added blogs</h6>
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default User;
