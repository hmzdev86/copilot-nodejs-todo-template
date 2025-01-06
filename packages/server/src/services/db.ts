import {CosmosClient, Container} from '@azure/cosmos';
import {Task} from  '../models/task';


/**
 * This class is responsible for interacting with the Cosmos DB database.
 * It provides methods for getting, creating, updating and deleting tasks.
 * The class is initialized with the Cosmos DB endpoint and key from the environment variables.
 * The methods use the CosmosClient to interact with the database.
 * This is a singleton class, so there is only one instance of it in the application.
 * @class
 * @constructor
 * @public
 * @singleton
 * @property {CosmosClient} client - The Cosmos DB client
 * @property {Container} container - The container for the tasks
 * @method getTasks - Get all tasks from the database
 * @method getTask - Get a task by id from the database
 * @method createTask - Create a new task in the database
 * @method updateTask - Update a task in the database
 * @method deleteTask - Delete a task by id from the database
 *
 */
export class DbService {
  private client: CosmosClient;
  private container : Container;

  private static instance: DbService;

  static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  constructor() {
    // inlcude a null reference check for the endpoint and key and throw and exception if they are missing
    if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
      throw new Error('Missing COSMOS_ENDPOINT or COSMOS_KEY environment variable');
    }

    const endpoint = process.env.COSMOS_ENDPOINT as string;
    const key = process.env.COSMOS_KEY as string;
    this.client = new CosmosClient({ endpoint, key });
    this.container = this.client
      .database('todo')
      .container('tasks');
  }

  async getTasks(userId: string): Promise<Task[]> {
    const querySpec = {
      query: 'SELECT * from c'
    };
    const { resources } = await this.container.items.query(querySpec).fetchAll();
    return resources as Task[];
  }

  async getTask(id: string): Promise<Task> {
    const { resource } = await this.container.item(id).read();
    return resource as Task;
  }

  async createTask(task: Task): Promise<Task> {
    const { resource } = await this.container.items.create(task);
    return resource as Task;
  }

  async updateTask(task: Task): Promise<Task> {
    const { resource } = await this.container.item(task.id).replace(task);
    return resource as Task;
  }

  async deleteTask(id: string): Promise<void> {
    await this.container.item(id).delete();
  }
}


