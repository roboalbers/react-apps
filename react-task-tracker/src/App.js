import { useState, useEffect } from "react";
//Alias
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import About from "./components/About";

function App() {
	/* 
	Hook useState
	[name, functionToUpdateState] set to useState and what default useState will use.	
	*/
	const [showAddTask, setShowAddTask] = useState(false);
	const [tasks, setTasks] = useState([]);

	/**
	 * Hook useEffect - used when page load to deal with effects or side effects.
	 */
	useEffect(() => {
		const getTasks = async () => {
			const tasksFromServer = await fetchTasks();
			setTasks(tasksFromServer);
		};
		getTasks();
		//Pass in dependencies as an empty array
	}, []);
	//Fetch tasks
	const fetchTasks = async () => {
		const res = await fetch("http://localhost:5000/tasks");

		const data = await res.json();
		return data;
	};

	//Fetch singleTask
	const fetchSingleTask = async (id) => {
		const res = await fetch(`http://localhost:5000/tasks/${id}`);

		const data = await res.json();
		return data;
	};
	//Add task
	const addTask = async (task) => {
		const res = await fetch("http://localhost:5000/tasks", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(task),
		});
		const data = await res.json();

		setTasks([...tasks, data]);
		//Set ID
		/* const id = Math.floor(Math.random() * 10000) + 1;
		const newTask = { id, ...task };
		setTasks([...tasks, newTask]); */
	};
	/**
	 * Delete Task
	 * Passes the state down to the component
	 * To delete we use the setTasks method in the useState to deal with the new state.
	 */
	const deleteTask = async (id) => {
		await fetch(`http://localhost:5000/tasks/${id}`, {
			method: "DELETE",
		});
		/*******************
		 * Filter the tasks array
		 * Foreach task we filter where task.id not equals the id
		 * We only show the id's we don't delete.
		 *******************/
		setTasks(tasks.filter((task) => task.id !== id));
	};
	/**
	 * Toggle Reminder
	 * Function that when the user double clicks an task we will highlight it.
	 */
	const toggleReminder = async (id) => {
		const taskToToggle = await fetchSingleTask(id);
		const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };
		const res = await fetch(`http://localhost:5000/tasks/${id}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(updatedTask),
		});

		const data = await res.json();
		/**
		 * Ultimately we want to toogle the reminder from true to false or vice versa.
		 * We map through the task where the task.id in the current iteration is equal to the id we pass in. Then we have a specific object.
		 * Else there is no change.
		 * If it is true, we copy/spread across the objects properties and values we have and change the reminder properties to true/false by negating what we have.
		 */
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, reminder: data.reminder } : task
			)
		);
	};

	return (
		<Router>
			<div className="container">
				<Header
					onAdd={() => setShowAddTask(!showAddTask)}
					showAdd={showAddTask}
				/>
				<Route
					path="/"
					exact
					render={(props) => (
						<>
							{showAddTask && <AddTask onAdd={addTask} />}
							{tasks.length > 0 ? (
								<Tasks
									tasks={tasks}
									onDelete={deleteTask}
									onToggle={toggleReminder}
								></Tasks>
							) : (
								"No tasks to show"
							)}
						</>
					)}
				/>
				<Route path="/about" component={About} />
				<Footer />
			</div>
		</Router>
	);
}

export default App;
