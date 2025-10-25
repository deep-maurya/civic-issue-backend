import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createIssue,
  getAllIssues,
  getIssueById,
  addOpinion,
  toggleUpvote,
  assignWorker,
  updateStatus,
} from '../services/issue.service';

export const createIssueController = async (
  req: FastifyRequest<{
    Body: {
      title: string;
      description: string;
      location: string;
      images?: string[];
      reportedBy: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const result = await createIssue(req.body);
    reply.code(201).send(result);
  } catch (err: any) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const getIssuesController = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await getAllIssues();
    reply.send(result);
  } catch (err: any) {
    reply.code(500).send({ status: 'error', message: err.message });
  }
};

export const getIssueController = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const result = await getIssueById(req.params.id);
    reply.send(result);
  } catch (err: any) {
    reply.code(404).send({ status: 'error', message: 'Issue not found' });
  }
};

export const addOpinionController = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { userId: string; comment: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const result = await addOpinion(
      req.params.id,
      req.body.userId,
      req.body.comment
    );
    reply.send(result);
  } catch (err: any) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const toggleUpvoteController = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { userId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const result = await toggleUpvote(req.params.id, req.body.userId);
    reply.send(result);
  } catch (err: any) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const assignWorkerController = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { workerId: string; adminId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const result = await assignWorker({
      issueId: req.params.id,
      workerId: req.body.workerId,
      adminId: req.body.adminId,
    });
    reply.send(result);
  } catch (err: any) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const updateStatusController = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: { status: 'pending' | 'in-progress' | 'resolved'; userId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const result = await updateStatus(
      req.params.id,
      req.body.status,
      req.body.userId
    );
    reply.send(result);
  } catch (err: any) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};
