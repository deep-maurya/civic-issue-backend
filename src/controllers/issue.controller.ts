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
import { uploadImage } from '../utis/uploadImage';
import { Mail_Sender } from '../utis/emailSender';
import { issueUpdated } from '../utis/emailTemplates';
import { getUserById } from '../services/user.service';

export const createIssueController = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    let imageUrls: string[] = [];
    let formData: any = {};
    if (req.isMultipart()) {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file' && part.fieldname === 'images') {
          if (part.mimetype && part.mimetype.startsWith('image/')) {
            try {
              const buffer = await part.toBuffer();
              const result = await uploadImage(buffer);
              imageUrls.push(result.secure_url);
            } catch (uploadErr: any) {
              return reply.code(400).send({
                status: 'error',
                message: `Failed to upload image: ${uploadErr.message}`,
              });
            }
          }
        } else if (part.type === 'field') {
          formData[part.fieldname] = part.value;
        }
      }
    } else {
      formData = req.body;
    }
    const { title, description, location, latitude, longitude } = formData;

    if (!title || !description || !location) {
      return reply.code(400).send({
        status: 'error',
        message: 'Missing required fields: title, description, location',
      });
    }

    const user = (req as any).user;
    if (!user || !user.id) {
      return reply.code(401).send({
        status: 'error',
        message: 'Unauthorized: User info not found in token',
      });
    }

    const issueData = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      reportedBy: user.id,
      images: imageUrls,
      lat: latitude ? parseFloat(formData.latitude) : undefined,
      lng: longitude ? parseFloat(formData.longitude) : undefined,
    };

    const result = await createIssue(issueData);
    if (result) {
      const userdata = await getUserById(user.id);

      if (userdata?.email) {
        const { html, without_html } = issueUpdated(
          userdata?.name || 'User',
          issueData?.title,
          'Reported'
        );
        const send_email = await Mail_Sender(
          userdata.email,
          'Issue Reported Successfully',
          without_html,
          html
        );
      }
    }
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
    Body: { comment: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = (req as any).user;
    const result = await addOpinion(req.params.id, user.id, req.body.comment);
    reply.send(result);
  } catch (err: any) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const toggleUpvoteController = async (
  req: FastifyRequest<{
    Params: { id: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const user = (req as any).user;
    const result = await toggleUpvote(req.params.id, user.id);
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
