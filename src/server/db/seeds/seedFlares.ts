import fs, { ReadStream } from 'fs';
import s3Client from '../../../../aws-config';
import path from 'path';
import dotenv from 'dotenv';
import Flares from '../models/flares';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';

dotenv.config();

const { S3_BUCKET_NAME } = process.env;

if (!S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME environment variable is not set.');
}
type FlareType = {
  id?: number;
  name: string;
  type: string | void;
  icon: string;
  achievement: string;
  value: number;
  milestone: number | null;
  description: string;
};
type FlareArr = any[];
type UploadParams = {
  Bucket: string;
  Key: string;
  Body: ReadStream;
  ACL?: 'public-read';
  ContentType: string;
};
// Function to create flare achievements and input them into the database

// Use a class to build flares and pass in arrays?
class Flare {
  name: string;
  type: string | '';
  icon: string | '';
  achievement: string;
  value: number;
  milestone: number;
  description: string;
  constructor(flareInfo: any[]) {
    // Destructure the array
    const [name, type, icon, achievement, value, milestone, description] =
      flareInfo;
    this.name = name;
    this.type = type;
    this.icon = icon;
    this.achievement = achievement;
    this.value = value;
    this.milestone = milestone;
    this.description = description;
  }
}
/* PLAN
 * Get images for the Flares
 * Add the image paths to the Flare Arrays
 * Update seed to store the images within the s3 bucket
 * - Need to use path.basename() to create the image key (This will be stored on the Flare)
 * - Once all image keys are created and added to the Flare objects => create the flares
 */
const flares: FlareType[] = [];
const flareArrays: any[] = [];
// Create individual flare arrays and push them onto the flareArrays
const butterFlareEffect: FlareArr = [
  'Butterflare Effect',
  'Special Flare',
  path.join(__dirname, '.', 'flareImages', 'butterFlare.png'),
  'Started your journey with Flare!',
  0,
  null,
  'Signup for Flare',
];
const goGetter: FlareArr = [
  'Go Getter',
  'Task Flare',
  path.join(__dirname, '.', 'flareImages', 'goGetter.png'),
  'Completed your first ever task!',
  0,
  null,
  'Complete your first task',
];
const theHost: FlareArr = [
  'The Host',
  'Event Flare',
  path.join(__dirname, '.', 'flareImages', 'theHost.png'),
  'Created an event for the first time!',
  0,
  null,
  'Create an event',
];
const storedThoughts: FlareArr = [
  'Stored Thoughts(x3)',
  'AI Flare',
  path.join(__dirname, '.', 'flareImages', 'storedThoughts.png'),
  'Saved 3 AI conversations',
  0,
  null,
  'Talk to the AI',
];
const theSpark: FlareArr = [
  'The Spark',
  'Event Flare',
  path.join(__dirname, '.', 'flareImages', 'theSpark.png'),
  'Attended your first ever event!',
  0,
  null,
  'Attend your first event',
];
const multiTasker: FlareArr = [
  'Multitasker',
  'Task Flare',
  '',
  "You've completed 5 tasks!",
  0,
  5,
  'Complete 5 tasks',
];
const partyAnimal: FlareArr = [
  'Party Animal',
  'Event Flare',
  '',
  "You've attended 5 events!",
  0,
  5,
  'Attend 5 events',
];
const venueVirtuoso: FlareArr = [
  'Venue Virtuoso',
  'Venue Flare',
  path.join(__dirname, '.', 'flareImages', 'venueVirtuoso.png'),
  'Added information to a venue!',
  0,
  null,
  'Input venue data',
];

flareArrays.push(theHost, theSpark, venueVirtuoso);

// Create an object using the arrays above and push the object onto the flares array
flareArrays.forEach((flareInfo) => {
  flares.push(new Flare(flareInfo));
});

const seedFlares = async () => {
  try {
    const foundFlares = await Flares.findAll();
    // if (foundFlares) {
    //   console.log('Destroying the existing flares');
    //   await Flares.destroy( { where: { value: 0 } });
    // }
  } catch (err) {
    console.error('Error seeding flares in the database: ', err);
  }
  // Create an array to push the result of uploadImages onto
  const flarePromises: Promise<FlareType>[] = [];
  // Iterate over the flaresArray of Flares using forEach and push the return onto readyFlares
  flares.forEach((flare) => {
    flarePromises.push(uploadImage(flare));
  });
  Promise.all(flarePromises)
    .then((flares) => {
      Flares.bulkCreate(flares);
    })
    .catch((err) => {
      console.error('Error in promise.all(): ', err);
    });
  console.log('Flares created');
};

async function uploadImage(flare: FlareType): Promise<FlareType> {
  // Store variables in the outer function scope to be accessed by all blocks
  let fileBuffer: Buffer<ArrayBufferLike> | undefined;
  const imageKey: string = `/flare/${path.basename(flare.icon)}`; // Plucks the filename from the path
  // Make sure the image isn't already in the database using headObjectCommand
  try {
    if (!S3_BUCKET_NAME || !s3Client) {
      console.error('S3_BUCKET_NAME or s3Client was undefined');
      throw new Error();
    }
    // Create a buffer with fs.promises.readFile
    fileBuffer = await fs.promises.readFile(flare.icon);
    // Make sure the image isn't already in the database using headObjectCommand
    const headObjectParams: HeadObjectCommandInput = {
      Bucket: S3_BUCKET_NAME,
      Key: imageKey,
    };
    // Create the command
    const headObjectCommand = new HeadObjectCommand(headObjectParams);
    // This command will throw an error if the imageKey does not exist in the bucket
    await s3Client.send(headObjectCommand);
    // If the headObjectCommand is successful then the image already exists
    console.error(`${flare.icon} already exists in the bucket`);
    return flare;
  } catch (error: any) {
    // Check to make sure the error was due to the object not being found
    if (error.name !== 'NotFound') {
      console.error('Error checking object existence:', error);
      throw error; // Re-throw the error
    }
    // If it's a NotFound error, proceed to upload (handled in the next try block)
    console.log(
      `Object with key ${imageKey} key does not exist, proceeding with upload.`
    );
  }
  try {
    const uploadParams: PutObjectCommandInput = {
      Bucket: S3_BUCKET_NAME,
      Key: imageKey,
      Body: fileBuffer,
      ContentType: 'image/png', // Specify the content type
    };
    // Configure the command with the uploadParams
    const putCommand = new PutObjectCommand(uploadParams);
    const image = await s3Client.send(putCommand);
    console.log('Successful upload');
    // Assign the image key to the flare icon
    flare.icon = imageKey; // This key is used to access the image from the bucket
    return flare;
  } catch (err) {
    console.error(`Error uploading file for ${flare.name}`, err);
    throw new Error();
  }
}

// Function to delete image from bucket
async function deleteFromBucket(imageKey: string): Promise<void> {
  try {
    // Configure the command parameters
    const deleteCommandParams: DeleteObjectCommandInput = {
      Bucket: S3_BUCKET_NAME,
      Key: imageKey,
    };
    // Create command with the parameters
    const deleteCommand = new DeleteObjectCommand(deleteCommandParams);
    // Send the command
    await s3Client.send(deleteCommand);
    console.log(`${imageKey} deleted from bucket`);
  } catch (error) {
    console.error(`Error in deleteFromBucket for key ${imageKey}`, error);
  }
}

deleteFromBucket('/flare/venueVirtuoso.png');

export default seedFlares;
