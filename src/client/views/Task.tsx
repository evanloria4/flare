import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';
import { UserContext } from '../contexts/UserContext';

function Task() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<object | null>({});
  // Use effect will call getTask if there is a change in user state
  useEffect((): void => {
    // Find the task by the id and set the task in state
    const { current_task_id } = user;
    if (current_task_id) {
      axios
        .get(`/api/task/${current_task_id}`)
        .then(({ data }) => {
          setTask(data);
        })
        .catch((err) => {
          console.error('Error GETting task by id: ', err);
        });
    }
  }, [user]);
  return (
    <>
      <h4>Hello Stanky, you have reached the dashboard.</h4>
      {user.current_task_id ? (
        <TaskDisplay task={task} />
      ) : (
        <ChooseTask setTask={setTask} />
      )}
    </>
  );
}

export default Task;
