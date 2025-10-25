import { FastifyInstance } from 'fastify';
import {
  createIssueController,
  getIssuesController,
  getIssueController,
  addOpinionController,
  toggleUpvoteController,
  assignWorkerController,
  updateStatusController,
} from '../controllers/issue.controller';

export default async function issueRoutes(app: FastifyInstance) {
  app.post('/', createIssueController);
  app.get('/', getIssuesController);
  app.get('/:id', getIssueController);
  app.post('/:id/opinion', addOpinionController);
  app.post('/:id/upvote', toggleUpvoteController);
  app.post('/:id/assign', assignWorkerController);
  app.post('/:id/status', updateStatusController);
}
