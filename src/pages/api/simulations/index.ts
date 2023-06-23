import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { simulationValidationSchema } from 'validationSchema/simulations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSimulations();
    case 'POST':
      return createSimulation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSimulations() {
    const data = await prisma.simulation
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'simulation'));
    return res.status(200).json(data);
  }

  async function createSimulation() {
    await simulationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.simulation_result?.length > 0) {
      const create_simulation_result = body.simulation_result;
      body.simulation_result = {
        create: create_simulation_result,
      };
    } else {
      delete body.simulation_result;
    }
    const data = await prisma.simulation.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
