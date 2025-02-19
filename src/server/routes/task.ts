import { Router, Request, Response } from 'express';
import dayjs from 'dayjs';
import User from '../db/models/users';
import Task from '../db/models/tasks';
import User_Task from '../db/models/users_tasks';

const taskRouter = Router();

// GET requests to /api/task/:id
taskRouter.get('/:id', (req: any, res: Response) => {
  const { id } = req.params;
  Task.findByPk(id)
    .then((task) => {
      if (task) {
        res.status(200).send(task);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error('Error finding task byPk: ', err);
      res.sendStatus(500);
    });
});

// POST requests to /api/task
taskRouter.post('/', async (req: any, res: Response) => {
  try {
    const { type, difficulty, date, userId } = req.body.taskInfo;
    // Find the task corresponding to the req.body values
    const task: any = await Task.findOne({
      where: { type, difficulty, date },
    });
    if (!task) {
      res.sendStatus(404);
    } else {
      const taskId = task.id;
      // Change the user's current_task_id to the task id
      const user: any = await User.findByPk(userId);
      user.current_task_id = taskId;
      await user.save();
      await User_Task.findOrCreate({
        where: { UserId: user.id, TaskId: taskId },
      });
      res.status(201).send(task);
    }
  } catch (err) {
    console.error('Error in POST to /api/task: ', err);
    res.sendStatus(500);
  }
});

// PATCH requests to /api/task/:id
taskRouter.patch('/:id', async (req: any, res: Response) => {
  try {
    // Get user's id from req.params
    const taskId = req.params.id;
    // Get taskId from  req.body
    const { userId }: { userId: number } = req.body;
    const user: any = await User.findByPk(userId);
    const userTask: any = await User_Task.findOne({
      where: { UserId: userId, TaskId: taskId },
    });
    if (user && userTask) {
      user.current_task_id = null;
      await user.save();
      userTask.opted_out = true;
      await userTask.save();
      res.status(200).send(user);
    } else {
      console.error('Could not find user or userTask');
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Error in PATCH to /api/task/:id: ', err);
    res.sendStatus(500);
  }
});

// PATCH requests to /api/task, but not to /api/task/:id
taskRouter.patch('/', async (req: any, res: Response) => {
  try {
    const { userId, taskId } = req.body.ids;
    const user: any = await User.findByPk(userId);
    const task: any = await Task.findByPk(taskId);
    const userTask: any = await User_Task.findOne({
      where: { UserId: userId, TaskId: taskId },
    });
    if (user && task && userTask) {
      user.current_task_id = null;
      user.tasks_completed += 1;
      await user.save();
      task.completed_count += 1;
      await task.save();
      userTask.completed = true;
      const date = dayjs().format('MM/DD/YYYY');
      const newDate = dayjs(date);
      userTask.date_completed = newDate;
      await userTask.save();
      res.status(200).send(user);
    } else {
      console.error('user, task, or userTask was not found in PATCH');
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('Error in PATCH to /api/task: ', err);
    res.sendStatus(500);
  }
});

export default taskRouter;
