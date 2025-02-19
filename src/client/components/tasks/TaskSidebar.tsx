import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '@/client/contexts/UserContext';
import TaskFlareCard from '../flares/TaskFlareCard';

type FlareType = {
  id: number;
  name: string;
  type: string | void;
  icon: string;
  achievement: string;
  milestone: string;
  description: string;
  value: number;
};

type TaskFlaresArr = FlareType[] | [];

function TaskSidebar() {
  const { user, getUser } = useContext(UserContext);
  const [completedTaskFlares, setCompletedTaskFlares] = useState<TaskFlaresArr>(
    []
  );

  useEffect(() => {
    const { id } = user;
    // GET req to /api/flares/completed/tasks
    axios
      .get(`/api/flare/completed/tasks/${id}`)
      .then(({ data }) => {
        setCompletedTaskFlares(data);
      })
      .catch((err) => {
        console.error('Error getting user task flares:', err);
      });
  }, [user]);
  return (
    <div>
      <div className="text-2xl text-white">{`Last week task count: ${user.last_week_task_count}`}</div>
      <div className="text-2xl text-white">{`This week task count: ${user.weekly_task_count}`}</div>
      {completedTaskFlares.map((taskFlare, index) => {
        return (
          <TaskFlareCard
            key={taskFlare.id}
            index={index}
            taskFlare={taskFlare}
          />
        );
      })}
    </div>
  );
}

export default TaskSidebar;
