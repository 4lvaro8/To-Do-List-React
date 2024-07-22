import React, { useState, useEffect } from "react";


const TodoList = () => {
  const [username, setUsername] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isUserCreated, setIsUserCreated] = useState(false);

  const baseApiUrl = "https://playground.4geeks.com/todo";

  const fetchUser = async (username) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchTodos = async () => {
    if (username !== "") {
      try {
        const userData = await fetchUser(username);
        if (userData !== null) {
          setTodoList(userData.todos || []);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
  };

  const deleteUser = () => {
    if (username !== "") {
      fetch(`${baseApiUrl}/users/${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.text().then((text) =>
              text ? JSON.parse(text) : {}
            );
          }
          throw Error(response.statusText + "! Something went wrong");
        })
        .then(() => {
          setUsername("");
          setTodoList([]);
          setIsUserCreated(false);
          alert("User and tasks are deleted now");
        })
        .catch((err) => {
          console.log("Error", err);
        });
    } else {
      alert("We cannot delete empty user");
    }
  };

  const createUser = async () => {
    if (username !== "") {
      console.log(username);
      try {
        const response = await fetch(`${baseApiUrl}/users/${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // If user already exists, fetch their todos
          if (response.status === 400) {
            alert("User already exists, fetching todos...");
            setIsUserCreated(true);
            fetchTodos(username);
          } else {
            throw new Error(
              response.statusText + "! Something went wrong"
            );
          }
        } else {
          await response.json();
          alert("User created successfully");
          setIsUserCreated(true);
          fetchTodos(username); // Fetch todos after user is created
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error: Username cannot be empty");
      throw new Error("Username cannot be empty");
    }
  };

  const addNewTodo = () => {
    if (username === "") {
      alert("Please add Username First");
      return;
    }

    if (newTodo !== "") {
      fetch(`${baseApiUrl}/todos/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: newTodo,
          is_done: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTodoList([...todoList, data]);
          console.log("Task added: ", data);
          setNewTodo("");
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Todo cannot be empty");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${baseApiUrl}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(response.statusText + "! Something went wrong");
      }

      if (response.headers.get("content-length") !== "0") {
        const data = await response.json();
        console.log(data);
      }

      const updatedTodoList = todoList.filter((todo) => todo.id !== id);
      setTodoList(updatedTodoList);

      const putResponse = await fetch(`${baseApiUrl}/todos`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodoList),
      });

      if (!putResponse.ok) {
        throw new Error(putResponse.statusText + "! Something went wrong");
      }

      alert("Todo deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isUserCreated) {
      fetchTodos();
    }
  }, [isUserCreated, username]);

  return (
    <div className="todo-app">
      <div className="input-section">
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Username"
        />
		{isUserCreated ? <button className="button" onClick={deleteUser}>delete</button> : <button className="button" onClick={createUser}>Create User</button> }
        
      </div>

      {isUserCreated && (
        <div className="input-section">
          <input
            className="input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter your New Task"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewTodo();
              }
            }}
          />
          <button className="button" onClick={addNewTodo}>
            Add
          </button>
        </div>
      )}

      <ul className="todo-list">
        {todoList !== undefined &&
          todoList.map((todo) => (
            <li key={todo.id} className="todo-item">
              {todo.label}
              <i
                className="fa fa-trash delete-icon"
                aria-hidden="true"
                onClick={() => deleteTodo(todo.id)}
              ></i>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TodoList;