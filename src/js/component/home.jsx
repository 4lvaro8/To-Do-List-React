import React, { useState } from "react";



const Home = () => {
    const [toDos, settoDos] = useState([]);
    const [toDoInput, settoDoInput] = useState("");


    function ToDoItem({ label, delete_toDo }) {
        return (
            <div className="toDo-item">
                <span className='toDo-text'>{label}</span>
                <div className='deletetrash' onClick={delete_toDo}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
                </div>
            </div>
        );
    }
    

    return (
        <div className='main container-fluid w-50'>

            <form className='form container-fluid d-flex flex-column ' onSubmit={(e) => {
                e.preventDefault();

                if (toDoInput.length > 0) {
                    settoDos([{
                        label: toDoInput,
                        is_done: false
                    }, ...toDos])
                    settoDoInput("");
                }
            }}>

                <h1 className="title align-self-center">To Do List</h1>

                <div className="tareas">
                    <input className="form-control"
                        type="text"
                        placeholder="Que debes hacer?"
                        aria-label="todo list input field"
                        value={toDoInput}
                        onChange={(e) => settoDoInput(e.target.value)}
                    />

                    {toDos.map((item, id) =>
                        <ToDoItem key={id} label={item.label}
                            delete_toDo={() => settoDos(toDos.toSpliced(id, 1))}
                        />)}

                    <p><small>{toDos.length} Que haceres restantes{toDos.length == 0 ? ", agregue una tarea" : ""}</small></p>
                </div>


            </form>
        </div>

    )
}

export default Home;