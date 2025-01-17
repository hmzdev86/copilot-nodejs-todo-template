import { DbService } from './db';

jest.mock('@azure/cosmos');

describe('DbService', () => {
  beforeAll(() => {
    // Set environment variables
    process.env.COSMOS_ENDPOINT = 'dummy';
    process.env.COSMOS_KEY = '123';

     // Mock the Cosmos DB client
     const mockClient = {
      database: () => ({
        container: () => ({
          items: {
            create: () => ({
              resource: {
                id: '1',
                userId: '1',
                title: 'test',
                completed: false
              }
            }),
            query: () => ({
              fetchAll: () => ({
                resources: [
                  {
                    id: '1',
                    userId: '1',
                    title: 'test',
                    completed: false
                  }
                ]
              })
            }),
          },
          item: () => ({
            read: () => ({
              resource: {
                id: '1',
                userId: '1',
                title: 'test',
                completed: false
              }
            }),
            replace: () => ({
              resource: {
                id: '1',
                userId: '1',
                title: 'test',
                completed: true
              }
            }),
            delete: () => ({})
          }),
        })
      })
    };
    const CosmosClient = require('@azure/cosmos').CosmosClient;
    CosmosClient.mockImplementation(() => mockClient);



  });

  it('should create a task', async () => {
    const dbService = new DbService();
    const task = await dbService.createTask({
      id: '1',
      title: 'test',
      completed: false,
      userId: '1'
    });
    expect(task).toEqual({
      id: '1',
      title: 'test',
      completed: false,
      userId: '1'
    });
  });

  it('should get all tasks for a user', async () => {
    const dbService = new DbService();
    const tasks = await dbService.getTasks('1');
    expect(tasks).toEqual([
      {
        id: '1',
        title: 'test',
        completed: false,
        userId: '1'
      }
    ]);
  });

  it('should get a task by id', async () => {
    const dbService = new DbService();
    const task = await dbService.getTask('1');
    expect(task).toEqual({
      id: '1',
      title: 'test',
      completed: false,
      userId: '1'
    });
  });


  it('should update a task', async () => {
    const dbService = new DbService();
    const task = await dbService.updateTask({
      id: '1',
      title: 'test',
      completed: true,
      userId: '1'
    });
    expect(task).toEqual({
      id: '1',
      title: 'test',
      completed: true,
      userId: '1'
    });
  });

  it('should delete a task', async () => {
    const dbService = new DbService();
    const task = await dbService.deleteTask('1');
    expect(task).toEqual(undefined);
  });


});
