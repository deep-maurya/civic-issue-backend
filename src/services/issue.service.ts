import Issue, { IIssue } from '../Schema/issue.schema';
import { Types } from 'mongoose';

interface AssignWorkerData {
  issueId: string;
  workerId: string;
  adminId: string;
}

export const createIssue = async (data: {
  title: string;
  description: string;
  location: string;
  images?: string[];
  reportedBy: string;
  lat?: Number;
  lng?: Number;
}) => {
  try {
    const issue = await Issue.create({
      ...data,
      timeline: [
        {
          status: 'reported',
          by: new Types.ObjectId(data.reportedBy),
          date: new Date(),
        },
      ],
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('reportedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('opinions.user', 'name email')
      .populate('upvotes', 'name email')
      .populate('timeline.by', 'name email');

    return {
      status: 'success',
      message: 'Issue created successfully',
      data: populatedIssue,
    };
  } catch (error: any) {
    throw new Error(`Failed to create issue: ${error.message}`);
  }
};

export const getAllIssues = async () => {
  const issues = await Issue.find()
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('opinions.user', 'name email')
    .populate('upvotes', 'name email')
    .populate('timeline.by', 'name email');

  return {
    status: 'success',
    message: 'Issues fetched successfully',
    data: issues,
  };
};

export const getIssueById = async (id: string | Types.ObjectId) => {
  const issue = await Issue.findById(id)
    .populate('reportedBy', 'name email')
    .populate('assignedTo', 'name email')
    .populate('opinions.user', 'name email')
    .populate('upvotes', 'name email')
    .populate('timeline.by', 'name email');

  if (!issue) throw new Error('Issue not found');

  return {
    status: 'success',
    message: 'Issue fetched successfully',
    data: issue,
  };
};

export const addOpinion = async (
  issueId: string,
  userId: string,
  comment: string
) => {
  const newOpinion = {
    user: new Types.ObjectId(userId),
    comment,
    date: new Date(),
  };

  await Issue.findByIdAndUpdate(issueId, { $push: { opinions: newOpinion } });

  return {
    status: 'success',
    message: 'Opinion added successfully',
    data: newOpinion,
  };
};

export const toggleUpvote = async (issueId: string, userId: string) => {
  const issue = await Issue.findById(issueId);
  if (!issue) throw new Error('Issue not found');

  const userObjId = new Types.ObjectId(userId);
  let action = 'upvoted';

  if (issue.upvotes.some((id) => id.equals(userObjId))) {
    await Issue.findByIdAndUpdate(issueId, { $pull: { upvotes: userObjId } });
    action = 'removed upvote';
  } else {
    await Issue.findByIdAndUpdate(issueId, {
      $addToSet: { upvotes: userObjId },
    });
  }

  const updatedIssue = await Issue.findById(issueId);
  const count = updatedIssue?.upvotes.length || 0;

  return {
    status: 'success',
    message: `Issue ${action} successfully`,
    data: { upvotesCount: count },
  };
};

export const assignWorker = async ({
  issueId,
  workerId,
  adminId,
}: AssignWorkerData) => {
  const issue = await Issue.findById(issueId);
  if (!issue) throw new Error('Issue not found');

  let status = 'assigned';
  if (issue.assignedTo) {
    status =
      issue.assignedTo.toString() === workerId
        ? 'already-assigned'
        : 'reassigned';
  }

  let timelineEntry = null;
  if (status !== 'already-assigned') {
    issue.assignedTo = new Types.ObjectId(workerId);
    timelineEntry = {
      status,
      by: new Types.ObjectId(adminId),
      date: new Date(),
    };
    issue.timeline.push(timelineEntry);
    await issue.save();
    await issue.populate({ path: 'assignedTo', select: 'name email' });
    await issue.populate({ path: 'timeline.by', select: 'name email' });
  }

  return {
    status: 'success',
    message:
      status === 'already-assigned'
        ? 'Worker already assigned'
        : 'Worker assigned successfully',
    data: {
      assignedTo: issue.assignedTo,
      timelineEntry,
    },
  };
};

export const updateStatus = async (
  issueId: string,
  status: 'pending' | 'in-progress' | 'resolved',
  userId: string
) => {
  const timelineEntry = {
    status,
    date: new Date(),
    by: new Types.ObjectId(userId),
  };

  await Issue.findByIdAndUpdate(issueId, {
    status,
    $push: { timeline: timelineEntry },
  });

  return {
    status: 'success',
    message: `Issue status updated to "${status}"`,
    data: { timelineEntry },
  };
};
