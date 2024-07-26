import React, { useState, useEffect } from "react";

const Home = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [isUserCreated, setIsUserCreated] = useState(false);

	const baseApiUrl = "https://playground.4geeks.com/todo";
	const username = "4lvaro8";

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = () => {
		fetch(`${baseApiUrl}/users/${username}`, {
			headers: {
				"accept": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setIsUserCreated(true);
			})
			.catch((error) => console.log("Error fetching user:", error));
	};


	const addTask = () => {
		fetch(`${baseApiUrl}/todos/${username}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"accept": "application/json",
			},
			body: JSON.stringify({
				label: newTask,
				done: false,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then((task) => {
				setTasks((tasks) => [...tasks, task]);
				setNewTask("");
				console.log(task);
			})
			.catch((error) => console.log("Error adding task:", error));
	};

	const deleteTask = (taskId) => {
		fetch(`${baseApiUrl}/todos/${taskId}`, {
			method: "DELETE",
			headers: {
				"accept": "application/json",
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response;
			})
			.then(() => {
				setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
			})
			.catch((error) => console.log("Error deleting task:", error));
	};

	const deleteAllTasks = () => {
		const deletePromises = tasks.map((task) =>
		  fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
			method: "DELETE",
			headers: {
			  "accept": "application/json",
			},
		  })
		);
	
		Promise.all(deletePromises)
		  .then((responses) => {
			const ok = responses.every((response) => response.ok);
			if (ok) {
			  setTasks([]);
			} else {
			  throw new error(responses.statusText);
			}
		  })
		  .catch((error) => console.log("Error:", error));
	  };


	return (
		isUserCreated ? <div className="task-container d-flex flex-column container-fluid w-50">
			<h1 className="title">Todo List App</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					addTask();
				}}
			>
				<div className="input-section">
					<input
						type="text"
						value={newTask}
						onChange={(e) => { setNewTask(e.target.value) }}
						placeholder="New task"
					/>
					<button className="addButton" type="submit">Add Task</button>
				</div>
			</form>

			<ul>
				{tasks.map((task) => (
					<li key={task.id}>
						{task.label}
						<button className="deleteButton" onClick={() => deleteTask(task.id)}>Delete</button>
					</li>
				))}
			</ul>

			<button className="deleteAllButton" onClick={deleteAllTasks}>Clear All Tasks</button>
		</div> : ""
	);
};

export default Home;