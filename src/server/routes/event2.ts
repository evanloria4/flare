import { Op } from 'sequelize';
import { Router, Request, Response } from 'express';
import axios from 'axios';
import Event from '../db/models/events';
import User_Event from '../db/models/users_events';
import User from '../db/models/users';
import Venue from '../db/models/venues';

const event2Router = Router();

/*
  GET /api/event => Retrieve all events from the database (filter for events near user in future)
*/
event2Router.get('/', (req: any, res: Response) => {
  const { city, state } = req.query.locationFilter;
  // Query DB for all event objects & send them back to the user
  if (city && state) {
    Event.findAll({
      where: {
        start_time: { [Op.gt]: new Date(Date.now()) },
        '$Venue.city_name$': city,
        '$Venue.state_name$': state,
      },
      include: [
        {
          model: User,
        },
        {
          model: Venue,
        },
        {
          association: 'Category',
        },
        {
          association: 'Interests',
        },
        {
          association: 'Users',
        },
      ],
    })
      .then((events: object[]) => {
        res.status(200);
        res.send(events);
      })
      .catch((err: Error) => {
        console.error('Failed to GET /events:', err);
        res.sendStatus(500);
      });
  } else {
    Event.findAll({
      where: {
        start_time: { [Op.gt]: new Date(Date.now()) },
      },
      include: [
        {
          model: User,
        },
        {
          model: Venue,
        },
        {
          association: 'Category',
        },
        {
          association: 'Interests',
        },
        {
          association: 'Users',
        },
      ],
    })
      .then((events: object[]) => {
        res.status(200);
        res.send(events);
      })
      .catch((err: Error) => {
        console.error('Failed to GET /events:', err);
        res.sendStatus(500);
      });
  }
});

/*
  POST /api/event/attend => Creates a new entry in the User_Tasks table:
    - Tracks the events a user is attending
    - req.user => { id } (user_id)
    - req.params => { id } (event_id)
*/
event2Router.post('/attend/:id', (req: any, res: Response) => {
  // UserId and EventId are needed to create new entry ing User_Tasks table
  const UserId = req.user.id;
  const EventId = req.params.id;

  /*
    Query the User_Events table and insert the new Attended Event
      - findOrCreate is being used to avoid duplicate entries.
  */
  User_Event.findOrCreate({
    where: { UserId, EventId },
    defaults: { UserId, EventId },
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err: unknown) => {
      console.error('Failed to findOrCreate User_Event:', err);
      res.sendStatus(500);
    });
});

/*
  GET /api/event/attend => Retrieve all events the user is attending from the User_Events table
*/
event2Router.get('/attend/:isAttending', (req: any, res: Response) => {
  let isAttending = true;

  if (req.params.isAttending === 'false') {
    isAttending = false;
  }

  User.findOne({
    where: {
      id: req.user.id,
    },
    include: {
      model: Event,
      where: { start_time: { [Op.gt]: new Date(Date.now()) } },
      include: [
        {
          model: User,
        },
        {
          model: Venue,
        },
        {
          association: 'Category',
        },
        {
          association: 'Interests',
        },
        {
          association: 'Users',
        },
      ],
    },
  })
    .then((data) => {
      res.status(200);
      res.send(
        data?.dataValues.Events.filter(
          (event: any) => event.User_Event.user_attending === isAttending
        )
      );
    })
    .catch((err: unknown) => {
      console.error('Failed to GET /api/event/attend', err);
    });
});

/*
  PATCH /api/event/attending/:id => Update User_Events row's user_attending to the opposite boolean
    - req.params => { id } (for the User_Events row)
*/
event2Router.patch('/attending/:id', async (req: any, res: Response) => {
  try {
    const userEvent: any = await User_Event.findOne({
      where: {
        UserId: req.user.id,
        EventId: req.params.id,
      },
    });
    userEvent.user_attending = !userEvent.user_attending;
    await userEvent.save();
    res.sendStatus(200);
  } catch (err: unknown) {
    console.error('Failed to PATCH /api/event/attend/:id', err);
  }
});

event2Router.get('/location/:lat/:lng', (req: Request, res: Response) => {
  // Get location from user
  const { lat, lng } = req.params;
  axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )
    .then(({ data }) => {
      if (data.results.length) {
        const location: any = {
          formatted_address: data.results[0].formatted_address,
        };
        data.results[0].address_components.forEach((comp: any) => {
          if (comp.types.includes('street_number')) {
            location.street_number = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('route')) {
            location.route = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('neighborhood')) {
            location.neighborhood = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('locality')) {
            location.city = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('administrative_area_level_2')) {
            location.parish = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('administrative_area_level_1')) {
            location.state = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('country')) {
            location.country = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('postal_code')) {
            location.postal_code = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
          if (comp.types.includes('postal_code_suffix')) {
            location.postal_code_suffix = {
              long_name: comp.long_name,
              short_name: comp.short_name,
            };
          }
        });
        res.status(200).send(location);
      }
    })
    .catch((err: unknown) => {
      console.error('Failed to GET /api/event/location/:lat/:lng', err);
    });
});

export default event2Router;
