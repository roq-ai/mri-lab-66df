import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { simulationResultValidationSchema } from 'validationSchema/simulation-results';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.simulation_result
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSimulationResultById();
    case 'PUT':
      return updateSimulationResultById();
    case 'DELETE':
      return deleteSimulationResultById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSimulationResultById() {
    const data = await prisma.simulation_result.findFirst(convertQueryToPrismaUtil(req.query, 'simulation_result'));
    return res.status(200).json(data);
  }

  async function updateSimulationResultById() {
    await simulationResultValidationSchema.validate(req.body);
    const data = await prisma.simulation_result.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSimulationResultById() {
    const data = await prisma.simulation_result.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
